// Cookie-consent state, shared between the banner (writes) and tracking
// loaders like GtmGate (reads). Persisted in localStorage; the decision is
// announced via a window CustomEvent so already-mounted client components
// react to it in the same session.

export type CookieConsent = 'accepted' | 'declined';

export const COOKIE_CONSENT_KEY = 'portfolio_cookie_consent';
export const COOKIE_CONSENT_EVENT = 'cookie-consent-change';

export function getCookieConsent(): CookieConsent | null {
  if (typeof window === 'undefined') return null;
  const value = window.localStorage.getItem(COOKIE_CONSENT_KEY);
  return value === 'accepted' || value === 'declined' ? value : null;
}

export function setCookieConsent(consent: CookieConsent): void {
  window.localStorage.setItem(COOKIE_CONSENT_KEY, consent);
  window.dispatchEvent(
    new CustomEvent<CookieConsent>(COOKIE_CONSENT_EVENT, { detail: consent }),
  );
}
