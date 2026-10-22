import React from 'react';
import { X, ShieldCheck, Mail, Phone, Lock, FileText, CheckCircle } from 'lucide-react';
import { INSTITUTIONAL_DATA, getActiveContactEmail, getActiveWhatsAppNumber } from '../config/creditConfig';

interface PrivacyPolicyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PrivacyPolicyModal: React.FC<PrivacyPolicyModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const contactEmail = getActiveContactEmail();
  const whatsappNumber = getActiveWhatsAppNumber();

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/75 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div className="relative bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden">
        
        {/* Modal Header */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-2.5">
            <ShieldCheck className="w-5 h-5 text-blue-400" />
            <h2 className="text-base sm:text-lg font-bold">
              Política de Privacidade e Proteção de Dados
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
          
          <div className="p-3.5 bg-blue-50 border border-blue-200 rounded-xl text-blue-900 text-xs">
            Esta Política de Privacidade reflete o compromisso da <strong>{INSTITUTIONAL_DATA.legalName}</strong> com a transparência, privacidade e proteção dos dados pessoais de seus usuários, em estrita conformidade com a <strong>Lei Geral de Proteção de Dados Pessoais (LGPD - Lei nº 13.709/2018)</strong> e resoluções do Banco Central do Brasil.
          </div>

          <section>
            <h3 className="text-sm sm:text-base font-bold text-slate-900 mb-2">
              1. Identificação do Controlador
            </h3>
            <p>
              O controlador dos seus dados pessoais é a <strong>{INSTITUTIONAL_DATA.legalName}</strong> (Nome Fantasia: <strong>{INSTITUTIONAL_DATA.tradeName}</strong>), pessoa jurídica de direito privado inscrita no CNPJ sob o nº <strong>{INSTITUTIONAL_DATA.cnpj}</strong>, com sede no município de <strong>{INSTITUTIONAL_DATA.city}</strong>, autorizada pelo Banco Central do Brasil a funcionar como Sociedade de Crédito Direto (SCD).
            </p>
          </section>

          <section>
            <h3 className="text-sm sm:text-base font-bold text-slate-900 mb-2">
              2. Dados Pessoais Coletados
            </h3>
            <p className="mb-2">
              Na utilização desta landing page e no atendimento preliminar, coletamos apenas as informações estritamente necessárias para dar andamento à sua manifestação de interesse:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-slate-600">
              <li><strong>Dados de navegação no simulador:</strong> Perfil selecionado (Pessoa Física ou Pessoa Jurídica) e valor de interesse indicado.</li>
              <li><strong>Dados de contato no WhatsApp:</strong> Número de telefone celular, nome informado no perfil do aplicativo e mensagens trocadas.</li>
              <li><strong>Dados cadastrais na etapa de análise:</strong> Durante o atendimento e formalização, poderão ser solicitados: nome completo, CPF/CNPJ, e-mail, comprovante de endereço e comprovantes de capacidade de renda/faturamento.</li>
            </ul>
            <div className="mt-2 text-xs text-slate-500 italic bg-slate-50 p-2.5 rounded-lg border border-slate-200">
              * Importante: Em nenhuma hipótese solicitamos senhas de aplicativos bancários, códigos de segurança de cartão de crédito (CVV) ou depósitos prévios para análise de crédito.
            </div>
          </section>

          <section>
            <h3 className="text-sm sm:text-base font-bold text-slate-900 mb-2">
              3. Finalidade e Base Legal do Tratamento
            </h3>
            <p className="mb-2">Tratamos os dados pessoais para as seguintes finalidades legítimas:</p>
            <ul className="list-disc pl-5 space-y-1.5 text-slate-600">
              <li><strong>Atendimento à solicitação de crédito:</strong> Viabilizar o contato inicial pelo WhatsApp e executar os procedimentos preliminares relacionados à análise de crédito (Art. 7º, V da LGPD).</li>
              <li><strong>Análise de risco de crédito e prevenção à fraude:</strong> Consultar sistemas de proteção ao crédito (SCR/Bacen, birôs autorizados) e verificar a conformidade cadastral (Art. 7º, X da LGPD).</li>
              <li><strong>Cumprimento de obrigações legais e regulatórias:</strong> Atendimento às normas do Banco Central do Brasil, Conselho Monetário Nacional e legislação fiscal/financeira (Art. 7º, II da LGPD).</li>
            </ul>
          </section>

          <section>
            <h3 className="text-sm sm:text-base font-bold text-slate-900 mb-2">
              4. Compartilhamento de Dados
            </h3>
            <p>
              Os dados coletados não são comercializados com terceiros. O compartilhamento poderá ocorrer estritamente quando indispensável para:
            </p>
            <ul className="list-disc pl-5 space-y-1 text-slate-600 mt-2">
              <li>Birôs de crédito e sistemas de proteção ao crédito (como SCR do Bacen) para realização da análise de risco;</li>
              <li>Instituições financeiras parceiras devidamente habilitadas, caso a modalidade de crédito dependa de arranjo ou securitização específica, sempre com conhecimento prévio do cliente;</li>
              <li>Provedores de infraestrutura de tecnologia em nuvem e ferramentas de mensageria com elevados padrões de segurança;</li>
              <li>Autoridades judiciais, policiais ou regulatórias competentes, mediante determinação legal expressa.</li>
            </ul>
          </section>

          <section>
            <h3 className="text-sm sm:text-base font-bold text-slate-900 mb-2">
              5. Segurança da Informação
            </h3>
            <p>
              Adotamos medidas técnicas, administrativas e organizacionais adequadas para proteger os dados pessoais contra acessos não autorizados, perdas acidentais, destruição ou qualquer forma de tratamento ilícito, utilizando criptografia no trânsito de dados (HTTPS/TLS) e controle rigoroso de privilégios de acesso.
            </p>
          </section>

          <section>
            <h3 className="text-sm sm:text-base font-bold text-slate-900 mb-2">
              6. Retenção e Descarte dos Dados
            </h3>
            <p>
              Os dados serão armazenados pelo período necessário para cumprir as finalidades para as quais foram coletados, ou enquanto houver obrigação legal ou regulatória de guarda (como prazos exigidos pelo Banco Central para registros financeiros e combate à lavagem de dinheiro). Findo o período, os dados serão descartados de forma segura ou anonimizados.
            </p>
          </section>

          <section>
            <h3 className="text-sm sm:text-base font-bold text-slate-900 mb-2">
              7. Direitos do Titular (Art. 18 da LGPD)
            </h3>
            <p className="mb-2">Você possui os seguintes direitos garantidos pela LGPD:</p>
            <ul className="list-disc pl-5 space-y-1 text-slate-600">
              <li>Confirmação da existência de tratamento e acesso aos dados;</li>
              <li>Correção de dados incompletos, inexatos ou desatualizados;</li>
              <li>Anonimização, bloqueio ou eliminação de dados desnecessários ou tratados em desconformidade;</li>
              <li>Portabilidade dos dados a outro fornecedor, observada a regulamentação;</li>
              <li>Informação sobre entidades públicas e privadas com as quais os dados foram compartilhados;</li>
              <li>Revogação do consentimento, nos termos da lei.</li>
            </ul>
          </section>

          <section>
            <h3 className="text-sm sm:text-base font-bold text-slate-900 mb-2">
              8. Canal de Contato e Encarregado de Dados (DPO)
            </h3>
            <p>
              Para exercer seus direitos ou tirar dúvidas sobre esta política, entre em contato através dos nossos canais oficiais:
            </p>
            <div className="mt-2 p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1 font-mono text-xs">
              <p><strong>E-mail de Contato:</strong> {contactEmail}</p>
              <p><strong>WhatsApp de Atendimento:</strong> {whatsappNumber}</p>
              <p><strong>Endereço:</strong> {INSTITUTIONAL_DATA.city}</p>
            </div>
          </section>

          <div className="pt-4 border-t border-slate-200 text-xs text-slate-400">
            Última atualização: Outubro de 2026. Esta política poderá ser revisada periodicamente para refletir melhorias contínuas ou alterações regulatórias.
          </div>

        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3.5 bg-slate-100 border-t border-slate-200 flex justify-end shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs sm:text-sm font-semibold transition-colors cursor-pointer"
          >
            Entendi e Concordo
          </button>
        </div>

      </div>
    </div>
  );
};
