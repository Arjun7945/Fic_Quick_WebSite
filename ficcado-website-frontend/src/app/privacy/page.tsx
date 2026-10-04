'use client';

// =============================================================================
// Privacy Policy — /privacy
// Transparent data privacy, no selling of personal information, secure checkout
// =============================================================================

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Shield, Lock, EyeOff, CheckCircle2, Menu } from 'lucide-react';
import { useModal } from '@/context/ModalContext';

const POLICY_TABS = [
  { href: '/terms', label: 'Terms & Conditions', active: false },
  { href: '/privacy', label: 'Privacy Policy', active: true },
  { href: '/returns-refunds', label: 'Returns & Refunds', active: false },
  { href: '/replacements-damages', label: 'Replacements & Damages', active: false },
  { href: '/shipping-delivery', label: 'Shipping & Delivery', active: false },
];

export default function PrivacyPage() {
  const router = useRouter();
  const { openModal } = useModal();

  return (
    <div id="privacy-page" className="min-h-full pb-16 animate-fade-in" style={{ background: 'var(--bg-app)' }}>
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
            Privacy Policy
          </h1>
        </div>
        <button
          onClick={() => openModal('mobileMenuDrawer')}
          className="flex items-center justify-center h-8 w-8 rounded-xl bg-[var(--bg-surface-alt)] border border-[var(--border-light)] text-[var(--text-main)] active:scale-95 cursor-pointer"
          aria-label="Open menu"
        >
          <Menu size={16} />
        </button>
      </header>

      {/* Header Banner */}
      <div className="bg-[var(--bg-surface)] border-b border-[var(--border-light)] py-8 md:py-12 px-4 md:px-8">
        <div className="max-w-5xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--primary-light)] text-[var(--primary)] text-xs font-800 uppercase tracking-wider">
            <Lock size={14} />
            <span>Encrypted & Private • We Never Sell Your Data</span>
          </div>

          <h1 className="text-2xl sm:text-3xl md:text-4xl font-900 text-[var(--text-main)]">
            Privacy & Personal Data Protection
          </h1>

          <p className="text-sm md:text-base text-[var(--text-secondary)] max-w-3xl leading-relaxed">
            Your trust is our cornerstone. At Ficcado, your phone numbers, addresses, and purchase histories are collected solely to deliver your orders and provide stellar support. We never sell or broker data.
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
      <div className="max-w-5xl mx-auto px-4 md:px-8 py-8 md:py-12">
        <div className="space-y-6 max-w-4xl">
          <section className="card p-6 md:p-8 bg-[var(--bg-surface)] border border-[var(--border-light)] space-y-3">
            <h2 className="text-lg font-800 text-[var(--text-main)] flex items-center gap-2">
              <EyeOff size={20} className="text-[var(--primary)]" />
              <span>1. Information We Collect</span>
            </h2>
            <p className="text-xs md:text-sm text-[var(--text-secondary)] leading-relaxed">
              We collect your name, shipping address, and phone number exclusively for order fulfillment, courier dispatch, and customer service communication. We do not store sensitive payment card credentials on our servers — your orders and delivery preferences are finalized directly with our verified team over WhatsApp.
            </p>
          </section>

          <section className="card p-6 md:p-8 bg-[var(--bg-surface)] border border-[var(--border-light)] space-y-3">
            <h2 className="text-lg font-800 text-[var(--text-main)] flex items-center gap-2">
              <Shield size={20} className="text-[var(--primary)]" />
              <span>2. How We Use Your Data</span>
            </h2>
            <ul className="space-y-2 text-xs md:text-sm text-[var(--text-secondary)]">
              <li className="flex items-start gap-2">
                <CheckCircle2 size={16} className="text-[var(--accent-green)] shrink-0 mt-0.5" />
                <span>To process your order, provide tracking updates, and coordinate doorstep delivery.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 size={16} className="text-[var(--accent-green)] shrink-0 mt-0.5" />
                <span>To provide telephone call support if you explicitly opted in with your phone number on our support form.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 size={16} className="text-[var(--accent-green)] shrink-0 mt-0.5" />
                <span>To send limited capsule drop announcements (you may opt out at any time with one click).</span>
              </li>
            </ul>
          </section>

          <section className="card p-6 md:p-8 bg-[var(--bg-surface)] border border-[var(--border-light)] space-y-3">
            <h2 className="text-lg font-800 text-[var(--text-main)] flex items-center gap-2">
              <Lock size={20} className="text-[var(--primary)]" />
              <span>3. Data Retention & Deletion</span>
            </h2>
            <p className="text-xs md:text-sm text-[var(--text-secondary)] leading-relaxed">
              You possess the fundamental right to request an export or complete deletion of your order records and support messages. Email us at <a href="mailto:privacy@ficcado.store" className="text-[var(--primary)] font-bold">privacy@ficcado.store</a> and our technical lead will purge your identifiable information within 24 hours.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
