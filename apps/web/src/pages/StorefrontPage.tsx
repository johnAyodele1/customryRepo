import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { Navbar } from '../components/layout/Navbar';
import { Hero } from '../components/layout/Hero';
import { Footer } from '../components/layout/Footer';
import { ProductCard } from '../features/products/components/ProductCard';
import { ProductDetailModal } from '../features/products/components/ProductDetailModal';
import { CartDrawer } from '../features/cart/components/CartDrawer';
import { CheckoutModal } from '../features/checkout/components/CheckoutModal';
import { OrderTrackingModal } from '../features/tracking/components/OrderTrackingModal';

interface StorefrontPageProps {
  onOpenAdmin: () => void;
}

export const StorefrontPage: React.FC<StorefrontPageProps> = ({ onOpenAdmin }) => {
  const navigate = useNavigate();
  const [selectedProduct, setSelectedProduct] = useState<any | null>(null);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [trackingOpen, setTrackingOpen] = useState(false);

  const { data: categories = [] } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const res = await fetch('/api/categories');
      const data = await res.json();
      return data.data || [];
    },
  });

  const { data: featuredByCategory = {} } = useQuery({
    queryKey: ['homepage-featured', categories.map((cat: any) => cat.code).join(',')],
    enabled: categories.length > 0,
    queryFn: async () => {
      const entries = await Promise.all(
        categories.map(async (category: any) => {
          const res = await fetch(
            `/api/products/featured?categoryCode=${category.code}&limit=4`
          );
          const data = await res.json();
          return [category.code, data.data || []] as const;
        })
      );

      return Object.fromEntries(entries);
    },
  });

  const openProduct = (product: any) => {
    if (window.matchMedia('(max-width: 1023px)').matches) {
      navigate(`/products/${product.slug}`);
    } else {
      setSelectedProduct(product);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-surface text-on-surface">
      <Navbar
        onOpenTracking={() => setTrackingOpen(true)}
        onOpenAdmin={onOpenAdmin}
      />

      <main className="flex-1">
        <Hero />

        <section
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 py-16 sm:py-20"
          id="catalogue"
        >
          <div className="max-w-2xl mb-12">
            <span className="text-[10px] font-semibold uppercase tracking-[0.3em] text-[#745a27]">
              The Customry Catalogue
            </span>
            <h2 className="font-serif text-4xl sm:text-5xl font-semibold text-[#1b1c1c] mt-2">
              Collections, not clutter.
            </h2>
            <p className="mt-4 text-sm leading-7 text-[#5c5549]">
              Explore each collection independently. Featured pieces are curated by the atelier,
              while the full catalogue lives inside its own category experience.
            </p>
          </div>

          <div className="space-y-20">
            {categories.map((category: any) => {
              const featured = featuredByCategory[category.code] || [];

              return (
                <section key={category.code} className="scroll-mt-24">
                  <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-[#d0c5b5] pb-5">
                    <div>
                      <span className="text-[10px] font-semibold uppercase tracking-[0.25em] text-[#745a27]">
                        Collection
                      </span>
                      <h3 className="font-serif text-3xl font-semibold text-[#1b1c1c] mt-1">
                        {category.name}
                      </h3>
                    </div>

                    <button
                      onClick={() => navigate(`/categories/${category.slug}`)}
                      className="self-start sm:self-auto text-[10px] font-semibold uppercase tracking-[0.2em] text-[#745a27] hover:text-[#1b1c1c] transition"
                    >
                      View entire collection →
                    </button>
                  </div>

                  <p className="max-w-2xl text-xs leading-6 text-[#6c6458] mt-4 mb-6">
                    {category.description}
                  </p>

                  {featured.length > 0 ? (
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5">
                      {featured.map((product: any) => (
                        <ProductCard
                          key={product.id}
                          product={product}
                          onSelect={openProduct}
                        />
                      ))}
                    </div>
                  ) : (
                    <div className="rounded-3xl border border-[#d0c5b5] bg-[#f6f3f2] px-6 py-10 text-center text-xs text-[#7f7668]">
                      The atelier is preparing featured pieces for this collection.
                    </div>
                  )}
                </section>
              );
            })}
          </div>
        </section>
      </main>

      <Footer />

      {selectedProduct && (
        <ProductDetailModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
          onOpenCheckout={() => {
            setSelectedProduct(null);
            setCheckoutOpen(true);
          }}
        />
      )}

      <CartDrawer onCheckout={() => setCheckoutOpen(true)} />

      {checkoutOpen && (
        <CheckoutModal onClose={() => setCheckoutOpen(false)} />
      )}

      {trackingOpen && (
        <OrderTrackingModal onClose={() => setTrackingOpen(false)} />
      )}
    </div>
  );
};
