'use client';

// =============================================================================
// ImageZoomModal — Fullscreen High-Resolution Image Viewer & Lightbox
// Features: Pinch-to-zoom (multitouch), double-tap zoom, mouse wheel zoom, pan,
// previous/next gallery cycling, keyboard controls, and full-resolution image download.
// =============================================================================

import { useState, useRef, useEffect, useCallback, useSyncExternalStore } from 'react';
import { createPortal } from 'react-dom';
import { X, Download, ZoomIn, ZoomOut, RotateCcw, ChevronLeft, ChevronRight } from 'lucide-react';

interface ImageZoomModalProps {
  isOpen: boolean;
  onClose: () => void;
  images: string[];
  initialIndex?: number;
  productName: string;
}

export function ImageZoomModal({
  isOpen,
  onClose,
  images,
  initialIndex = 0,
  productName,
}: ImageZoomModalProps) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [isDownloading, setIsDownloading] = useState(false);
  const isClient = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );

  // Touch tracking refs
  const initialTouchDistanceRef = useRef<number | null>(null);
  const initialTouchScaleRef = useRef<number>(1);
  const lastTapRef = useRef<number>(0);
  const containerRef = useRef<HTMLDivElement>(null);

  // Sync index and reset scale if initialIndex changes
  const [prevInitialIndex, setPrevInitialIndex] = useState(initialIndex);
  if (initialIndex !== prevInitialIndex) {
    setPrevInitialIndex(initialIndex);
    setCurrentIndex(initialIndex);
    setScale(1);
    setPosition({ x: 0, y: 0 });
  }

  // Reset scale and position when cycling images
  const resetZoom = useCallback(() => {
    setScale(1);
    setPosition({ x: 0, y: 0 });
  }, []);

  const handlePrev = useCallback(() => {
    resetZoom();
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : images.length - 1));
  }, [images.length, resetZoom]);

  const handleNext = useCallback(() => {
    resetZoom();
    setCurrentIndex((prev) => (prev < images.length - 1 ? prev + 1 : 0));
  }, [images.length, resetZoom]);

  // Keyboard navigation & escape to close
  useEffect(() => {
    if (!isOpen) return;

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowLeft') {
        handlePrev();
      } else if (e.key === 'ArrowRight') {
        handleNext();
      } else if (e.key === '+' || e.key === '=') {
        setScale((s) => Math.min(4, s + 0.5));
      } else if (e.key === '-') {
        setScale((s) => Math.max(1, s - 0.5));
      } else if (e.key === '0') {
        resetZoom();
      }
    }

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, handleNext, handlePrev, onClose, resetZoom]);

  // Prevent background scrolling when zoom modal is open
  useEffect(() => {
    if (!isOpen) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prevOverflow;
    };
  }, [isOpen]);

  // Direct download preserving original uncompressed image quality
  const handleDownload = async () => {
    const currentSrc = images[currentIndex];
    if (!currentSrc) return;

    setIsDownloading(true);
    try {
      const response = await fetch(currentSrc);
      const blob = await response.blob();
      const blobUrl = URL.createObjectURL(blob);

      // Extract filename from URL or build descriptive fallback
      const urlParts = currentSrc.split('/');
      const rawFileName = urlParts[urlParts.length - 1] || 'image.jpeg';
      const cleanFileName = `${productName.toLowerCase().replace(/\s+/g, '-')}-${rawFileName}`;

      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = cleanFileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(blobUrl);
    } catch {
      // Direct navigation fallback if blob fetch is blocked
      const link = document.createElement('a');
      link.href = currentSrc;
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      link.download = '';
      link.click();
    } finally {
      setIsDownloading(false);
    }
  };

  // Mouse wheel zoom
  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const zoomFactor = e.deltaY < 0 ? 0.25 : -0.25;
    setScale((prev) => {
      const newScale = Math.min(4, Math.max(1, prev + zoomFactor));
      if (newScale === 1) setPosition({ x: 0, y: 0 });
      return newScale;
    });
  };

  // Double tap / double click to toggle zoom
  const handleDoubleTap = (clientX: number, clientY: number) => {
    if (scale > 1) {
      resetZoom();
    } else {
      setScale(2.5);
      // Center zoom towards tap location
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        const offsetX = (rect.width / 2 - (clientX - rect.left)) * 1.5;
        const offsetY = (rect.height / 2 - (clientY - rect.top)) * 1.5;
        setPosition({ x: offsetX, y: offsetY });
      }
    }
  };

  // Touch event handlers (pinch to zoom and pan)
  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 2) {
      // 2 fingers: pinch zoom
      const touch1 = e.touches[0];
      const touch2 = e.touches[1];
      const distance = Math.hypot(touch2.clientX - touch1.clientX, touch2.clientY - touch1.clientY);
      initialTouchDistanceRef.current = distance;
      initialTouchScaleRef.current = scale;
    } else if (e.touches.length === 1) {
      // Double tap detection
      const now = Date.now();
      const touch = e.touches[0];
      if (now - lastTapRef.current < 300) {
        handleDoubleTap(touch.clientX, touch.clientY);
      } else {
        // Start dragging if already zoomed in
        if (scale > 1) {
          setIsDragging(true);
          setDragStart({ x: touch.clientX - position.x, y: touch.clientY - position.y });
        }
      }
      lastTapRef.current = now;
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (e.touches.length === 2 && initialTouchDistanceRef.current !== null) {
      // Calculate dynamic pinch zoom
      const touch1 = e.touches[0];
      const touch2 = e.touches[1];
      const currentDistance = Math.hypot(touch2.clientX - touch1.clientX, touch2.clientY - touch1.clientY);
      const ratio = currentDistance / initialTouchDistanceRef.current;
      const newScale = Math.min(4, Math.max(1, initialTouchScaleRef.current * ratio));
      setScale(newScale);
      if (newScale === 1) setPosition({ x: 0, y: 0 });
    } else if (e.touches.length === 1 && isDragging && scale > 1) {
      const touch = e.touches[0];
      setPosition({
        x: touch.clientX - dragStart.x,
        y: touch.clientY - dragStart.y,
      });
    }
  };

  const handleTouchEnd = () => {
    initialTouchDistanceRef.current = null;
    setIsDragging(false);
  };

  // Mouse drag handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    if (scale > 1) {
      setIsDragging(true);
      setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y });
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging && scale > 1) {
      setPosition({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y,
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  if (!isOpen || !isClient || typeof document === 'undefined') return null;

  const currentImage = images[currentIndex] || '';

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`Full resolution view of ${productName}`}
      className="fixed inset-0 z-[100] flex flex-col bg-black/95 backdrop-blur-md select-none touch-none animate-fadeIn"
      style={{ isolation: 'isolate' }}
    >
      {/* Top Header Bar */}
      <header className="shrink-0 h-16 px-4 md:px-6 flex items-center justify-between z-20 bg-gradient-to-b from-black/80 to-transparent">
        {/* Product Title & Image Counter */}
        <div className="flex items-center gap-3">
          <span className="text-white font-bold text-sm md:text-base line-clamp-1 max-w-[220px] md:max-w-md">
            {productName}
          </span>
          {images.length > 1 && (
            <span className="px-2.5 py-0.5 rounded-full bg-white/15 text-white/90 text-xs font-semibold">
              {currentIndex + 1} / {images.length}
            </span>
          )}
        </div>

        {/* Top Right Actions: Download & Close */}
        <div className="flex items-center gap-2">
          {/* Download Original Image Button */}
          <button
            onClick={handleDownload}
            disabled={isDownloading}
            aria-label="Download full-resolution image"
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white/15 hover:bg-white/25 active:scale-95 text-white text-xs md:text-sm font-semibold transition-all cursor-pointer backdrop-blur-sm border border-white/20 shadow-lg"
            title="Download full-resolution original image"
          >
            <Download size={16} className={isDownloading ? 'animate-bounce' : ''} />
            <span className="hidden sm:inline">
              {isDownloading ? 'Downloading...' : 'Download Image'}
            </span>
          </button>

          {/* Close Modal Button */}
          <button
            onClick={onClose}
            aria-label="Close image viewer"
            className="flex items-center justify-center h-10 w-10 rounded-full bg-white/15 hover:bg-white/25 text-white transition-all active:scale-90 cursor-pointer backdrop-blur-sm border border-white/20"
          >
            <X size={20} />
          </button>
        </div>
      </header>

      {/* Main Image Viewport with Pinch & Pan */}
      <main
        ref={containerRef}
        onWheel={handleWheel}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onDoubleClick={(e) => handleDoubleTap(e.clientX, e.clientY)}
        className="flex-1 relative flex items-center justify-center overflow-hidden cursor-grab active:cursor-grabbing p-2 md:p-6"
      >
        {/* Navigation Arrows for desktop/tablet */}
        {images.length > 1 && (
          <>
            <button
              onClick={handlePrev}
              aria-label="Previous image"
              className="absolute left-3 md:left-6 z-20 flex items-center justify-center h-11 w-11 rounded-full bg-black/60 hover:bg-black/85 text-white border border-white/20 transition-all active:scale-90 cursor-pointer backdrop-blur-sm"
            >
              <ChevronLeft size={24} />
            </button>
            <button
              onClick={handleNext}
              aria-label="Next image"
              className="absolute right-3 md:right-6 z-20 flex items-center justify-center h-11 w-11 rounded-full bg-black/60 hover:bg-black/85 text-white border border-white/20 transition-all active:scale-90 cursor-pointer backdrop-blur-sm"
            >
              <ChevronRight size={24} />
            </button>
          </>
        )}

        {/* The Full Uncompressed Image */}
        <div
          className="relative max-w-full max-h-full transition-transform duration-75 ease-out"
          style={{
            transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`,
            transformOrigin: 'center center',
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={currentImage}
            alt={`${productName} full-resolution display`}
            className="max-h-[82vh] max-w-[92vw] object-contain rounded-lg shadow-2xl pointer-events-none"
            loading="eager"
            decoding="async"
          />
        </div>
      </main>

      {/* Floating Bottom Control Bar */}
      <footer className="shrink-0 h-20 px-4 flex items-center justify-center z-20 bg-gradient-to-t from-black/80 to-transparent">
        <div className="flex items-center gap-3 px-4 py-2 rounded-2xl bg-black/70 backdrop-blur-md border border-white/15 text-white shadow-2xl">
          {/* Zoom Out Button */}
          <button
            onClick={() => setScale((s) => Math.max(1, s - 0.5))}
            disabled={scale <= 1}
            aria-label="Zoom out"
            className="p-1.5 rounded-lg hover:bg-white/15 disabled:opacity-30 disabled:hover:bg-transparent transition-all cursor-pointer"
          >
            <ZoomOut size={18} />
          </button>

          {/* Current Zoom Level / Reset Indicator */}
          <button
            onClick={resetZoom}
            aria-label="Reset zoom to 100%"
            className="px-2.5 py-1 text-xs font-mono font-bold rounded-md hover:bg-white/15 transition-all cursor-pointer flex items-center gap-1.5"
            title="Reset zoom"
          >
            <RotateCcw size={12} className={scale !== 1 ? 'text-[var(--primary)]' : 'opacity-60'} />
            <span>{Math.round(scale * 100)}%</span>
          </button>

          {/* Zoom In Button */}
          <button
            onClick={() => setScale((s) => Math.min(4, s + 0.5))}
            disabled={scale >= 4}
            aria-label="Zoom in"
            className="p-1.5 rounded-lg hover:bg-white/15 disabled:opacity-30 disabled:hover:bg-transparent transition-all cursor-pointer"
          >
            <ZoomIn size={18} />
          </button>

          {/* Small thumbnail strip if multiple images */}
          {images.length > 1 && (
            <div className="hidden sm:flex items-center gap-1.5 pl-3 border-l border-white/20">
              {images.map((img, idx) => (
                <button
                  key={img}
                  onClick={() => {
                    resetZoom();
                    setCurrentIndex(idx);
                  }}
                  aria-label={`View photo ${idx + 1}`}
                  className={`h-8 w-8 rounded-md overflow-hidden border transition-all cursor-pointer ${
                    currentIndex === idx
                      ? 'border-white ring-2 ring-white/40 scale-105'
                      : 'border-white/30 opacity-60 hover:opacity-100'
                  }`}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={img} alt={`thumb ${idx + 1}`} className="h-full w-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>
      </footer>
    </div>,
    document.body
  );
}
