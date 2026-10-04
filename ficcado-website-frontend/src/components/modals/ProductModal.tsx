'use client';

// =============================================================================
// ProductModal — Product detail modal (#productModal)
// Image gallery, size/color selectors, Add to Cart CTA
// Refactored per REQUIREMENT_AND_REFACTOR_PART_2.md
// =============================================================================

import { useState } from 'react';
import Image from 'next/image';
import { X } from 'lucide-react';
import { useModal, getProductModalPayload } from '@/context/ModalContext';
import { useCart } from '@/context/CartContext';
import { useToast } from '@/context/ToastContext';
import { RatingStars } from '@/components/ui/RatingStars';
import { getItemImages, PLACEHOLDER_IMAGE } from '@/lib/itemImages';
import { isCategoryLive } from '@/config/categories';
import type { Product, SizeOption } from '@/types';

const DEFAULT_SIZES: SizeOption[] = ['S', 'M', 'L', 'XL'];

export function ProductModal() {
  const { activeModal, modalPayload, closeModal, openModal } = useModal();
  const { addToCart } = useCart();
  const { showToast } = useToast();

  const [userSize, setUserSize] = useState<SizeOption | null>(null);
  const [userColor, setUserColor] = useState<string | null>(null);
  const [activeImageIdx, setActiveImageIdx] = useState(0);
  const [expanded, setExpanded] = useState(false);
  const [prevProductId, setPrevProductId] = useState<string | number | null>(null);

  const isOpen = activeModal === 'productModal';
  const payload = getProductModalPayload(modalPayload);
  const product: Product | null = payload?.product ?? null;

  // Reset selections when product changes without cascading render
  if (product && product.id !== prevProductId) {
    setPrevProductId(product.id);
    setUserSize(null);
    setUserColor(null);
    setActiveImageIdx(0);
    setExpanded(false);
  }

  if (!isOpen || !product) return null;

  const isLive = isCategoryLive(product.category);
  const images = getItemImages(product.name || product.slug);
  const activeImage = images[activeImageIdx] || images[0] || PLACEHOLDER_IMAGE;
  const availableSizes = product.sizes && product.sizes.length > 0 ? product.sizes : DEFAULT_SIZES;
  const selectedSize = userSize || availableSizes[0] || 'M';
  const selectedColor = userColor || (product.colors && product.colors[0]) || 'Standard';

  function handleAddToCart() {
    if (!product) return;
    if (!isLive) {
      showToast('This collection is coming soon. Please wait for the drop! ✨', 'info');
      return;
    }
    const finalSize = selectedSize;
    const finalColor = selectedColor;
    addToCart(product, finalSize, finalColor);
    closeModal();
    showToast(`Added to Bag! 🛍️`);
    openModal('cartDrawer');
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center p-0 md:p-6 pointer-events-none">
      {/* Backdrop */}
      <div
        className="overlay animate-backdrop-in pointer-events-auto"
        onClick={closeModal}
        aria-hidden="true"
      />

      {/* Sheet on mobile, Wide Two-Column Dialog on Tablet & Desktop */}
      <div
        id="productModal"
        role="dialog"
        aria-modal="true"
        aria-label={`Product details: ${product.name}`}
        className="animate-sheet-in md:animate-modal-in relative w-full max-w-[440px] md:max-w-3xl lg:max-w-4xl flex flex-col pointer-events-auto overflow-hidden rounded-t-[28px] md:rounded-3xl shadow-2xl"
        style={{
          maxHeight: '90vh',
          background: 'var(--bg-surface)',
          zIndex: 'var(--z-modal)',
        }}
      >
        {/* Drag handle (Mobile only) */}
        <div className="flex md:hidden justify-center pt-3 pb-1 shrink-0">
          <div style={{ width: '36px', height: '4px', borderRadius: '2px', background: 'var(--border-medium)' }} />
        </div>

        {/* Single Unified Close Button */}
        <button
          onClick={closeModal}
          id="close-product-modal-btn"
          className="absolute right-3.5 top-3.5 z-30 flex items-center justify-center h-9 w-9 rounded-full bg-white/90 dark:bg-gray-900/90 hover:bg-white border border-[var(--border-light)] shadow-md backdrop-blur-md transition-transform active:scale-95 cursor-pointer"
          aria-label="Close product details"
        >
          <X size={18} style={{ color: 'var(--text-main)' }} />
        </button>

        {/* Content Container */}
        <div className="no-scrollbar overflow-y-auto flex-1 md:grid md:grid-cols-2">
          {/* Left Column: Product Image Gallery */}
          <div className="flex flex-col bg-[var(--bg-surface-alt)] border-b md:border-b-0 md:border-r border-[var(--border-light)]">
            <div className="relative aspect-square md:aspect-auto md:flex-1 min-h-[300px] overflow-hidden">
              <Image
                src={activeImage}
                alt={product.name}
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover"
                priority
              />
              <div className="absolute bottom-3 left-3 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full text-[11px] font-bold text-white uppercase tracking-wider">
                {product.category}
              </div>
            </div>

            {/* Gallery Thumbnail Selector if multiple images exist */}
            {images.length > 1 && (
              <div className="p-3 flex items-center justify-center gap-2 bg-[var(--bg-surface)] border-t border-[var(--border-light)]">
                {images.map((img, idx) => (
                  <button
                    key={img}
                    onClick={() => setActiveImageIdx(idx)}
                    className={`relative w-12 h-14 rounded-lg overflow-hidden border-2 transition-all cursor-pointer ${
                      activeImageIdx === idx
                        ? 'border-[var(--primary)] ring-2 ring-[var(--primary)]/20 scale-105'
                        : 'border-transparent opacity-70 hover:opacity-100'
                    }`}
                    aria-label={`View image ${idx + 1}`}
                  >
                    <Image
                      src={img}
                      alt={`${product.name} thumbnail ${idx + 1}`}
                      fill
                      sizes="48px"
                      className="object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right Column: Details & Actions */}
          <div className="p-5 md:p-8 flex flex-col justify-between space-y-5">
            <div className="space-y-4">
              {/* Name + Price */}
              <div className="flex items-start justify-between gap-3">
                <h2 className="text-xl md:text-2xl font-900 leading-tight" style={{ fontWeight: 900, color: 'var(--text-main)' }}>
                  {product.name}
                </h2>
                <span className="text-2xl md:text-3xl font-900 shrink-0" style={{ fontWeight: 900, color: 'var(--primary)' }}>
                  ₹{product.price.toLocaleString('en-IN')}
                </span>
              </div>

              {/* Rating row: only shown when real verified ratings exist */}
              {product.rating > 0 && product.reviews > 0 && (
                <div className="inline-flex items-center gap-2">
                  <RatingStars rating={product.rating} size={15} />
                  <span className="text-xs md:text-sm font-semibold" style={{ color: 'var(--text-muted)' }}>
                    {product.rating} ({product.reviews} reviews)
                  </span>
                </div>
              )}

              {/* Divider */}
              <div className="divider" />

              {/* Size selector */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <p className="text-xs md:text-sm font-700" style={{ fontWeight: 700, color: 'var(--text-main)' }}>
                    Select Size
                  </p>
                  <span className="text-[11px] text-[var(--text-muted)] font-medium">Standard Fit</span>
                </div>
                <div className="flex gap-2.5">
                  {availableSizes.map((size) => (
                    <button
                      key={size}
                      id={`size-${size}`}
                      onClick={() => setUserSize(size)}
                      className="flex h-10 w-10 md:h-11 md:w-11 items-center justify-center rounded-xl text-sm font-700 transition-all active:scale-95 cursor-pointer"
                      style={{
                        fontWeight: 700,
                        background: selectedSize === size ? 'var(--primary)' : 'var(--bg-surface-alt)',
                        color: selectedSize === size ? '#fff' : 'var(--text-main)',
                        border: selectedSize === size ? 'none' : '1.5px solid var(--border-light)',
                        boxShadow: selectedSize === size ? 'var(--shadow-btn)' : 'none',
                      }}
                      aria-pressed={selectedSize === size}
                      aria-label={`Size ${size}`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              {/* Color selector */}
              {product.colors && product.colors.length > 0 && (
                <div>
                  <p className="text-xs md:text-sm font-700 mb-2" style={{ fontWeight: 700, color: 'var(--text-main)' }}>
                    Available Colorways
                  </p>
                  <div className="flex gap-3">
                    {product.colors.map((color) => (
                      <button
                        key={color}
                        id={`color-${color.replace('#', '')}`}
                        onClick={() => setUserColor(color)}
                        className="h-8 w-8 md:h-9 md:w-9 rounded-full transition-all active:scale-90 cursor-pointer"
                        style={{
                          background: color,
                          border: selectedColor === color ? `3px solid var(--primary)` : '2px solid transparent',
                          outline: selectedColor === color ? `2px solid var(--primary)` : 'none',
                          outlineOffset: selectedColor === color ? '2px' : '0',
                          boxShadow: '0 0 0 1px rgba(0,0,0,0.12)',
                        }}
                        aria-pressed={selectedColor === color}
                        aria-label={`Select color ${color}`}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Description */}
              {product.desc && (
                <div>
                  <p
                    className={`text-xs md:text-sm leading-relaxed transition-all ${expanded ? '' : 'line-clamp-3 md:line-clamp-4'}`}
                    style={{ color: 'var(--text-secondary)' }}
                  >
                    {product.desc}
                  </p>
                  {product.desc.length > 120 && (
                    <button
                      onClick={() => setExpanded((e) => !e)}
                      className="mt-1 text-xs font-semibold transition-opacity hover:opacity-70"
                      style={{ color: 'var(--primary)', background: 'none', border: 'none', padding: 0, cursor: 'pointer' }}
                    >
                      {expanded ? 'Show less' : 'Read full specs'}
                    </button>
                  )}
                </div>
              )}
            </div>

            {/* CTA in Right Column */}
            <div className="pt-4 mt-4 border-t border-[var(--border-light)]">
              <button
                id="add-to-cart-btn"
                onClick={handleAddToCart}
                disabled={!isLive}
                className={`btn-primary w-full py-3.5 text-sm font-bold shadow-md rounded-2xl ${
                  !isLive ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                {isLive ? `Add To Bag — ₹${product.price.toLocaleString('en-IN')}` : 'Collection Coming Soon'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

