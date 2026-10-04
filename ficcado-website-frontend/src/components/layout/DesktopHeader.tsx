'use client';

// =============================================================================
// DesktopHeader — Luxury Top Navigation Bar for Tablet & Desktop screens
// Retains Brand Logo, Primary Nav Links, Search, and Shopping Bag with item count
// =============================================================================

import { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Search, ShoppingBag } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useModal } from '@/context/ModalContext';

const NAV_LINKS = [
  { href: '/', label: 'Drops' },
  { href: '/categories', label: 'Categories' },
  { href: '/journal', label: 'Journal' },
  { href: '/about', label: 'About' },
  { href: '/faq', label: 'FAQ' },
  { href: '/support', label: 'Support' },
];

export function DesktopHeader() {
  const pathname = usePathname();
  const router = useRouter();
  const { totalItemsCount, subtotalAmount } = useCart();
  const { openModal } = useModal();

  const [searchQuery, setSearchQuery] = useState('');

  function handleSearchSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      router.push('/search');
    }
  }

  return (
    <header className="hidden md:block w-full sticky top-0 z-40 bg-[var(--bg-surface)]/95 backdrop-blur-md border-b border-[var(--border-light)] shadow-xs">

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-6 h-18 flex items-center justify-between gap-6">
        {/* Left: Brand Logo & Unisex Subtitle */}
        <div className="flex items-center gap-5 shrink-0">
          <Link href="/" className="flex items-center gap-3 group">
            <div
              className="flex h-10 w-10 items-center justify-center rounded-xl text-white font-black text-sm tracking-wider shadow-sm transition-transform group-hover:scale-105"
              style={{
                background: 'linear-gradient(135deg, #2B62C6 0%, #1D4ED8 100%)',
                boxShadow: '0 4px 14px rgba(43, 98, 198, 0.35)',
              }}
            >
              FC
            </div>
            <div>
              <span className="text-lg font-900 tracking-tight leading-none block text-[var(--text-main)]">
                FICCADO
              </span>
              <span className="text-[9px] font-800 tracking-[0.2em] text-[var(--primary)] uppercase block mt-0.5">
                Heavyweight Unisex T-Shirts
              </span>
            </div>
          </Link>
        </div>

        {/* Center: Primary Navigation Links (Single line, no wrap) */}
        <nav className="flex items-center gap-1 lg:gap-2" aria-label="Primary navigation">
          {NAV_LINKS.map(({ href, label }) => {
            const isActive = href === '/' ? pathname === '/' : pathname.startsWith(href);
            return (
              <Link
                key={href}
                href={href}
                className={`px-3.5 py-1.5 rounded-xl text-xs uppercase tracking-wider font-bold whitespace-nowrap transition-all ${
                  isActive
                    ? 'text-[var(--primary)] bg-[var(--primary-light)]'
                    : 'text-[var(--text-secondary)] hover:text-[var(--text-main)] hover:bg-[var(--bg-surface-alt)]'
                }`}
              >
                {label}
              </Link>
            );
          })}
        </nav>

        {/* Center-Right: Search Input */}
        <form onSubmit={handleSearchSubmit} className="flex-1 max-w-xs xl:max-w-sm relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search tees, drops..."
            className="w-full h-9.5 pl-9 pr-10 rounded-full bg-[var(--bg-surface-alt)] border border-[var(--border-light)] text-xs text-[var(--text-main)] placeholder-[var(--text-light)] focus:outline-none focus:border-[var(--primary)] focus:bg-white transition-all shadow-xs"
          />
          <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--text-light)]" />
          <button
            type="submit"
            aria-label="Search"
            className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] font-800 bg-[var(--border-light)] text-[var(--text-muted)] px-1.5 py-0.5 rounded-md hover:bg-gray-300 transition-colors cursor-pointer"
          >
            ↵
          </button>
        </form>

        {/* Right: Shopping Bag CTA */}
        <div className="flex items-center gap-2 xl:gap-3 shrink-0">
          <button
            id="desktop-header-cart-btn"
            onClick={() => openModal('cartDrawer')}
            className="flex items-center gap-2.5 px-4 py-2 rounded-full bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-white transition-all active:scale-95 shadow-btn font-bold text-xs cursor-pointer"
            aria-label={`Shopping Bag, ${totalItemsCount} item${totalItemsCount !== 1 ? 's' : ''}`}
          >
            <div className="relative">
              <ShoppingBag size={17} />
              {totalItemsCount > 0 && (
                <span className="absolute -top-1.5 -right-2 flex h-4 min-w-4 items-center justify-center rounded-full bg-white text-[var(--primary)] text-[9px] font-black px-0.5 shadow-xs">
                  {totalItemsCount}
                </span>
              )}
            </div>
            <span>
              {totalItemsCount > 0 ? `Bag (₹${subtotalAmount.toLocaleString('en-IN')})` : 'Bag'}
            </span>
          </button>
        </div>
      </div>
    </header>
  );
}

export default DesktopHeader;
