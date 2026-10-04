'use client';

// =============================================================================
// Shipping & Delivery Policy — /shipping-delivery
// Dispatch speeds, Live GPS tracking, and courier timelines
// =============================================================================

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Truck, MapPin, Clock, ShieldCheck, Menu } from 'lucide-react';
import { useModal } from '@/context/ModalContext';

const POLICY_TABS = [
  { href: '/terms', label: 'Terms & Conditions', active: false },
  { href: '/privacy', label: 'Privacy Policy', active: false },
  { href: '/returns-refunds', label: 'Returns & Refunds', active: false },
  { href: '/replacements-damages', label: 'Replacements & Damages', active: false },
  { href: '/shipping-delivery', label: 'Shipping & Delivery', active: true },
];

export default function ShippingDeliveryPage() {
  const router = useRouter();
  const { openModal } = useModal();

  return (
    <div id="shipping-page" className="min-h-full pb-16 animate-fade-in" style={{ background: 'var(--bg-app)' }}>
      {/* Mobile Top Header */}
      <header
        className="flex md:hidden items-center justify-between px-4 py-3 sticky top-0 z-30"
        style={{ background: 'var(--bg-surface)', borderBottom: '1px solid var(--border-light)' }}
      >
        <div className="flex items-center gap-3">
          <button onClick={() => router.back()} className="btn-icon" aria-label="Go back">
            <ArrowLeft size={20} style={{ color: 'var(--text-main)' }} />
          </button>
          <h1 className="text-base font-800 tracking-tight" style={{ color: 'var(--text-main)' }}>
            Shipping & Delivery
          </h1>
        </div>
        <button
          onClick={() => openModal('mobileMenuDrawer')}
          className="btn-icon"
          aria-label="Open menu"
        >
          <Menu size={20} style={{ color: 'var(--text-main)' }} />
        </button>
      </header>

      {/* Header Banner */}
      <div className="bg-[var(--bg-surface)] border-b border-[var(--border-light)] py-8 md:py-12 px-4 md:px-8">
        <div className="max-w-5xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--primary-light)] text-[var(--primary)] text-xs font-800 uppercase tracking-wider">
            <Truck size={14} />
            <span>All-India Express Dispatch • WhatsApp Tracking Updates</span>
          </div>

          <h1 className="text-2xl sm:text-3xl md:text-4xl font-900 text-[var(--text-main)]">
            Shipping & Dispatch Transparency
          </h1>

          <p className="text-sm md:text-base text-[var(--text-secondary)] max-w-3xl leading-relaxed">
            Every Ficcado order is hand-packed in sustainable custom dustbags, barcoded, and dispatched with verified courier tracking links sent directly to your WhatsApp.
          </p>

          {/* Quick Policy Switcher Tabs */}
          <div className="flex gap-2 overflow-x-auto pt-4 no-scrollbar">
            {POLICY_TABS.map((tab) => (
              <Link
                key={tab.href}
                href={tab.href}
                className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-colors ${
                  tab.active
                    ? 'bg-[var(--primary)] text-white shadow-xs'
                    : 'bg-[var(--bg-surface-alt)] text-[var(--text-secondary)] hover:bg-[var(--border-light)] border border-[var(--border-light)]'
                }`}
              >
                {tab.label}
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-5xl mx-auto px-4 md:px-8 py-8 md:py-12 space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="card p-6 bg-[var(--bg-surface)] border border-[var(--border-light)] rounded-2xl space-y-3">
            <Clock size={24} className="text-[var(--primary)]" />
            <h3 className="text-base font-800 text-[var(--text-main)]">Same-Day Dispatch</h3>
            <p className="text-xs text-[var(--text-muted)] leading-relaxed">
              Orders placed before 2:00 PM are inspected, packaged, and handed over to courier carriers on the very same business day.
            </p>
          </div>

          <div className="card p-6 bg-[var(--bg-surface)] border border-[var(--border-light)] rounded-2xl space-y-3">
            <MapPin size={24} className="text-[var(--primary)]" />
            <h3 className="text-base font-800 text-[var(--text-main)]">WhatsApp Tracking</h3>
            <p className="text-xs text-[var(--text-muted)] leading-relaxed">
              Receive live courier AWB tracking links, dispatch confirmations, and delivery milestones directly on your WhatsApp chat.
            </p>
          </div>

          <div className="card p-6 bg-[var(--bg-surface)] border border-[var(--border-light)] rounded-2xl space-y-3">
            <ShieldCheck size={24} className="text-[var(--primary)]" />
            <h3 className="text-base font-800 text-[var(--text-main)]">100% Insured Transit</h3>
            <p className="text-xs text-[var(--text-muted)] leading-relaxed">
              All shipments are insured against theft, loss, or weather damage at no extra cost to our customers.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
