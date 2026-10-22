import React, { useState } from 'react';
import { ChevronDown, HelpCircle } from 'lucide-react';

export const FAQ: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      question: 'O envio da solicitação garante aprovação?',
      answer:
        'Não. Toda solicitação está sujeita à análise e aos critérios aplicáveis. O envio do interesse não representa aprovação prévia nem obriga a contratação do crédito.',
    },
    {
      question: 'Qual valor posso solicitar?',
      answer:
        'Para Pessoa Física, o site permite indicar valores de interesse entre R$ 1.000 e R$ 50.000. Para Pessoa Jurídica, entre R$ 5.000 e R$ 100.000. A disponibilidade efetiva dependerá da análise de capacidade de pagamento e perfil cadastral.',
    },
    {
      question: 'Quando saberei as taxas e condições?',
      answer:
        'As taxas, custos, prazos e demais condições aplicáveis deverão ser apresentados de maneira clara antes de qualquer contratação, discriminados na proposta formal e Cédula de Crédito Bancário.',
    },
    {
      question: 'Tenho que pagar alguma coisa antecipadamente?',
      answer:
        'Não. A SANTS SCD não solicita depósitos prévios, taxas de avalista, adiantamentos ou fiadores como condição para liberação de empréstimo. Qualquer cobrança antecipada não faz parte dos procedimentos da instituição.',
    },
    {
      question: 'Quem analisa minha solicitação?',
      answer:
        'A solicitação passará pelos procedimentos de análise aplicáveis à operação. A instituição responsável pela contratação será claramente identificada antes da formalização.',
    },
    {
      question: 'Quais documentos podem ser solicitados durante a análise?',
      answer:
        'Geralmente são solicitados documento de identificação com foto (RG ou CNH), comprovante de residência e comprovantes de renda ou faturamento (no caso de PJ). Não solicitamos senhas bancárias ou códigos de segurança de cartão.',
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
            Respostas diretas sobre o processo de solicitação, prazos e critérios de análise.
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
