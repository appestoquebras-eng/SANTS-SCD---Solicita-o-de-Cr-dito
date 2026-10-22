/**
 * UTILITÁRIO DE TRACKING E EVENTOS DE CONVERSÃO
 * Suporte a TikTok Pixel, Google Tag Manager (GTM) e Google Analytics 4 (GA4)
 */

declare global {
  interface Window {
    dataLayer?: any[];
    ttq?: {
      track: (eventName: string, params?: Record<string, any>) => void;
      page: () => void;
    };
  }
}

export type TrackingEventName =
  | 'profile_selected'
  | 'loan_amount_changed'
  | 'whatsapp_click'
  | 'simulation_started'
  | 'privacy_accepted';

export function trackEvent(eventName: TrackingEventName, payload?: Record<string, any>) {
  const timestamp = new Date().toISOString();
  const eventData = {
    event: eventName,
    ...payload,
    timestamp,
  };

  // 1. Google Tag Manager / dataLayer
  if (typeof window !== 'undefined') {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push(eventData);

    // 2. TikTok Pixel (quando instalado)
    if (window.ttq && typeof window.ttq.track === 'function') {
      try {
        // Mapeamento semântico para eventos padrão do TikTok quando aplicável
        if (eventName === 'whatsapp_click') {
          window.ttq.track('Contact', {
            content_name: 'whatsapp_credit_request',
            value: payload?.amount,
            currency: 'BRL',
          });
        } else if (eventName === 'simulation_started') {
          window.ttq.track('InitiateCheckout', {
            content_name: 'credit_simulation',
            value: payload?.amount,
            currency: 'BRL',
          });
        } else {
          window.ttq.track(eventName, payload);
        }
      } catch (err) {
        // Silencioso em caso de bloqueador de anúncios
      }
    }

    // 3. Custom DOM Event (permite listeners externos e depuração)
    window.dispatchEvent(
      new CustomEvent('sants_analytics', {
        detail: eventData,
      })
    );

    // 4. Log em ambiente de desenvolvimento
    if (import.meta.env.DEV) {
      console.log(`[ANALYTICS] Evento disparado: "${eventName}"`, payload);
    }
  }
}
