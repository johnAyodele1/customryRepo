import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';
import { ProductDetailModal } from '../features/products/components/ProductDetailModal';

export const ProductPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();

  const { data: product, isLoading, isError } = useQuery({
    queryKey: ['product', slug],
    queryFn: async () => {
      const res = await fetch(`/api/products/slug/${encodeURIComponent(slug || '')}`);
      const payload = await res.json();
      if (!res.ok) throw new Error(payload.error?.message || 'Product not found');
      return payload.data;
    },
    enabled: Boolean(slug),
  });

  return (
    <div className="min-h-screen flex flex-col bg-surface text-on-surface">
      <Navbar />

      <main className="flex-1">
        {isLoading && (
          <div className="max-w-6xl mx-auto px-4 py-24 text-center text-sm text-[#7f7668]">
            Loading your bespoke piece...
          </div>
        )}

        {(isError || !product) && !isLoading && (
          <div className="max-w-6xl mx-auto px-4 py-24 text-center">
            <p className="font-serif text-2xl font-semibold text-[#1b1c1c]">Product unavailable</p>
            <p className="text-sm text-[#7f7668] mt-2">This piece may have been removed or is no longer published.</p>
            <button
              onClick={() => navigate(-1)}
              className="mt-6 px-5 py-2.5 rounded-full bg-[#745a27] text-white text-xs font-semibold uppercase tracking-wider"
            >
              Go Back
            </button>
          </div>
        )}

        {product && (
          <ProductDetailModal
            product={product}
            mode="page"
            onClose={() => navigate(-1)}
            onOpenCheckout={() => navigate('/bag')}
          />
        )}
      </main>

      <Footer />
    </div>
  );
};
