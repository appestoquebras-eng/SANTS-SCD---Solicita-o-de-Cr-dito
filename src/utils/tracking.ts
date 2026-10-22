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
  | 'page_view'
  | 'profile_selected'
  | 'amount_changed'
  | 'loan_amount_changed'
  | 'term_changed'
  | 'payment_estimate_calculated'
  | 'privacy_accepted'
  | 'whatsapp_click'
  | 'application_started'
  | 'simulation_started';

export function trackEvent(eventName: TrackingEventName, payload?: Record<string, any>) {
  try {
    const timestamp = new Date().toISOString();
    
    // Filtrar estritamente apenas dados não sensíveis
    const safePayload: Record<string, any> = {};
    if (payload) {
      if (payload.profile) safePayload.profile = payload.profile;
      if (typeof payload.amount === 'number') {
        safePayload.amount = payload.amount;
        safePayload.currency = 'BRL';
      }
      if (typeof payload.term === 'number') {
        safePayload.term = payload.term;
      }
      if (typeof payload.estimated_payment === 'number') {
        safePayload.estimated_payment = Math.round(payload.estimated_payment * 100) / 100;
      }
    }

    const eventData = {
      event: eventName,
      ...safePayload,
      timestamp,
    };

    if (typeof window !== 'undefined') {
      // 1. Google Tag Manager / dataLayer
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push(eventData);

      // 2. TikTok Pixel
      if (window.ttq && typeof window.ttq.track === 'function') {
        try {
          if (eventName === 'whatsapp_click') {
            window.ttq.track('Contact', {
              content_name: 'whatsapp_credit_request',
              value: safePayload.amount,
              currency: 'BRL',
            });
          } else if (eventName === 'application_started' || eventName === 'simulation_started') {
            window.ttq.track('InitiateCheckout', {
              content_name: 'credit_simulation',
              value: safePayload.amount,
              currency: 'BRL',
            });
          } else if (eventName === 'page_view') {
            if (typeof window.ttq.page === 'function') {
              window.ttq.page();
            }
          } else {
            window.ttq.track(eventName, safePayload);
          }
        } catch {
          // Bloqueador de anúncios ou erro de script de terceiros não interrompe a UX
        }
      }

      // 3. Custom DOM Event
      window.dispatchEvent(
        new CustomEvent('sants_analytics', {
          detail: eventData,
        })
      );

      // 4. Log em ambiente de desenvolvimento
      if (import.meta.env.DEV) {
        console.log(`[ANALYTICS] Evento disparado: "${eventName}"`, safePayload);
      }
    }
  } catch (err) {
    // Falha em telemetria nunca pode travar o fluxo do usuário
    console.warn('[ANALYTICS] Falha não impeditiva no disparo:', err);
  }
}
