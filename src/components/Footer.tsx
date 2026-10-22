import React from 'react';
import { ShieldCheck, Mail, Phone, MapPin, ExternalLink, Settings } from 'lucide-react';
import {
  INSTITUTIONAL_DATA,
  getActiveWhatsAppNumber,
  getActiveContactEmail,
} from '../config/creditConfig';

interface FooterProps {
  onOpenPrivacy: () => void;
  onOpenTerms: () => void;
  onOpenConfig: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  onOpenPrivacy,
  onOpenTerms,
  onOpenConfig,
}) => {
  const whatsappNumber = getActiveWhatsAppNumber();
  const contactEmail = getActiveContactEmail();

  return (
    <footer className="bg-slate-950 text-slate-400 text-xs border-t border-slate-800">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
        
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 mb-12">
          
          {/* Institutional Info */}
          <div className="md:col-span-6 space-y-3">
            <div className="flex items-center gap-2 text-white">
              <div className="w-7 h-7 rounded-lg bg-blue-600 flex items-center justify-center text-white">
                <ShieldCheck className="w-4 h-4 text-blue-100" />
              </div>
              <span className="font-extrabold text-base tracking-tight text-white">
                SANTS <span className="text-blue-400 font-semibold">SCD</span>
              </span>
            </div>

            <p className="text-slate-300 font-semibold text-xs sm:text-sm">
              {INSTITUTIONAL_DATA.legalName}
            </p>

            <p className="text-slate-400 text-xs leading-relaxed max-w-md">
              {INSTITUTIONAL_DATA.regulatoryStatement}
            </p>

            <div className="pt-2 space-y-1 font-mono text-[11px] text-slate-400">
              <p>CNPJ: {INSTITUTIONAL_DATA.cnpj} · Situação: {INSTITUTIONAL_DATA.registrationStatus}</p>
              <p className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-slate-500" />
                {INSTITUTIONAL_DATA.city}
              </p>
            </div>
          </div>

          {/* Links e Documentos Legais */}
          <div className="md:col-span-3 space-y-3">
            <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider">
              Legal & Regulatório
            </h4>
            <ul className="space-y-2">
              <li>
                <button
                  type="button"
                  onClick={onOpenPrivacy}
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  Política de Privacidade (LGPD)
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={onOpenTerms}
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  Termos de Uso
                </button>
              </li>
              <li>
                <a
                  href="#sobre"
                  className="hover:text-white transition-colors text-left block"
                >
                  Sobre a SANTS
                </a>
              </li>
              <li>
                <a
                  href="#condicoes"
                  className="hover:text-white transition-colors text-left block"
                >
                  Condições do Crédito
                </a>
              </li>
            </ul>
          </div>

          {/* Contato & Atendimento */}
          <div className="md:col-span-3 space-y-3">
            <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider">
              Canais Oficiais
            </h4>
            <div className="space-y-2 text-xs">
              <div>
                <span className="text-slate-500 block text-[11px]">WhatsApp Oficial:</span>
                <span className="text-slate-200 font-mono">{whatsappNumber}</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[11px]">E-mail de Atendimento:</span>
                <span className="text-slate-200 font-mono">{contactEmail}</span>
              </div>
              <div className="pt-2">
                <button
                  type="button"
                  onClick={onOpenConfig}
                  className="inline-flex items-center gap-1.5 text-[11px] text-slate-400 hover:text-blue-400 border border-slate-800 hover:border-slate-700 rounded-lg px-2.5 py-1.5 transition-colors cursor-pointer"
                >
                  <Settings className="w-3.5 h-3.5" />
                  <span>Configurar Contato / Parâmetros</span>
                </button>
              </div>
            </div>
          </div>

        </div>

        {/* Mandatory Regulatory Disclaimers */}
        <div className="pt-8 border-t border-slate-900 space-y-3 text-[11px] text-slate-500 leading-relaxed">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <p className="font-medium text-slate-400">
              Operações sujeitas à análise, critérios de elegibilidade e condições aplicáveis.
            </p>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-300 font-bold text-[10px]">
                18+
              </span>
              <span className="text-slate-500">Destinado a maiores de 18 anos</span>
            </div>
          </div>

          <p>
            A SANTS Sociedade de Crédito Direto S.A. atua estritamente em conformidade com as normas do Conselho Monetário Nacional (CMN) e do Banco Central do Brasil. Não realizamos cobrança de quaisquer taxas, seguros prévios ou depósitos para liberação de operações financeiras.
          </p>

          <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-slate-600 text-[10px]">
            <p>© {new Date().getFullYear()} SANTS SCD · Todos os direitos reservados.</p>
            <p>CNPJ 52.440.987/0001-69 · São José dos Campos - SP</p>
          </div>
        </div>

      </div>
    </footer>
  );
};
