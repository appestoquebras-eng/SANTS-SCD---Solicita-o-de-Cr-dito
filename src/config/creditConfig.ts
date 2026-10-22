/**
 * CONFIGURAÇÕES INSTITUCIONAIS E DE OPERAÇÃO DE CRÉDITO
 * SANTS SOCIEDADE DE CRÉDITO DIRETO S.A.
 * 
 * Em conformidade estrita com as regulamentações do Banco Central do Brasil,
 * Conselho Monetário Nacional (Resolução CMN nº 4.656/2018), LGPD (Lei nº 13.709/2018)
 * e políticas de publicidade para serviços financeiros no Brasil.
 */

// 1. CANAIS DE CONTATO
// Número oficial no formato internacional com DDI e DDD (ex: "5511999999999")
export const DEFAULT_WHATSAPP_NUMBER = "";

// E-mail oficial institucional de atendimento aos clientes
export const DEFAULT_CONTACT_EMAIL = "";

// 2. DADOS INSTITUCIONAIS OFICIAIS
export const INSTITUTIONAL_DATA = {
  legalName: "SANTS SOCIEDADE DE CRÉDITO DIRETO S.A.",
  tradeName: "SANTS SCD",
  cnpj: "52.440.987/0001-69",
  registrationStatus: "ATIVA",
  city: "São José dos Campos - SP",
  regulatoryStatement:
    "A SANTS Sociedade de Crédito Direto S.A. é uma instituição autorizada pelo Banco Central do Brasil a atuar como Sociedade de Crédito Direto, nos termos da regulamentação aplicável.",
  regulatoryFramework:
    "Sociedade de Crédito Direto (SCD) regida pela Resolução CMN nº 4.656/2018 e pela Lei nº 4.595/1964, autorizada a realizar operações de crédito exclusivamente por meio de plataforma eletrônica.",
};

// 3. PARÂMETROS DO SIMULADOR DE VALORES
export const SIMULATOR_CONFIG = {
  PF: {
    label: "Pessoa Física",
    minAmount: 1000,
    maxAmount: 50000,
    step: 500,
    defaultAmount: 10000,
    presetSteps: [5000, 10000, 20000, 35000, 50000],
  },
  PJ: {
    label: "Pessoa Jurídica",
    minAmount: 5000,
    maxAmount: 100000,
    step: 1000,
    defaultAmount: 20000,
    presetSteps: [10000, 20000, 50000, 75000, 100000],
  },
};

// ============================================================================
// CONDIÇÕES FINANCEIRAS CONFIRMADAS
// - Taxa mensal mínima: a partir de 1,35% a.m.
// - Taxa anual equivalente aproximada: 17,46% a.a. (equivalência composta a 1,35% a.m.)
// - Prazo: de 6 a 120 meses conforme modalidade, perfil e análise de crédito.
// - CET e Tarifas: apresentados de forma transparente quando não pré-fixados.
// ============================================================================
export const CREDIT_CONFIG = {
  monthlyInterestFrom: 1.35,
  annualEquivalentFrom: 17.46,
  minTermMonths: 6,
  maxTermMonths: 120,
  cet: null as number | null,
  fees: null as string | null,
};

// ============================================================================
// VALIDAÇÃO DE CONFORMIDADE COM DIRETRIZES DO TIKTOK ADS (SERVIÇOS FINANCEIROS)
// - Prazo mínimo de pagamento: >= 6 meses (proibidos empréstimos de curtíssimo prazo <= 90 dias)
// - Taxa anual máxima permitida para certas campanhas: < 50% a.a.
// ============================================================================
export const TIKTOK_POLICY_VERIFICATION = {
  isMinimumTermCompliant: CREDIT_CONFIG.minTermMonths >= 6,
  isMaxAprCompliant: CREDIT_CONFIG.annualEquivalentFrom < 50.0,
  get status() {
    if (!this.isMinimumTermCompliant || !this.isMaxAprCompliant) {
      console.warn(
        '[TIKTOK ADS COMPLIANCE WARNING] Parâmetros configurados excedem diretrizes de publicidade financeira do TikTok (prazo mínimo < 6 meses ou taxa anual >= 50%).'
      );
      return 'WARNING_NON_COMPLIANT';
    }
    return 'COMPLIANT';
  },
};

// Textos padronizados de transparência financeira
export const FINANCIAL_TEXTS = {
  monthlyInterestDisplay: `A partir de ${CREDIT_CONFIG.monthlyInterestFrom.toFixed(2).replace('.', ',')}% ao mês`,
  annualEquivalentDisplay: `A partir de aproximadamente ${CREDIT_CONFIG.annualEquivalentFrom.toFixed(2).replace('.', ',')}% ao ano`,
  termDisplay: `De ${CREDIT_CONFIG.minTermMonths} a ${CREDIT_CONFIG.maxTermMonths} meses, conforme modalidade, perfil e análise de crédito.`,
  minTermDisplay: `${CREDIT_CONFIG.minTermMonths} meses`,
  maxTermDisplay: `${CREDIT_CONFIG.maxTermMonths} meses`,
  
  // Quando CET for null, exibir divulgação verdadeira e transparente
  getCetDisplay: () => {
    if (CREDIT_CONFIG.cet !== null) {
      return `${CREDIT_CONFIG.cet.toFixed(2).replace('.', ',')}% a.a.`;
    }
    return "O CET aplicável varia conforme as condições específicas da operação e será informado na proposta antes da contratação.";
  },

  // Quando Tarifas for null, exibir divulgação verdadeira e transparente
  getFeesDisplay: () => {
    if (CREDIT_CONFIG.fees !== null) {
      return CREDIT_CONFIG.fees;
    }
    return "Eventuais tarifas e custos aplicáveis serão informados de forma clara antes da contratação e considerados no CET correspondente.";
  },

  representativeExample:
    "Exemplo representativo: as parcelas, o valor total e o CET dependem das condições efetivamente disponibilizadas após a análise. Antes de qualquer contratação, o cliente receberá a proposta com taxa, CET, prazo, parcelas, custos aplicáveis e valor total da operação.",
};

// Helper para ler override do WhatsApp e Email caso o operador configure no painel de testes local
export function getActiveWhatsAppNumber(): string {
  if (typeof window !== "undefined") {
    const saved = localStorage.getItem("sants_override_whatsapp");
    if (saved && saved.trim().length > 0) return saved.trim();
  }
  return DEFAULT_WHATSAPP_NUMBER;
}

export function getActiveContactEmail(): string {
  if (typeof window !== "undefined") {
    const saved = localStorage.getItem("sants_override_email");
    if (saved && saved.trim().length > 0) return saved.trim();
  }
  return DEFAULT_CONTACT_EMAIL;
}

export function formatCurrencyBRL(value: number): string {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}
