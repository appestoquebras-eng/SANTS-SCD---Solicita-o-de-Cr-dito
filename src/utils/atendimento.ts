export const PIXEL_ID = "DBD3NDBC77U0QK5QBER0";
export const isPanel = () => /^\/painel(?:\/|$)/.test(location.pathname);
declare global {
  interface Window {
    ttq?: any;
    TiktokAnalyticsObject?: string;
  }
}
export function analyticsAllowed() {
  try {
    return localStorage.getItem("sants_measurement") === "yes";
  } catch {
    return false;
  }
}
export function loadPixel() {
  if (isPanel() || !analyticsAllowed() || window.ttq) return;
  const q: any = [];
  window.TiktokAnalyticsObject = "ttq";
  window.ttq = q;
  const methods = [
    "page",
    "track",
    "identify",
    "instances",
    "debug",
    "on",
    "off",
    "once",
    "ready",
    "alias",
    "group",
    "enableCookie",
    "disableCookie",
    "holdConsent",
    "revokeConsent",
    "grantConsent",
  ];
  const defer = (obj: any, key: string) => {
    obj[key] = (...args: any[]) => obj.push([key, ...args]);
  };
  methods.forEach((m) => defer(q, m));
  q.instance = (id: string) => {
    const x = q._i[id] || [];
    methods.forEach((m) => defer(x, m));
    return x;
  };
  q.load = (id: string, options: any = {}) => {
    const src = "https://analytics.tiktok.com/i18n/pixel/events.js";
    q._i = q._i || {};
    q._i[id] = [];
    q._i[id]._u = src;
    q._t = q._t || {};
    q._t[id] = Date.now();
    q._o = q._o || {};
    q._o[id] = options;
    const script = document.createElement("script");
    script.async = true;
    script.src = src + "?sdkid=" + id + "&lib=ttq";
    document.head.appendChild(script);
  };
  q.load(PIXEL_ID, { autoConfig: false });
  q.page();
}
export function setAnalyticsConsent(value: boolean) {
  try {
    localStorage.setItem("sants_measurement", value ? "yes" : "no");
  } catch {}
  if (value) {
    loadPixel();
    window.ttq?.grantConsent?.();
  } else window.ttq?.revokeConsent?.();
  window.dispatchEvent(new Event("sants_consent"));
}
export async function api(
  path: string,
  method = "GET",
  data?: unknown,
  token?: string,
) {
  const res = await fetch("/api/" + path, {
    method,
    credentials: "same-origin",
    cache: "no-store",
    headers: {
      ...(data !== undefined ? { "Content-Type": "application/json" } : {}),
      ...(token ? { Authorization: "Bearer " + token } : {}),
    },
    ...(data !== undefined ? { body: JSON.stringify(data) } : {}),
  });
  if (!res.headers.get("Content-Type")?.includes("application/json"))
    throw new Error("Serviço de atendimento ainda não publicado/configurado.");
  const result = await res.json();
  if (!res.ok)
    throw Object.assign(new Error(result.error || "Não foi possível salvar."), {
      status: res.status,
    });
  return result;
}
let initialization: Promise<any> | undefined;
export function initVisitor() {
  if (!initialization) {
    const run = () => api("visitor");
    initialization = (
      navigator.locks
        ? navigator.locks.request("sants-visitor-init", run)
        : run()
    ).catch((e) => {
      initialization = undefined;
      throw e;
    });
  }
  return initialization;
}
let routing = false;
export async function goToWhatsApp(message: string) {
  if (routing) return;
  routing = true;
  try {
    await initVisitor();
    const data = await api("route", "POST", { analytics: analyticsAllowed() });
    if (!/^55\d{10,11}$/.test(data.phone))
      throw new Error("Número de atendimento inválido.");
    if (data.trackContact && analyticsAllowed()) {
      try {
        loadPixel();
        window.ttq?.track(
          "Lead",
          { content_name: "chamar_no_whatsapp" },
          { event_id: data.eventId },
        );
      } catch {}
    }
    location.assign(
      "https://wa.me/" + data.phone + "?text=" + encodeURIComponent(message),
    );
  } finally {
    routing = false;
  }
}
