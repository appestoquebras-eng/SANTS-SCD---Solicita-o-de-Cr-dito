/**
 * CONFIGURAÇÕES INSTITUCIONAIS E DE OPERAÇÃO DE CRÉDITO
 * SANTS SOCIEDADE DE CRÉDITO DIRETO S.A.
 * 
 * Em conformidade estrita com as regulamentações do Banco Central do Brasil,
 * Conselho Monetário Nacional (Resolução CMN nº 4.656/2018), LGPD (Lei nº 13.709/2018)
 * e políticas de publicidade para serviços financeiros no Brasil.
 */

// 1. CANAIS DE CONTATO
// Número oficial no formato internacional com DDI e DDD (55 + 11 + 962433641)
export const DEFAULT_WHATSAPP_NUMBER = "5511962433641";
export const DISPLAY_PHONE_NUMBER = "(11) 96243-3641";

// E-mail oficial institucional de atendimento aos clientes
export const DEFAULT_CONTACT_EMAIL = "contato@santscredito.online";

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

// ============================================================================
// EXEMPLO REPRESENTATIVO NUMÉRICO (EXIGÊNCIA TIKTOK ADS & BANCO CENTRAL)
// Cálculo matemático real (Sistema Price / amortização com parcelas fixas):
// - Valor solicitado de referência: R$ 10.000,00
// - Prazo: 24 meses
// - Taxa mensal de referência: 1,35% ao mês
// - Taxa anual equivalente: a partir de aproximadamente 17,46% ao ano
// - Parcela mensal estimada: R$ 490,59
// - Total estimado a pagar: R$ 11.774,16 (sendo R$ 1.774,16 em juros)
// - CET e IOF: discriminados detalhadamente na proposta antes da contratação
// ============================================================================
export const REPRESENTATIVE_EXAMPLE_DATA = {
  amount: 10000,
  amountDisplay: "R$ 10.000,00",
  termMonths: 24,
  termDisplay: "24 meses",
  monthlyRate: 1.35,
  monthlyRateDisplay: "1,35% ao mês",
  annualEquivalentRate: 17.46,
  annualRateDisplay: "A partir de aprox. 17,46% ao ano",
  installmentAmount: 490.59,
  installmentDisplay: "R$ 490,59",
  totalAmount: 11774.16,
  totalAmountDisplay: "R$ 11.774,16",
  interestTotal: 1774.16,
  interestTotalDisplay: "R$ 1.774,16",
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
    "Para um crédito de R$ 10.000, com prazo de 24 meses e taxa de 1,35% ao mês (equivalente a partir de aproximadamente 17,46% ao ano), a parcela estimada seria de aproximadamente R$ 490,59, com valor total aproximado de R$ 11.774,16. O CET e eventuais custos aplicáveis serão informados na proposta antes da contratação. As condições efetivas podem variar conforme modalidade, perfil e análise.",
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

export function formatPhoneDisplay(number: string): string {
  if (!number) return DISPLAY_PHONE_NUMBER;
  const clean = number.replace(/\D/g, '');
  if (clean.length === 13 && clean.startsWith('55')) {
    const ddd = clean.slice(2, 4);
    const part1 = clean.slice(4, 9);
    const part2 = clean.slice(9, 13);
    return `(${ddd}) ${part1}-${part2}`;
  }
  if (clean.length === 11) {
    const ddd = clean.slice(0, 2);
    const part1 = clean.slice(2, 7);
    const part2 = clean.slice(7, 11);
    return `(${ddd}) ${part1}-${part2}`;
  }
  return number;
}

