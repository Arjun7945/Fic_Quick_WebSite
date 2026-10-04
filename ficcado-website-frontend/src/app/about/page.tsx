'use client';

// =============================================================================
// About Us — /about
// The 2025 Founding Story of Ficcado by 3 Friends
// Founders: Ganga Lakshmi, Rohith Murali, Sinan
// Inspiring customer trust, craftsmanship transparency & first-order confidence
// =============================================================================

import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  Sparkles,
  ShieldCheck,
  Truck,
  HeartHandshake,
  Award,
  CheckCircle2,
  Quote,
  Menu,
} from 'lucide-react';
import { useModal } from '@/context/ModalContext';

const FOUNDERS = [
  {
    name: 'Ganga Lakshmi',
    role: 'Co-Founder & Creative Director',
    designation: 'Lead Apparel Designer & Aesthetic Visionary',
    image: '/assets/founders_profile_pic/Ganga Lakshmi.jpg',
    bio: 'Obsessed with silhouette geometry, architectural drapes, and precision-cut apparel design. Ganga personally directs every cut, ensuring our heavyweight T-shirts balance bold structural presence with effortless everyday wearability.',
    highlights: ['Silhouette Geometry', 'Capsule Design', 'Color Dynamics'],
  },
  {
    name: 'Rohith Murali',
    role: 'Co-Founder & Head of Sourcing & Production',
    designation: 'Textile Engineering & Ethical Manufacturing Lead',
    image: '/assets/founders_profile_pic/Rohith Murali.jpg',
    bio: 'Traversing vetted textile mills to engineer our signature 380 GSM combed cotton and heavyweight textiles. Rohith oversees ethical supply lines, sustainable dyeing, and indestructible double-needle seam stitching.',
    highlights: ['380 GSM Combed Cotton', 'Ethical Mill Partners', 'Zero Stitch Defects'],
  },
  {
    name: 'Sinan',
    role: 'Co-Founder & Head of Product & Experience',
    designation: 'Digital Architect & Community Trust Lead',
    image: '/assets/founders_profile_pic/Sinan.jpg',
    bio: 'Championing total brand transparency, customer-first policies, and real-time parcel visibility. Sinan ensures that from your first tap to unboxing at your doorstep, the Ficcado experience inspires absolute trust.',
    highlights: ['Transparent Operations', 'WhatsApp Updates', 'Direct Customer Care'],
  },
];

const TRUST_METRICS = [
  {
    icon: Award,
    title: '380 GSM Heavyweight',
    desc: 'Dense custom combed cotton weaves that keep structure wash after wash.',
  },
  {
    icon: ShieldCheck,
    title: '100% Quality Inspected',
    desc: 'Every garment is hand-verified before dispatch from our cleanroom facility.',
  },
  {
    icon: HeartHandshake,
    title: '7-Day Transparent Returns',
    desc: 'Try it on at home. If the drape or fit isn’t perfect, doorstep pickup is on us.',
  },
  {
    icon: Truck,
    title: 'WhatsApp Dispatch Updates',
    desc: 'Direct dispatch alerts and courier AWB tracking links sent to your WhatsApp.',
  },
];

export default function AboutPage() {
  const router = useRouter();
  const { openModal } = useModal();

  return (
    <div id="about-page" className="min-h-full pb-16 animate-fade-in" style={{ background: 'var(--bg-app)' }}>
      {/* Mobile Top Header (Hidden on Tablet & Desktop) */}
      <header
        className="flex md:hidden items-center justify-between px-4 py-3 sticky top-0 z-30"
        style={{ background: 'var(--bg-surface)', borderBottom: '1px solid var(--border-light)' }}
      >
        <div className="flex items-center gap-3">
          <button onClick={() => router.back()} className="btn-icon" aria-label="Go back">
            <ArrowLeft size={20} style={{ color: 'var(--text-main)' }} />
          </button>
          <h1 className="text-base font-800 tracking-tight" style={{ color: 'var(--text-main)' }}>
            About Ficcado
          </h1>
        </div>
        <button
          onClick={() => openModal('mobileMenuDrawer')}
          className="flex items-center justify-center h-8 w-8 rounded-xl bg-[var(--bg-surface-alt)] border border-[var(--border-light)] text-[var(--text-main)] active:scale-95"
          aria-label="Open menu"
        >
          <Menu size={16} />
        </button>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-8 md:pt-14 pb-12 md:pb-16 px-4 md:px-8 border-b border-[var(--border-light)] bg-gradient-to-b from-[var(--bg-surface)] to-[var(--bg-app)]">
        {/* Decorative background glow */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-[var(--accent-ice)]/30 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/4 w-80 h-80 bg-[var(--primary)]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-4xl mx-auto text-center relative z-10 space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[var(--primary-light)] text-[var(--primary)] text-xs font-800 tracking-wider uppercase border border-[var(--primary)]/20 shadow-xs">
            <Sparkles size={14} />
            <span>The Ficcado Story • Launched in 2025</span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-900 tracking-tight text-[var(--text-main)] leading-tight">
            Born From A Passion For Timeless Clothing & Honest Design.
          </h1>

          <p className="text-base md:text-lg text-[var(--text-secondary)] max-w-2xl mx-auto leading-relaxed">
            Ficcado was founded in 2025 by three close friends who refused to accept paper-thin fast fashion and overpriced synthetic apparel. We set out to build the clothing brand we always wished existed — starting with the perfect heavyweight T-shirt.
          </p>

          <div className="pt-2 flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/categories/t-shirts"
              className="btn-primary text-sm px-6 py-3 rounded-xl shadow-md font-bold hover:scale-105 transition-transform"
            >
              Explore T-Shirt Drops 🔥
            </Link>
            <Link
              href="/support"
              className="px-6 py-3 rounded-xl text-sm font-bold text-[var(--text-main)] bg-[var(--bg-surface)] border border-[var(--border-light)] hover:bg-[var(--bg-surface-alt)] transition-colors shadow-xs"
            >
              Reach Out To The Team
            </Link>
          </div>
        </div>
      </section>

      {/* The 2025 Genesis Story */}
      <section className="max-w-5xl mx-auto px-4 md:px-8 py-12 md:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-12 items-center">
          <div className="lg:col-span-6 space-y-5">
            <div className="space-y-2">
              <span className="text-xs font-800 uppercase tracking-widest text-[var(--primary)]">
                Our Genesis
              </span>
              <h2 className="text-2xl md:text-3xl font-900 text-[var(--text-main)] leading-tight">
                3 Friends. 1 Shared Obsession. Zero Shortcuts.
              </h2>
            </div>

            <p className="text-sm md:text-base text-[var(--text-secondary)] leading-relaxed">
              In late 2024 and early 2025, three friends — <strong>Ganga Lakshmi</strong>, <strong>Rohith Murali</strong>, and <strong>Sinan</strong> — found themselves repeatedly having the same conversation: why was it so hard to find heavyweight t-shirts that possessed true structural weight, rich tailored colors, and durability without a 400% designer markup?
            </p>

            <p className="text-sm md:text-base text-[var(--text-secondary)] leading-relaxed">
              We decided to stop searching and start building. We pooled our savings, visited spinning mills across the subcontinent, and spent months prototyping custom 380 GSM combed cotton and relaxed drop-shoulder patterns.
            </p>

            <p className="text-sm md:text-base text-[var(--text-secondary)] leading-relaxed">
              Ficcado was officially unveiled in <strong>2025</strong> with a singular ethos: <em>Peoples’ own brand</em> — transparent materials, limited capsule drops, and garments engineered to become the favorite piece in your wardrobe.
            </p>

            <div className="p-4 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-light)] shadow-xs space-y-2">
              <div className="flex items-center gap-2 text-xs font-800 text-[var(--primary)]">
                <CheckCircle2 size={16} />
                <span>Our Founding Commitment to Every Customer</span>
              </div>
              <p className="text-xs text-[var(--text-muted)] leading-relaxed">
                We never cut corners on yarn weight, stitch density, or ethical wages. When you wear Ficcado, you wear our personal guarantee of quality.
              </p>
            </div>
          </div>

          <div className="lg:col-span-6 relative">
            <div className="card p-6 md:p-8 bg-gradient-to-br from-[#1E293B] to-[#0F172A] text-white shadow-xl rounded-3xl relative overflow-hidden">
              <Quote className="absolute -bottom-6 -right-6 w-36 h-36 text-white/5 pointer-events-none" />
              <div className="space-y-6 relative z-10">
                <div className="w-12 h-12 rounded-2xl bg-[var(--primary)] flex items-center justify-center font-black text-lg">
                  FC
                </div>

                <p className="text-lg md:text-xl font-medium leading-relaxed italic text-gray-200">
                  “We built Ficcado because clothing shouldn’t be disposable. It should feel reassuringly heavy when you put it on, look effortless on the street, and stay just as vibrant years later.”
                </p>

                <div className="pt-4 border-t border-white/15 flex items-center justify-between text-xs">
                  <div>
                    <span className="font-800 block text-white">The Founding Trio</span>
                    <span className="text-gray-400">Ganga, Rohith & Sinan • Ficcado 2025</span>
                  </div>
                  <span className="px-3 py-1 rounded-full bg-white/10 text-[#B4D1EF] font-bold">
                    Est. 2025
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* The 3 Founders Section (Ganga Lakshmi, Rohith Murali, Sinan) */}
      <section className="bg-[var(--bg-surface)] py-14 md:py-20 border-y border-[var(--border-light)]">
        <div className="max-w-6xl mx-auto px-4 md:px-8 space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="text-xs font-800 uppercase tracking-widest text-[var(--primary)]">
              Leadership & Craft
            </span>
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-900 text-[var(--text-main)]">
              Meet The Partners Behind Ficcado
            </h2>
            <p className="text-sm md:text-base text-[var(--text-muted)]">
              Three friends combining creative flair, textile engineering, and transparent customer operations.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
            {FOUNDERS.map((founder) => (
              <div
                key={founder.name}
                className="card group flex flex-col bg-[var(--bg-surface)] border border-[var(--border-light)] hover:border-[var(--primary)]/40 transition-all duration-300 shadow-sm hover:shadow-hover rounded-3xl overflow-hidden"
              >
                {/* Image Container with aspect ratio and smooth zoom on hover */}
                <div className="relative w-full aspect-[4/5] bg-gray-100 overflow-hidden">
                  <Image
                    src={founder.image}
                    alt={founder.name}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 400px"
                    className="object-cover object-center group-hover:scale-105 transition-transform duration-500"
                    priority
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-80" />
                  <div className="absolute bottom-3 left-4 right-4 text-white">
                    <span className="text-xs font-semibold text-[#B4D1EF] block uppercase tracking-wider">
                      {founder.role}
                    </span>
                    <h3 className="text-xl font-900 leading-tight drop-shadow-sm">
                      {founder.name}
                    </h3>
                  </div>
                </div>

                {/* Content */}
                <div className="p-5 md:p-6 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-2">
                    <p className="text-xs font-bold text-[var(--primary)]">
                      {founder.designation}
                    </p>
                    <p className="text-xs md:text-sm text-[var(--text-secondary)] leading-relaxed">
                      {founder.bio}
                    </p>
                  </div>

                  {/* Highlights Tags */}
                  <div className="pt-2 border-t border-[var(--border-light)] flex flex-wrap gap-1.5">
                    {founder.highlights.map((tag) => (
                      <span
                        key={tag}
                        className="text-[11px] font-semibold px-2.5 py-1 rounded-lg bg-[var(--bg-surface-alt)] text-[var(--text-muted)] border border-[var(--border-light)]"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust & Transparency Pillars (Inspiring First Orders) */}
      <section className="max-w-6xl mx-auto px-4 md:px-8 py-14 md:py-20 space-y-12">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <span className="text-xs font-800 uppercase tracking-widest text-[var(--primary)]">
            Built For Trust
          </span>
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-900 text-[var(--text-main)]">
            Why You Can Order With Absolute Confidence
          </h2>
          <p className="text-sm text-[var(--text-muted)]">
            Every order is backed by direct founder accountability and people-first transparency.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {TRUST_METRICS.map((metric) => {
            const Icon = metric.icon;
            return (
              <div
                key={metric.title}
                className="card p-6 bg-[var(--bg-surface)] border border-[var(--border-light)] rounded-2xl space-y-3 shadow-xs hover:shadow-card transition-all"
              >
                <div className="w-12 h-12 rounded-xl bg-[var(--primary-light)] text-[var(--primary)] flex items-center justify-center font-bold">
                  <Icon size={22} />
                </div>
                <h4 className="text-base font-800 text-[var(--text-main)]">
                  {metric.title}
                </h4>
                <p className="text-xs text-[var(--text-muted)] leading-relaxed">
                  {metric.desc}
                </p>
              </div>
            );
          })}
        </div>

        {/* First Order Callout Card */}
        <div className="card p-8 md:p-10 bg-gradient-to-r from-[var(--primary)] to-[#1E40AF] text-white rounded-3xl shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center md:text-left">
            <span className="text-xs font-800 uppercase tracking-wider text-amber-300">
              Risk-Free Shopping Experience
            </span>
            <h3 className="text-xl md:text-2xl font-900">
              Ready to feel the difference of authentic 380 GSM heavyweight cotton?
            </h3>
            <p className="text-xs md:text-sm text-blue-100 max-w-xl">
              Experience our signature quality, custom knit fabrics, and relaxed unisex silhouettes. Fully covered by our 7-day hassle-free doorstep return policy.
            </p>
          </div>

          <Link
            href="/categories"
            className="shrink-0 px-7 py-3.5 rounded-xl bg-white text-[var(--primary)] font-bold text-sm shadow-md hover:bg-gray-50 transition-all hover:scale-105"
          >
            Shop Current Drops 🛍️
          </Link>
        </div>
      </section>
    </div>
  );
}
