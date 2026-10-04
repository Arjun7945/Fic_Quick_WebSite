'use client';

// =============================================================================
// Settings & Brand Hub — /settings
// Brand information, quick navigation links, and app version info.
// =============================================================================

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  Info,
  ShoppingBag,
  HelpCircle,
  BookOpen,
  Truck,
  Shield,
  Mail,
  ExternalLink,
  PhoneCall,
  Star,
} from 'lucide-react';

const QUICK_LINKS = [
  { label: 'Shop T-Shirts', href: '/categories/t-shirts', icon: ShoppingBag, desc: 'Browse available drops' },
  { label: 'FAQ', href: '/faq', icon: HelpCircle, desc: 'Frequently asked questions' },
  { label: 'The Journal', href: '/journal', icon: BookOpen, desc: 'Brand story & textile lab' },
  { label: 'About Ficcado', href: '/about', icon: Info, desc: 'Founders & brand mission' },
  { label: 'Delivery Info', href: '/faq#delivery', icon: Truck, desc: 'Shipping & courier options' },
  { label: 'Returns & Refunds', href: '/faq#returns-refunds', icon: Shield, desc: '7-day return policy' },
  { label: 'Support', href: '/support', icon: Mail, desc: 'Reach out to our team' },
];

const BRAND_PILLARS = [
  { label: 'T-Shirts Now', detail: 'Currently selling heavyweight unisex T-shirts (380 GSM)' },
  { label: 'All Wears in Future', detail: 'Combos, hoodies, shirts, pants & sneakers coming soon' },
  { label: 'Founded 2025', detail: 'By Ganga Lakshmi, Rohith Murali & Sinan' },
  { label: 'Pan-India Dispatch', detail: 'Verified courier delivery across all of India' },
];

export default function SettingsPage() {
  const router = useRouter();

  return (
    <div id="settings-page" className="min-h-full pb-16 animate-fade-in" style={{ background: 'var(--bg-app)' }}>
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
            Settings & Brand Hub
          </h1>
        </div>
      </header>

      <div className="max-w-3xl mx-auto px-4 md:px-8 py-10 md:py-14 space-y-10">

        {/* Brand Identity Card */}
        <section className="card p-7 md:p-10 bg-gradient-to-br from-[var(--primary)] to-[#1E40AF] text-white rounded-3xl shadow-xl space-y-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-white/20 flex items-center justify-center font-black text-xl">
              FC
            </div>
            <div>
              <h1 className="text-2xl font-900 tracking-tight">Ficcado Clothings</h1>
              <p className="text-sm text-blue-100 font-medium mt-0.5">
                Heavyweight T-Shirts Now · All Wears in Future
              </p>
            </div>
          </div>
          <p className="text-xs md:text-sm text-blue-100 leading-relaxed">
            Ficcado was founded in 2025 by three friends — Ganga Lakshmi, Rohith Murali, and Sinan —
            dedicated to crafting heavyweight, honest apparel. We currently sell signature unisex
            T-shirts. All other wears (combos, hoodies, shirts, pants) are coming in future drops.
          </p>
          <div className="flex flex-wrap gap-2 pt-1">
            <span className="px-3 py-1 rounded-full bg-white/15 text-xs font-bold text-white">Est. 2025</span>
            <span className="px-3 py-1 rounded-full bg-white/15 text-xs font-bold text-white">T-Shirts Now 🔥</span>
            <span className="px-3 py-1 rounded-full bg-white/15 text-xs font-bold text-white">All Wears In Future</span>
          </div>
        </section>

        {/* Brand Pillars */}
        <section className="space-y-3">
          <h2 className="text-xs font-800 uppercase tracking-widest text-[var(--text-muted)]">Brand Status</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {BRAND_PILLARS.map((pillar) => (
              <div
                key={pillar.label}
                className="card p-4 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-light)] flex items-start gap-3"
              >
                <div className="w-7 h-7 mt-0.5 rounded-lg bg-[var(--primary-light)] flex items-center justify-center shrink-0">
                  <Star size={14} className="text-[var(--primary)]" />
                </div>
                <div>
                  <p className="text-sm font-800 text-[var(--text-main)]">{pillar.label}</p>
                  <p className="text-xs text-[var(--text-muted)] mt-0.5 leading-relaxed">{pillar.detail}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Quick Links */}
        <section className="space-y-3">
          <h2 className="text-xs font-800 uppercase tracking-widest text-[var(--text-muted)]">Quick Navigation</h2>
          <div className="card rounded-3xl bg-[var(--bg-surface)] border border-[var(--border-light)] overflow-hidden divide-y divide-[var(--border-light)]">
            {QUICK_LINKS.map((link) => {
              const Icon = link.icon;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className="flex items-center justify-between p-4 md:p-5 hover:bg-[var(--bg-surface-alt)] transition-colors group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-[var(--primary-light)] flex items-center justify-center shrink-0">
                      <Icon size={16} className="text-[var(--primary)]" />
                    </div>
                    <div>
                      <span className="text-sm font-bold text-[var(--text-main)] block">{link.label}</span>
                      <span className="text-xs text-[var(--text-muted)]">{link.desc}</span>
                    </div>
                  </div>
                  <ExternalLink size={14} className="text-[var(--text-muted)] group-hover:text-[var(--primary)] transition-colors" />
                </Link>
              );
            })}
          </div>
        </section>

        {/* Contact */}
        <section className="space-y-3">
          <h2 className="text-xs font-800 uppercase tracking-widest text-[var(--text-muted)]">Contact & Socials</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <a
              href="https://wa.me/919497144795"
              target="_blank"
              rel="noopener noreferrer"
              id="settings-whatsapp-btn"
              className="card p-4 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-light)] flex items-center gap-3 hover:border-[var(--primary)]/40 transition-all group"
            >
              <PhoneCall size={18} className="text-green-500 shrink-0" />
              <div>
                <p className="text-xs font-800 text-[var(--text-main)]">WhatsApp</p>
                <p className="text-[11px] text-[var(--text-muted)]">+91 94971 44795</p>
              </div>
            </a>
            <a
              href="mailto:support@ficcado.store"
              id="settings-email-btn"
              className="card p-4 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-light)] flex items-center gap-3 hover:border-[var(--primary)]/40 transition-all group"
            >
              <Mail size={18} className="text-[var(--primary)] shrink-0" />
              <div>
                <p className="text-xs font-800 text-[var(--text-main)]">Email</p>
                <p className="text-[11px] text-[var(--text-muted)]">support@ficcado.store</p>
              </div>
            </a>
            <a
              href="https://instagram.com/ficcado.store"
              target="_blank"
              rel="noopener noreferrer"
              id="settings-instagram-btn"
              className="card p-4 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-light)] flex items-center gap-3 hover:border-[var(--primary)]/40 transition-all group"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-pink-500 shrink-0"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>
              <div>
                <p className="text-xs font-800 text-[var(--text-main)]">Instagram</p>
                <p className="text-[11px] text-[var(--text-muted)]">@ficcado.store</p>
              </div>
            </a>
          </div>
        </section>

        {/* App Info */}
        <footer className="text-center space-y-1 pt-4">
          <p className="text-xs text-[var(--text-muted)] font-medium">
            Ficcado Clothings · Est. 2025 · T-Shirts Now, All Wears in Future
          </p>
          <p className="text-[11px] text-[var(--text-muted)]">
            Official Store ·{' '}
            <a
              href="https://www.ficcado.store"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[var(--primary)] transition-colors"
            >
              ficcado.store
            </a>
          </p>
        </footer>
      </div>
    </div>
  );
}
