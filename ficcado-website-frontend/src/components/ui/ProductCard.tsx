'use client';

// =============================================================================
// ProductCard — Reusable catalog grid card
// Hover zoom image, price badge, color swatches, tap-to-open modal
// =============================================================================

import { useState } from 'react';
import { useModal } from '@/context/ModalContext';
import Image from 'next/image';
import { Sparkles } from 'lucide-react';
import { RatingStars } from './RatingStars';
import { getProductMainImage, PLACEHOLDER_PRODUCT_IMAGE } from '@/lib/images';
import { isSpecialDrop } from '@/lib/specialDrops';
import type { Product } from '@/types';

interface ProductCardProps {
  product: Product;
  priority?: boolean;
}

export function ProductCard({ product, priority = false }: ProductCardProps) {
  const { openProductModal } = useModal();
  const [imageError, setImageError] = useState(false);
  const imageSrc = product.img || product.image_main || getProductMainImage(product.slug);
  const isSpecial = isSpecialDrop(product);
  const isPriority =
    priority ||
    Number(product.id) <= 8 ||
    (Boolean(product.sort_order) && Number(product.sort_order) <= 8);
  const displaySrc = imageError ? PLACEHOLDER_PRODUCT_IMAGE : (imageSrc || PLACEHOLDER_PRODUCT_IMAGE);

  const cardContent = (
    <>
      {/* Image container */}
      <div
        className="relative overflow-hidden bg-[var(--bg-surface-alt)]"
        style={{ aspectRatio: '3/4' }}
      >
        <Image
          src={displaySrc}
          alt={product.name}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          onError={() => setImageError(true)}
          priority={isPriority}
          loading={isPriority ? 'eager' : 'lazy'}
        />

        {/* Special Drop Tag or New Launch Badge */}
        {isSpecial ? (
          <div className="absolute top-2 left-2 sm:top-2.5 sm:left-2.5 z-20">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[9.5px] sm:text-[10px] font-black uppercase tracking-wider text-amber-200 bg-neutral-950/90 border border-amber-400/80 shadow-[0_0_12px_rgba(245,158,11,0.5)] backdrop-blur-md">
              <Sparkles size={11} className="text-amber-400 animate-pulse shrink-0" />
              <span>Ficcado Special Drops</span>
            </span>
          </div>
        ) : product.featured ? (
          <div className="absolute top-2.5 left-2.5 z-10">
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-800 uppercase tracking-wider text-amber-300 bg-neutral-950/85 border border-amber-400/40 backdrop-blur-md shadow-xs">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
              New Drop
            </span>
          </div>
        ) : null}

        {/* Price tag */}
        <div
          className="absolute bottom-2.5 left-2.5 rounded-full px-2.5 py-1 text-xs font-bold text-white tracking-tight"
          style={{ background: 'rgba(17,24,39,0.75)', backdropFilter: 'blur(6px)' }}
        >
          ₹{product.price.toLocaleString('en-IN')}
        </div>
      </div>

      {/* Card body */}
      <div className="px-3 py-2.5 flex-1 flex flex-col justify-between">
        <div>
          <h3
            className="line-clamp-1 text-sm font-700 leading-tight"
            style={{ color: 'var(--text-main)', fontWeight: 700 }}
          >
            {product.name}
          </h3>

          {product.rating > 0 && product.reviews > 0 && (
            <div className="mt-1 flex items-center gap-1.5">
              <RatingStars rating={product.rating} size={10} />
              <span className="text-[11px]" style={{ color: 'var(--text-muted)' }}>
                {product.rating} ({product.reviews})
              </span>
            </div>
          )}
        </div>

        {/* Color swatches */}
        <div className="mt-2 flex items-center gap-1.5">
          {product.colors.map((color) => (
            <div
              key={color}
              className="h-3.5 w-3.5 rounded-full border-2 border-white"
              style={{
                background: color,
                boxShadow: '0 0 0 1px rgba(0,0,0,0.12)',
              }}
              aria-label={`Color option: ${color}`}
            />
          ))}
        </div>
      </div>
    </>
  );

  if (isSpecial) {
    return (
      <div
        id={`product-card-${product.id}`}
        className="special-drop-card-wrapper group cursor-pointer"
        onClick={() => openProductModal(product)}
        aria-label={`View ${product.name} — ₹${product.price.toLocaleString('en-IN')} (Ficcado Special Drop)`}
      >
        {/* Animated continuous golden beam rotating around the card perimeter */}
        <div className="special-drop-beam" aria-hidden="true" />
        <div className="special-drop-inner">
          {cardContent}
        </div>
      </div>
    );
  }

  return (
    <article
      id={`product-card-${product.id}`}
      className="card group cursor-pointer"
      style={{
        borderRadius: 'var(--radius-md)',
        transition:
          'box-shadow var(--duration-base) var(--ease-out), transform var(--duration-base) var(--ease-out)',
      }}
      onClick={() => openProductModal(product)}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLElement).style.boxShadow = 'var(--shadow-hover)';
        (e.currentTarget as HTMLElement).style.transform = 'translateY(-3px)';
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLElement).style.boxShadow = 'var(--shadow-card)';
        (e.currentTarget as HTMLElement).style.transform = 'translateY(0)';
      }}
      aria-label={`View ${product.name} — ₹${product.price.toLocaleString('en-IN')}`}
    >
      {cardContent}
    </article>
  );
}

export default ProductCard;
