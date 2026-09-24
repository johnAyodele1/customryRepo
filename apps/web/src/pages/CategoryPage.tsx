import React, { useMemo, useState } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { ArrowLeft, SlidersHorizontal } from 'lucide-react';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';
import { ProductCard } from '../features/products/components/ProductCard';
import { ProductDetailModal } from '../features/products/components/ProductDetailModal';

const formatPrice = (value: number) => `₦${value.toLocaleString()}`;

export const CategoryPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [selectedProduct, setSelectedProduct] = useState<any | null>(null);
  const [filtersOpen, setFiltersOpen] = useState(false);

  const page = Number(searchParams.get('page') || 1);
  const minPrice = searchParams.get('minPrice') || '';
  const maxPrice = searchParams.get('maxPrice') || '';
  const sort = searchParams.get('sort') || 'newest';

  const { data: categories = [] } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const res = await fetch('/api/categories');
      const payload = await res.json();
      return payload.data || [];
    },
  });

  const category = useMemo(
    () => categories.find((item: any) => item.slug === slug),
    [categories, slug]
  );

  const categoryCode = category?.code;

  const { data: featured = [] } = useQuery({
    queryKey: ['featured-products', categoryCode],
    queryFn: async () => {
      const res = await fetch(`/api/products/featured?categoryCode=${categoryCode}&limit=4`);
      const payload = await res.json();
      if (!res.ok) throw new Error(payload.error?.message || 'Failed to load featured products');
      return payload.data || [];
    },
    enabled: Boolean(categoryCode),
  });

  const { data: catalogue, isLoading } = useQuery({
    queryKey: ['category-products', categoryCode, page, minPrice, maxPrice, sort],
    queryFn: async () => {
      const params = new URLSearchParams({
        categoryCode: categoryCode!,
        page: String(page),
        limit: '12',
        sort: sort === 'newest' ? 'newest' : sort,
      });

      if (minPrice) params.set('minPrice', minPrice);
      if (maxPrice) params.set('maxPrice', maxPrice);

      const res = await fetch(`/api/products?${params.toString()}`);
      const payload = await res.json();
      if (!res.ok) throw new Error(payload.error?.message || 'Failed to load products');
      return payload;
    },
    enabled: Boolean(categoryCode),
  });

  const openProduct = (product: any) => {
    if (window.matchMedia('(max-width: 1023px)').matches) {
      navigate(`/products/${product.slug}`);
    } else {
      setSelectedProduct(product);
    }
  };

  const updateFilters = (next: Record<string, string>) => {
    const params = new URLSearchParams(searchParams);
    params.set('page', '1');

    Object.entries(next).forEach(([key, value]) => {
      if (value) params.set(key, value);
      else params.delete(key);
    });

    setSearchParams(params);
    setFiltersOpen(false);
  };

  if (!category && categories.length > 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface">
        <div className="text-center">
          <p className="font-serif text-2xl font-semibold">Collection not found</p>
          <button onClick={() => navigate('/')} className="mt-5 text-xs uppercase tracking-wider text-[#745a27]">
            Return to atelier
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-surface text-on-surface">
      <Navbar />

      <main className="flex-1">
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 pt-10 sm:pt-14">
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] font-semibold text-[#7f7668] hover:text-[#745a27]"
          >
            <ArrowLeft size={14} /> All collections
          </button>

          <div className="mt-8 border-b border-[#d0c5b5] pb-7 flex flex-col lg:flex-row lg:items-end lg:justify-between gap-5">
            <div>
              <span className="text-[10px] font-semibold uppercase tracking-[0.3em] text-[#745a27]">
                The Collection
              </span>
              <h1 className="font-serif text-4xl sm:text-5xl font-semibold text-[#1b1c1c] mt-2">
                {category?.name || 'Collection'}
              </h1>
            </div>
            <p className="max-w-xl text-sm leading-7 text-[#5c5549]">
              {category?.description || 'A curated collection of pieces made personal.'}
            </p>
          </div>
        </section>

        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 py-10 sm:py-14">
          <div className="flex items-end justify-between mb-6">
            <div>
              <span className="text-[10px] uppercase tracking-[0.25em] text-[#745a27] font-semibold">
                Curated for you
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl font-semibold mt-1">Featured pieces</h2>
            </div>
            <span className="hidden sm:block text-[10px] uppercase tracking-wider text-[#7f7668]">
              {featured.length} of 4 featured
            </span>
          </div>

          {featured.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
              {featured.map((product: any) => (
                <ProductCard key={product._id || product.id} product={product} onSelect={openProduct} />
              ))}
            </div>
          ) : (
            <div className="rounded-3xl border border-[#d0c5b5] bg-[#f6f3f2] px-6 py-10 text-center text-sm text-[#7f7668]">
              No featured pieces in this collection yet.
            </div>
          )}
        </section>

        <section className="bg-[#f6f3f2] border-y border-[#d0c5b5]/60">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 py-8 sm:py-12">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
              <div>
                <span className="text-[10px] uppercase tracking-[0.25em] text-[#745a27] font-semibold">
                  Full catalogue
                </span>
                <h2 className="font-serif text-2xl sm:text-3xl font-semibold mt-1">Every piece in {category?.name}</h2>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <select
                  value={sort}
                  onChange={(e) => updateFilters({ sort: e.target.value })}
                  className="h-10 rounded-full border border-[#cfc5b8] bg-white px-4 text-xs text-[#3d392f] outline-none"
                  aria-label="Sort products"
                >
                  <option value="newest">Newest</option>
                  <option value="price_asc">Price: Low to High</option>
                  <option value="price_desc">Price: High to Low</option>
                  <option value="name">Name: A-Z</option>
                </select>

                <button
                  onClick={() => setFiltersOpen((value) => !value)}
                  className="h-10 rounded-full border border-[#cfc5b8] bg-white px-4 text-xs font-semibold flex items-center gap-2"
                >
                  <SlidersHorizontal size={14} /> Price filter
                </button>
              </div>
            </div>

            {filtersOpen && (
              <div className="mt-5 rounded-3xl border border-[#d0c5b5] bg-white p-5 sm:p-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
                <label className="text-xs font-semibold">
                  Minimum price
                  <input
                    inputMode="numeric"
                    value={minPrice}
                    onChange={(e) => updateFilters({ minPrice: e.target.value })}
                    placeholder="₦0"
                    className="mt-2 w-full h-11 rounded-xl border border-[#d0c5b5] px-3 text-sm outline-none focus:border-[#745a27]"
                  />
                </label>
                <label className="text-xs font-semibold">
                  Maximum price
                  <input
                    inputMode="numeric"
                    value={maxPrice}
                    onChange={(e) => updateFilters({ maxPrice: e.target.value })}
                    placeholder="No maximum"
                    className="mt-2 w-full h-11 rounded-xl border border-[#d0c5b5] px-3 text-sm outline-none focus:border-[#745a27]"
                  />
                </label>
                <div className="flex items-end">
                  <button
                    onClick={() => updateFilters({ minPrice: '', maxPrice: '' })}
                    className="h-11 w-full rounded-xl bg-[#1b1c1c] text-white text-xs font-semibold uppercase tracking-wider"
                  >
                    Clear price filter
                  </button>
                </div>
              </div>
            )}

            <div className="mt-8 flex items-center justify-between text-[10px] uppercase tracking-wider text-[#7f7668]">
              <span>{catalogue?.pagination?.total || 0} pieces</span>
              {(minPrice || maxPrice) && (
                <span>
                  {formatPrice(Number(minPrice || 0))} — {maxPrice ? formatPrice(Number(maxPrice)) : 'No limit'}
                </span>
              )}
            </div>

            {isLoading ? (
              <div className="py-20 text-center text-sm text-[#7f7668]">Curating the collection...</div>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5 mt-4">
                  {(catalogue?.data || []).map((product: any) => (
                    <ProductCard key={product.id} product={product} onSelect={openProduct} />
                  ))}
                </div>

                {(catalogue?.pagination?.totalPages || 1) > 1 && (
                  <div className="flex justify-center items-center gap-2 mt-10">
                    <button
                      disabled={page <= 1}
                      onClick={() => updateFilters({ page: String(page - 1) })}
                      className="px-4 py-2 rounded-full border border-[#cfc5b8] text-xs disabled:opacity-40"
                    >
                      Previous
                    </button>
                    <span className="px-4 text-xs font-semibold">
                      {page} / {catalogue?.pagination?.totalPages}
                    </span>
                    <button
                      disabled={page >= catalogue.pagination.totalPages}
                      onClick={() => updateFilters({ page: String(page + 1) })}
                      className="px-4 py-2 rounded-full border border-[#cfc5b8] text-xs disabled:opacity-40"
                    >
                      Next
                    </button>
                  </div>
                )}
              </>
            )}
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
            navigate('/bag');
          }}
        />
      )}
    </div>
  );
};
