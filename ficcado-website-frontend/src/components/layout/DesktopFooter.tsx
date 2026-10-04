'use client';

// =============================================================================
// DesktopFooter — Dedicated footer for Tablet and Desktop screens
// Clean, balanced layout with collections, support, and transparent policies
// =============================================================================

import Link from 'next/link';
import { Sparkles, MessageCircle, Mail, ShieldCheck } from 'lucide-react';

export function DesktopFooter() {
  return (
    <footer className="w-full bg-[var(--bg-surface)] border-t border-[var(--border-light)] mt-12 md:mt-16 text-[var(--text-secondary)] pb-24 md:pb-0">
      {/* Brand value props banner */}
      <div className="border-b border-[var(--border-light)] py-6 bg-[var(--bg-surface-alt)]">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
          <div className="flex flex-col items-center gap-1.5">
            <Sparkles size={20} className="text-[var(--primary)]" />
            <span className="text-xs font-bold text-[var(--text-main)]">Limited Unisex Drops</span>
            <span className="text-[11px] text-[var(--text-muted)]">Precision-tailored heavyweight cotton for everyone</span>
          </div>
          <div className="flex flex-col items-center gap-1.5 border-y md:border-y-0 md:border-x border-[var(--border-light)] py-4 md:py-0 px-4">
            <MessageCircle size={20} className="text-[var(--primary)]" />
            <span className="text-xs font-bold text-[var(--text-main)]">Direct WhatsApp Ordering</span>
            <span className="text-[11px] text-[var(--text-muted)]">Instant order confirmation, payment, and size care</span>
          </div>
          <div className="flex flex-col items-center gap-1.5">
            <ShieldCheck size={20} className="text-[var(--primary)]" />
            <span className="text-xs font-bold text-[var(--text-main)]">Priority Care Guarantee</span>
            <span className="text-[11px] text-[var(--text-muted)]">support@ficcado.store with rapid resolution</span>
          </div>
        </div>
      </div>

      {/* Main Footer Links (4 Balanced Columns) */}
      <div className="max-w-7xl mx-auto px-6 py-10 md:py-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {/* Col 1: Brand Info */}
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div
              className="flex h-9 w-9 items-center justify-center rounded-xl text-white font-black text-xs"
              style={{ background: 'var(--primary)' }}
            >
              FC
            </div>
            <div>
              <span className="text-base font-900 tracking-tight leading-none block text-[var(--text-main)]">
                FICCADO
              </span>
              <span className="text-[9px] font-700 tracking-widest text-[var(--text-muted)] uppercase">
                Clothings
              </span>
            </div>
          </div>
          <p className="text-xs leading-relaxed text-[var(--text-muted)]">
            Ficcado sells signature heavyweight T-shirts now. All other apparel wears and silhouettes will be available in future drops.
          </p>
          <div className="flex items-center gap-2 text-xs font-semibold text-[var(--primary)]">
            <Mail size={14} />
            <a href="mailto:support@ficcado.store" className="hover:underline">
              support@ficcado.store
            </a>
          </div>
        </div>

        {/* Col 2: Collections */}
        <div>
          <h4 className="text-xs font-800 uppercase tracking-wider text-[var(--text-main)] mb-4">
            Collections
          </h4>
          <ul className="space-y-2.5 text-xs font-medium">
            <li>
              <Link href="/categories/t-shirts" className="hover:text-[var(--primary)] transition-colors">
                T-Shirts (Live Drop)
              </Link>
            </li>
            <li>
              <Link href="/categories/combos" className="hover:text-[var(--primary)] transition-colors text-[var(--text-muted)]">
                Combos (Coming Soon)
              </Link>
            </li>
            <li>
              <Link href="/categories/shirts" className="hover:text-[var(--primary)] transition-colors text-[var(--text-muted)]">
                Shirts (Coming Soon)
              </Link>
            </li>
            <li>
              <Link href="/categories/hoodies" className="hover:text-[var(--primary)] transition-colors text-[var(--text-muted)]">
                Hoodies (Coming Soon)
              </Link>
            </li>
          </ul>
        </div>

        {/* Col 3: Customer Care & Experience */}
        <div>
          <h4 className="text-xs font-800 uppercase tracking-wider text-[var(--text-main)] mb-4">
            Customer Care
          </h4>
          <ul className="space-y-2.5 text-xs font-medium">
            <li>
              <Link href="/support" className="hover:text-[var(--primary)] transition-colors font-bold text-[var(--primary)]">
                Reach Out To Us (Support Desk)
              </Link>
            </li>
            <li>
              <Link href="/journal" className="hover:text-[var(--primary)] transition-colors">
                The Journal & Chronicles
              </Link>
            </li>
            <li>
              <Link href="/about" className="hover:text-[var(--primary)] transition-colors">
                About Ficcado
              </Link>
            </li>
            <li>
              <Link href="/faq" className="hover:text-[var(--primary)] transition-colors">
                Frequently Asked Questions (FAQ)
              </Link>
            </li>
            <li>
              <Link href="/support" className="hover:text-[var(--primary)] transition-colors">
                Help Regarding Order
              </Link>
            </li>
          </ul>
        </div>

        {/* Col 4: Transparent Policies */}
        <div>
          <h4 className="text-xs font-800 uppercase tracking-wider text-[var(--text-main)] mb-4">
            Transparent Policies
          </h4>
          <ul className="space-y-2.5 text-xs font-medium">
            <li>
              <Link href="/terms" className="hover:text-[var(--primary)] transition-colors">
                Terms & Conditions
              </Link>
            </li>
            <li>
              <Link href="/privacy" className="hover:text-[var(--primary)] transition-colors">
                Privacy Policy
              </Link>
            </li>
            <li>
              <Link href="/returns-refunds" className="hover:text-[var(--primary)] transition-colors">
                Returns & Refunds (7 Days)
              </Link>
            </li>
            <li>
              <Link href="/replacements-damages" className="hover:text-[var(--primary)] transition-colors">
                Replacements & Guarantees
              </Link>
            </li>
            <li>
              <Link href="/shipping-delivery" className="hover:text-[var(--primary)] transition-colors">
                Shipping & Delivery Timelines
              </Link>
            </li>
          </ul>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-[var(--border-light)] py-5 text-center text-xs text-[var(--text-light)] bg-[var(--bg-surface-alt)]">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-3 text-[11px] text-[var(--text-muted)]">
          <p>© 2026 Ficcado Clothings. All rights reserved. • T-Shirts Now, All Wears in Future</p>
          <div className="flex items-center gap-2 font-medium">
            <span>Direct WhatsApp Ordering & Verification • All Transactions in INR (₹)</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default DesktopFooter;
