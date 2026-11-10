import { useEffect, useRef, useState } from "react";
import { assignAttendant, handoffMessage, loadPixel, trackAttendantEntry } from "../utils/atendimento";
import { getActiveWhatsAppNumber } from "../config/creditConfig";

export default function AttendantRedirect() {
  const [href, setHref] = useState("");
  const [statusText, setStatusText] = useState("Conectando ao WhatsApp...");
  const opening = useRef(false);
  const redirectPromiseRef = useRef<Promise<string> | null>(null);

  const redirectToWhatsApp = (targetHref: string) => {
    if (opening.current || !targetHref) return;
    opening.current = true;
    try {
      window.location.replace(targetHref);
    } catch {
      window.location.assign(targetHref);
    }
  };

  const getFallbackHref = () => {
    const rawOfficial = getActiveWhatsAppNumber().replace(/\D/g, "") || "5511962433641";
    const officialPhone = (rawOfficial.length === 10 || rawOfficial.length === 11) && !rawOfficial.startsWith("55")
      ? "55" + rawOfficial
      : rawOfficial;
    return `https://wa.me/${officialPhone}?text=${encodeURIComponent(handoffMessage())}`;
  };

  useEffect(() => {
    document.title = "Conectando ao atendimento | SANTS";
    document.querySelector('meta[name="robots"]')?.setAttribute("content", "noindex,nofollow");
    document.querySelector('link[rel="canonical"]')?.setAttribute("href", location.origin + "/atendente");
    loadPixel();
    let alive = true;

    const performRouting = async (): Promise<string> => {
      let targetHref = "";
      try {
        const data = await assignAttendant();
        targetHref = data.href;
        if (alive) {
          setHref(targetHref);
          setStatusText("Abrindo seu WhatsApp...");
        }

        // Aguarda envio do pixel com limite razoável (máximo 2.5s) para não interromper o evento nem travar o atendimento
        await Promise.race([
          trackAttendantEntry(data).then(
            () => new Promise<void>((resolve) => setTimeout(resolve, 100)),
          ),
          new Promise<void>((resolve) => setTimeout(resolve, 2500)),
        ]);
      } catch (err) {
        console.warn("Roteamento backend indisponível ou sem atendente ativo, usando WhatsApp oficial:", err);
        targetHref = getFallbackHref();
        if (alive) {
          setHref(targetHref);
          setStatusText("Redirecionando para o WhatsApp oficial da SANTS...");
        }
      }
      return targetHref;
    };

    const routingPromise = performRouting();
    redirectPromiseRef.current = routingPromise;

    routingPromise.then((target) => {
      if (alive && target) {
        redirectToWhatsApp(target);
      }
    });

    return () => {
      alive = false;
    };
  }, []);

  const handleManualClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (opening.current) return;
    setStatusText("Abrindo seu WhatsApp...");

    if (redirectPromiseRef.current) {
      try {
        const target = await redirectPromiseRef.current;
        if (target) {
          redirectToWhatsApp(target);
          return;
        }
      } catch {}
    }

    if (href) {
      redirectToWhatsApp(href);
    } else {
      redirectToWhatsApp(getFallbackHref());
    }
  };

  return (
    <main className="min-h-screen bg-slate-900 text-white flex items-center justify-center px-4 py-8">
      <section className="w-full max-w-md rounded-2xl border border-white/10 bg-slate-800 p-6 sm:p-8 text-center shadow-2xl">
        <p className="text-xs font-bold tracking-widest text-blue-400 mb-4 uppercase">SANTS SCD</p>
        <div aria-hidden="true" className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-3 border-slate-600 border-t-emerald-400" />
        <h1 className="text-xl sm:text-2xl font-bold mb-2">Redirecionando para o WhatsApp</h1>
        <p role="status" aria-live="polite" className="text-sm text-slate-300 leading-relaxed mb-6">
          {statusText} Sua mensagem com os dados da simulação está pronta para envio.
        </p>

        {href ? (
          <a
            href={href}
            onClick={handleManualClick}
            className="block w-full rounded-xl bg-emerald-500 hover:bg-emerald-400 active:bg-emerald-600 px-5 py-4 text-slate-950 font-bold transition-all shadow-lg text-base cursor-pointer"
          >
            Abrir WhatsApp Agora
          </a>
        ) : (
          <button
            type="button"
            onClick={handleManualClick}
            className="block w-full rounded-xl bg-emerald-500 hover:bg-emerald-400 active:bg-emerald-600 px-5 py-4 text-slate-950 font-bold transition-all shadow-lg text-base cursor-pointer"
          >
            Abrir WhatsApp Agora
          </button>
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
