'use client';

// =============================================================================
// Home Storefront View — /src/components/home/HomeView.tsx
// Renders live catalog items fetched server-side from Google Sheets
// =============================================================================

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Search, SlidersHorizontal, Settings, Menu } from 'lucide-react';
import { useModal } from '@/context/ModalContext';
import { ProductCard } from '@/components/ui/ProductCard';
import { getLiveCategories } from '@/config/categories';
import type { Product } from '@/types';

interface HomeViewProps {
  initialProducts: Product[];
}

export function HomeView({ initialProducts }: HomeViewProps) {
  const [activeCategory, setActiveCategory] = useState('all');
  const { openModal, openProductModal } = useModal();

  const liveCategories = getLiveCategories();
  const categoryPills = [
    { label: 'All', slug: 'all' },
    ...liveCategories.map((c) => ({ label: c.name, slug: c.slug })),
  ];

  const products = initialProducts;

  const filteredProducts =
    activeCategory === 'all'
      ? products
      : products.filter((p) => p.category === activeCategory);

  const heroFeaturedProduct = products.length > 0 ? products[0] : null;

  return (
    <div className="animate-fade-in flex flex-col min-h-full" style={{ background: 'var(--bg-app)' }}>
      {/* Mobile Top Header */}
      <header
        className="flex md:hidden items-center justify-between px-4 py-2.5 shrink-0"
        style={{ background: 'var(--bg-surface)', borderBottom: '1px solid var(--border-light)' }}
      >
        <div className="flex items-center gap-2.5">
          <button
            id="mobile-menu-trigger-btn"
            onClick={() => openModal('mobileMenuDrawer')}
            className="flex items-center justify-center h-9 w-9 rounded-xl bg-[var(--bg-surface-alt)] border border-[var(--border-light)] text-[var(--text-main)] active:scale-95 transition-transform cursor-pointer"
            aria-label="Open navigation menu and features"
          >
            <Menu size={18} />
          </button>
          <Link href="/" className="flex items-center gap-2">
            <div
              className="relative flex h-8 w-8 items-center justify-center rounded-lg bg-white border border-[var(--border-light)] overflow-hidden p-0.5 shadow-2xs"
            >
              <Image
                src="/images/brand_logo/Ficcado Brand Logo.jpeg"
                alt="Ficcado Logo"
                fill
                sizes="32px"
                className="object-contain p-0.5"
                priority
              />
            </div>
            <span className="text-sm font-900 tracking-tight text-[var(--text-main)]">FICCADO</span>
          </Link>
        </div>

        {/* T-Shirt Collection Badge */}
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-800 uppercase tracking-widest text-[var(--primary)] bg-[var(--primary-light)] px-2.5 py-1 rounded-full border border-[var(--primary)]/20">
            T-Shirts Live
          </span>
          <Link
            href="/settings"
            id="home-settings-btn"
            className="btn-icon"
            aria-label="Settings"
          >
            <Settings size={18} style={{ color: 'var(--text-muted)' }} />
          </Link>
        </div>
      </header>

      {/* Mobile Search bar */}
      <div className="flex md:hidden items-center gap-2 px-4 py-3" style={{ background: 'var(--bg-surface)' }}>
        <Link
          href="/search"
          id="home-search-bar"
          className="flex flex-1 items-center gap-2 rounded-2xl px-3.5 py-2.5"
          style={{ background: 'var(--bg-surface-alt)', border: '1.5px solid var(--border-light)' }}
          aria-label="Search products"
        >
          <Search size={16} style={{ color: 'var(--text-light)' }} />
          <span className="text-sm" style={{ color: 'var(--text-light)' }}>Search tees, drops...</span>
        </Link>
        <button
          id="home-filter-btn"
          onClick={() => openModal('filterModal')}
          className="btn-icon h-10 w-10 cursor-pointer"
          style={{ background: 'var(--primary-light)', borderRadius: 'var(--radius-sm)' }}
          aria-label="Open filters"
        >
          <SlidersHorizontal size={17} style={{ color: 'var(--primary)' }} />
        </button>
      </div>

      <div className="no-scrollbar flex-1 overflow-y-auto">
        {/* Hero Banner Drop */}
        <div
          className="relative mx-4 md:mx-0 mt-4 md:mt-2 md:mb-6 overflow-hidden rounded-3xl h-[220px] md:h-[360px]"
          style={{ borderRadius: 'var(--radius-lg)' }}
        >
          <Image
            src="/images/hero/main-hero.jpg"
            alt="Ficcado Drop — High Quality Unisex Wears"
            fill
            sizes="(max-width: 768px) 100vw, 1200px"
            className="object-cover object-top"
            priority
            unoptimized
          />
          {/* Gradient overlay */}
          <div
            className="absolute inset-0"
            style={{
              background:
                'linear-gradient(to right, rgba(17,24,39,0.85) 0%, rgba(17,24,39,0.4) 50%, transparent 100%)',
            }}
          />
          {/* Hero copy */}
          <div className="absolute bottom-5 left-5 md:bottom-12 md:left-12 max-w-md">
            <span
              className="inline-block px-2.5 py-1 rounded-full bg-[var(--primary)] text-white text-[10px] md:text-xs font-800 uppercase tracking-widest mb-2"
              style={{ fontWeight: 800 }}
            >
              Selling T-Shirts Now 🔥
            </span>
            <h1
              className="text-2xl md:text-4xl lg:text-5xl font-900 leading-tight text-white tracking-tight"
              style={{ fontWeight: 900 }}
            >
              High Quality Unisex Wears
            </h1>
            <p className="text-xs md:text-sm text-white/90 mt-1.5 mb-4 leading-relaxed">
              Ficcado crafts signature high quality unisex streetwear with premium 230 GSM cotton and lasting comfort.
            </p>
            <div className="flex items-center gap-3">
              {heroFeaturedProduct && (
                <button
                  id="hero-explore-btn"
                  onClick={() => openProductModal(heroFeaturedProduct)}
                  className="rounded-full px-5 py-2.5 text-xs md:text-sm font-700 text-white transition-transform active:scale-95 hover:opacity-95 shadow-lg cursor-pointer"
                  style={{ background: 'var(--primary)', fontWeight: 700 }}
                >
                  Shop T-Shirts &rarr;
                </button>
              )}
              <Link
                href="/categories"
                className="inline-flex rounded-full px-4 md:px-5 py-2 md:py-2.5 text-xs md:text-sm font-700 text-white bg-white/20 hover:bg-white/30 backdrop-blur-md transition-all active:scale-95"
              >
                View Roadmapped Wears
              </Link>
            </div>
          </div>
        </div>

        {/* Category filter pills & Desktop Filter Trigger */}
        <div className="flex items-center justify-between px-4 md:px-0 pt-4 pb-2">
          <div className="scroll-row gap-2 md:gap-3">
            {categoryPills.map((cat) => {
              const isActive = activeCategory === cat.slug;
              return (
                <button
                  key={cat.slug}
                  id={`pill-${cat.slug}`}
                  onClick={() => setActiveCategory(cat.slug)}
                  className="rounded-full px-4 md:px-5 py-1.5 md:py-2 text-xs md:text-sm font-semibold whitespace-nowrap transition-all active:scale-95 cursor-pointer"
                  style={{
                    background: isActive ? 'var(--primary)' : 'var(--bg-surface)',
                    color: isActive ? '#fff' : 'var(--text-muted)',
                    border: `1.5px solid ${isActive ? 'var(--primary)' : 'var(--border-light)'}`,
                    flexShrink: 0,
                  }}
                  aria-pressed={isActive}
                >
                  {cat.label}
                </button>
              );
            })}
          </div>

          {/* Desktop Filter Drawer Trigger */}
          <button
            onClick={() => openModal('filterModal')}
            className="hidden md:flex items-center gap-2 px-4 py-2 rounded-xl border border-[var(--border-light)] bg-[var(--bg-surface)] hover:bg-[var(--bg-surface-alt)] text-xs font-bold text-[var(--text-main)] transition-colors shrink-0 cursor-pointer"
          >
            <SlidersHorizontal size={14} className="text-[var(--primary)]" />
            <span>Filters</span>
          </button>
        </div>

        {/* Section header */}
        <div className="flex items-center justify-between px-4 md:px-0 pt-4 pb-2">
          <h2 className="text-base md:text-xl font-800" style={{ fontWeight: 800, color: 'var(--text-main)' }}>
            Available T-Shirt Drops
          </h2>
          <span className="text-xs md:text-sm font-semibold text-[var(--text-muted)]">
            {filteredProducts.length} Item{filteredProducts.length !== 1 ? 's' : ''} in Catalog
          </span>
        </div>

        {/* Product grid: 2-col mobile, 3-col tablet, 4-col desktop */}
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-6 px-4 md:px-0 pb-6">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} priority={true} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center py-16 gap-3 text-center px-4">
            <span className="text-3xl">🛍️</span>
            <p className="text-sm font-bold text-[var(--text-main)]">
              {products.length === 0
                ? 'Catalog temporarily unavailable'
                : 'No items in this category'}
            </p>
            <p className="text-xs text-[var(--text-muted)] max-w-sm">
              {products.length === 0
                ? 'Please check back shortly or connect with our team on WhatsApp.'
                : 'Please check other categories or browse all t-shirt drops.'}
            </p>
            {products.length === 0 && (
              <a
                href="https://wa.me/919497144795"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary mt-2 text-xs py-2 px-4"
              >
                Chat on WhatsApp &rarr;
              </a>
            )}
          </div>
        )}

        <div className="h-4" />
      </div>
    </div>
  );
}
