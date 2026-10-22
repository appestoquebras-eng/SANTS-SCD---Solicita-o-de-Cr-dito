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
// CONDIÇÕES FINANCEIRAS CENTRALIZADAS (CREDIT_CONFIG)
// - Taxa mensal de referência: 1,35% a.m. (0.0135)
// - Taxa anual equivalente aproximada: 17,46% a.a. (0.1746)
// - Prazo geral da operação: de 6 a 120 meses
// - Limites de valores: PF (R$ 1.000 a R$ 50.000) e PJ (R$ 5.000 a R$ 100.000)
// ============================================================================
export const CREDIT_CONFIG = {
  monthlyInterestFrom: 0.0135,
  annualEquivalentFrom: 0.1746,

  minimumTermMonths: 6,
  maximumTermMonths: 120,

  // Aliases de retrocompatibilidade com componentes existentes
  minTermMonths: 6,
  maxTermMonths: 120,
  cet: null as number | null,
  fees: null as string | null,

  pf: {
    minAmount: 1000,
    maxAmount: 50000,
  },

  pj: {
    minAmount: 5000,
    maxAmount: 100000,
  },
};

// ============================================================================
// REGRAS INTERNAS DO SIMULADOR (PARCELA MÍNIMA POR FAIXA DE VALOR)
// Utilizadas internamente para limitar dinamicamente o prazo máximo e evitar
// a exibição de prestações excessivamente baixas.
// Não são apresentadas como critérios ou exigências de aprovação ao usuário.
// ============================================================================
export interface InstallmentRule {
  minAmount: number;
  maxAmount: number;
  minimumPayment: number;
}

export const INSTALLMENT_RULES: InstallmentRule[] = [
  {
    minAmount: 1000,
    maxAmount: 1499.99,
    minimumPayment: 150,
  },
  {
    minAmount: 1500,
    maxAmount: 3000,
    minimumPayment: 200,
  },
  {
    minAmount: 3000.01,
    maxAmount: 9000,
    minimumPayment: 250,
  },
  {
    minAmount: 9000.01,
    maxAmount: 15000,
    minimumPayment: 350,
  },
  {
    minAmount: 15000.01,
    maxAmount: 30000,
    minimumPayment: 500,
  },
  {
    minAmount: 30000.01,
    maxAmount: 50000,
    minimumPayment: 700,
  },
  {
    minAmount: 50000.01,
    maxAmount: 75000,
    minimumPayment: 1000,
  },
  {
    minAmount: 75000.01,
    maxAmount: 100000,
    minimumPayment: 1500,
  },
];

/**
 * Retorna a regra de prestação mínima interna correspondente à faixa do valor principal.
 */
export function getInstallmentRule(principal: number): InstallmentRule {
  const found = INSTALLMENT_RULES.find(
    (rule) => principal >= rule.minAmount - 0.001 && principal <= rule.maxAmount + 0.001
  );
  if (found) return found;
  if (principal < 1000) return INSTALLMENT_RULES[0];
  return INSTALLMENT_RULES[INSTALLMENT_RULES.length - 1];
}

/**
 * Cálculo da prestação fixa (Sistema Price / PMT)
 * PMT = PV × i / (1 - (1 + i)^(-n))
 */
export function calculateMonthlyPayment(
  principal: number,
  months: number,
  monthlyRate: number = CREDIT_CONFIG.monthlyInterestFrom
): number {
  if (months <= 0 || principal <= 0) return 0;
  if (monthlyRate === 0) return principal / months;
  return (
    (principal * monthlyRate) /
    (1 - Math.pow(1 + monthlyRate, -months))
  );
}

/**
 * Calcula dinamicamente o maior prazo permitido (entre 6 e 120 meses)
 * em que calculateMonthlyPayment(valor, meses, taxa) seja maior ou igual
 * à parcela mínima configurada na faixa daquele valor.
 */
export function getMaximumAllowedTerm(
  principal: number,
  monthlyRate: number = CREDIT_CONFIG.monthlyInterestFrom
): number {
  const rule = getInstallmentRule(principal);
  let maximum = CREDIT_CONFIG.minimumTermMonths;

  for (let months = CREDIT_CONFIG.minimumTermMonths; months <= CREDIT_CONFIG.maximumTermMonths; months++) {
    const payment = calculateMonthlyPayment(principal, months, monthlyRate);
    // Tolerância de 1 centavo para imprecisão de ponto flutuante
    if (payment >= rule.minimumPayment - 0.01) {
      maximum = months;
    } else {
      break;
    }
  }

  // Nunca permitir mais que o máximo absoluto configurado
  return Math.min(maximum, CREDIT_CONFIG.maximumTermMonths);
}

// ============================================================================
// VALIDAÇÃO DE CONFORMIDADE COM DIRETRIZES DO TIKTOK ADS (SERVIÇOS FINANCEIROS)
// - Prazo mínimo de pagamento: >= 6 meses (proibidos empréstimos de curtíssimo prazo <= 90 dias)
// - Taxa anual máxima permitida para certas campanhas: < 50% a.a.
// ============================================================================
export const TIKTOK_POLICY_VERIFICATION = {
  isMinimumTermCompliant: CREDIT_CONFIG.minimumTermMonths >= 6,
  isMaxAprCompliant: (CREDIT_CONFIG.annualEquivalentFrom < 1 ? CREDIT_CONFIG.annualEquivalentFrom * 100 : CREDIT_CONFIG.annualEquivalentFrom) < 50.0,
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
  monthlyInterestDisplay: "A partir de 1,35% ao mês",
  annualEquivalentDisplay: "A partir de aproximadamente 17,46% ao ano",
  termDisplay: `De ${CREDIT_CONFIG.minimumTermMonths} a ${CREDIT_CONFIG.maximumTermMonths} meses, conforme modalidade, perfil e análise de crédito.`,
  minTermDisplay: `${CREDIT_CONFIG.minimumTermMonths} meses`,
  maxTermDisplay: `${CREDIT_CONFIG.maximumTermMonths} meses`,
  
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

export function formatCurrencyBRL(value: number, includeDecimals = false): string {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    minimumFractionDigits: includeDecimals ? 2 : 0,
    maximumFractionDigits: includeDecimals ? 2 : 0,
  }).format(value);
}

export function formatCurrencyExactBRL(value: number): string {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
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

