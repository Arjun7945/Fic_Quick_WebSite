'use client';

// =============================================================================
// SplashScreen — /src/components/ui/SplashScreen.tsx
// Luxury brand opening splash presentation with official Ficcado gecko emblem,
// legal brand entity "Ficcado Clothing", 3-second animated progress beam,
// and color palette: Primary Blue (#0066CC) and Secondary Ice (#ACD5F3).
// =============================================================================

import React, { useEffect, useState, useCallback, useSyncExternalStore } from 'react';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';

const emptySubscribe = () => () => {};

function getInitialShowSnapshot(): boolean {
  if (typeof window === 'undefined') return false;
  try {
    const isForced = window.location.search.includes('intro=1') || window.location.search.includes('splash=1');
    const hasSeen = sessionStorage.getItem('ficcado_brand_intro_seen');
    return !hasSeen || isForced;
  } catch {
    return false;
  }
}

function getServerSnapshot(): boolean {
  return false;
}

export function SplashScreen() {
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
      // Land smoothly on the home page if accessed via any external/sub route
      if (pathname !== '/' && pathname !== '/onboarding') {
        router.push('/');
      }
    }, 600);
  }, [pathname, router]);

  // 3-second progress animation and auto-transition to storefront
  useEffect(() => {
    if (!shouldShowInitial || isDismissed || isExiting) return;

    const totalDuration = 3000; // Exact 3 seconds delay per requirement
    const intervalTime = 20; // 50 updates per second for ultra-fluid motion
    const step = 100 / (totalDuration / intervalTime);

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

  // Handle escape / enter key to dismiss immediately
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
      id="splash-screen"
      role="dialog"
      aria-modal="true"
      aria-label="Welcome to Ficcado Clothing"
      className={`fixed inset-0 z-[99999] flex flex-col items-center justify-center select-none transition-all duration-700 ease-out ${
        isExiting ? 'opacity-0 scale-105 pointer-events-none' : 'opacity-100 scale-100'
      }`}
      style={{
        background: '#040711',
        backgroundImage:
          'radial-gradient(circle at 50% 45%, rgba(0, 102, 204, 0.28) 0%, rgba(172, 213, 243, 0.08) 45%, rgba(4, 7, 17, 0.95) 80%, #040711 100%)',
      }}
    >
      {/* Background Animated Particle / Shimmer Dust Rings */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden flex items-center justify-center">
        <div
          className="w-[520px] h-[520px] rounded-full opacity-20 blur-3xl animate-pulse"
          style={{
            background: 'radial-gradient(circle, #0066CC 0%, rgba(172, 213, 243, 0.3) 50%, transparent 75%)',
            animationDuration: '4s',
          }}
        />
      </div>

      {/* Top Bar with subtle Skip option */}
      <div className="absolute top-6 right-6 z-20">
        <button
          onClick={handleDismiss}
          className="px-4 py-1.5 rounded-full text-xs font-semibold tracking-wider text-[#ACD5F3]/80 hover:text-white bg-white/5 hover:bg-white/15 backdrop-blur-md border border-[#ACD5F3]/20 transition-all cursor-pointer active:scale-95"
        >
          Skip Intro &rarr;
        </button>
      </div>

      {/* Main Centered Brand Showcase */}
      <div className="flex flex-col items-center text-center px-6 max-w-md w-full animate-modal-in relative z-10">
        {/* Glowing Logo Emblem Container with Dual Ambient Rings */}
        <div className="relative mb-8">
          {/* Outer Breathing Aura */}
          <div
            className="absolute -inset-4 rounded-full blur-2xl opacity-70 animate-pulse"
            style={{
              background: 'radial-gradient(circle, rgba(0, 102, 204, 0.85) 0%, rgba(172, 213, 243, 0.4) 50%, transparent 75%)',
              animationDuration: '3s',
            }}
          />

          {/* Secondary Concentric Orbital Ring */}
          <div
            className="absolute -inset-2 rounded-full border border-[#ACD5F3]/30 animate-spin"
            style={{
              animationDuration: '18s',
              borderStyle: 'dashed',
            }}
          />

          {/* Frosted Emblem Badge */}
          <div
            className="relative h-28 w-28 sm:h-32 sm:w-32 rounded-full p-2.5 bg-gradient-to-b from-white/20 via-white/10 to-white/5 border border-[#ACD5F3]/40 shadow-2xl backdrop-blur-xl flex items-center justify-center overflow-hidden transition-transform duration-700 hover:scale-105"
            style={{
              boxShadow: '0 20px 60px rgba(0, 0, 0, 0.8), 0 0 35px rgba(0, 102, 204, 0.55), inset 0 0 15px rgba(172, 213, 243, 0.25)',
            }}
          >
            <Image
              src="/images/brand_logo/favicon-rounded.png"
              alt="Ficcado Clothing Emblem"
              width={112}
              height={112}
              className="object-contain drop-shadow-lg"
              priority
            />
          </div>
        </div>

        {/* Brand Primary Name */}
        <h1
          className="text-4xl sm:text-5xl font-900 tracking-[0.28em] uppercase mb-3 text-white"
          style={{
            fontWeight: 900,
            textShadow: '0 0 30px rgba(0, 102, 204, 0.7), 0 0 60px rgba(172, 213, 243, 0.35)',
            letterSpacing: '0.28em',
          }}
        >
          FICCADO
        </h1>

        {/* Legal Entity Badge */}
        <div
          className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full border shadow-lg backdrop-blur-md mb-3.5 transition-all"
          style={{
            background: 'rgba(0, 102, 204, 0.18)',
            borderColor: 'rgba(172, 213, 243, 0.35)',
            boxShadow: '0 4px 20px rgba(0, 102, 204, 0.25)',
          }}
        >
          <span
            className="w-2 h-2 rounded-full animate-ping"
            style={{ background: '#ACD5F3' }}
          />
          <span className="text-xs sm:text-sm font-bold tracking-widest text-white uppercase">
            Ficcado Clothing
          </span>
          <span className="text-[#ACD5F3]/60">•</span>
          <span className="text-[11px] font-semibold text-[#ACD5F3]/90 tracking-wider">
            Est. 2025
          </span>
        </div>

        {/* Tagline in Clean High-Fashion Typography */}
        <p
          className="text-sm sm:text-base font-semibold tracking-wide mb-10"
          style={{
            color: '#ACD5F3',
            textShadow: '0 2px 10px rgba(0, 102, 204, 0.4)',
          }}
        >
          High Quality Unisex Wears
        </p>

        {/* Advanced Animated Progress Bar with Dynamic Light Sweep Beam */}
        <div className="w-full max-w-xs space-y-2.5">
          {/* Progress Track */}
          <div
            className="relative w-full h-2 rounded-full overflow-hidden p-0.5 border backdrop-blur-md"
            style={{
              background: 'rgba(255, 255, 255, 0.06)',
              borderColor: 'rgba(172, 213, 243, 0.25)',
              boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.6)',
            }}
          >
            {/* Filled Progress Bar with Multi-Stop Gradient */}
            <div
              className="relative h-full rounded-full transition-all duration-75 overflow-hidden"
              style={{
                width: `${progress}%`,
                background: 'linear-gradient(90deg, #0066CC 0%, #0066CC 35%, #ACD5F3 100%)',
                boxShadow: '0 0 18px rgba(0, 102, 204, 0.95), 0 0 8px #ACD5F3',
              }}
            >
              {/* Dynamic Traveling Light Beam Shimmer inside the bar */}
              <div
                className="absolute inset-0 w-full h-full"
                style={{
                  background:
                    'linear-gradient(90deg, transparent 0%, rgba(255, 255, 255, 0.85) 50%, transparent 100%)',
                  backgroundSize: '200% 100%',
                  animation: 'shimmerSweep 1.1s infinite linear',
                }}
              />
            </div>
          </div>

          {/* Status Label & Percentage Indicator */}
          <div className="flex justify-between items-center text-[11px] font-mono tracking-widest px-1">
            <span
              className="uppercase font-semibold tracking-wider flex items-center gap-1.5"
              style={{ color: '#ACD5F3' }}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-[#0066CC] animate-pulse" />
              Entering Storefront
            </span>
            <span
              className="font-bold text-white tracking-wider"
              style={{ textShadow: '0 0 8px rgba(172, 213, 243, 0.6)' }}
            >
              {Math.min(100, Math.round(progress))}%
            </span>
          </div>
        </div>
      </div>

      {/* Inline Keyframe for Smooth Beam Animation */}
      <style jsx>{`
        @keyframes shimmerSweep {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(200%);
          }
        }
      `}</style>
    </div>
  );
}
export default SplashScreen;
