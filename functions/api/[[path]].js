const headers = {
  "Cache-Control": "no-store",
  "X-Content-Type-Options": "nosniff",
  "X-Robots-Tag": "noindex, nofollow",
};
const json = (data, status = 200, extra = {}) =>
  Response.json(data, { status, headers: { ...headers, ...extra } });
const fail = (message, status = 400) => {
  throw Object.assign(new Error(message), { status });
};
const uuid = () => crypto.randomUUID();
const validID = (v) => typeof v === "string" && /^[0-9a-f-]{36}$/i.test(v);
const TABLES = {
  1: {
    agents: "agents",
    settings: "settings",
    visitors: "visitors",
    deliveries: "deliveries",
    route_requests: "route_requests",
  },
  2: {
    agents: "agents_2",
    settings: "settings_2",
    visitors: "visitors_2",
    deliveries: "deliveries_2",
    route_requests: "route_requests_2",
  },
};

function toHex(bytes) {
  return [...new Uint8Array(bytes)]
    .map((x) => x.toString(16).padStart(2, "0"))
    .join("");
}
function fromHex(hex) {
  const arr = new Uint8Array(hex.length / 2);
  for (let i = 0; i < arr.length; i++)
    arr[i] = parseInt(hex.slice(i * 2, i * 2 + 2), 16);
  return arr;
}
function constantTimeEqualHex(a, b) {
  if (typeof a !== "string" || typeof b !== "string" || a.length !== b.length)
    return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}
async function hash(s) {
  return toHex(
    await crypto.subtle.digest("SHA-256", new TextEncoder().encode(s)),
  );
}
async function hashPasswordPBKDF2(password, saltHex) {
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(password),
    "PBKDF2",
    false,
    ["deriveBits"],
  );
  const bits = await crypto.subtle.deriveBits(
    {
      name: "PBKDF2",
      salt: fromHex(saltHex),
      iterations: 100000,
      hash: "SHA-256",
    },
    key,
    256,
  );
  return toHex(bits);
}
async function equal(a, b) {
  const x = await hash(a),
    y = await hash(b);
  return constantTimeEqualHex(x, y);
}
function cookie(request) {
  return request.headers
    .get("Cookie")
    ?.match(/(?:^|;\s*)sants_visitor=([0-9a-f-]{36})(?:;|$)/i)?.[1];
}
function visitorCookie(request, id) {
  const host = new URL(request.url).hostname;
  const baseDomain = ["santscredito.online", "santscreditoltda.online"].find(
    (domain) => host === domain || host === `www.${domain}`,
  );
  const domain = baseDomain ? `; Domain=${baseDomain}` : "";
  return `sants_visitor=${id}; Path=/; HttpOnly; SameSite=Lax; Max-Age=31536000${domain}${new URL(request.url).protocol === "https:" ? "; Secure" : ""}`;
}
async function body(request) {
  if (!request.headers.get("Content-Type")?.startsWith("application/json"))
    fail("Formato inválido.", 415);
  const text = await request.text();
  if (text.length > 8192) fail("Solicitação muito grande.", 413);
  try {
    return JSON.parse(text);
  } catch {
    fail("Dados inválidos.");
  }
}
export function normalizePhone(input) {
  let n = String(input || "").replace(/\D/g, "");
  n = n.replace(/^0+/, "");
  if (n.startsWith("55") && (n.length === 12 || n.length === 13)) {
    // Já possui o DDI 55 com 10 ou 11 dígitos nacionais
  } else if (n.length === 10 || n.length === 11) {
    // DDD (2 dígitos) + número com 8 ou 9 dígitos
    n = "55" + n;
  }
  if (!/^55[1-9][0-9]\d{8,9}$/.test(n))
    fail("Informe um telefone brasileiro válido com DDD.");
  return n;
}
export function rangeStart(days, now = Date.now()) {
  // Local calendar days in São Paulo; the IANA zone handles offset changes.
  const day = new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/Sao_Paulo",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(now);
  const midnight = new Date(`${day}T00:00:00-03:00`).getTime();
  return midnight - (days - 1) * 86400000;
}
async function checkRateLimit(sql, prefix, request, now) {
  // CF-Connecting-IP is supplied by Cloudflare, never stored as raw IP.
  const key = await hash(
    prefix + (request.headers.get("CF-Connecting-IP") || "local"),
  );
  const result = await sql(
    `INSERT INTO login_limits(key,attempts,expires) VALUES(?,1,?) ON CONFLICT(key) DO UPDATE SET attempts=CASE WHEN expires<? THEN 1 ELSE attempts+1 END, expires=CASE WHEN expires<? THEN ? ELSE expires END RETURNING attempts`,
    key,
    now + 900000,
    now,
    now,
    now + 900000,
  ).first();
  if (result.attempts > 10)
    fail("Muitas tentativas. Aguarde 15 minutos.", 429);
}
async function issueSession(db, sql, team, now) {
  const token = uuid() + uuid();
  await db.batch([
    sql(
      "INSERT INTO sessions(token_hash,expires,team) VALUES(?,?,?)",
      await hash(token),
      now + 1800000,
      team,
    ),
    sql("DELETE FROM sessions WHERE expires<?", now),
    sql("DELETE FROM login_limits WHERE expires<?", now),
  ]);
  return { token, expires: now + 1800000 };
}
async function handle({ request, env }) {
  const url = new URL(request.url),
    rawPath = url.pathname.replace(/\/$/, "");
  if (!env.DB)
    fail(
      "Atendimento ainda não configurado. Tente novamente em instantes.",
      503,
    );
  const db = env.DB.withSession ? env.DB.withSession("first-primary") : env.DB;
  const sql = (s, ...args) => db.prepare(s).bind(...args);
  if (request.method !== "GET") {
    if (request.headers.get("Origin") !== url.origin)
      fail("Origem não autorizada.", 403);
    if (request.headers.get("Sec-Fetch-Site") === "cross-site")
      fail("Origem não autorizada.", 403);
  }
  if (rawPath === "/api/visitor" && request.method === "GET") {
    const id = cookie(request) || uuid();
    return json({ ready: true }, 200, {
      "Set-Cookie": visitorCookie(request, id),
      Vary: "Cookie",
    });
  }

  const isTeam2 = rawPath === "/api/2" || rawPath.startsWith("/api/2/");
  const team = isTeam2 ? 2 : 1;
  const path = isTeam2 ? "/api" + rawPath.slice(6) : rawPath;
  const t = TABLES[team];

  if (team === 2 && path === "/api/auth-status" && request.method === "GET") {
    if (env.ADMIN_PASSWORD_2)
      return json({ configured: true, needsSetup: false, source: "env" });
    const existing = await sql(
      "SELECT 1 FROM panel_auth WHERE team=2",
    ).first();
    return json({
      configured: !!existing,
      needsSetup: !existing,
      source: existing ? "db" : "none",
    });
  }

  if (team === 2 && path === "/api/setup" && request.method === "POST") {
    if (env.ADMIN_PASSWORD_2)
      fail("A senha deste painel já é gerenciada pelo servidor.", 409);
    const data = await body(request),
      now = Date.now();
    await checkRateLimit(sql, "setup2:", request, now);
    if (
      typeof data.password !== "string" ||
      data.password.length < 4 ||
      data.password.length > 128
    )
      fail("Informe uma senha com 4 a 128 caracteres.", 400);
    const salt = toHex(crypto.getRandomValues(new Uint8Array(16)));
    const passwordHash = await hashPasswordPBKDF2(data.password, salt);
    const inserted = await sql(
      "INSERT INTO panel_auth(team,salt,password_hash,updated_at) VALUES(2,?,?,?) ON CONFLICT(team) DO NOTHING RETURNING team",
      salt,
      passwordHash,
      now,
    ).first();
    if (!inserted) fail("A senha do painel já foi configurada.", 409);
    return json(await issueSession(db, sql, 2, now));
  }

  if (path === "/api/route" && request.method === "POST") {
    const data = await body(request);
    if (!validID(cookie(request)))
      fail("Recarregue a página para iniciar o atendimento.", 409);
    if (data.handoffId !== undefined && !validID(data.handoffId))
      fail("Identificação do atendimento inválida.");
    // Each simulation click gets a new key; retries/reloads keep that key.
    // Legacy clients keep cookie affinity until they load the current frontend.
    const id = data.handoffId || cookie(request);
    const req = uuid(),
      event = uuid(),
      now = Date.now();
    let results;
    try {
      results = await db.batch([
        sql(
          `INSERT INTO ${t.route_requests}(id,visitor_id,event_id,at) VALUES(?,?,?,?)`,
          req,
          id,
          event,
          now,
        ),
        sql(
          `SELECT v.event_id,a.phone,a.name FROM ${t.visitors} v JOIN ${t.agents} a ON a.id=v.agent_id WHERE v.id=?`,
          id,
        ),
        sql(`DELETE FROM ${t.route_requests} WHERE id=?`, req),
        sql(
          `UPDATE ${t.visitors} SET pixel_claimed=1 WHERE id=? AND pixel_claimed=0 AND ?=1 RETURNING event_id`,
          id,
          data.analytics === true ? 1 : 0,
        ),
      ]);
    } catch (e) {
      if (String(e).includes("NO_AGENTS"))
        fail(
          "Nenhum atendente disponível no momento. Tente novamente mais tarde.",
          503,
        );
      throw e;
    }
    const row = results[1].results[0];
    if (!row) fail("Não foi possível encaminhar. Tente novamente.", 503);
    return json(
      {
        phone: row.phone,
        eventId: row.event_id,
        trackContact: results[3].results.length === 1,
      },
      200,
      { Vary: "Cookie" },
    );
  }

  if (path === "/api/login" && request.method === "POST") {
    const data = await body(request),
      now = Date.now();
    await checkRateLimit(sql, team === 2 ? "login2:" : "login:", request, now);
    if (
      typeof data.password !== "string" ||
      data.password.length > 128
    )
      fail("Senha incorreta.", 401);

    if (team === 1) {
      if (!env.ADMIN_PASSWORD)
        fail("A senha do painel ainda não foi configurada no servidor.", 503);
      if (!(await equal(data.password, env.ADMIN_PASSWORD)))
        fail("Senha incorreta.", 401);
    } else {
      if (env.ADMIN_PASSWORD_2) {
        if (!(await equal(data.password, env.ADMIN_PASSWORD_2)))
          fail("Senha incorreta.", 401);
      } else {
        const authRow = await sql(
          "SELECT salt, password_hash FROM panel_auth WHERE team=2",
        ).first();
        if (!authRow)
          fail("Configure a senha inicial do Painel 2 antes de entrar.", 503);
        const derived = await hashPasswordPBKDF2(data.password, authRow.salt);
        if (!constantTimeEqualHex(derived, authRow.password_hash))
          fail("Senha incorreta.", 401);
      }
    }
    return json(await issueSession(db, sql, team, now));
  }

  if (path.startsWith("/api/admin/")) {
    const token = request.headers.get("Authorization")?.replace(/^Bearer /, "");
    if (!token || token.length > 100) fail("Entre novamente no painel.", 401);
    const tokenHash = await hash(token);
    if (
      !(await sql(
        "SELECT 1 FROM sessions WHERE token_hash=? AND team=? AND expires>?",
        tokenHash,
        team,
        Date.now(),
      ).first())
    )
      fail("Sessão expirada. Entre novamente.", 401);
    if (path === "/api/admin/logout" && request.method === "POST") {
      await sql(
        "DELETE FROM sessions WHERE token_hash=? AND team=?",
        tokenHash,
        team,
      ).run();
      return json({ ok: true });
    }
    if (path === "/api/admin/clear-history" && request.method === "POST") {
      await db.batch([
        sql(`DELETE FROM ${t.deliveries}`),
        sql(`DELETE FROM ${t.visitors}`),
        sql(`DELETE FROM ${t.route_requests}`),
        sql(`UPDATE ${t.settings} SET cursor_agent=NULL, used=0 WHERE id=1`),
      ]);
      return json({ ok: true, message: "Histórico zerado com sucesso." });
    }
    if (path === "/api/admin/config" && request.method === "GET") {
      const res = await db.batch([
        sql(`SELECT batch_size FROM ${t.settings} WHERE id=1`),
        sql(`SELECT * FROM ${t.agents} WHERE deleted=0 ORDER BY position,id`),
      ]);
      return json({
        batchSize: res[0].results[0].batch_size,
        agents: res[1].results,
      });
    }
    if (path === "/api/admin/config" && request.method === "PUT") {
      const data = await body(request);
      if (
        !Number.isInteger(data.batchSize) ||
        data.batchSize < 1 ||
        data.batchSize > 1000
      )
        fail("O lote deve ser de 1 a 1000.");
      await sql(
        `UPDATE ${t.settings} SET batch_size=? WHERE id=1`,
        data.batchSize,
      ).run();
      return json({ ok: true });
    }
    if (path === "/api/admin/agents" && request.method === "POST") {
      const data = await body(request),
        name = String(data.name || "").trim();
      if (!name || name.length > 80)
        fail("Informe um nome de até 80 caracteres.");
      const phone = normalizePhone(data.phone);
      await sql(
        `INSERT INTO ${t.agents}(id,name,phone,position) SELECT ?,?,?,COALESCE(MAX(position),0)+1 FROM ${t.agents}`,
        uuid(),
        name,
        phone,
      ).run();
      return json({ ok: true });
    }
    if (
      path.startsWith("/api/admin/agents/") &&
      ["PUT", "DELETE"].includes(request.method)
    ) {
      const id = path.split("/").pop();
      if (!validID(id)) fail("Atendente inválido.");
      if (request.method === "DELETE") {
        await sql(
          `UPDATE ${t.agents} SET deleted=1,active=0 WHERE id=?`,
          id,
        ).run();
        return json({ ok: true });
      }
      const data = await body(request),
        name = String(data.name || "").trim();
      if (
        !name ||
        name.length > 80 ||
        typeof data.active !== "boolean" ||
        !Number.isInteger(data.position) ||
        data.position < 0
      )
        fail("Dados do atendente inválidos.");
      await sql(
        `UPDATE ${t.agents} SET name=?,phone=?,active=?,position=? WHERE id=? AND deleted=0`,
        name,
        normalizePhone(data.phone),
        data.active ? 1 : 0,
        data.position,
        id,
      ).run();
      return json({ ok: true });
    }
    if (path === "/api/admin/stats" && request.method === "GET") {
      const now = Date.now(),
        today = rangeStart(1, now),
        yesterday = today - 86400000;
      const periods = [
        ["today", today, now + 1],
        ["yesterday", yesterday, today],
        ["7", rangeStart(7, now), now + 1],
        ["15", rangeStart(15, now), now + 1],
        ["30", rangeStart(30, now), now + 1],
        ["total", 0, now + 1],
      ];
      const selected = url.searchParams.get("period") || "today";
      const p = periods.find((x) => x[0] === selected);
      if (!p) fail("Período inválido.");
      const statements = periods.map(([, start, end]) =>
        sql(
          `SELECT COUNT(*) AS unique_clients FROM ${t.visitors} WHERE created_at>=? AND created_at<?`,
          start,
          end,
        ),
      );
      statements.push(
        sql(
          `SELECT a.id,a.name,a.phone,a.active,a.deleted,COUNT(d.id) AS deliveries,COALESCE(SUM(d.first_delivery),0) AS new_clients FROM ${t.agents} a LEFT JOIN ${t.deliveries} d ON d.agent_id=a.id AND d.created_at>=? AND d.created_at<? GROUP BY a.id ORDER BY a.position,a.id`,
          p[1],
          p[2],
        ),
      );
      const res = await db.batch(statements);
      return json({
        totals: Object.fromEntries(
          periods.map((p, i) => [p[0], res[i].results[0].unique_clients]),
        ),
        agents: res[6].results,
        period: selected,
        timeZone: "America/Sao_Paulo",
      });
    }
  }
  return json({ error: "Página não encontrada." }, 404);
}
export async function onRequest(context) {
  try {
    return await handle(context);
  } catch (e) {
    if (
      String(e).includes("UNIQUE constraint failed: agents.phone") ||
      String(e).includes("UNIQUE constraint failed: agents_2.phone")
    )
      return json({ error: "Esse telefone já está cadastrado." }, 409);
    if (
      /no such table: (?:agents_2|settings_2|visitors_2|deliveries_2|route_requests_2|panel_auth)|no such column: team/i.test(
        String(e),
      )
    )
      return json(
        {
          error:
            "Banco de dados do Painel 2 ainda não migrado. Aplique 0002_equipe2.sql no D1.",
        },
        503,
      );
    if (e.status) return json({ error: e.message }, e.status);
    console.error("Falha na API de atendimento");
    return json(
      { error: "Serviço indisponível. Tente novamente em instantes." },
      503,
    );
  }
}
