import React, { useState, useEffect } from 'react';
import { User, Building2, MessageCircle, AlertCircle, ShieldCheck } from 'lucide-react';
import {
  SIMULATOR_CONFIG,
  INSTITUTIONAL_DATA,
  formatCurrencyBRL,
  getActiveWhatsAppNumber,
} from '../config/creditConfig';
import { trackEvent } from '../utils/tracking';

interface SimulatorHeroProps {
  onOpenPrivacy: () => void;
  onOpenConfig?: () => void;
}

export const SimulatorHero: React.FC<SimulatorHeroProps> = ({ onOpenPrivacy, onOpenConfig }) => {
  const [profile, setProfile] = useState<'PF' | 'PJ'>('PF');
  const [amount, setAmount] = useState<number>(SIMULATOR_CONFIG.PF.defaultAmount);
  const [agreedPrivacy, setAgreedPrivacy] = useState<boolean>(true);
  const [showConfigNotice, setShowConfigNotice] = useState<boolean>(false);

  const currentConfig = SIMULATOR_CONFIG[profile];

  // Disparar evento quando o simulador carrega pela primeira vez
  useEffect(() => {
    trackEvent('simulation_started', {
      profile,
      amount,
    });
  }, []);

  // Quando alterna PF/PJ, ajusta o valor para os limites do perfil selecionado
  const handleProfileChange = (newProfile: 'PF' | 'PJ') => {
    setProfile(newProfile);
    const targetConfig = SIMULATOR_CONFIG[newProfile];
    let newAmount = amount;
    if (newAmount < targetConfig.minAmount) {
      newAmount = targetConfig.minAmount;
    } else if (newAmount > targetConfig.maxAmount) {
      newAmount = targetConfig.maxAmount;
    } else {
      // Ajusta para o múltiplo mais próximo do step
      newAmount = Math.round(newAmount / targetConfig.step) * targetConfig.step;
    }
    setAmount(newAmount);

    trackEvent('profile_selected', {
      profile: newProfile,
      amount: newAmount,
    });
  };

  const handleAmountChange = (newVal: number) => {
    setAmount(newVal);
    trackEvent('loan_amount_changed', {
      profile,
      amount: newVal,
    });
  };

  const handlePrivacyToggle = (checked: boolean) => {
    setAgreedPrivacy(checked);
    if (checked) {
      trackEvent('privacy_accepted', {
        profile,
        amount,
      });
    }
  };

  // Construir link dinâmico do WhatsApp
  const handleWhatsAppClick = (e: React.MouseEvent) => {
    if (!agreedPrivacy) return;

    const currentNumber = getActiveWhatsAppNumber();
    
    // Se ainda estiver com o placeholder padrão e não for um número válido
    if (!currentNumber || currentNumber.includes('[') || currentNumber.length < 8) {
      e.preventDefault();
      setShowConfigNotice(true);
      return;
    }

    trackEvent('whatsapp_click', {
      profile,
      amount,
      whatsapp_number: currentNumber,
    });

    const profileText = profile === 'PF' ? 'Pessoa Física' : 'Pessoa Jurídica';
    const formattedAmount = formatCurrencyBRL(amount);

    const message = `Olá! Vim pelo site da SANTS e gostaria de solicitar uma análise de crédito.\n\nPerfil: ${profileText}\nValor de interesse: ${formattedAmount}\n\nEstou ciente de que a solicitação está sujeita à análise e que valores, taxas e condições podem variar.`;

    const encodedMessage = encodeURIComponent(message);
    // Limpar qualquer caractere não numérico para o wa.me
    const cleanNumber = currentNumber.replace(/\D/g, '');
    const whatsappUrl = `https://wa.me/${cleanNumber}?text=${encodedMessage}`;

    window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <section id="simulador" className="relative pt-4 pb-12 sm:pt-8 sm:pb-16 bg-gradient-to-b from-slate-900 via-slate-900 to-slate-800 text-white overflow-hidden">
      {/* Background visual texture */}
      <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#3b82f6_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-4xl mx-auto px-4 sm:px-6">
        
        {/* Regulatory Banner Pill-Free */}
        <div className="flex items-center justify-center gap-2 mb-4 sm:mb-6 text-center">
          <ShieldCheck className="w-4 h-4 text-blue-400 shrink-0" />
          <p className="text-xs sm:text-sm text-slate-300 font-medium">
            Instituição autorizada pelo <span className="text-white font-semibold">Banco Central do Brasil</span> · SCD ativa
          </p>
        </div>

        {/* Hero Title & Subtitle */}
        <div className="text-center max-w-2xl mx-auto mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-white mb-2 sm:mb-3 text-balance leading-tight">
            Crédito para seus planos, sujeito à análise
          </h1>
          <p className="text-sm sm:text-base text-slate-300 font-normal">
            Escolha seu perfil e o valor de interesse para iniciar sua solicitação.
          </p>
          <p className="text-xs text-slate-400 mt-1.5 font-light">
            Valores e condições estão sujeitos à análise de crédito, disponibilidade e critérios aplicáveis.
          </p>
        </div>

        {/* Main Interactive Simulator Card */}
        <div className="bg-slate-800/90 border border-slate-700/80 rounded-2xl p-5 sm:p-8 shadow-2xl backdrop-blur-sm">
          
          {/* Question: PF or PJ */}
          <div className="mb-6">
            <label className="block text-xs sm:text-sm font-semibold text-slate-200 uppercase tracking-wider mb-3 text-center sm:text-left">
              Você é Pessoa Física ou Pessoa Jurídica?
            </label>
            <div className="grid grid-cols-2 gap-3 sm:gap-4">
              <button
                type="button"
                onClick={() => handleProfileChange('PF')}
                className={`flex items-center justify-center gap-2.5 py-3.5 sm:py-4 px-3 sm:px-5 rounded-xl border text-sm sm:text-base font-semibold transition-all cursor-pointer ${
                  profile === 'PF'
                    ? 'bg-blue-600 text-white border-blue-400 shadow-md shadow-blue-600/30'
                    : 'bg-slate-900/60 text-slate-300 border-slate-700 hover:bg-slate-700/50 hover:text-white'
                }`}
                aria-pressed={profile === 'PF'}
              >
                <User className="w-4 h-4 sm:w-5 sm:h-5 shrink-0" />
                <span>Pessoa Física</span>
              </button>

              <button
                type="button"
                onClick={() => handleProfileChange('PJ')}
                className={`flex items-center justify-center gap-2.5 py-3.5 sm:py-4 px-3 sm:px-5 rounded-xl border text-sm sm:text-base font-semibold transition-all cursor-pointer ${
                  profile === 'PJ'
                    ? 'bg-blue-600 text-white border-blue-400 shadow-md shadow-blue-600/30'
                    : 'bg-slate-900/60 text-slate-300 border-slate-700 hover:bg-slate-700/50 hover:text-white'
                }`}
                aria-pressed={profile === 'PJ'}
              >
                <Building2 className="w-4 h-4 sm:w-5 sm:h-5 shrink-0" />
                <span>Pessoa Jurídica</span>
              </button>
            </div>
          </div>

          {/* Slider Section */}
          <div className="mb-6 bg-slate-900/50 rounded-xl p-4 sm:p-6 border border-slate-700/60">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs sm:text-sm font-medium text-slate-300">
                Valor de interesse
              </span>
              <span className="text-xs text-slate-400 hidden sm:inline">
                Etapa preliminar para análise
              </span>
            </div>

            {/* Displayed Amount in prominent typography */}
            <div className="text-center sm:text-left mb-4">
              <div className="text-3xl sm:text-5xl font-black text-white tracking-tight tabular-nums font-mono">
                {formatCurrencyBRL(amount)}
              </div>
              <p className="text-xs text-slate-400 mt-1">
                Faixa disponível para consulta {profile === 'PF' ? 'PF (R$ 1.000 a R$ 50.000)' : 'PJ (R$ 5.000 a R$ 100.000)'}
              </p>
            </div>

            {/* Range Input Slider */}
            <div className="py-2">
              <label htmlFor="amount-slider" className="sr-only">
                Selecione o valor de interesse
              </label>
              <input
                id="amount-slider"
                type="range"
                min={currentConfig.minAmount}
                max={currentConfig.maxAmount}
                step={currentConfig.step}
                value={amount}
                onChange={(e) => handleAmountChange(Number(e.target.value))}
                className="w-full accent-blue-500 cursor-pointer"
                aria-valuemin={currentConfig.minAmount}
                aria-valuemax={currentConfig.maxAmount}
                aria-valuenow={amount}
                aria-label={`Valor de interesse: ${formatCurrencyBRL(amount)}`}
              />
            </div>

            {/* Range Extremes */}
            <div className="flex justify-between items-center text-xs text-slate-400 font-mono tabular-nums mt-1">
              <span>{formatCurrencyBRL(currentConfig.minAmount)}</span>
              <span>{formatCurrencyBRL(currentConfig.maxAmount)}</span>
            </div>

            {/* Preset quick buttons */}
            <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 mt-4 pt-3 border-t border-slate-800">
              <span className="text-xs text-slate-400 mr-1 hidden sm:inline">Valores rápidos:</span>
              {currentConfig.presetSteps.map((presetVal) => (
                <button
                  key={presetVal}
                  type="button"
                  onClick={() => handleAmountChange(presetVal)}
                  className={`text-xs py-1 px-2.5 rounded-md font-mono tabular-nums transition-colors cursor-pointer ${
                    amount === presetVal
                      ? 'bg-blue-500/20 text-blue-300 border border-blue-500/40 font-semibold'
                      : 'bg-slate-800 text-slate-300 hover:bg-slate-700 border border-slate-700/60'
                  }`}
                >
                  {formatCurrencyBRL(presetVal)}
                </button>
              ))}
            </div>
          </div>

          {/* Consent Checkbox (Strictly Mandatory & Unchecked by default) */}
          <div className="mb-6">
            <label className="flex items-start gap-3 cursor-pointer select-none group text-left">
              <input
                type="checkbox"
                checked={agreedPrivacy}
                onChange={(e) => handlePrivacyToggle(e.target.checked)}
                className="mt-1 w-4 h-4 rounded border-slate-600 bg-slate-900 text-blue-600 focus:ring-2 focus:ring-blue-500 focus:ring-offset-slate-800 cursor-pointer shrink-0"
                id="privacy-consent"
              />
              <span className="text-xs sm:text-sm text-slate-300 group-hover:text-white leading-relaxed">
                Li e concordo com a{' '}
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
                e autorizo o tratamento dos meus dados para atendimento da minha solicitação, conforme descrito na Política de Privacidade.
              </span>
            </label>
          </div>

          {/* Primary CTA Button */}
          <button
            type="button"
            disabled={!agreedPrivacy}
            onClick={handleWhatsAppClick}
            className={`w-full py-4 px-6 rounded-xl font-bold text-base sm:text-lg flex items-center justify-center gap-3 transition-all duration-200 cursor-pointer shadow-lg ${
              agreedPrivacy
                ? 'bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-white shadow-emerald-900/30 hover:scale-[1.01]'
                : 'bg-slate-700 text-slate-400 cursor-not-allowed opacity-60 shadow-none'
            }`}
          >
            {/* Logo Oficial do WhatsApp */}
            <svg
              className="w-5 h-5 sm:w-6 sm:h-6 shrink-0 fill-current"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path d="M12.031 2C6.516 2 2.025 6.491 2.025 12.006c0 1.93.551 3.734 1.508 5.263L2.002 22l4.898-1.503a9.96 9.96 0 0 0 5.131 1.517c5.515 0 10.006-4.491 10.006-10.008C22.037 6.491 17.546 2 12.031 2zm0 18.232c-1.637 0-3.153-.473-4.437-1.285l-.318-.201-2.923.898.908-2.854-.207-.328A8.19 8.19 0 0 1 3.82 12.006C3.82 7.481 7.498 3.803 12.031 3.803c4.533 0 8.211 3.678 8.211 8.203 0 4.525-3.678 8.226-8.211 8.226zm4.502-6.149c-.247-.124-1.463-.722-1.69-.805-.227-.082-.392-.124-.557.124-.165.247-.64 1.052-.784 1.217-.144.165-.289.186-.536.062-.247-.124-1.043-.385-1.986-1.226-.734-.655-1.23-1.464-1.374-1.711-.144-.247-.015-.38.109-.504.111-.111.247-.289.371-.433.124-.144.165-.247.247-.412.082-.165.041-.309-.021-.433-.062-.124-.557-1.34-.763-1.835-.2-.482-.404-.417-.557-.425l-.474-.008c-.165 0-.433.062-.66.309-.227.247-.866.845-.866 2.062 0 1.216.887 2.392 1.01 2.557.124.165 1.745 2.665 4.227 3.738.591.255 1.052.408 1.412.522.593.188 1.134.161 1.56.098.476-.071 1.463-.598 1.669-1.175.206-.577.206-1.072.144-1.175-.062-.103-.227-.165-.474-.289z" />
            </svg>
            <span>Continuar pelo WhatsApp</span>
          </button>

          {!agreedPrivacy && (
            <p className="text-center text-xs text-amber-400/90 mt-2 flex items-center justify-center gap-1.5">
              <AlertCircle className="w-3.5 h-3.5 shrink-0" />
              Marque o aceite da Política de Privacidade acima para continuar.
            </p>
          )}

          {/* Clear Disclaimer under CTA */}
          <div className="mt-5 pt-4 border-t border-slate-700/60 text-center space-y-1">
            <p className="text-xs text-slate-400 leading-normal">
              Esta solicitação não representa aprovação de crédito. A contratação está sujeita à análise, critérios de elegibilidade e condições vigentes.
            </p>
            <p className="text-xs text-slate-400 font-medium">
              Produto destinado a maiores de 18 anos.
            </p>
          </div>
        </div>

        {/* Modal / Dialog when WhatsApp number needs configuration */}
        {showConfigNotice && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-150">
            <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-md w-full p-6 text-slate-200 shadow-2xl">
              <div className="flex items-center gap-3 text-amber-400 mb-3">
                <AlertCircle className="w-6 h-6 shrink-0" />
                <h3 className="text-base font-bold text-white">Configuração do WhatsApp</h3>
              </div>
              <p className="text-xs sm:text-sm text-slate-300 mb-4 leading-relaxed">
                O número de atendimento ainda está configurado como <code className="bg-slate-800 px-1 py-0.5 rounded text-amber-300 font-mono text-xs">[COLOCAR NÚMERO CORRETO]</code> em <code className="text-blue-300 font-mono text-xs">src/config/creditConfig.ts</code>.
              </p>
              <p className="text-xs text-slate-400 mb-5">
                Você pode inserir um número com DDD para testar o envio imediatamente agora mesmo:
              </p>
              
              <div className="space-y-3">
                <input
                  type="text"
                  placeholder="Ex: 5511999998888 (com DDI e DDD)"
                  id="quick-whatsapp-input"
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500 font-mono"
                  defaultValue="5511999998888"
                />
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      const input = document.getElementById('quick-whatsapp-input') as HTMLInputElement;
                      if (input && input.value.trim()) {
                        localStorage.setItem('sants_override_whatsapp', input.value.trim());
                        setShowConfigNotice(false);
                        // Agora simula o clique com o novo número
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
