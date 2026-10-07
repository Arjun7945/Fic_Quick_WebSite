'use client';

// =============================================================================
// BrandOpeningScreen — Premium Brand Opening / Loading Presentation
// Greets initial visitors across any entry URL with the official brand identity,
// logo emblem, legal entity name, and tagline before smoothly landing on the home page.
// =============================================================================

import React, { useEffect, useState, useCallback, useSyncExternalStore } from 'react';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';

const emptySubscribe = () => () => {};

function getInitialShowSnapshot(): boolean {
  if (typeof window === 'undefined') return false;
  try {
    const isForced = window.location.search.includes('intro=1');
    const hasSeen = sessionStorage.getItem('ficcado_brand_intro_seen');
    return !hasSeen || isForced;
  } catch {
    return false;
  }
}

function getServerSnapshot(): boolean {
  return false;
}

export function BrandOpeningScreen() {
  const shouldShowInitial = useSyncExternalStore(emptySubscribe, getInitialShowSnapshot, getServerSnapshot);
  const [isDismissed, setIsDismissed] = useState(false);
  const [isExiting, setIsExiting] = useState(false);
  const [progress, setProgress] = useState(0);

  const pathname = usePathname();
  const router = useRouter();

  const handleDismiss = useCallback(() => {
    setIsExiting(true);
    try {
      sessionStorage.setItem('ficcado_brand_intro_seen', '1');
    } catch {}

    setTimeout(() => {
      setIsDismissed(true);
      // Land on the home page as requested when opening from any entry URL
      if (pathname !== '/' && pathname !== '/onboarding') {
        router.push('/');
      }
    }, 450);
  }, [pathname, router]);

  // Progress animation and auto-dismiss timer
  useEffect(() => {
    if (!shouldShowInitial || isDismissed || isExiting) return;

    const duration = 1800; // 1.8 seconds presentation
    const intervalTime = 20;
    const step = 100 / (duration / intervalTime);

    const timer = setInterval(() => {
      setProgress((prev) => {
        const nextVal = prev + step;
        if (nextVal >= 100) {
          clearInterval(timer);
          handleDismiss();
          return 100;
        }
        return nextVal;
      });
    }, intervalTime);

    return () => clearInterval(timer);
  }, [shouldShowInitial, isDismissed, isExiting, handleDismiss]);

  // Handle escape key
  useEffect(() => {
    if (!shouldShowInitial || isDismissed) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' || e.key === 'Enter') {
        handleDismiss();
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [shouldShowInitial, isDismissed, handleDismiss]);

  if (!shouldShowInitial || isDismissed) return null;

  return (
    <div
      id="brand-opening-screen"
      role="dialog"
      aria-modal="true"
      aria-label="Welcome to Ficcado Clothing"
      className={`fixed inset-0 z-[99999] flex flex-col items-center justify-center select-none transition-all duration-500 ${
        isExiting ? 'opacity-0 scale-105 pointer-events-none' : 'opacity-100 scale-100'
      }`}
      style={{
        background: '#07090E',
        backgroundImage:
          'radial-gradient(circle at 50% 45%, rgba(43, 98, 198, 0.28) 0%, rgba(22, 56, 136, 0.12) 50%, #07090E 85%)',
      }}
    >
      {/* Top Bar with Skip Button */}
      <div className="absolute top-6 right-6 z-20">
        <button
          onClick={handleDismiss}
          className="px-4 py-2 rounded-full text-xs font-semibold tracking-wider text-white/80 hover:text-white bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/10 transition-all cursor-pointer active:scale-95"
        >
          Skip Intro &rarr;
        </button>
      </div>

      {/* Main Centered Brand Card */}
      <div className="flex flex-col items-center text-center px-6 max-w-md w-full animate-modal-in">
        {/* Glowing Logo Emblem Container */}
        <div className="relative mb-6">
          <div
            className="absolute -inset-3 rounded-full blur-xl opacity-60 transition-all"
            style={{
              background: 'radial-gradient(circle, rgba(43,98,198,0.8) 0%, rgba(43,98,198,0) 70%)',
            }}
          />
          <div
            className="relative h-24 w-24 sm:h-28 sm:w-28 rounded-full p-2 bg-gradient-to-b from-white/20 to-white/5 border border-white/20 shadow-2xl backdrop-blur-md flex items-center justify-center overflow-hidden transition-transform duration-700 hover:scale-105"
            style={{
              boxShadow: '0 20px 50px rgba(0, 0, 0, 0.6), 0 0 30px rgba(43, 98, 198, 0.4)',
            }}
          >
            <Image
              src="/images/brand_logo/favicon-rounded.png"
              alt="Ficcado Clothing Emblem"
              width={100}
              height={100}
              className="object-contain drop-shadow-md"
              priority
            />
          </div>
        </div>

        {/* Brand Primary Name */}
        <h1
          className="text-4xl sm:text-5xl font-900 text-white tracking-[0.25em] uppercase mb-2"
          style={{
            fontWeight: 900,
            textShadow: '0 4px 20px rgba(43, 98, 198, 0.6)',
          }}
        >
          FICCADO
        </h1>

        {/* Legal Entity Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[var(--primary)]/20 border border-[var(--primary)]/40 text-blue-200 text-xs font-semibold uppercase tracking-widest mb-3">
          <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
          <span>Ficcado Clothing</span>
          <span className="text-white/40">•</span>
          <span className="text-[10px] text-white/70">Est. 2025</span>
        </div>

        {/* Authentic Tagline */}
        <p className="text-sm sm:text-base font-medium text-white/80 tracking-wide mb-6">
          High Quality Unisex Wears
        </p>

        {/* Textile Honesty Spec */}
        <div className="flex items-center justify-center gap-4 text-[11px] text-white/50 uppercase tracking-widest mb-8">
          <span>230 GSM Combed Cotton</span>
          <span>•</span>
          <span>Architectural Cut</span>
          <span>•</span>
          <span>Pan-India</span>
        </div>

        {/* Smooth Loading Progress Bar */}
        <div className="w-full max-w-xs space-y-2">
          <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden p-0.5 border border-white/10">
            <div
              className="h-full rounded-full transition-all duration-75"
              style={{
                width: `${progress}%`,
                background: 'linear-gradient(90deg, #2B62C6 0%, #60A5FA 100%)',
                boxShadow: '0 0 10px rgba(96, 165, 250, 0.8)',
              }}
            />
          </div>
          <div className="flex justify-between items-center text-[10px] font-mono text-white/40 px-1">
            <span>Entering Storefront</span>
            <span>{Math.round(progress)}%</span>
          </div>
        </div>

        {/* Quick Direct Enter CTA Button */}
        <button
          onClick={handleDismiss}
          className="mt-6 inline-flex items-center gap-2 px-6 py-2.5 rounded-full text-xs font-bold text-white uppercase tracking-wider bg-[var(--primary)] hover:bg-[var(--primary-hover)] active:scale-95 transition-all shadow-lg cursor-pointer"
          style={{
            boxShadow: '0 10px 25px rgba(43, 98, 198, 0.4)',
          }}
        >
          <span>Enter Store Now</span>
          <span>&rarr;</span>
        </button>
      </div>
    </div>
  );
}
