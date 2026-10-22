import React from 'react';
import { X, ShieldCheck } from 'lucide-react';
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
            Esta Política de Privacidade reflete o compromisso da <strong>{INSTITUTIONAL_DATA.legalName}</strong> com a transparência, privacidade e proteção dos dados pessoais de seus usuários, em estrita conformidade com a <strong>Lei Geral de Proteção de Dados Pessoais (LGPD - Lei nº 13.709/2018)</strong> e resoluções do Conselho Monetário Nacional e do Banco Central do Brasil.
          </div>

          <section>
            <h3 className="text-sm sm:text-base font-bold text-slate-900 mb-2">
              1. Identificação do Controlador
            </h3>
            <p>
              O controlador dos seus dados pessoais é a <strong>{INSTITUTIONAL_DATA.legalName}</strong> (Nome Fantasia: <strong>{INSTITUTIONAL_DATA.tradeName}</strong>), pessoa jurídica de direito privado inscrita no CNPJ sob o nº <strong>{INSTITUTIONAL_DATA.cnpj}</strong>, com sede no município de <strong>{INSTITUTIONAL_DATA.city}</strong>, instituição autorizada pelo Banco Central do Brasil a atuar como Sociedade de Crédito Direto, nos termos da regulamentação aplicável.
            </p>
          </section>

          <section>
            <h3 className="text-sm sm:text-base font-bold text-slate-900 mb-2">
              2. Dados Pessoais Coletados
            </h3>
            <p className="mb-2">
              Na utilização desta landing page e no atendimento preliminar, coletamos as informações necessárias para dar andamento à sua manifestação de interesse:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-slate-600">
              <li><strong>Dados fornecidos no simulador:</strong> Perfil selecionado (Pessoa Física ou Pessoa Jurídica) e valor de interesse indicado.</li>
              <li><strong>Dados de contato e mensageria:</strong> Número de telefone celular, nome informado no perfil de atendimento no WhatsApp e mensagens trocadas.</li>
              <li><strong>Dados cadastrais na etapa de análise:</strong> Durante o atendimento e formalização, poderão ser solicitados: nome completo, CPF/CNPJ, e-mail, comprovante de endereço e comprovantes de renda ou faturamento.</li>
              <li><strong>Dados coletados automaticamente:</strong> Endereço IP, data e hora de acesso, tipo de dispositivo, navegador utilizado e dados analíticos de tráfego.</li>
            </ul>
            <div className="mt-2 text-xs text-slate-500 italic bg-slate-50 p-2.5 rounded-lg border border-slate-200">
              * Importante: Em nenhuma hipótese solicitamos senhas bancárias, senhas de cartões, códigos de segurança de cartão de crédito (CVV), tokens ou depósitos prévios para análise ou liberação de crédito.
            </div>
          </section>

          <section>
            <h3 className="text-sm sm:text-base font-bold text-slate-900 mb-2">
              3. Cookies e Tecnologias de Medição
            </h3>
            <p>
              Utilizamos cookies técnicos necessários ao funcionamento da plataforma e identificadores de medição (como ferramentas de análise e pixels de conversão de campanhas publicitárias) para avaliar o desempenho das nossas páginas e aprimorar a experiência de navegação, respeitando as preferências do usuário e a legislação de proteção de dados.
            </p>
          </section>

          <section>
            <h3 className="text-sm sm:text-base font-bold text-slate-900 mb-2">
              4. Finalidade e Bases Legais do Tratamento
            </h3>
            <p className="mb-2">Tratamos os dados pessoais para as seguintes finalidades legítimas:</p>
            <ul className="list-disc pl-5 space-y-1.5 text-slate-600">
              <li><strong>Atendimento à solicitação de crédito:</strong> Viabilizar o contato inicial e executar os procedimentos preliminares relacionados à solicitação de crédito (Art. 7º, V da LGPD).</li>
              <li><strong>Análise de crédito e prevenção a fraudes:</strong> Avaliação cadastral, capacidade financeira e consulta a sistemas de proteção ao crédito (Art. 7º, X da LGPD).</li>
              <li><strong>Cumprimento de obrigações legais e regulatórias:</strong> Observância das normas expedidas pelo Banco Central do Brasil, Conselho Monetário Nacional e legislação aplicável (Art. 7º, II da LGPD).</li>
            </ul>
          </section>

          <section>
            <h3 className="text-sm sm:text-base font-bold text-slate-900 mb-2">
              5. Compartilhamento de Dados
            </h3>
            <p>
              Quando necessário para atendimento da solicitação, os dados poderão ser compartilhados com instituições financeiras ou parceiros envolvidos na análise, formalização ou atendimento da operação, conforme descrito nesta Política de Privacidade e observada a legislação aplicável.
            </p>
            <p className="mt-2">O compartilhamento poderá ocorrer também com:</p>
            <ul className="list-disc pl-5 space-y-1 text-slate-600 mt-1">
              <li>Birôs de crédito e sistemas oficiais (como SCR do Bacen) para fins exclusivos de análise de risco e proteção do crédito;</li>
              <li>Provedores de serviços de tecnologia, servidores em nuvem e mensageria com elevados padrões de segurança;</li>
              <li>Autoridades judiciais, policiais ou regulatórias competentes, mediante determinação legal expressa.</li>
            </ul>
            <p className="mt-2 text-xs text-slate-500">
              * A SANTS não comercializa dados pessoais de seus usuários sob nenhuma hipótese.
            </p>
          </section>

          <section>
            <h3 className="text-sm sm:text-base font-bold text-slate-900 mb-2">
              6. Segurança e Transferência Internacional
            </h3>
            <p>
              Adotamos medidas técnicas e organizacionais adequadas para proteger os dados pessoais contra acessos não autorizados, utilizando criptografia no trânsito de dados (HTTPS/TLS). Eventuais armazenamentos em infraestrutura de nuvem internacional obedecem aos preceitos da LGPD.
            </p>
          </section>

          <section>
            <h3 className="text-sm sm:text-base font-bold text-slate-900 mb-2">
              7. Retenção e Descarte dos Dados
            </h3>
            <p>
              Os dados serão armazenados pelo período necessário para cumprir as finalidades para as quais foram coletados, ou enquanto houver obrigação legal ou regulatória de guarda (como prazos regulatórios do Banco Central). Findo o período, os dados serão descartados de forma segura ou anonimizados.
            </p>
          </section>

          <section>
            <h3 className="text-sm sm:text-base font-bold text-slate-900 mb-2">
              8. Direitos do Titular (Art. 18 da LGPD)
            </h3>
            <p className="mb-2">Você possui os seguintes direitos garantidos pela LGPD:</p>
            <ul className="list-disc pl-5 space-y-1 text-slate-600">
              <li>Confirmação da existência de tratamento e acesso aos dados;</li>
              <li>Correção de dados incompletos, inexatos ou desatualizados;</li>
              <li>Anonimização, bloqueio ou eliminação de dados desnecessários ou tratados em desconformidade;</li>
              <li>Portabilidade dos dados a outro fornecedor, observada a regulamentação;</li>
              <li>Informação sobre entidades com as quais os dados foram compartilhados;</li>
              <li>Revogação do consentimento, nos termos da lei.</li>
            </ul>
          </section>

          <section>
            <h3 className="text-sm sm:text-base font-bold text-slate-900 mb-2">
              9. Canal de Contato e Encarregado de Proteção de Dados (DPO)
            </h3>
            <p>
              Para exercer seus direitos ou tirar dúvidas sobre esta política, entre em contato através dos nossos canais de atendimento:
            </p>
            <div className="mt-2 p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1 text-xs">
              <p><strong>Controlador:</strong> {INSTITUTIONAL_DATA.legalName}</p>
              <p><strong>CNPJ:</strong> {INSTITUTIONAL_DATA.cnpj}</p>
              <p><strong>Localização:</strong> {INSTITUTIONAL_DATA.city}</p>
              <p><strong>Canal de Atendimento:</strong> Disponível diretamente pela plataforma, pelo WhatsApp oficial: (11) 96243-3641 e pelo e-mail: contato@santscredito.online.</p>
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
            Entendi
          </button>
        </div>

      </div>
    </div>
  );
};
