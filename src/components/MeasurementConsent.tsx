import React, { useEffect, useState } from "react";
import { loadPixel, setAnalyticsConsent } from "../utils/atendimento";
export function MeasurementConsent() {
  const [open, setOpen] = useState(() => {
    try {
      return !localStorage.getItem("sants_measurement");
    } catch {
      return true;
    }
  });
  useEffect(() => {
    loadPixel();
  }, []);
  const choose = (yes: boolean) => {
    setAnalyticsConsent(yes);
    setOpen(false);
  };
  return open ? (
    <aside
      className="fixed bottom-0 left-0 right-0 z-50 bg-slate-950 border-t border-slate-700 p-4 text-slate-200 text-sm shadow-2xl"
      aria-label="Preferências de medição"
    >
      <div className="max-w-4xl mx-auto flex flex-wrap items-center gap-3">
        <p className="flex-1 min-w-52">
          Podemos usar o TikTok Pixel para medir visitas e cliques no WhatsApp?
          A escolha é opcional e não afeta seu atendimento.
        </p>
        <button
          className="bg-blue-600 rounded-lg px-4 py-2 cursor-pointer"
          onClick={() => choose(true)}
        >
          Aceitar medição
        </button>
        <button
          className="border border-slate-500 rounded-lg px-4 py-2 cursor-pointer"
          onClick={() => choose(false)}
        >
          Recusar
        </button>
      </div>
    </aside>
  ) : (
    <div className="bg-slate-950 text-center">
      <button
        className="text-xs text-slate-400 underline p-2 cursor-pointer"
        onClick={() => setOpen(true)}
      >
        Preferências de medição
      </button>
    </div>
  );
}
