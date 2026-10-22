import React from 'react';
import { Building, Shield, Info } from 'lucide-react';
import { INSTITUTIONAL_DATA } from '../config/creditConfig';

export const OperationModel: React.FC = () => {
  return (
    <section className="py-14 bg-slate-50 border-b border-slate-200">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        
        <div className="bg-white border border-slate-200/90 rounded-2xl p-6 sm:p-8 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-200/60 flex items-center justify-center text-blue-700 shrink-0">
              <Info className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs font-bold text-blue-700 uppercase tracking-wider">
                Modelo da Operação
              </span>
              <h3 className="text-lg sm:text-xl font-bold text-slate-950">
                Atendimento e Geração de Solicitação
              </h3>
            </div>
          </div>

          <div className="space-y-3.5 text-xs sm:text-sm text-slate-700 leading-relaxed">
            <p>
              Por meio deste site, o usuário manifesta interesse em uma operação de crédito e fornece as informações necessárias para o início do atendimento. A solicitação poderá passar por análise de elegibilidade e crédito antes da apresentação de qualquer proposta ou contratação.
            </p>

            <p>
              Dependendo da operação, a análise e/ou contratação poderá envolver instituição financeira parceira devidamente habilitada, que será identificada ao usuário antes da contratação.
            </p>

            <div className="pt-3 border-t border-slate-100 mt-4 flex items-start gap-2.5 text-xs text-slate-600 bg-slate-50/70 p-3.5 rounded-xl">
              <Shield className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
              <span>
                <strong className="text-slate-800">Nota Regulatória:</strong> A autorização outorgada pelo Banco Central do Brasil para atuar como Sociedade de Crédito Direto aplica-se exclusivamente à <strong className="text-slate-900">{INSTITUTIONAL_DATA.legalName}</strong> (CNPJ {INSTITUTIONAL_DATA.cnpj}), nos termos da legislação brasileira vigente.
              </span>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};
