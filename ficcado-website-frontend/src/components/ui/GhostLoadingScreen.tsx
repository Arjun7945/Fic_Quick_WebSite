'use client';

// =============================================================================
// GhostLoadingScreen — Skeleton Content Shimmer for All Screens
// Responsive across Mobile, Tablet, and Desktop displays.
// =============================================================================

interface GhostLoadingProps {
  type?: 'catalog' | 'orders' | 'detail' | 'full';
}

export function GhostLoadingScreen({ type = 'full' }: GhostLoadingProps) {
  return (
    <div
      role="status"
      aria-label="Loading content..."
      className="w-full min-h-[60vh] p-4 md:p-6 lg:p-8 animate-fade-in space-y-6"
    >
      {/* Top Banner Skeleton */}
      <div className="w-full h-32 md:h-48 lg:h-56 rounded-2xl skeleton" />

      {/* Filter / Nav Pills Skeleton */}
      <div className="flex items-center gap-3 overflow-x-hidden py-1">
        <div className="w-20 h-9 rounded-full skeleton shrink-0" />
        <div className="w-28 h-9 rounded-full skeleton shrink-0" />
        <div className="w-24 h-9 rounded-full skeleton shrink-0" />
        <div className="w-32 h-9 rounded-full skeleton shrink-0" />
      </div>

      {type === 'orders' ? (
        /* Orders List Skeleton */
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="card p-4 space-y-3">
              <div className="flex justify-between items-center">
                <div className="w-32 h-4 rounded skeleton" />
                <div className="w-20 h-5 rounded-full skeleton" />
              </div>
              <div className="flex gap-3">
                <div className="w-16 h-16 rounded-xl skeleton shrink-0" />
                <div className="flex-1 space-y-2">
                  <div className="w-3/4 h-4 rounded skeleton" />
                  <div className="w-1/2 h-3 rounded skeleton" />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Responsive Product Grid Skeleton (1 col mobile, 2 col tablet, 3-4 col desktop) */
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div
              key={i}
              className="card p-3 space-y-3 flex flex-col"
              style={{ borderRadius: 'var(--radius-md)' }}
            >
              {/* Product Image Placeholder */}
              <div className="w-full aspect-square rounded-xl skeleton" />

              {/* Meta & Rating */}
              <div className="flex items-center justify-between pt-1">
                <div className="w-20 h-3 rounded skeleton" />
                <div className="w-12 h-3 rounded skeleton" />
              </div>

              {/* Title */}
              <div className="w-4/5 h-4 rounded skeleton" />

              {/* Price & Action */}
              <div className="flex items-center justify-between pt-2 mt-auto">
                <div className="w-16 h-5 rounded skeleton" />
                <div className="w-8 h-8 rounded-full skeleton" />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
