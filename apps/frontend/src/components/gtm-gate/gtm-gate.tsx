'use client';

import { useSyncExternalStore } from 'react';
import { GoogleTagManager } from '@next/third-parties/google';
import { GTM_ID } from '@/lib/site';
import {
  COOKIE_CONSENT_EVENT,
  COOKIE_CONSENT_KEY,
  getCookieConsent,
} from '@/lib/consent';

function subscribe(callback: () => void) {
  window.addEventListener(COOKIE_CONSENT_EVENT, callback);
  const onStorage = (event: StorageEvent) => {
    if (event.key === COOKIE_CONSENT_KEY) callback();
  };
  window.addEventListener('storage', onStorage);
  return () => {
    window.removeEventListener(COOKIE_CONSENT_EVENT, callback);
    window.removeEventListener('storage', onStorage);
  };
}

/**
 * Loads Google Tag Manager only after an explicit cookie consent.
 * SSR HTML never contains gtm.js — the scripts are injected after hydration,
 * once the visitor accepts cookies (or on later visits with stored consent).
 */
export const GtmGate: React.FC = () => {
  const consent = useSyncExternalStore(subscribe, getCookieConsent, () => null);

  if (consent !== 'accepted') return null;

  return <GoogleTagManager gtmId={GTM_ID} />;
};
