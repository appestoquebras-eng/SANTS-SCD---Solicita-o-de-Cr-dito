/**
 * CONFIGURAÇÕES INSTITUCIONAIS E DE OPERAÇÃO DE CRÉDITO
 * SANTS SOCIEDADE DE CRÉDITO DIRETO S.A.
 * 
 * ============================================================================
 * ATENÇÃO: Preencher os campos abaixo com os dados reais de contato e com as 
 * condições financeiras reais antes de veicular esta página em campanhas de publicidade.
 * ============================================================================
 */

// 1. CANAIS DE CONTATO
// Substitua pelo número oficial do WhatsApp no formato internacional com DDD (ex: "5511999999999")
export const DEFAULT_WHATSAPP_NUMBER = "[COLOCAR NÚMERO CORRETO]";

// Substitua pelo e-mail oficial institucional de atendimento
export const DEFAULT_CONTACT_EMAIL = "[COLOCAR E-MAIL CORRETO]";

// 2. DADOS INSTITUCIONAIS (OFICIAIS)
export const INSTITUTIONAL_DATA = {
  legalName: "SANTS SOCIEDADE DE CRÉDITO DIRETO S.A.",
  tradeName: "SANTS SCD",
  cnpj: "52.440.987/0001-69",
  registrationStatus: "ATIVA",
  city: "São José dos Campos - SP",
  regulatoryStatement:
    "A SANTS Sociedade de Crédito Direto S.A. é uma instituição autorizada pelo Banco Central do Brasil a atuar como Sociedade de Crédito Direto, nos termos da legislação vigente.",
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
// ATENÇÃO: preencher com as condições financeiras reais antes de utilizar esta
// página em campanhas de publicidade.
// NUNCA inventar taxas ou promessas absolutas.
// ============================================================================
export const FINANCIAL_CONDITIONS = {
  MONTHLY_INTEREST_RATE: "[A DEFINIR CONFORME PRODUTO]",
  ANNUAL_INTEREST_RATE: "[A DEFINIR CONFORME PRODUTO]",
  CET: "[A DEFINIR CONFORME OPERAÇÃO]",
  MIN_TERM: "[A DEFINIR (ex: 6 meses)]",
  MAX_TERM: "[A DEFINIR (ex: 48 meses)]",
  FEES: "[A DEFINIR - Sem cobrança de taxa prévia de liberação]",
  REPRESENTATIVE_EXAMPLE:
    "Exemplo: para uma solicitação de R$ [X], considerando prazo de [X] meses e taxa de [X]% ao mês, o valor total e as parcelas dependerão das condições efetivamente disponibilizadas após análise.",
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
