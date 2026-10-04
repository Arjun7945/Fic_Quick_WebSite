'use client';

// =============================================================================
// ProductCard — Reusable catalog grid card
// Hover zoom image, price badge, color swatches, tap-to-open modal
// =============================================================================

import { useModal } from '@/context/ModalContext';
import Image from 'next/image';
import { RatingStars } from './RatingStars';
import { getProductMainImage, PLACEHOLDER_PRODUCT_IMAGE } from '@/lib/images';
import type { Product } from '@/types';

interface ProductCardProps {
  product: Product;
  priority?: boolean;
}

export function ProductCard({ product, priority = false }: ProductCardProps) {
  const { openProductModal } = useModal();
  const imageSrc = product.img || product.image_main || getProductMainImage(product.slug);

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
      {/* Image container */}
      <div
        className="relative overflow-hidden"
        style={{ aspectRatio: '3/4', background: 'var(--bg-surface-alt)' }}
      >
        <Image
          src={imageSrc || PLACEHOLDER_PRODUCT_IMAGE}
          alt={product.name}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          priority={priority || product.id === 1}
        />

        {/* Price tag */}
        <div
          className="absolute bottom-2.5 left-2.5 rounded-full px-2.5 py-1 text-xs font-bold text-white tracking-tight"
          style={{ background: 'rgba(17,24,39,0.75)', backdropFilter: 'blur(6px)' }}
        >
          ₹{product.price.toLocaleString('en-IN')}
        </div>
      </div>

      {/* Card body */}
      <div className="px-3 py-2.5">
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
    </article>
  );
}

export default ProductCard;
