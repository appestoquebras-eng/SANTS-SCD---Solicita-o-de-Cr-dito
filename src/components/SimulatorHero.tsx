import React, { useState, useEffect } from 'react';
import { User, Building2, AlertCircle, ShieldCheck, Calculator } from 'lucide-react';
import {
  SIMULATOR_CONFIG,
  CREDIT_CONFIG,
  formatCurrencyBRL,
  formatCurrencyExactBRL,
  getActiveWhatsAppNumber,
  calculateMonthlyPayment,
  getMaximumAllowedTerm,
} from '../config/creditConfig';
import { trackEvent } from '../utils/tracking';

interface SimulatorHeroProps {
  onOpenPrivacy: () => void;
  onOpenConfig?: () => void;
}

export const SimulatorHero: React.FC<SimulatorHeroProps> = ({ onOpenPrivacy, onOpenConfig }) => {
  const [profile, setProfile] = useState<'PF' | 'PJ'>('PF');
  const [amount, setAmount] = useState<number>(SIMULATOR_CONFIG.PF.defaultAmount); // R$ 10.000
  
  // Prazo inicial baseado no valor padrão (para 10.000 o máximo calculado é 36)
  const initialMaxTerm = getMaximumAllowedTerm(SIMULATOR_CONFIG.PF.defaultAmount);
  const [term, setTerm] = useState<number>(Math.min(36, initialMaxTerm));

  // Checkbox de consentimento marcado como padrão (sempre ativo)
  const [agreedPrivacy, setAgreedPrivacy] = useState<boolean>(true);
  const [showConfigNotice, setShowConfigNotice] = useState<boolean>(false);
  const [validationError, setValidationError] = useState<string | null>(null);

  const currentConfig = SIMULATOR_CONFIG[profile];

  // Cálculo dinâmico do prazo máximo permitido para o valor atual
  const maxAllowedTerm = getMaximumAllowedTerm(amount);

  // Cálculo da parcela mensal estimada pela fórmula PMT
  const estimatedPayment = calculateMonthlyPayment(amount, term, CREDIT_CONFIG.monthlyInterestFrom);

  // Disparar eventos quando o simulador carrega
  useEffect(() => {
    trackEvent('page_view');
    trackEvent('application_started', {
      profile,
      amount,
      term,
    });
    trackEvent('simulation_started', {
      profile,
      amount,
      term,
    });
  }, []);

  // Notificar cálculo de estimativa sempre que os parâmetros alterarem
  useEffect(() => {
    if (estimatedPayment > 0) {
      trackEvent('payment_estimate_calculated', {
        profile,
        amount,
        term,
        estimated_payment: estimatedPayment,
      });
    }
  }, [profile, amount, term, estimatedPayment]);

  // Quando alterna PF/PJ, ajusta o valor para os limites do perfil selecionado
  const handleProfileChange = (newProfile: 'PF' | 'PJ') => {
    setValidationError(null);
    setProfile(newProfile);
    const targetConfig = SIMULATOR_CONFIG[newProfile];
    let newAmount = amount;
    if (newAmount < targetConfig.minAmount) {
      newAmount = targetConfig.minAmount;
    } else if (newAmount > targetConfig.maxAmount) {
      newAmount = targetConfig.maxAmount;
    } else {
      newAmount = Math.round(newAmount / targetConfig.step) * targetConfig.step;
    }
    setAmount(newAmount);

    // Recalcula o prazo máximo para o novo valor
    const newMaxTerm = getMaximumAllowedTerm(newAmount);
    if (term > newMaxTerm) {
      setTerm(newMaxTerm);
    }

    trackEvent('profile_selected', {
      profile: newProfile,
      amount: newAmount,
    });
  };

  // Quando o usuário ajusta o valor de interesse
  const handleAmountChange = (newVal: number) => {
    setValidationError(null);
    setAmount(newVal);

    // Recalcula dinamicamente o prazo máximo
    const newMaxTerm = getMaximumAllowedTerm(newVal);
    if (term > newMaxTerm) {
      setTerm(newMaxTerm);
    }

    trackEvent('amount_changed', {
      profile,
      amount: newVal,
    });
    trackEvent('loan_amount_changed', {
      profile,
      amount: newVal,
    });
  };

  // Quando o usuário altera o número de parcelas
  const handleTermChange = (newTerm: number) => {
    setValidationError(null);
    const validTerm = Math.max(CREDIT_CONFIG.minimumTermMonths, Math.min(newTerm, maxAllowedTerm));
    setTerm(validTerm);

    trackEvent('term_changed', {
      profile,
      amount,
      term: validTerm,
    });
  };

  // Toggle do consentimento de privacidade
  const handlePrivacyToggle = (checked: boolean) => {
    setAgreedPrivacy(checked);
    if (checked) {
      setValidationError(null);
      trackEvent('privacy_accepted', {
        profile,
        amount,
        term,
      });
    }
  };

  // Validação estrita e abertura do canal de WhatsApp com dados oficiais
  const handleWhatsAppClick = (e: React.MouseEvent) => {
    setValidationError(null);

    // 1. Validação de consentimento
    if (!agreedPrivacy) {
      setValidationError('Marque o aceite da Política de Privacidade para prosseguir com o atendimento.');
      return;
    }

    // 2. Validação de perfil
    if (profile !== 'PF' && profile !== 'PJ') {
      setValidationError('Selecione se você é Pessoa Física ou Pessoa Jurídica.');
      return;
    }

    // 3. Validação de intervalo de valor do perfil
    const config = SIMULATOR_CONFIG[profile];
    if (amount < config.minAmount || amount > config.maxAmount) {
      setValidationError(
        `O valor de interesse deve estar entre ${formatCurrencyBRL(config.minAmount)} e ${formatCurrencyBRL(config.maxAmount)}.`
      );
      return;
    }

    // 4. Validação do prazo em relação ao limite dinâmico
    const currentMax = getMaximumAllowedTerm(amount);
    if (term < CREDIT_CONFIG.minimumTermMonths || term > currentMax) {
      setValidationError(
        `O prazo deve ser de ${CREDIT_CONFIG.minimumTermMonths} a ${currentMax} parcelas para o valor selecionado.`
      );
      return;
    }

    // 5. Validação de cálculo numérico
    if (!estimatedPayment || estimatedPayment <= 0 || isNaN(estimatedPayment)) {
      setValidationError('Não foi possível calcular a estimativa. Por favor, reajuste o valor ou o prazo.');
      return;
    }

    const currentNumber = getActiveWhatsAppNumber();

    // Se o número ainda não tiver sido preenchido
    if (!currentNumber || currentNumber.trim().length < 8) {
      e.preventDefault();
      setShowConfigNotice(true);
      return;
    }

    trackEvent('whatsapp_click', {
      profile,
      amount,
      term,
      estimated_payment: estimatedPayment,
    });

    const profileText = profile === 'PF' ? 'Pessoa Física' : 'Pessoa Jurídica';
    const formattedAmount = formatCurrencyBRL(amount);
    const formattedPayment = formatCurrencyExactBRL(estimatedPayment);

    const message = `Olá! Vim pelo site da SANTS e gostaria de iniciar uma solicitação para análise de crédito.\n\nPerfil: ${profileText}\nValor de interesse: ${formattedAmount}\nPrazo selecionado: ${term} meses\nParcela mensal estimada: ${formattedPayment}\n\nEstou ciente de que esta é uma estimativa e que a solicitação está sujeita à análise. Taxas, CET, custos, valores e condições definitivas podem variar.`;

    const encodedMessage = encodeURIComponent(message);
    const cleanNumber = currentNumber.replace(/\D/g, '');
    const whatsappUrl = `https://wa.me/${cleanNumber}?text=${encodedMessage}`;

    window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <section id="simulador" className="relative pt-2 pb-8 sm:pt-6 sm:pb-12 bg-gradient-to-b from-slate-900 via-slate-900 to-slate-800 text-white overflow-hidden">
      {/* Visual background textures */}
      <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#3b82f6_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-3xl mx-auto px-4 sm:px-6">
        
        {/* Informação Institucional e Regulatória Compacta */}
        <div className="flex items-center justify-center gap-1.5 mb-2 text-center">
          <ShieldCheck className="w-4 h-4 text-blue-400 shrink-0" />
          <p className="text-xs text-slate-300 font-medium">
            Instituição autorizada pelo <span className="text-white font-semibold">Banco Central do Brasil</span> a atuar como SCD
          </p>
        </div>

        {/* Hero Title & Subtitle Compacto */}
        <div className="text-center max-w-xl mx-auto mb-3 sm:mb-5">
          <h1 className="text-xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-white mb-1 leading-tight">
            Crédito para seus planos, sujeito à análise
          </h1>
          <p className="text-xs sm:text-sm text-slate-300">
            Simule o valor de interesse e o prazo estimado para iniciar sua solicitação.
          </p>
        </div>

        {/* Main Interactive Simulator Card - Compacto e direto ao ponto */}
        <div className="bg-slate-800/95 border border-slate-700/80 rounded-2xl p-3.5 sm:p-6 shadow-2xl backdrop-blur-sm space-y-3.5 sm:space-y-4">
          
          {/* ================================================================= */}
          {/* PASSO 1: Qual é o seu perfil? (Compacto) */}
          {/* ================================================================= */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs sm:text-sm font-semibold text-slate-200">
                1. Qual é o seu perfil?
              </label>
              <span className="text-[11px] text-slate-400 font-mono">
                {profile === 'PF' ? 'PF: R$ 1k a R$ 50k' : 'PJ: R$ 5k a R$ 100k'}
              </span>
            </div>
            <div className="grid grid-cols-2 gap-2 sm:gap-3">
              <button
                type="button"
                onClick={() => handleProfileChange('PF')}
                className={`flex items-center justify-center gap-2 py-2 sm:py-2.5 px-3 rounded-xl border text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                  profile === 'PF'
                    ? 'bg-blue-600 text-white border-blue-400 shadow-sm shadow-blue-600/30'
                    : 'bg-slate-900/60 text-slate-300 border-slate-700 hover:bg-slate-700/50 hover:text-white'
                }`}
                aria-pressed={profile === 'PF'}
              >
                <User className="w-4 h-4 shrink-0" />
                <span>Pessoa Física</span>
              </button>

              <button
                type="button"
                onClick={() => handleProfileChange('PJ')}
                className={`flex items-center justify-center gap-2 py-2 sm:py-2.5 px-3 rounded-xl border text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                  profile === 'PJ'
                    ? 'bg-blue-600 text-white border-blue-400 shadow-sm shadow-blue-600/30'
                    : 'bg-slate-900/60 text-slate-300 border-slate-700 hover:bg-slate-700/50 hover:text-white'
                }`}
                aria-pressed={profile === 'PJ'}
              >
                <Building2 className="w-4 h-4 shrink-0" />
                <span>Pessoa Jurídica</span>
              </button>
            </div>
          </div>

          {/* ================================================================= */}
          {/* PASSO 2: Qual valor você deseja solicitar? (Valor de interesse) */}
          {/* ================================================================= */}
          <div className="bg-slate-900/55 rounded-xl p-3 sm:p-4 border border-slate-700/60">
            <div className="flex items-baseline justify-between mb-1">
              <label htmlFor="amount-slider" className="text-xs sm:text-sm font-semibold text-slate-200">
                2. Valor de interesse
              </label>
              <span className="text-xl sm:text-3xl font-black text-white font-mono tracking-tight">
                {formatCurrencyBRL(amount)}
              </span>
            </div>

            {/* Slider de valor */}
            <div className="py-1">
              <input
                id="amount-slider"
                type="range"
                min={currentConfig.minAmount}
                max={currentConfig.maxAmount}
                step={currentConfig.step}
                value={amount}
                onChange={(e) => handleAmountChange(Number(e.target.value))}
                className="w-full accent-blue-500 cursor-pointer h-2 bg-slate-700 rounded-lg"
                aria-valuemin={currentConfig.minAmount}
                aria-valuemax={currentConfig.maxAmount}
                aria-valuenow={amount}
                aria-label={`Valor de interesse: ${formatCurrencyBRL(amount)}`}
              />
            </div>

            {/* Extremidades mínima e máxima */}
            <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono mt-1">
              <span>Mínimo: {formatCurrencyBRL(currentConfig.minAmount)}</span>
              <span>Máximo: {formatCurrencyBRL(currentConfig.maxAmount)}</span>
            </div>
          </div>

          {/* ================================================================= */}
          {/* PASSO 3: Em quantas parcelas? */}
          {/* ================================================================= */}
          <div className="bg-slate-900/55 rounded-xl p-3 sm:p-4 border border-slate-700/60">
            <div className="flex items-baseline justify-between mb-1">
              <label htmlFor="term-slider" className="text-xs sm:text-sm font-semibold text-slate-200">
                3. Em quantas parcelas?
              </label>
              <span className="text-xl sm:text-3xl font-black text-white font-mono tracking-tight">
                {term}x <span className="text-xs sm:text-sm font-normal text-slate-400">({term} meses)</span>
              </span>
            </div>

            {/* Slider de parcelas */}
            <div className="py-1">
              <input
                id="term-slider"
                type="range"
                min={CREDIT_CONFIG.minimumTermMonths}
                max={maxAllowedTerm}
                step={1}
                value={term}
                onChange={(e) => handleTermChange(Number(e.target.value))}
                className="w-full accent-blue-500 cursor-pointer h-2 bg-slate-700 rounded-lg"
                aria-valuemin={CREDIT_CONFIG.minimumTermMonths}
                aria-valuemax={maxAllowedTerm}
                aria-valuenow={term}
                aria-label={`Prazo: ${term} parcelas`}
              />
            </div>

            {/* Extremidades */}
            <div className="flex justify-between items-center text-[11px] text-slate-400 font-mono mt-1">
              <span>{CREDIT_CONFIG.minimumTermMonths}x</span>
              <span className="text-[10px] text-slate-400">
                Máximo de {maxAllowedTerm}x para este valor
              </span>
              <span>{maxAllowedTerm}x</span>
            </div>
          </div>

          {/* ================================================================= */}
          {/* PASSO 4: Card de Resultado (Estimativa da solicitação) Compacto */}
          {/* ================================================================= */}
          <div className="p-3 sm:p-4 bg-gradient-to-r from-blue-950/70 via-slate-900 to-slate-900 border border-blue-500/40 rounded-xl shadow-md">
            <div className="flex items-center justify-between gap-2 mb-1">
              <div className="flex items-center gap-1.5 text-blue-400 text-xs font-bold uppercase tracking-wider">
                <Calculator className="w-3.5 h-3.5 shrink-0" />
                <span>Estimativa da solicitação</span>
              </div>
              <span className="text-[10px] text-slate-400 font-mono">
                Taxa ref. 1,35% a.m.
              </span>
            </div>

            <div className="flex flex-wrap items-baseline justify-between gap-1 py-0.5">
              <div>
                <span className="text-[11px] text-slate-300 block">Parcela mensal estimada:</span>
                <div className="text-2xl sm:text-3xl font-black text-white font-mono tracking-tight">
                  aproximadamente {formatCurrencyExactBRL(estimatedPayment)}
                </div>
              </div>
              <div className="text-right text-xs text-slate-300 font-mono">
                <span>{formatCurrencyBRL(amount)}</span> em <strong>{term} meses</strong>
              </div>
            </div>
          </div>

          {/* ================================================================= */}
          {/* PASSO 5: Consentimento de Privacidade (Compacto) */}
          {/* ================================================================= */}
          <div>
            <label className="flex items-start gap-2.5 cursor-pointer select-none group text-left">
              <input
                type="checkbox"
                checked={agreedPrivacy}
                onChange={(e) => handlePrivacyToggle(e.target.checked)}
                className="mt-0.5 w-4 h-4 rounded border-slate-600 bg-slate-900 text-blue-600 focus:ring-2 focus:ring-blue-500 focus:ring-offset-slate-800 cursor-pointer shrink-0"
                id="privacy-consent"
              />
              <span className="text-xs text-slate-300 group-hover:text-white leading-snug">
                Li a{' '}
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    onOpenPrivacy();
                  }}
                  className="text-blue-400 underline underline-offset-2 hover:text-blue-300 font-medium inline"
                >
                  Política de Privacidade
                </button>{' '}
                e autorizo o tratamento dos meus dados para atendimento desta solicitação.
              </span>
            </label>
          </div>

          {/* Feedback de Validação Amigável */}
          {validationError && (
            <div className="p-2.5 bg-red-950/70 border border-red-500/60 rounded-xl text-xs text-red-200 flex items-start gap-2 animate-in fade-in">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
              <span>{validationError}</span>
            </div>
          )}

          {/* ================================================================= */}
          {/* BOTÃO PRINCIPAL: Continuar pelo WhatsApp */}
          {/* ================================================================= */}
          <button
            type="button"
            disabled={!agreedPrivacy}
            onClick={handleWhatsAppClick}
            className={`w-full py-3.5 px-5 rounded-xl font-bold text-base sm:text-lg flex items-center justify-center gap-2.5 transition-all duration-200 cursor-pointer shadow-lg ${
              agreedPrivacy
                ? 'bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-white shadow-emerald-900/30 hover:scale-[1.005]'
                : 'bg-slate-700 text-slate-400 cursor-not-allowed opacity-60 shadow-none'
            }`}
          >
            {/* Logo Oficial do WhatsApp */}
            <svg
              className="w-5 h-5 shrink-0 fill-current"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path d="M12.031 2C6.516 2 2.025 6.491 2.025 12.006c0 1.93.551 3.734 1.508 5.263L2.002 22l4.898-1.503a9.96 9.96 0 0 0 5.131 1.517c5.515 0 10.006-4.491 10.006-10.008C22.037 6.491 17.546 2 12.031 2zm0 18.232c-1.637 0-3.153-.473-4.437-1.285l-.318-.201-2.923.898.908-2.854-.207-.328A8.19 8.19 0 0 1 3.82 12.006C3.82 7.481 7.498 3.803 12.031 3.803c4.533 0 8.211 3.678 8.211 8.203 0 4.525-3.678 8.226-8.211 8.226zm4.502-6.149c-.247-.124-1.463-.722-1.69-.805-.227-.082-.392-.124-.557.124-.165.247-.64 1.052-.784 1.217-.144.165-.289.186-.536.062-.247-.124-1.043-.385-1.986-1.226-.734-.655-1.23-1.464-1.374-1.711-.144-.247-.015-.38.109-.504.111-.111.247-.289.371-.433.124-.144.165-.247.247-.412.082-.165.041-.309-.021-.433-.062-.124-.557-1.34-.763-1.835-.2-.482-.404-.417-.557-.425l-.474-.008c-.165 0-.433.062-.66.309-.227.247-.866.845-.866 2.062 0 1.216.887 2.392 1.01 2.557.124.165 1.745 2.665 4.227 3.738.591.255 1.052.408 1.412.522.593.188 1.134.161 1.56.098.476-.071 1.463-.598 1.669-1.175.206-.577.206-1.072.144-1.175-.062-.103-.227-.165-.474-.289z" />
            </svg>
            <span>Continuar pelo WhatsApp</span>
          </button>

          {!agreedPrivacy && (
            <p className="text-center text-[11px] text-amber-400/90 flex items-center justify-center gap-1.5">
              <AlertCircle className="w-3.5 h-3.5 shrink-0" />
              Marque o aceite da Política de Privacidade acima para continuar.
            </p>
          )}

          {/* ================================================================= */}
          {/* EXPLICAÇÕES E CONDIÇÕES REGULATÓRIAS (EM BAIXO DO BOTÃO) */}
          {/* ================================================================= */}
          <div className="pt-3 border-t border-slate-700/60 space-y-1.5 text-[11px] text-slate-400 leading-relaxed text-center sm:text-left">
            <p>
              <strong className="text-slate-300">Explicações e Condições:</strong> Esta é apenas uma estimativa calculada com a taxa de referência mínima informada de 1,35% ao mês (equivalente a partir de aprox. 17,46% ao ano). A taxa efetiva, CET, custos, valor da parcela e demais condições podem variar conforme modalidade, perfil e análise de crédito. O número máximo de parcelas varia conforme o valor de interesse.
            </p>
            <p className="text-slate-500">
              A estimativa acima utiliza apenas a taxa mensal de referência e pode não incluir CET, tributos, seguros ou outros custos eventualmente aplicáveis. Estimativa informativa; não representa aprovação, proposta vinculante ou garantia de concessão de crédito.
            </p>
            <p className="text-slate-400 font-medium text-center">
              Operação sujeita à análise • Produto destinado exclusivamente a maiores de 18 anos.
            </p>
          </div>
        </div>

        {/* Modal / Dialog quando o número de WhatsApp precisa ser configurado localmente */}
        {showConfigNotice && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-150">
            <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-md w-full p-6 text-slate-200 shadow-2xl">
              <div className="flex items-center gap-3 text-amber-400 mb-3">
                <AlertCircle className="w-6 h-6 shrink-0" />
                <h3 className="text-base font-bold text-white">Configuração do WhatsApp</h3>
              </div>
              <p className="text-xs sm:text-sm text-slate-300 mb-4 leading-relaxed">
                O número de atendimento ainda não foi configurado em <code className="text-blue-300 font-mono text-xs">src/config/creditConfig.ts</code>.
              </p>
              <p className="text-xs text-slate-400 mb-5">
                Insira o número oficial com DDI e DDD (ex: 5511999999999) para prosseguir:
              </p>
              
              <div className="space-y-3">
                <input
                  type="text"
                  placeholder="Ex: 5511999998888 (com DDI e DDD)"
                  id="quick-whatsapp-input"
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500 font-mono"
                />
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      const input = document.getElementById('quick-whatsapp-input') as HTMLInputElement;
                      if (input && input.value.trim()) {
                        localStorage.setItem('sants_override_whatsapp', input.value.trim());
                        setShowConfigNotice(false);
                        setTimeout(() => {
                          const fakeEvent = { preventDefault: () => {} } as any;
                          handleWhatsAppClick(fakeEvent);
                        }, 100);
                      }
                    }}
                    className="flex-1 bg-blue-600 hover:bg-blue-500 text-white font-semibold py-2 px-3 rounded-lg text-xs transition-colors cursor-pointer"
                  >
                    Salvar e Abrir WhatsApp
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowConfigNotice(false)}
                    className="bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium py-2 px-3 rounded-lg text-xs transition-colors cursor-pointer"
                  >
                    Fechar
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    </section>
  );
};
