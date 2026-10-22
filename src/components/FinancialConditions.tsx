import React from 'react';
import { Percent, Calendar, FileText, AlertTriangle, ShieldCheck, Calculator, Info } from 'lucide-react';
import { CREDIT_CONFIG, FINANCIAL_TEXTS, REPRESENTATIVE_EXAMPLE_DATA } from '../config/creditConfig';

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
              Equivalência efetiva anual aproximada calculada para a taxa mensal de 1,35% a.m. composta em 12 meses. Condição &ldquo;a partir de&rdquo;.
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

        {/* Caixa de Exemplo Representativo Numérico (Conformidade com TikTok Ads & BACEN) */}
        <div className="p-6 sm:p-7 bg-slate-900 text-white rounded-2xl border border-slate-800 shadow-xl">
          <div className="flex flex-wrap items-center justify-between gap-2 mb-4 pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2.5">
              <span className="px-2.5 py-1 rounded text-[11px] font-bold bg-blue-500/20 text-blue-300 border border-blue-500/30 tracking-wider uppercase flex items-center gap-1.5">
                <Calculator className="w-3.5 h-3.5" />
                Exemplo Representativo Numérico
              </span>
              <h3 className="text-base sm:text-lg font-bold text-white">
                Simulação Ilustrativa da Operação
              </h3>
            </div>
            <span className="text-[11px] text-slate-400 font-mono">
              Base de cálculo real · Amortização com parcelas fixas
            </span>
          </div>

          {/* Grid com os parâmetros numéricos exatos */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-5">
            <div className="p-3 bg-slate-800/80 rounded-xl border border-slate-700/60">
              <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
                Valor do Crédito
              </span>
              <span className="text-sm sm:text-base font-bold text-white font-mono">
                {REPRESENTATIVE_EXAMPLE_DATA.amountDisplay}
              </span>
            </div>

            <div className="p-3 bg-slate-800/80 rounded-xl border border-slate-700/60">
              <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
                Prazo de Pagamento
              </span>
              <span className="text-sm sm:text-base font-bold text-white font-mono">
                {REPRESENTATIVE_EXAMPLE_DATA.termDisplay}
              </span>
            </div>

            <div className="p-3 bg-slate-800/80 rounded-xl border border-slate-700/60">
              <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
                Taxa Mensal
              </span>
              <span className="text-sm sm:text-base font-bold text-emerald-400 font-mono">
                {REPRESENTATIVE_EXAMPLE_DATA.monthlyRateDisplay}
              </span>
            </div>

            <div className="p-3 bg-slate-800/80 rounded-xl border border-slate-700/60">
              <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
                Taxa Anual Equiv.
              </span>
              <span className="text-xs sm:text-sm font-bold text-slate-200 font-mono">
                {REPRESENTATIVE_EXAMPLE_DATA.annualRateDisplay}
              </span>
            </div>

            <div className="p-3 bg-blue-950/60 rounded-xl border border-blue-500/30">
              <span className="text-[10px] uppercase font-bold text-blue-300 block mb-1">
                Parcela Estimada
              </span>
              <span className="text-sm sm:text-base font-black text-blue-200 font-mono">
                {REPRESENTATIVE_EXAMPLE_DATA.installmentDisplay}
              </span>
            </div>

            <div className="p-3 bg-slate-800/80 rounded-xl border border-slate-700/60">
              <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
                Total Estimado
              </span>
              <span className="text-sm sm:text-base font-bold text-white font-mono">
                {REPRESENTATIVE_EXAMPLE_DATA.totalAmountDisplay}
              </span>
            </div>
          </div>

          {/* Texto descritivo exigido pelas políticas */}
          <div className="p-4 bg-slate-800/40 rounded-xl border border-slate-800 mb-4">
            <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-mono">
              <strong>Exemplo representativo:</strong> {FINANCIAL_TEXTS.representativeExample}
            </p>
          </div>

          {/* Explicação de CET, Tributos e Ausência de Adiantamento */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-[11px] text-slate-400 pt-2 border-t border-slate-800/80">
            <div className="flex items-start gap-2">
              <Info className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
              <span>
                <strong>CET e encargos:</strong> O Custo Efetivo Total (CET), o IOF e eventuais despesas da operação serão informados detalhadamente na proposta individual antes da contratação.
              </span>
            </div>
            <div className="flex items-start gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <span>
                <strong>Segurança:</strong> A SANTS nunca solicita pagamento antecipado, depósito de garantia ou taxa de cartório para aprovação ou liberação de crédito.
              </span>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};
