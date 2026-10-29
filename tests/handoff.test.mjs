import { test } from "node:test";
import assert from "node:assert/strict";
import { runInNewContext } from "node:vm";
import { build } from "esbuild";

const compiled = await build({ entryPoints: ["src/utils/atendimento.ts"], bundle: true, write: false, format: "cjs", platform: "browser" });
function browser() {
  const store = new Map(), calls = [], navigations = [], events = [];
  const context = {
    module: { exports: {} }, URL, navigator: {},
    location: { pathname: "/", origin: "https://santscreditoltda.online", href: "https://santscreditoltda.online/?ttclid=campaign-test", assign: url => navigations.push(url) },
    sessionStorage: { getItem: key => store.get(key) || null, setItem: (key, value) => store.set(key, value) },
    fetch: async (url, options) => {
      calls.push({ url, options });
      return { ok: true, headers: new Headers({ "Content-Type": "application/json" }), json: async () => url.endsWith("visitor") ? { ready: true } : { phone: "5511999991111", eventId: "test-event", trackContact: true } };
    },
    window: { ttq: { ready: fn => fn(), track: (...args) => events.push(args) }, setTimeout, clearTimeout },
  };
  runInNewContext(compiled.outputFiles[0].text, context);
  return { api: context.module.exports, store, calls, navigations, events, context };
}

test("simulação passa para /atendente sem colocar a mensagem ou valores na URL", async () => {
  const s = browser();
  const message = "Perfil: Pessoa Física\nValor de interesse: R$ 10.000";
  await s.api.goToWhatsApp(message);
  assert.equal(s.calls.length, 0, "a landing não aloca nem conta conversão");
  assert.equal(s.navigations[0], "/atendente?ttclid=campaign-test");
  assert.equal(s.api.handoffMessage(), message);
  const [first, duplicate] = await Promise.all([s.api.assignAttendant(), s.api.assignAttendant()]);
  assert.equal(first.href, duplicate.href);
  assert.equal(new URL(first.href).searchParams.get("text"), message);
  assert.equal(s.calls.filter(c => c.url === "/api/route").length, 1);
  await s.api.trackAttendantEntry(first);
  assert.equal(s.events[0][0], "Lead");
  assert.equal(s.events[0][1].content_name, "entrada_atendente");
});

test("entrada direta ou mensagem vencida usa texto genérico sem recuperar simulação antiga", () => {
  const s = browser();
  assert.ok(!s.api.handoffMessage().includes("Valor de interesse"));
  s.store.set("sants_handoff", JSON.stringify({ message: "simulação antiga", at: Date.now() - 31 * 60000 }));
  assert.ok(!s.api.handoffMessage().includes("simulação antiga"));
});

test("falha de atendimento pode ser tentada novamente sem inventar número", async () => {
  const s = browser();
  const fetch = s.context.fetch;
  let fail = true;
  s.context.fetch = async (url, options) => {
    if (url.endsWith("route") && fail) { fail = false; throw new Error("offline"); }
    return fetch(url, options);
  };
  await assert.rejects(s.api.assignAttendant(), /offline/);
  assert.equal(s.navigations.length, 0);
  const result = await s.api.assignAttendant();
  assert.equal(new URL(result.href).hostname, "wa.me");
});
