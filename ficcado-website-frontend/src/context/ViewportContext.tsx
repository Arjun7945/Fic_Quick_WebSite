'use client';

// =============================================================================
// ViewportContext — Automatic Device Tier Detection
// Automatically detects and updates layout tier for Mobile (<768px),
// Tablet (768-1023px), and Desktop (>=1024px) based on active window size.
// =============================================================================

import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';

export type DeviceTier = 'mobile' | 'tablet' | 'desktop';

interface ViewportContextValue {
  deviceTier: DeviceTier;
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  isWideView: boolean;
  isMobileView: boolean;
}

const ViewportContext = createContext<ViewportContextValue | null>(null);

export function ViewportProvider({ children }: { children: React.ReactNode }) {
  const [deviceTier, setDeviceTier] = useState<DeviceTier>('desktop');

  useEffect(() => {
    function handleResize() {
      const width = window.innerWidth;
      if (width < 768) {
        setDeviceTier('mobile');
      } else if (width < 1024) {
        setDeviceTier('tablet');
      } else {
        setDeviceTier('desktop');
      }
    }

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const isMobile = deviceTier === 'mobile';
  const isTablet = deviceTier === 'tablet';
  const isDesktop = deviceTier === 'desktop';
  const isWideView = isDesktop || isTablet;
  const isMobileView = isMobile;

  const value = useMemo<ViewportContextValue>(
    () => ({
      deviceTier,
      isMobile,
      isTablet,
      isDesktop,
      isWideView,
      isMobileView,
    }),
    [deviceTier, isMobile, isTablet, isDesktop, isWideView, isMobileView],
  );

  return (
    <ViewportContext.Provider value={value}>{children}</ViewportContext.Provider>
  );
}

export function useViewport(): ViewportContextValue {
  const ctx = useContext(ViewportContext);
  if (!ctx) throw new Error('useViewport must be used within <ViewportProvider>');
  return ctx;
}

export default ViewportContext;
