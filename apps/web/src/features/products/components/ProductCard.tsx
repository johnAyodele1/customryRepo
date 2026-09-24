import React from 'react';
import { Sparkles, Eye } from 'lucide-react';

export interface ProductCardProps {
  product: {
    id?: string;
    _id?: string;
    name: string;
    slug: string;
    categoryCode: string;
    basePrice: number;
    currency: string;
    images: string[];
    stock: number;
    customizationFields?: any[];
  };
  onSelect: (product: any) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onSelect }) => {
  const isOutOfStock = product.stock <= 0;
  const isLowStock = product.stock > 0 && product.stock <= 5;
  const hasCustomization = product.customizationFields && product.customizationFields.length > 0;

  return (
    <div
      onClick={() => onSelect(product)}
      className="group bg-surface-container-low border border-outline-variant/30 rounded-2xl overflow-hidden hover:border-[#c9a96e] transition-all duration-300 hover:shadow-xl cursor-pointer flex flex-col h-full"
    >
      <div className="relative aspect-square overflow-hidden bg-surface-container">
        <img
          src={product.images[0] || 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&q=80&w=800'}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />

        <div className="absolute top-3 left-3 flex flex-col gap-1.5">
          {hasCustomization && (
            <span className="bg-[#1b1c1c]/80 backdrop-blur-md text-[#c9a96e] text-[10px] font-semibold tracking-wider uppercase px-2.5 py-1 rounded-full flex items-center gap-1 border border-[#745a27]/50">
              <Sparkles size={10} /> Bespoke Custom
            </span>
          )}
          {isOutOfStock && (
            <span className="bg-red-900/80 text-white text-[10px] font-semibold uppercase px-2.5 py-1 rounded-full">
              Out of Stock
            </span>
          )}
          {isLowStock && (
            <span className="bg-[#745a27] text-white text-[10px] font-semibold uppercase px-2.5 py-1 rounded-full">
              Low Stock ({product.stock})
            </span>
          )}
        </div>

        <div className="absolute inset-0 bg-[#1b1c1c]/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
          <span className="bg-[#745a27] text-white text-xs font-semibold uppercase tracking-widest px-5 py-2.5 rounded-full flex items-center gap-2 shadow-lg">
            <Eye size={14} /> Customize & Order
          </span>
        </div>
      </div>

      <div className="p-5 flex flex-col justify-between flex-1">
        <div>
          <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#7f7668] block mb-1">
            {product.categoryCode.replace('_', ' ')}
          </span>
          <h3 className="font-serif text-lg font-semibold text-[#1b1c1c] group-hover:text-[#745a27] transition-colors leading-snug mb-2">
            {product.name}
          </h3>
        </div>

        <div className="pt-3 border-t border-outline-variant/30 flex items-center justify-between mt-auto">
          <span className="text-xs font-medium text-[#4d463a]">Starting from</span>
          <span className="font-serif text-lg font-bold text-[#745a27]">
            ₦{product.basePrice.toLocaleString()}
          </span>
        </div>
      </div>
    </div>
  );
};
