'use client';

// =============================================================================
// Privacy Policy — /privacy
// Transparent data privacy, zero selling of personal data, verified brand facts per D15
// =============================================================================

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Shield, Lock, EyeOff, CheckCircle2, Menu, Truck, Mail, Clock, UserCheck, Cookie } from 'lucide-react';
import { useModal } from '@/context/ModalContext';

const POLICY_TABS = [
  { href: '/terms', label: 'Terms & Conditions', active: false },
  { href: '/privacy', label: 'Privacy Policy', active: true },
  { href: '/cookies', label: 'Cookie Policy', active: false },
  { href: '/returns-refunds', label: 'Returns & Refunds', active: false },
  { href: '/shipping-delivery', label: 'Shipping & Delivery', active: false },
];

export default function PrivacyPage() {
  const router = useRouter();
  const { openModal } = useModal();
  const privacyEmail = process.env.NEXT_PUBLIC_PRIVACY_EMAIL || 'ficcado.clothing@gmail.com';

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
            Your trust is our cornerstone. At Ficcado, your phone numbers, addresses, and purchase histories are collected solely to deliver your orders and provide customer support. We never sell or broker data.
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
          {/* Section 1 */}
          <section className="card p-6 md:p-8 bg-[var(--bg-surface)] border border-[var(--border-light)] space-y-3">
            <h2 className="text-lg font-800 text-[var(--text-main)] flex items-center gap-2">
              <EyeOff size={20} className="text-[var(--primary)]" />
              <span>1. Information We Collect</span>
            </h2>
            <p className="text-xs md:text-sm text-[var(--text-secondary)] leading-relaxed">
              We collect your name, shipping address, email, and phone number exclusively for order fulfillment, courier dispatch, and customer service communication. We do not store sensitive payment card credentials on our servers — your orders and delivery preferences are finalized directly with our verified team over WhatsApp.
            </p>
          </section>

          {/* Section 2 */}
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
                <span>To resolve order inquiries and support tickets submitted through our website.</span>
              </li>
            </ul>
          </section>

          {/* Section 3: Courier Sharing & Regions */}
          <section className="card p-6 md:p-8 bg-[var(--bg-surface)] border border-[var(--border-light)] space-y-3">
            <h2 className="text-lg font-800 text-[var(--text-main)] flex items-center gap-2">
              <Truck size={20} className="text-[var(--primary)]" />
              <span>3. Courier Logistics & Regional Coverage</span>
            </h2>
            <p className="text-xs md:text-sm text-[var(--text-secondary)] leading-relaxed">
              Customer data is <strong>never shared or sold</strong> to courier partners. Only the physical package with the customer delivery label pasted on the exterior box is provided to the logistics partner. Our standard delivery region is strictly <strong>INDIA</strong>. Deliveries outside India are available upon customer request, with applicable delivery charges strictly calculated based on the carrier partner and destination region.
            </p>
          </section>

          {/* Section 4: Data Retention */}
          <section className="card p-6 md:p-8 bg-[var(--bg-surface)] border border-[var(--border-light)] space-y-3">
            <h2 className="text-lg font-800 text-[var(--text-main)] flex items-center gap-2">
              <Lock size={20} className="text-[var(--primary)]" />
              <span>4. Data Retention & Safety</span>
            </h2>
            <p className="text-xs md:text-sm text-[var(--text-secondary)] leading-relaxed">
              Order and support records are kept forever safe and secured in our administrative data storage to honor warranty, dispute resolution, and replacement commitments. You may contact us at any time to request access to or updates for your contact records.
            </p>
          </section>

          {/* Section 5: Cookies Link */}
          <section className="card p-6 md:p-8 bg-[var(--bg-surface)] border border-[var(--border-light)] space-y-3">
            <h2 className="text-lg font-800 text-[var(--text-main)] flex items-center gap-2">
              <Cookie size={20} className="text-[var(--primary)]" />
              <span>5. Cookies & Local Storage</span>
            </h2>
            <p className="text-xs md:text-sm text-[var(--text-secondary)] leading-relaxed">
              We use strictly necessary browser storage to maintain your shopping bag and process order continuation. Please consult our{' '}
              <Link href="/cookies" className="text-[var(--primary)] font-bold hover:underline">
                Cookie Policy
              </Link>{' '}
              for the complete inventory of storage keys and to configure your preferences.
            </p>
          </section>

          {/* Section 6: Grievance Officer & Contact Details */}
          <section className="card p-6 md:p-8 bg-[var(--bg-surface)] border border-[var(--border-light)] space-y-4">
            <h2 className="text-lg font-800 text-[var(--text-main)] flex items-center gap-2">
              <UserCheck size={20} className="text-[var(--primary)]" />
              <span>6. Privacy Officer & Support Contact</span>
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs md:text-sm text-[var(--text-secondary)]">
              <div className="p-4 rounded-2xl bg-[var(--bg-surface-alt)] border border-[var(--border-light)] space-y-1.5">
                <span className="font-bold text-[var(--text-main)] flex items-center gap-1.5">
                  <Mail size={14} className="text-[var(--primary)]" />
                  Privacy & Support Email
                </span>
                <a href={`mailto:${privacyEmail}`} className="text-[var(--primary)] font-bold hover:underline block font-mono">
                  {privacyEmail}
                </a>
                <span className="text-[11px] text-[var(--text-muted)] flex items-center gap-1">
                  <Clock size={12} />
                  Support Hours: 7:00 AM – 7:00 PM IST
                </span>
              </div>

              <div className="p-4 rounded-2xl bg-[var(--bg-surface-alt)] border border-[var(--border-light)] space-y-1.5">
                <span className="font-bold text-[var(--text-main)] flex items-center gap-1.5">
                  <UserCheck size={14} className="text-[var(--primary)]" />
                  Point of Grievance (POG) Contact
                </span>
                <span className="font-bold text-[var(--text-main)] block">Rohith Murali</span>
                <a href="mailto:rohithficcado@gmail.com" className="text-[var(--primary)] font-bold hover:underline block font-mono">
                  rohithficcado@gmail.com
                </a>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
