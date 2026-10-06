'use client';

// =============================================================================
// Consent Context & Cookie State Manager — /src/context/ConsentContext.tsx
// Implements B-24 / D5 consent management: 12-month expiry, equal prominence reject,
// categories (Necessary, Preferences, Analytics slot), and storage minimization.
// =============================================================================

import React, { createContext, useContext, useEffect, useState } from 'react';

export interface ConsentPreferences {
  necessary: true; // Always true
  preferences: boolean;
  analytics: boolean;
  timestamp: number;
  expiresAt: number;
}

interface ConsentContextType {
  consent: ConsentPreferences | null;
  hasDecided: boolean;
  isSettingsOpen: boolean;
  openSettings: () => void;
  closeSettings: () => void;
  acceptAll: () => void;
  rejectNonEssential: () => void;
  saveCustomPreferences: (prefs: { preferences: boolean; analytics: boolean }) => void;
}

const STORAGE_KEY = 'ficcado-consent';
const TWELVE_MONTHS_MS = 365 * 24 * 60 * 60 * 1000;

const ConsentContext = createContext<ConsentContextType | undefined>(undefined);

export function ConsentProvider({ children }: { children: React.ReactNode }) {
  const [consent, setConsent] = useState<ConsentPreferences | null>(null);
  const [hasDecided, setHasDecided] = useState<boolean>(true); // default true to avoid flash on SSR
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored) as ConsentPreferences;
        // Verify 12-month expiration per D5
        if (parsed.expiresAt && Date.now() < parsed.expiresAt) {
          setConsent(parsed);
          setHasDecided(true);
          return;
        }
      }
    } catch {}

    // No valid consent record
    setConsent(null);
    setHasDecided(false);
  }, []);

  const persistConsent = (prefs: { preferences: boolean; analytics: boolean }) => {
    const now = Date.now();
    const newConsent: ConsentPreferences = {
      necessary: true,
      preferences: prefs.preferences,
      analytics: prefs.analytics,
      timestamp: now,
      expiresAt: now + TWELVE_MONTHS_MS,
    };

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newConsent));

      // Storage minimization: purge optional drafts if preferences are rejected
      if (!prefs.preferences) {
        localStorage.removeItem('ficcado-checkout-draft');
        localStorage.removeItem('ficcado-recent-searches');
      }
    } catch {}

    setConsent(newConsent);
    setHasDecided(true);
    setIsSettingsOpen(false);
  };

  const acceptAll = () => {
    persistConsent({ preferences: true, analytics: true });
  };

  const rejectNonEssential = () => {
    persistConsent({ preferences: false, analytics: false });
  };

  const saveCustomPreferences = (prefs: { preferences: boolean; analytics: boolean }) => {
    persistConsent(prefs);
  };

  return (
    <ConsentContext.Provider
      value={{
        consent,
        hasDecided,
        isSettingsOpen,
        openSettings: () => setIsSettingsOpen(true),
        closeSettings: () => setIsSettingsOpen(false),
        acceptAll,
        rejectNonEssential,
        saveCustomPreferences,
      }}
    >
      {children}
    </ConsentContext.Provider>
  );
}

export function useConsent() {
  const ctx = useContext(ConsentContext);
  if (!ctx) {
    throw new Error('useConsent must be used within a ConsentProvider');
  }
  return ctx;
}
