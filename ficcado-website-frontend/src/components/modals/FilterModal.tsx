'use client';

// =============================================================================
// FilterModal — Price range slider, category chips, size & color filter sheet
// =============================================================================

import { useState } from 'react';
import { X, SlidersHorizontal } from 'lucide-react';
import { useModal } from '@/context/ModalContext';
import { DEFAULT_FILTER_STATE } from '@/config/site';
import type { ClothingCategory, FilterState, SizeOption } from '@/types';

const CATEGORY_CHIPS: { label: string; slug: ClothingCategory | 'all' }[] = [
  { label: 'All', slug: 'all' },
  { label: 'T-Shirts', slug: 't-shirts' },
  { label: 'Combos', slug: 'combos' },
  { label: 'Shirts', slug: 'shirts' },
  { label: 'Hoodies', slug: 'hoodies' },
  { label: 'Pants', slug: 'pants' },
  { label: 'Sneakers', slug: 'sneakers' },
];
const SIZE_OPTIONS: SizeOption[] = ['S', 'M', 'L', 'XL'];
const COLOR_OPTIONS = [
  { hex: '#2B62C6', name: 'Royal Blue' },
  { hex: '#9FD2C7', name: 'Mint' },
  { hex: '#111827', name: 'Black' },
  { hex: '#FF6B00', name: 'Orange' },
  { hex: '#B4D1EF', name: 'Ice Blue' },
  { hex: '#9B1C1C', name: 'Crimson' },
];

export function FilterModal() {
  const { activeModal, closeModal } = useModal();
  const [filters, setFilters] = useState<FilterState>(DEFAULT_FILTER_STATE);

  const isOpen = activeModal === 'filterModal';

  function toggleCategory(catSlug: ClothingCategory | 'all') {
    if (catSlug === 'all') {
      setFilters((f) => ({ ...f, categories: [] }));
      return;
    }
    setFilters((f) => ({
      ...f,
      categories: f.categories.includes(catSlug)
        ? f.categories.filter((c) => c !== catSlug)
        : [...f.categories, catSlug],
    }));
  }

  function toggleSize(size: SizeOption) {
    setFilters((f) => ({
      ...f,
      sizes: f.sizes.includes(size)
        ? f.sizes.filter((s) => s !== size)
        : [...f.sizes, size],
    }));
  }

  function toggleColor(hex: string) {
    setFilters((f) => ({
      ...f,
      colors: f.colors.includes(hex)
        ? f.colors.filter((c) => c !== hex)
        : [...f.colors, hex],
    }));
  }

  function handleReset() {
    setFilters(DEFAULT_FILTER_STATE);
  }

  function handleApply() {
    // In a full integration, dispatch filter state upward via context or router params
    closeModal();
  }

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center p-0 md:p-6 pointer-events-none">
      <div className="overlay animate-backdrop-in pointer-events-auto" onClick={closeModal} aria-hidden="true" />

      <div
        id="filterModal"
        role="dialog"
        aria-modal="true"
        aria-label="Filter products"
        className="animate-sheet-in md:animate-modal-in relative w-full max-w-[440px] md:max-w-lg lg:max-w-xl flex flex-col pointer-events-auto overflow-hidden rounded-t-[28px] md:rounded-3xl shadow-2xl"
        style={{
          maxHeight: '88vh',
          background: 'var(--bg-surface)',
          zIndex: 'var(--z-modal)',
        }}
      >
        {/* Drag handle (Mobile only) */}
        <div className="flex md:hidden justify-center pt-3 pb-1 shrink-0">
          <div style={{ width: '36px', height: '4px', borderRadius: '2px', background: 'var(--border-medium)' }} />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between px-5 pb-4 pt-2 shrink-0">
          <div className="flex items-center gap-2">
            <SlidersHorizontal size={18} style={{ color: 'var(--primary)' }} />
            <h2 className="text-lg font-800" style={{ fontWeight: 800 }}>Filters</h2>
          </div>
          <button onClick={closeModal} className="btn-icon" aria-label="Close filters">
            <X size={20} />
          </button>
        </div>

        {/* Scrollable filter content */}
        <div className="no-scrollbar flex-1 overflow-y-auto px-5 space-y-6 pb-2">

          {/* Price Range */}
          <section>
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm font-700" style={{ fontWeight: 700, color: 'var(--text-main)' }}>Price Range</p>
              <span className="text-sm font-semibold" style={{ color: 'var(--primary)' }}>
                ₹{filters.priceRange[0].toLocaleString('en-IN')} — ₹{filters.priceRange[1].toLocaleString('en-IN')}
              </span>
            </div>
            <input
              type="range"
              min={999}
              max={7999}
              step={100}
              value={filters.priceRange[1]}
              onChange={(e) =>
                setFilters((f) => ({ ...f, priceRange: [f.priceRange[0], Number(e.target.value)] }))
              }
              className="w-full"
              style={{ accentColor: 'var(--primary)' }}
              aria-label="Maximum price filter"
            />
            <div className="flex justify-between text-xs mt-1 font-medium" style={{ color: 'var(--text-light)' }}>
              <span>₹999</span>
              <span>₹7,999</span>
            </div>
          </section>

          {/* Category chips */}
          <section>
            <p className="text-sm font-700 mb-3" style={{ fontWeight: 700 }}>Category</p>
            <div className="scroll-row flex-wrap gap-2">
              {CATEGORY_CHIPS.map((cat) => {
                const isActive = cat.slug === 'all' ? filters.categories.length === 0 : filters.categories.includes(cat.slug);
                return (
                  <button
                    key={cat.slug}
                    id={`filter-cat-${cat.slug}`}
                    onClick={() => toggleCategory(cat.slug)}
                    className="rounded-full px-4 py-1.5 text-sm font-semibold transition-all active:scale-95 cursor-pointer"
                    style={{
                      background: isActive ? 'var(--primary)' : 'var(--bg-surface-alt)',
                      color: isActive ? '#fff' : 'var(--text-muted)',
                      border: `1.5px solid ${isActive ? 'var(--primary)' : 'var(--border-light)'}`,
                    }}
                    aria-pressed={isActive}
                  >
                    {cat.label}
                  </button>
                );
              })}
            </div>
          </section>

          {/* Size */}
          <section>
            <p className="text-sm font-700 mb-3" style={{ fontWeight: 700 }}>Size</p>
            <div className="flex gap-2.5 flex-wrap">
              {SIZE_OPTIONS.map((size) => {
                const isActive = filters.sizes.includes(size);
                return (
                  <button
                    key={size}
                    id={`filter-size-${size}`}
                    onClick={() => toggleSize(size)}
                    className="flex h-10 w-10 items-center justify-center rounded-full text-sm font-700 transition-all active:scale-90"
                    style={{
                      fontWeight: 700,
                      background: isActive ? 'var(--primary)' : 'var(--bg-surface-alt)',
                      color: isActive ? '#fff' : 'var(--text-main)',
                      border: `1.5px solid ${isActive ? 'var(--primary)' : 'var(--border-light)'}`,
                    }}
                    aria-pressed={isActive}
                  >
                    {size}
                  </button>
                );
              })}
            </div>
          </section>

          {/* Color swatches */}
          <section>
            <p className="text-sm font-700 mb-3" style={{ fontWeight: 700 }}>Color</p>
            <div className="flex gap-3 flex-wrap">
              {COLOR_OPTIONS.map(({ hex, name }) => {
                const isActive = filters.colors.includes(hex);
                return (
                  <button
                    key={hex}
                    id={`filter-color-${hex.replace('#', '')}`}
                    onClick={() => toggleColor(hex)}
                    className="h-8 w-8 rounded-full transition-all active:scale-90"
                    style={{
                      background: hex,
                      boxShadow: '0 0 0 1px rgba(0,0,0,0.12)',
                      outline: isActive ? `3px solid var(--primary)` : 'none',
                      outlineOffset: isActive ? '2px' : '0',
                    }}
                    aria-pressed={isActive}
                    aria-label={name}
                  />
                );
              })}
            </div>
          </section>
        </div>

        {/* Actions */}
        <div
          className="shrink-0 flex gap-3 px-5 py-4"
          style={{ borderTop: '1px solid var(--border-light)' }}
        >
          <button
            id="filter-reset-btn"
            onClick={handleReset}
            className="btn-ghost flex-1"
          >
            Reset
          </button>
          <button
            id="filter-apply-btn"
            onClick={handleApply}
            className="btn-primary flex-[2]"
          >
            Apply Filter
          </button>
        </div>
      </div>
    </div>
  );
}
