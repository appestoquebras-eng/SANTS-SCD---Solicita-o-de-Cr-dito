import { useEffect, useRef, useState } from "react";
import { assignAttendant, handoffMessage, loadPixel, trackAttendantEntry } from "../utils/atendimento";
import { getActiveWhatsAppNumber } from "../config/creditConfig";

export default function AttendantRedirect() {
  const [href, setHref] = useState("");
  const [statusText, setStatusText] = useState("Conectando ao WhatsApp...");
  const opening = useRef(false);

  const redirectToWhatsApp = (targetHref: string) => {
    if (opening.current) return;
    opening.current = true;
    try {
      window.location.replace(targetHref);
    } catch {
      window.location.assign(targetHref);
    }
  };

  useEffect(() => {
    document.title = "Conectando ao atendimento | SANTS";
    document.querySelector('meta[name="robots"]')?.setAttribute("content", "noindex,nofollow");
    document.querySelector('link[rel="canonical"]')?.setAttribute("href", location.origin + "/atendente");
    loadPixel();
    let alive = true;

    // Número oficial de contingência com sanitização DDI 55
    const rawOfficial = getActiveWhatsAppNumber().replace(/\D/g, "") || "5511962433641";
    const officialPhone = (rawOfficial.length === 10 || rawOfficial.length === 11) && !rawOfficial.startsWith("55")
      ? "55" + rawOfficial
      : rawOfficial;
    const fallbackHref = `https://wa.me/${officialPhone}?text=${encodeURIComponent(handoffMessage())}`;

    // Disponibiliza o link imediatamente para caso o usuário toque na hora
    setHref(fallbackHref);

    (async () => {
      let finalHref = fallbackHref;
      try {
        const data = await assignAttendant();
        if (!alive) return;
        finalHref = data.href;
        setHref(finalHref);
        setStatusText("Abrindo seu WhatsApp...");
        trackAttendantEntry(data).catch(() => {});
      } catch (err) {
        console.warn("Roteamento backend indisponível ou sem atendente ativo, usando WhatsApp oficial:", err);
        setStatusText("Redirecionando para o WhatsApp oficial da SANTS...");
      }

      if (alive) {
        redirectToWhatsApp(finalHref);
      }
    })();

    // Garantia de segurança contra bloqueadores de redirecionamento automático
    const timer = setTimeout(() => {
      if (alive && !opening.current && href) {
        redirectToWhatsApp(href);
      }
    }, 1200);

    return () => {
      alive = false;
      clearTimeout(timer);
    };
  }, []);

  return (
    <main className="min-h-screen bg-slate-900 text-white flex items-center justify-center px-4 py-8">
      <section className="w-full max-w-md rounded-2xl border border-white/10 bg-slate-800 p-6 sm:p-8 text-center shadow-2xl">
        <p className="text-xs font-bold tracking-widest text-blue-400 mb-4 uppercase">SANTS SCD</p>
        <div aria-hidden="true" className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-3 border-slate-600 border-t-emerald-400" />
        <h1 className="text-xl sm:text-2xl font-bold mb-2">Redirecionando para o WhatsApp</h1>
        <p role="status" aria-live="polite" className="text-sm text-slate-300 leading-relaxed mb-6">
          {statusText} Sua mensagem com os dados da simulação está pronta para envio.
        </p>

        {href && (
          <a
            href={href}
            onClick={() => { opening.current = true; }}
            className="block w-full rounded-xl bg-emerald-500 hover:bg-emerald-400 active:bg-emerald-600 px-5 py-4 text-slate-950 font-bold transition-all shadow-lg text-base"
          >
            Abrir WhatsApp Agora
          </a>
        )}

        <p className="text-xs text-slate-400 mt-3">
          Se o aplicativo não abrir automaticamente, toque no botão verde acima.
        </p>

        <a href="/#simulador" className="inline-block mt-6 text-xs text-slate-400 hover:text-white underline transition-colors">
          ← Voltar e ajustar simulação
        </a>
      </section>
    </main>
  );
}
