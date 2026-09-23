import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
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

  const { data: products = [] } = useQuery({
    queryKey: ['products'],
    queryFn: async () => {
      const res = await fetch('/api/products?limit=100');
      const data = await res.json();
      return data.data || [];
    },
  });

  return (
    <div className="min-h-screen flex flex-col bg-surface text-on-surface">
      <Navbar
        onOpenTracking={() => setTrackingOpen(true)}
        onOpenAdmin={onOpenAdmin}
      />

      <main className="flex-1">
        <Hero />

        <section className="max-w-container mx-auto px-6 lg:px-16 py-16 space-y-24" id="catalogue">
          {categories.map((cat: any) => {
            const categoryProducts = products.filter(
              (p: any) => p.categoryCode === cat.code
            );

            return (
              <div key={cat.code} id={cat.slug} className="scroll-mt-24 space-y-8">
                <div className="flex flex-col sm:flex-row sm:items-end justify-between border-b border-[#d0c5b5] pb-4 gap-2">
                  <div>
                    <span className="text-[10px] font-semibold uppercase tracking-[0.25em] text-[#745a27]">
                      Category Collection
                    </span>
                    <h2 className="font-serif text-3xl font-semibold text-[#1b1c1c]">
                      {cat.name}
                    </h2>
                  </div>
                  <p className="text-xs text-[#4d463a] max-w-md font-sans">
                    {cat.description}
                  </p>
                </div>

                {categoryProducts.length === 0 ? (
                  <div className="p-8 text-center bg-surface-container-low rounded-2xl border border-outline-variant/30 text-xs text-[#7f7668]">
                    No products currently published in this collection.
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {categoryProducts.map((product: any) => (
                      <ProductCard
                        key={product.id}
                        product={product}
                        onSelect={(p) => setSelectedProduct(p)}
                      />
                    ))}
                  </div>
                )}
              </div>
            );
          })}
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
