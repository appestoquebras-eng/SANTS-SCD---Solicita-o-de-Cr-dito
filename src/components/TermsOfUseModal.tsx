import React from 'react';
import { X, FileText, AlertCircle, ShieldCheck } from 'lucide-react';
import { INSTITUTIONAL_DATA, getActiveContactEmail, getActiveWhatsAppNumber } from '../config/creditConfig';

interface TermsOfUseModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const TermsOfUseModal: React.FC<TermsOfUseModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const contactEmail = getActiveContactEmail();
  const whatsappNumber = getActiveWhatsAppNumber();

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/75 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div className="relative bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden">
        
        {/* Modal Header */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-2.5">
            <FileText className="w-5 h-5 text-blue-400" />
            <h2 className="text-base sm:text-lg font-bold">
              Termos e Condições de Uso da Plataforma
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
            aria-label="Fechar modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto custom-scrollbar text-xs sm:text-sm text-slate-700 space-y-5 leading-relaxed">
          
          <div className="p-3.5 bg-amber-50 border border-amber-200 rounded-xl text-amber-950 text-xs flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <span>
              <strong>Aviso Importante:</strong> A utilização deste site para simulação e manifestação de interesse NÃO constitui aprovação prévia, garantia de contratação ou liberação imediata de crédito. Toda operação depende de análise de crédito e atendimento a critérios regulatórios.
            </span>
          </div>

          <section>
            <h3 className="text-sm sm:text-base font-bold text-slate-900 mb-2">
              1. Identificação da Empresa e Finalidade do Site
            </h3>
            <p>
              Estes Termos de Uso regem o acesso e a utilização do site mantido pela <strong>{INSTITUTIONAL_DATA.legalName}</strong> (Nome Fantasia: <strong>{INSTITUTIONAL_DATA.tradeName}</strong>), CNPJ <strong>{INSTITUTIONAL_DATA.cnpj}</strong>, com sede em <strong>{INSTITUTIONAL_DATA.city}</strong>, instituição autorizada pelo Banco Central do Brasil a atuar como Sociedade de Crédito Direto.
            </p>
            <p className="mt-2">
              A presente plataforma possui o objetivo de disponibilizar aos usuários uma ferramenta interativa para indicação de valores de interesse (Pessoa Física ou Pessoa Jurídica) e direcionamento para atendimento via WhatsApp com a equipe de análise.
            </p>
          </section>

          <section>
            <h3 className="text-sm sm:text-base font-bold text-slate-900 mb-2">
              2. Caráter Preliminar do Simulador e Ausência de Garantia de Crédito
            </h3>
            <p>
              O usuário declara ter ciência de que:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-slate-600 mt-2">
              <li>O controle deslizante (slider) na página inicial representa unicamente uma indicação do <strong>valor de interesse</strong> do solicitante;</li>
              <li>A simulação não gera direito adquirido à obtenção do crédito no valor pretendido;</li>
              <li>A aprovação, as taxas aplicáveis, o Custo Efetivo Total (CET), o prazo e as garantias exigidas serão informados apenas após a conclusão da análise de crédito individualizada;</li>
              <li>A instituição reserva-se o direito de recusar solicitações que não atendam às suas políticas internas de concessão de crédito ou requisitos de risco.</li>
            </ul>
          </section>

          <section>
            <h3 className="text-sm sm:text-base font-bold text-slate-900 mb-2">
              3. Elegibilidade e Condições de Uso
            </h3>
            <p>
              O serviço é destinado exclusivamente a pessoas capazes e maiores de 18 (dezoito) anos, ou a representantes legais de pessoas jurídicas devidamente constituídas no Brasil. Ao prosseguir, o usuário declara a veracidade de todas as informações que vier a fornecer no atendimento.
            </p>
          </section>

          <section>
            <h3 className="text-sm sm:text-base font-bold text-slate-900 mb-2">
              4. Responsabilidades do Usuário
            </h3>
            <ul className="list-disc pl-5 space-y-1 text-slate-600">
              <li>Fornecer dados cadastrais autênticos, atuais e completos;</li>
              <li>Não utilizar identidades falsas ou tentar fraudar o processo de avaliação de crédito;</li>
              <li>Não utilizar a plataforma para quaisquer fins ilícitos, criminosos ou em desacordo com as leis vigentes;</li>
              <li>Manter a confidencialidade de seus dados e não repassar senhas pessoais a terceiros.</li>
            </ul>
          </section>

          <section>
            <h3 className="text-sm sm:text-base font-bold text-slate-900 mb-2">
              5. Segurança e Alerta contra Golpes
            </h3>
            <p>
              A <strong>{INSTITUTIONAL_DATA.legalName}</strong> reforça que:
            </p>
            <div className="mt-2 p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1 text-slate-700">
              <p>• <strong>JAMAIS</strong> solicitamos depósitos prévios, taxas de cartório, pagamentos de seguros avulsos ou quantias antecipadas como requisito para aprovação ou liberação de empréstimos;</p>
              <p>• Nosso atendimento oficial é realizado exclusivamente pelos canais certificados da empresa;</p>
              <p>• Caso receba contatos solicitando depósitos prévios em nome da SANTS, interrompa o contato imediatamente e denuncie aos nossos canais oficiais.</p>
            </div>
          </section>

          <section>
            <h3 className="text-sm sm:text-base font-bold text-slate-900 mb-2">
              6. Propriedade Intelectual
            </h3>
            <p>
              Todos os direitos relativos à marca SANTS SCD, design, textos, códigos e elementos visuais da plataforma são de titularidade exclusiva da SANTS SOCIEDADE DE CRÉDITO DIRETO S.A., sendo vedada a reprodução ou uso não autorizado.
            </p>
          </section>

          <section>
            <h3 className="text-sm sm:text-base font-bold text-slate-900 mb-2">
              7. Foro e Legislação Aplicável
            </h3>
            <p>
              Estes Termos são regidos pelas leis da República Federativa do Brasil. Para dirimir quaisquer controvérsias decorrentes destes Termos, fica eleito o Foro da Comarca de São José dos Campos, Estado de São Paulo, com exclusão de qualquer outro por mais privilegiado que seja.
            </p>
          </section>

          <div className="pt-4 border-t border-slate-200 text-xs text-slate-500">
            Dúvidas sobre estes Termos de Uso? Fale conosco pelo e-mail: <span className="font-mono text-slate-800">{contactEmail}</span> ou WhatsApp: <span className="font-mono text-slate-800">{whatsappNumber}</span>.
          </div>

        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3.5 bg-slate-100 border-t border-slate-200 flex justify-end shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs sm:text-sm font-semibold transition-colors cursor-pointer"
          >
            Fechar
          </button>
        </div>

      </div>
    </div>
  );
};
