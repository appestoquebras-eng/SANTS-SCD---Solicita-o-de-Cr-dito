import React from 'react';
import { Building, ShieldCheck, MapPin, CheckCircle } from 'lucide-react';
import { INSTITUTIONAL_DATA } from '../config/creditConfig';
import architectureImage from '../assets/images/sants_finance_architecture_1792677055208.jpg';

export const AboutSants: React.FC = () => {
  return (
    <section id="sobre" className="py-16 bg-white border-b border-slate-200">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Institutional Text Column */}
          <div className="lg:col-span-7">
            <span className="text-xs font-bold text-blue-600 uppercase tracking-widest">
              Institucional
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mt-2 tracking-tight">
              Sobre a SANTS
            </h2>
            
            <p className="text-sm sm:text-base text-slate-700 mt-4 leading-relaxed font-medium">
              {INSTITUTIONAL_DATA.regulatoryStatement}
            </p>

            <p className="text-xs sm:text-sm text-slate-600 mt-3 leading-relaxed">
              Como Sociedade de Crédito Direto (SCD), realizamos operações de crédito exclusivamente por meio de plataforma eletrônica, proporcionando um processo ágil, seguro e em conformidade estrita com as diretrizes do Conselho Monetário Nacional (CMN) e do Banco Central do Brasil.
            </p>

            {/* Official Identification Card */}
            <div className="mt-6 p-5 bg-slate-50 border border-slate-200 rounded-xl space-y-2.5">
              <div className="flex items-center justify-between flex-wrap gap-2 text-xs">
                <span className="text-slate-500 font-medium">Razão Social:</span>
                <span className="font-bold text-slate-900 font-mono text-right">{INSTITUTIONAL_DATA.legalName}</span>
              </div>

              <div className="flex items-center justify-between flex-wrap gap-2 text-xs">
                <span className="text-slate-500 font-medium">Nome Fantasia:</span>
                <span className="font-semibold text-slate-800">{INSTITUTIONAL_DATA.tradeName}</span>
              </div>

              <div className="flex items-center justify-between flex-wrap gap-2 text-xs">
                <span className="text-slate-500 font-medium">CNPJ:</span>
                <span className="font-bold text-slate-900 font-mono">{INSTITUTIONAL_DATA.cnpj}</span>
              </div>

              <div className="flex items-center justify-between flex-wrap gap-2 text-xs">
                <span className="text-slate-500 font-medium">Situação Cadastral:</span>
                <span className="inline-flex items-center gap-1 font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded text-[11px] border border-emerald-200">
                  <CheckCircle className="w-3 h-3" /> {INSTITUTIONAL_DATA.registrationStatus}
                </span>
              </div>

              <div className="flex items-center justify-between flex-wrap gap-2 text-xs">
                <span className="text-slate-500 font-medium">Município / UF:</span>
                <span className="text-slate-800 flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" /> {INSTITUTIONAL_DATA.city}
                </span>
              </div>
            </div>

            <div className="mt-4 flex items-center gap-2 text-xs text-slate-500">
              <ShieldCheck className="w-4 h-4 text-blue-600 shrink-0" />
              <span>Regulação: Resolução CMN nº 4.656/2018 e normativos aplicáveis do Bacen.</span>
            </div>
          </div>

          {/* Visual Column */}
          <div className="lg:col-span-5">
            <div className="relative rounded-2xl overflow-hidden border border-slate-200 shadow-lg bg-slate-100">
              <img
                src={architectureImage}
                alt="Edifício Corporativo Institucional SANTS SCD"
                className="w-full h-72 sm:h-80 object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent flex items-end p-5">
                <div className="text-white">
                  <p className="text-xs font-semibold text-blue-300">
                    Operação 100% Eletrônica
                  </p>
                  <p className="text-sm font-bold text-white mt-0.5">
                    Segurança, transparência e governança institucional
                  </p>
                </div>
              </div>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
