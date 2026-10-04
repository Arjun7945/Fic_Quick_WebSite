'use client';

// =============================================================================
// Returns & Refunds Policy — /returns-refunds
// 7-day transparent doorstep pickup, zero hidden fees, fast refunds
// =============================================================================

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  RotateCcw,
  ShieldCheck,
  CheckCircle2,
  Banknote,
  Menu,
} from 'lucide-react';
import { useModal } from '@/context/ModalContext';

const POLICY_TABS = [
  { href: '/terms', label: 'Terms & Conditions', active: false },
  { href: '/privacy', label: 'Privacy Policy', active: false },
  { href: '/returns-refunds', label: 'Returns & Refunds', active: true },
  { href: '/replacements-damages', label: 'Replacements & Damages', active: false },
  { href: '/shipping-delivery', label: 'Shipping & Delivery', active: false },
];

const RETURN_STEPS = [
  {
    step: '1',
    title: 'Initiate Request',
    desc: 'Reach out via our Reach Out To Us / Support page or email support@ficcado.store within 7 days of delivery with your order ID.',
  },
  {
    step: '2',
    title: 'Doorstep Pickup',
    desc: 'Our logistics carrier arrives at your address to inspect tags and collect the parcel in its original protective packaging.',
  },
  {
    step: '3',
    title: 'Quality Verification',
    desc: 'Our inspection hub verifies the unworn condition within 24 hours of package arrival.',
  },
  {
    step: '4',
    title: 'Instant Refund',
    desc: '100% of purchase price is credited back to your original payment method within 3-5 business days. Zero restocking fees.',
  },
];

export default function ReturnsRefundsPage() {
  const router = useRouter();
  const { openModal } = useModal();

  return (
    <div id="returns-page" className="min-h-full pb-16 animate-fade-in" style={{ background: 'var(--bg-app)' }}>
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
            Returns & Refunds
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
            <RotateCcw size={14} />
            <span>Peoples’ Guarantee • 7-Day Doorstep Trial</span>
          </div>

          <h1 className="text-2xl sm:text-3xl md:text-4xl font-900 text-[var(--text-main)]">
            Returns & Transparent Refund Policy
          </h1>

          <p className="text-sm md:text-base text-[var(--text-secondary)] max-w-3xl leading-relaxed">
            We want you to love the feel of our heavyweight textiles. If the silhouette isn’t your exact fit or drape, we make returns straightforward, honest, and completely fee-free.
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
      <div className="max-w-5xl mx-auto px-4 md:px-8 py-8 md:py-12 space-y-10">
        {/* 4 Steps Timeline Grid */}
        <section className="space-y-4">
          <h2 className="text-xl font-900 text-[var(--text-main)]">
            How The 4-Step Return Process Works
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {RETURN_STEPS.map((s) => (
              <div
                key={s.step}
                className="card p-5 bg-[var(--bg-surface)] border border-[var(--border-light)] rounded-2xl space-y-2 relative"
              >
                <div className="w-8 h-8 rounded-full bg-[var(--primary)] text-white font-black text-sm flex items-center justify-center">
                  {s.step}
                </div>
                <h3 className="text-sm font-800 text-[var(--text-main)]">
                  {s.title}
                </h3>
                <p className="text-xs text-[var(--text-muted)] leading-relaxed">
                  {s.desc}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Core Return Conditions */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-8 space-y-6">
            <section className="card p-6 md:p-8 bg-[var(--bg-surface)] border border-[var(--border-light)] space-y-4">
              <h3 className="text-lg font-800 text-[var(--text-main)] flex items-center gap-2">
                <ShieldCheck size={20} className="text-[var(--primary)]" />
                <span>Eligibility Criteria</span>
              </h3>
              <ul className="space-y-2.5 text-xs md:text-sm text-[var(--text-secondary)]">
                <li className="flex items-start gap-2">
                  <CheckCircle2 size={16} className="text-[var(--accent-green)] shrink-0 mt-0.5" />
                  <span>Item must be initiated for return within <strong>7 calendar days</strong> of doorstep arrival.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 size={16} className="text-[var(--accent-green)] shrink-0 mt-0.5" />
                  <span>Item must be unworn, unwashed, and in pristine condition with original tags intact.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 size={16} className="text-[var(--accent-green)] shrink-0 mt-0.5" />
                  <span>Original branded packaging and barcode sleeve should accompany the pickup parcel.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 size={16} className="text-[var(--accent-green)] shrink-0 mt-0.5" />
                  <span>Limited capsule archive items marked as “Final Vault Release” are eligible for size exchanges rather than monetary returns.</span>
                </li>
              </ul>
            </section>

            <section className="card p-6 md:p-8 bg-[var(--bg-surface)] border border-[var(--border-light)] space-y-4">
              <h3 className="text-lg font-800 text-[var(--text-main)] flex items-center gap-2">
                <Banknote size={20} className="text-[var(--primary)]" />
                <span>Refund Timelines & Method</span>
              </h3>
              <p className="text-xs md:text-sm text-[var(--text-secondary)] leading-relaxed">
                Once received and inspected at our fulfillment center, refunds are initiated immediately to your UPI or bank account. You will receive a direct confirmation with transaction reference on WhatsApp and email.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs">
                <div className="p-3 rounded-xl bg-[var(--bg-surface-alt)] border border-[var(--border-light)]">
                  <span className="font-bold block text-[var(--text-main)]">UPI Transfer</span>
                  <span className="text-[var(--accent-green)] font-semibold">Processed within 2 to 4 hours</span>
                </div>
                <div className="p-3 rounded-xl bg-[var(--bg-surface-alt)] border border-[var(--border-light)]">
                  <span className="font-bold block text-[var(--text-main)]">Bank Account / Cards</span>
                  <span className="text-[var(--text-muted)]">2 to 4 business days per bank cycle</span>
                </div>
              </div>
            </section>
          </div>

          {/* Action Box */}
          <div className="lg:col-span-4 space-y-6">
            <div className="card p-6 bg-[var(--bg-surface)] border border-[var(--border-light)] space-y-4 sticky top-24">
              <h4 className="text-base font-800 text-[var(--text-main)]">
                Need To Return An Item?
              </h4>
              <p className="text-xs text-[var(--text-muted)] leading-relaxed">
                You can start a return directly through our Support page with your Reference ID (FIC-A0001) or Order ID, or message us on WhatsApp.
              </p>
              <Link
                href="/support"
                className="btn-primary w-full py-3 text-xs font-bold rounded-xl text-center"
              >
                Initiate Return via Support Form
              </Link>
              <div className="text-[11px] text-center text-[var(--text-muted)] pt-2">
                Or write directly to <a href="mailto:support@ficcado.store" className="text-[var(--primary)] font-bold">support@ficcado.store</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
