import React, { useState } from 'react';
import { ChevronDown, HelpCircle } from 'lucide-react';

export const FAQ: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      question: 'O envio da solicitação garante aprovação?',
      answer:
        'Não. O envio da solicitação não representa aprovação ou garantia de crédito. A disponibilidade depende da modalidade, critérios de elegibilidade e análise aplicável.',
    },
    {
      question: 'Qual valor posso solicitar?',
      answer:
        'O site permite indicar valores de interesse conforme o perfil selecionado. Para Pessoa Física, de R$ 1.000 a R$ 50.000; para Pessoa Jurídica, de R$ 5.000 a R$ 100.000. A disponibilidade efetiva depende da análise.',
    },
    {
      question: 'Qual é a taxa de juros?',
      answer:
        'As taxas podem partir de 1,35% ao mês, equivalente a aproximadamente 17,46% ao ano. A taxa efetivamente disponibilizada pode variar conforme modalidade, perfil e análise.',
    },
    {
      question: 'Qual é o prazo?',
      answer:
        'O prazo pode variar de 6 a 120 meses, conforme modalidade, perfil e condições disponibilizadas.',
    },
    {
      question: 'O que é CET?',
      answer:
        'O Custo Efetivo Total reúne os custos da operação de crédito. O CET aplicável será apresentado ao cliente de forma clara antes da contratação.',
    },
    {
      question: 'Quando saberei as condições finais?',
      answer:
        'As condições da proposta, incluindo taxa, prazo, parcelas, CET e custos aplicáveis, serão apresentadas antes da contratação.',
    },
    {
      question: 'Quem realiza a análise?',
      answer:
        'A solicitação seguirá os procedimentos de análise aplicáveis à operação. Caso haja participação de instituição financeira parceira, a responsável pela contratação será identificada antes da formalização.',
    },
    {
      question: 'Tenho que pagar alguma coisa antecipadamente?',
      answer:
        'Não. A SANTS SCD não solicita depósitos prévios, taxas de avalista, adiantamentos ou fiadores como condição para liberação de empréstimo. Qualquer cobrança antecipada não faz parte dos procedimentos da instituição.',
    },
  ];

  const toggle = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <section id="duvidas" className="py-16 bg-slate-50 border-b border-slate-200">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-bold text-blue-600 uppercase tracking-widest">
            Tire Suas Dúvidas
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mt-2 tracking-tight">
            Perguntas Frequentes
          </h2>
          <p className="text-sm sm:text-base text-slate-600 mt-2">
            Respostas diretas sobre o processo de solicitação, prazos, taxas e critérios de análise.
          </p>
        </div>

        <div className="space-y-3.5">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <div
                key={index}
                className="bg-white border border-slate-200 rounded-xl overflow-hidden transition-all shadow-sm"
              >
                <button
                  type="button"
                  onClick={() => toggle(index)}
                  className="w-full text-left p-5 flex items-center justify-between gap-4 cursor-pointer hover:bg-slate-50/60 transition-colors"
                  aria-expanded={isOpen}
                >
                  <span className="text-sm sm:text-base font-semibold text-slate-900 flex items-center gap-2.5">
                    <HelpCircle className="w-4 h-4 text-blue-600 shrink-0" />
                    {faq.question}
                  </span>
                  <ChevronDown
                    className={`w-5 h-5 text-slate-400 shrink-0 transition-transform duration-200 ${
                      isOpen ? 'rotate-180 text-blue-600' : ''
                    }`}
                  />
                </button>

                {isOpen && (
                  <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-100">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
