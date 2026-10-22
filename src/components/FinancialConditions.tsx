import React from 'react';
import { Percent, Calendar, FileText, AlertTriangle, ShieldCheck } from 'lucide-react';
import { FINANCIAL_CONDITIONS } from '../config/creditConfig';

export const FinancialConditions: React.FC = () => {
  return (
    <section id="condicoes" className="py-16 bg-white border-b border-slate-200">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-xs font-bold text-blue-600 uppercase tracking-widest">
            Transparência Regulatória
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mt-2 tracking-tight">
            Condições do crédito
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 mt-2">
            Todas as taxas, encargos e prazos são definidos e apresentados de forma individualizada com base na análise de crédito e perfil do proponente.
          </p>
        </div>

        {/* Operational Notice */}
        <div className="mb-8 p-4 bg-amber-50/70 border border-amber-200/80 rounded-xl text-xs sm:text-sm text-amber-900 flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold text-amber-950 mb-0.5">
              Aviso sobre parâmetros financeiros
            </p>
            <p className="text-amber-800 leading-relaxed text-xs">
              A SANTS não inventa taxas ou condições fictícias em materiais publicitários. As condições contratadas (taxa mensal, taxa anual, Custo Efetivo Total - CET e prazos) são formalizadas na Proposta de Crédito (CCB) antes de qualquer contratação.
            </p>
          </div>
        </div>

        {/* Grid de Condições */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-8">
          
          {/* Taxa de Juros Mensal */}
          <div className="p-5 bg-slate-50 border border-slate-200 rounded-xl">
            <div className="flex items-center gap-2 text-blue-600 mb-2">
              <Percent className="w-4 h-4" />
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-600">
                Taxa de Juros Mensal
              </span>
            </div>
            <div className="text-lg font-bold text-slate-900 font-mono">
              {FINANCIAL_CONDITIONS.MONTHLY_INTEREST_RATE}
            </div>
            <p className="text-[11px] text-slate-500 mt-1 leading-snug">
              Definida após a análise cadastral e de capacidade financeira do solicitante.
            </p>
          </div>

          {/* Taxa Anual Correspondente */}
          <div className="p-5 bg-slate-50 border border-slate-200 rounded-xl">
            <div className="flex items-center gap-2 text-blue-600 mb-2">
              <Percent className="w-4 h-4" />
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-600">
                Taxa Anual Correspondente
              </span>
            </div>
            <div className="text-lg font-bold text-slate-900 font-mono">
              {FINANCIAL_CONDITIONS.ANNUAL_INTEREST_RATE}
            </div>
            <p className="text-[11px] text-slate-500 mt-1 leading-snug">
              Calculada proporcionalmente com base na taxa pactuada na operação.
            </p>
          </div>

          {/* Custo Efetivo Total (CET) */}
          <div className="p-5 bg-slate-50 border border-slate-200 rounded-xl">
            <div className="flex items-center gap-2 text-blue-600 mb-2">
              <FileText className="w-4 h-4" />
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-600">
                CET (Custo Efetivo Total)
              </span>
            </div>
            <div className="text-lg font-bold text-slate-900 font-mono">
              {FINANCIAL_CONDITIONS.CET}
            </div>
            <p className="text-[11px] text-slate-500 mt-1 leading-snug">
              Compreende taxas, tributos (IOF), seguros e eventuais custos da operação.
            </p>
          </div>

          {/* Prazo Mínimo */}
          <div className="p-5 bg-slate-50 border border-slate-200 rounded-xl">
            <div className="flex items-center gap-2 text-blue-600 mb-2">
              <Calendar className="w-4 h-4" />
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-600">
                Prazo Mínimo
              </span>
            </div>
            <div className="text-lg font-bold text-slate-900 font-mono">
              {FINANCIAL_CONDITIONS.MIN_TERM}
            </div>
            <p className="text-[11px] text-slate-500 mt-1 leading-snug">
              Prazo mínimo disponível conforme a modalidade de crédito aprovada.
            </p>
          </div>

          {/* Prazo Máximo */}
          <div className="p-5 bg-slate-50 border border-slate-200 rounded-xl">
            <div className="flex items-center gap-2 text-blue-600 mb-2">
              <Calendar className="w-4 h-4" />
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-600">
                Prazo Máximo
              </span>
            </div>
            <div className="text-lg font-bold text-slate-900 font-mono">
              {FINANCIAL_CONDITIONS.MAX_TERM}
            </div>
            <p className="text-[11px] text-slate-500 mt-1 leading-snug">
              Prazo estendido sujeito aos limites do produto e análise de risco.
            </p>
          </div>

          {/* Tarifas e Custos */}
          <div className="p-5 bg-slate-50 border border-slate-200 rounded-xl">
            <div className="flex items-center gap-2 text-blue-600 mb-2">
              <ShieldCheck className="w-4 h-4" />
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-600">
                Tarifas e Custos
              </span>
            </div>
            <div className="text-lg font-bold text-slate-900 font-mono">
              {FINANCIAL_CONDITIONS.FEES}
            </div>
            <p className="text-[11px] text-slate-500 mt-1 leading-snug">
              Nenhum valor antecipado é cobrado para liberação de empréstimo.
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
            {FINANCIAL_CONDITIONS.REPRESENTATIVE_EXAMPLE}
          </p>
          <div className="mt-3 pt-3 border-t border-slate-800 text-[11px] text-slate-400">
            * Valores e parcelas reais serão discriminados no Contrato de Cédula de Crédito Bancário (CCB) emitido nos termos da Resolução CMN nº 4.656/2018.
          </div>
        </div>

      </div>
    </section>
  );
};
