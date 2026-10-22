import React from 'react';
import { Percent, Calendar, FileText, AlertTriangle, ShieldCheck } from 'lucide-react';
import { CREDIT_CONFIG, FINANCIAL_TEXTS } from '../config/creditConfig';

export const FinancialConditions: React.FC = () => {
  return (
    <section id="condicoes" className="py-16 bg-white border-b border-slate-200">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        
        <div className="text-center max-w-3xl mx-auto mb-10">
          <span className="text-xs font-bold text-blue-600 uppercase tracking-widest">
            Transparência Regulatória
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mt-2 tracking-tight">
            Condições do crédito
          </h2>
          <p className="text-sm sm:text-base text-slate-700 font-medium mt-3 leading-relaxed">
            Taxas de juros a partir de 1,35% ao mês, equivalente a aproximadamente 17,46% ao ano. Prazo de pagamento de 6 a 120 meses, conforme modalidade, perfil e análise de crédito.
          </p>
          <p className="text-xs sm:text-sm text-slate-500 mt-2 leading-relaxed">
            As taxas, o CET, valores disponíveis, custos e demais condições podem variar conforme modalidade, perfil do cliente e análise da operação. As condições definitivas serão apresentadas ao cliente antes da contratação.
          </p>
        </div>

        {/* Aviso de Transparência Financeira */}
        <div className="mb-8 p-4 bg-blue-50/70 border border-blue-200/80 rounded-xl text-xs sm:text-sm text-blue-950 flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-blue-700 shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold text-blue-950 mb-0.5">
              Informações prévias e formalização transparente
            </p>
            <p className="text-blue-900 leading-relaxed text-xs">
              A SANTS não inventa taxas, condições ou CET fictícios em materiais publicitários. As condições contratadas (taxa mensal, taxa anual, Custo Efetivo Total - CET, parcelas e prazos) são detalhadas na proposta formal e formalizadas na Cédula de Crédito Bancário (CCB) antes de qualquer contratação.
            </p>
          </div>
        </div>

        {/* Grid de Condições */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-8">
          
          {/* Taxa de Juros Mensal */}
          <div className="p-5 bg-slate-50 border border-slate-200 rounded-xl flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 text-blue-600 mb-2">
                <Percent className="w-4 h-4" />
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-600">
                  Taxa de Juros Mensal
                </span>
              </div>
              <div className="text-lg font-bold text-slate-900 font-mono">
                {FINANCIAL_TEXTS.monthlyInterestDisplay}
              </div>
            </div>
            <p className="text-[11px] text-slate-500 mt-2 leading-snug">
              Definida com base na análise de crédito e perfil cadastral do solicitante.
            </p>
          </div>

          {/* Taxa Anual Equivalente */}
          <div className="p-5 bg-slate-50 border border-slate-200 rounded-xl flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 text-blue-600 mb-2">
                <Percent className="w-4 h-4" />
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-600">
                  Taxa Anual Equivalente
                </span>
              </div>
              <div className="text-lg font-bold text-slate-900 font-mono">
                {FINANCIAL_TEXTS.annualEquivalentDisplay}
              </div>
            </div>
            <p className="text-[11px] text-slate-500 mt-2 leading-snug">
              Equivalência efetiva anual aproximada calculada para a taxa mensal de 1,35% a.m. composta em 12 meses.
            </p>
          </div>

          {/* Custo Efetivo Total (CET) */}
          <div className="p-5 bg-slate-50 border border-slate-200 rounded-xl flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 text-blue-600 mb-2">
                <FileText className="w-4 h-4" />
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-600">
                  CET (Custo Efetivo Total)
                </span>
              </div>
              <div className="text-xs sm:text-sm font-semibold text-slate-800 leading-snug">
                {FINANCIAL_TEXTS.getCetDisplay()}
              </div>
            </div>
            <p className="text-[11px] text-slate-500 mt-2 leading-snug">
              Reúne todos os custos da operação (juros, tributos como IOF e eventuais despesas).
            </p>
          </div>

          {/* Prazo Mínimo */}
          <div className="p-5 bg-slate-50 border border-slate-200 rounded-xl flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 text-blue-600 mb-2">
                <Calendar className="w-4 h-4" />
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-600">
                  Prazo Mínimo
                </span>
              </div>
              <div className="text-lg font-bold text-slate-900 font-mono">
                {FINANCIAL_TEXTS.minTermDisplay}
              </div>
            </div>
            <p className="text-[11px] text-slate-500 mt-2 leading-snug">
              Prazo mínimo disponível conforme a modalidade de crédito aprovada.
            </p>
          </div>

          {/* Prazo Máximo */}
          <div className="p-5 bg-slate-50 border border-slate-200 rounded-xl flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 text-blue-600 mb-2">
                <Calendar className="w-4 h-4" />
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-600">
                  Prazo Máximo
                </span>
              </div>
              <div className="text-lg font-bold text-slate-900 font-mono">
                {FINANCIAL_TEXTS.maxTermDisplay}
              </div>
            </div>
            <p className="text-[11px] text-slate-500 mt-2 leading-snug">
              Até 120 meses, conforme a modalidade, garantia e análise da operação.
            </p>
          </div>

          {/* Tarifas e Custos */}
          <div className="p-5 bg-slate-50 border border-slate-200 rounded-xl flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 text-blue-600 mb-2">
                <ShieldCheck className="w-4 h-4" />
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-600">
                  Tarifas e Custos
                </span>
              </div>
              <div className="text-xs sm:text-sm font-semibold text-slate-800 leading-snug">
                {FINANCIAL_TEXTS.getFeesDisplay()}
              </div>
            </div>
            <p className="text-[11px] text-slate-500 mt-2 leading-snug">
              Nenhum valor antecipado ou depósito prévio é solicitado para liberação de crédito.
            </p>
          </div>

        </div>

        {/* Caixa de Exemplo Representativo */}
        <div className="p-6 bg-slate-900 text-white rounded-2xl border border-slate-800 shadow-md">
          <div className="flex items-center gap-2.5 mb-2.5">
            <span className="px-2.5 py-0.5 rounded text-[11px] font-bold bg-blue-500/20 text-blue-300 border border-blue-500/30">
              DISCLOSURE
            </span>
            <h3 className="text-base font-bold text-white">
              Exemplo representativo
            </h3>
          </div>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-mono">
            {FINANCIAL_TEXTS.representativeExample}
          </p>
          <div className="mt-3 pt-3 border-t border-slate-800 text-[11px] text-slate-400">
            * As parcelas, encargos e condições finais serão discriminados no Contrato de Cédula de Crédito Bancário (CCB) emitido nos termos da regulamentação aplicável do Banco Central do Brasil.
          </div>
        </div>

      </div>
    </section>
  );
};
