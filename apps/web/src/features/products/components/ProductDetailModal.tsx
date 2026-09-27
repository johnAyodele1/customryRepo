import React, { useState, useEffect } from 'react';
import { X, Sparkles, ShoppingBag, ShieldCheck } from 'lucide-react';
import { useCart } from '../../cart/context/CartContext';

interface ProductDetailModalProps {
  product: any;
  onClose: () => void;
  onOpenCheckout: () => void;
  mode?: 'modal' | 'page';
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  onClose,
  onOpenCheckout,
  mode = 'modal',
}) => {
  const { addItem } = useCart();
  const [selectedVariantId, setSelectedVariantId] = useState<string | undefined>(
    product.variants?.[0]?.id
  );
  const [quantity, setQuantity] = useState(product.minQuantity || 1);
  const [customizationValues, setCustomizationValues] = useState<Record<string, string>>({});
  const [validationError, setValidationError] = useState<string | null>(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [touchStartX, setTouchStartX] = useState<number | null>(null);
  const [touchCurrentX, setTouchCurrentX] = useState<number | null>(null);

  useEffect(() => {
    if (product.customizationFields) {
      const initial: Record<string, string> = {};
      product.customizationFields.forEach((field: any) => {
        if (field.defaultValue) {
          initial[field.key] = field.defaultValue;
        }
      });
      setCustomizationValues(initial);
    }
  }, [product]);

  const selectedVariant = product.variants?.find((v: any) => v.id === selectedVariantId);
  const productImages = Array.isArray(product.images) ? product.images.filter(Boolean) : [];
  const variantImages = Array.isArray(selectedVariant?.images)
    ? selectedVariant.images.filter(Boolean)
    : [];
  const galleryImages = variantImages.length > 0 ? variantImages : productImages;
  const currentImageIndex = Math.min(selectedImageIndex, Math.max(galleryImages.length - 1, 0));
  const currentImage =
    galleryImages[currentImageIndex] ||
    'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&q=80&w=800';
  const currentPrice = selectedVariant?.price ?? product.basePrice;
  const currentStock = selectedVariant?.stock ?? product.stock;
  const isOutOfStock = currentStock <= 0;

  useEffect(() => {
    setSelectedImageIndex(0);
    setTouchStartX(null);
    setTouchCurrentX(null);
  }, [product, selectedVariantId]);

  const goToImage = (index: number) => {
    if (galleryImages.length === 0) return;
    setSelectedImageIndex(Math.max(0, Math.min(index, galleryImages.length - 1)));
  };

  const goToNextImage = () => {
    if (galleryImages.length < 2) return;
    setSelectedImageIndex((index) => (index + 1) % galleryImages.length);
  };

  const goToPreviousImage = () => {
    if (galleryImages.length < 2) return;
    setSelectedImageIndex(
      (index) => (index - 1 + galleryImages.length) % galleryImages.length
    );
  };

  const handleTouchStart = (event: React.TouchEvent<HTMLDivElement>) => {
    setTouchStartX(event.touches[0]?.clientX ?? null);
    setTouchCurrentX(event.touches[0]?.clientX ?? null);
  };

  const handleTouchMove = (event: React.TouchEvent<HTMLDivElement>) => {
    if (touchStartX === null) return;
    setTouchCurrentX(event.touches[0]?.clientX ?? null);
  };

  const handleTouchEnd = () => {
    if (touchStartX === null || touchCurrentX === null) {
      setTouchStartX(null);
      setTouchCurrentX(null);
      return;
    }

    const swipeDistance = touchStartX - touchCurrentX;
    const minimumSwipeDistance = 40;

    if (Math.abs(swipeDistance) >= minimumSwipeDistance) {
      if (swipeDistance > 0) {
        goToNextImage();
      } else {
        goToPreviousImage();
      }
    }

    setTouchStartX(null);
    setTouchCurrentX(null);
  };

  const handleCustomizationChange = (key: string, value: string) => {
    setCustomizationValues((prev) => ({ ...prev, [key]: value }));
    setValidationError(null);
  };

  const handleAddToCart = (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);

    if (product.customizationFields) {
      for (const field of product.customizationFields) {
        const val = customizationValues[field.key];
        if (field.required && (!val || val.trim() === '')) {
          setValidationError(`Please fill out required customization: ${field.label}`);
          return;
        }
        if (val && field.maxLength && val.length > field.maxLength) {
          setValidationError(
            `${field.label} cannot exceed ${field.maxLength} characters`
          );
          return;
        }
      }
    }

    addItem({
      productId: product._id || product.id,
      variantId: selectedVariantId,
      productName: product.name,
      variantName: selectedVariant?.name,
      unitPrice: currentPrice,
      quantity,
      customization: customizationValues,
      imageUrl: product.images[0],
    });

    onClose();
  };

  return (
    <div className={mode === 'modal'
      ? 'fixed inset-0 z-50 overflow-y-auto bg-[#1b1c1c]/80 backdrop-blur-md flex items-center justify-center p-4 sm:p-6'
      : 'min-h-[calc(100vh-5rem)] bg-surface text-on-surface py-6 sm:py-10'}>
      <div className={mode === 'modal'
        ? 'bg-surface text-on-surface max-w-4xl w-full rounded-3xl shadow-2xl overflow-hidden border border-outline-variant relative animate-in fade-in zoom-in-95 duration-200 my-8'
        : 'bg-surface text-on-surface max-w-6xl mx-auto w-full overflow-hidden relative px-4 sm:px-6 lg:px-10'}>
        <button
          onClick={onClose}
          className="absolute top-3 right-3 z-20 p-2 bg-[#1b1c1c]/80 hover:bg-[#1b1c1c] text-white rounded-full transition"
          aria-label={mode === 'modal' ? 'Close product' : 'Back'}
        >
          <X size={20} />
        </button>

        <div className={mode === 'modal' ? 'grid grid-cols-1 md:grid-cols-2 max-h-[85vh] overflow-y-auto' : 'grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-14'}>
          <div
            className="bg-surface-container p-4 sm:p-6 flex flex-col items-center justify-center relative"
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            <div className="relative w-full">
              <img
                src={currentImage}
                alt={`${product.name} - image ${currentImageIndex + 1} of ${Math.max(galleryImages.length, 1)}`}
                className="w-full h-full max-h-[620px] object-cover rounded-2xl shadow-md select-none touch-pan-y"
                draggable={false}
              />

              {galleryImages.length > 1 && (
                <>
                  <button
                    type="button"
                    onClick={goToPreviousImage}
                    className="absolute left-3 top-1/2 -translate-y-1/2 h-9 w-9 rounded-full bg-[#1b1c1c]/65 text-white flex items-center justify-center hover:bg-[#1b1c1c]/85 transition"
                    aria-label="Previous image"
                  >
                    ‹
                  </button>
                  <button
                    type="button"
                    onClick={goToNextImage}
                    className="absolute right-3 top-1/2 -translate-y-1/2 h-9 w-9 rounded-full bg-[#1b1c1c]/65 text-white flex items-center justify-center hover:bg-[#1b1c1c]/85 transition"
                    aria-label="Next image"
                  >
                    ›
                  </button>

                  <span className="absolute top-3 right-3 rounded-full bg-[#1b1c1c]/70 px-2.5 py-1 text-[10px] font-semibold text-white">
                    {currentImageIndex + 1} / {galleryImages.length}
                  </span>
                </>
              )}
            </div>

            {galleryImages.length > 1 && (
              <div className="flex items-center justify-center gap-1.5 pt-4" aria-label="Product images">
                {galleryImages.map((image: string, index: number) => (
                  <button
                    key={`${image}-${index}`}
                    type="button"
                    onClick={() => goToImage(index)}
                    className={`h-2 rounded-full transition-all duration-200 ${
                      index === currentImageIndex
                        ? 'w-5 bg-[#745a27]'
                        : 'w-2 bg-[#b8aea0] hover:bg-[#745a27]/60'
                    }`}
                    aria-label={`Go to image ${index + 1}`}
                    aria-current={index === currentImageIndex ? 'true' : undefined}
                  />
                ))}
              </div>
            )}
          </div>

          <div className="p-2 sm:p-4 lg:p-8 flex flex-col justify-between space-y-6">
            <div>
              <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#745a27] mb-2 block">
                {product.categoryCode.replace('_', ' ')}
              </span>
              <h2 className="font-serif text-2xl lg:text-3xl font-semibold text-[#1b1c1c] mb-2">
                {product.name}
              </h2>
              <div className="flex items-center gap-3 mb-4">
                <span className="font-serif text-2xl font-bold text-[#745a27]">
                  ₦{currentPrice.toLocaleString()}
                </span>
                <span className="text-xs text-[#7f7668]">Inclusive of all custom taxes</span>
              </div>
              <p className="text-xs text-[#4d463a] leading-relaxed mb-6">
                {product.description}
              </p>

              {product.variants && product.variants.length > 0 && (
                <div className="mb-6">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#1b1c1c] mb-2">
                    Select Option / Variant:
                  </label>
                  <div className="grid grid-cols-1 gap-2">
                    {product.variants.map((variant: any) => (
                      <button
                        key={variant.id}
                        type="button"
                        onClick={() => setSelectedVariantId(variant.id)}
                        className={`p-3 rounded-xl border text-xs text-left transition flex justify-between items-center ${
                          selectedVariantId === variant.id
                            ? 'border-[#745a27] bg-[#f6f3f2] font-semibold text-[#745a27]'
                            : 'border-outline-variant/50 hover:border-[#745a27]'
                        }`}
                      >
                        <span>{variant.name}</span>
                        <span className="font-serif font-semibold">
                          ₦{(variant.price ?? product.basePrice).toLocaleString()}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {product.customizationFields && product.customizationFields.length > 0 && (
                <div className="p-4 rounded-2xl bg-[#f6f3f2] border border-[#d0c5b5] space-y-4 mb-6">
                  <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-[#745a27]">
                    <Sparkles size={16} /> Customization Options
                  </div>

                  {product.customizationFields.map((field: any) => (
                    <div key={field.key} className="space-y-1.5">
                      <label className="block text-xs font-medium text-[#1b1c1c]">
                        {field.label}{' '}
                        {field.required ? (
                          <span className="text-red-600">*</span>
                        ) : (
                          <span className="text-[#7f7668] text-[10px]">(Optional)</span>
                        )}
                      </label>

                      {field.type === 'TEXT' && (
                        <div>
                          <input
                            type="text"
                            maxLength={field.maxLength}
                            value={customizationValues[field.key] || ''}
                            onChange={(e) =>
                              handleCustomizationChange(field.key, e.target.value)
                            }
                            placeholder={`Enter text (max ${field.maxLength || 30} chars)`}
                            className="w-full p-2.5 bg-white border border-[#7f7668]/40 rounded-xl text-xs focus:border-[#745a27] focus:outline-none"
                          />
                          {field.maxLength && (
                            <span className="text-[10px] text-[#7f7668] float-right mt-1">
                              {(customizationValues[field.key] || '').length}/{field.maxLength}
                            </span>
                          )}
                        </div>
                      )}

                      {field.type === 'TEXTAREA' && (
                        <textarea
                          rows={3}
                          maxLength={field.maxLength}
                          value={customizationValues[field.key] || ''}
                          onChange={(e) =>
                            handleCustomizationChange(field.key, e.target.value)
                          }
                          placeholder="Enter message"
                          className="w-full p-2.5 bg-white border border-[#7f7668]/40 rounded-xl text-xs focus:border-[#745a27] focus:outline-none"
                        />
                      )}

                      {field.type === 'SELECT' && (
                        <select
                          value={customizationValues[field.key] || ''}
                          onChange={(e) =>
                            handleCustomizationChange(field.key, e.target.value)
                          }
                          className="w-full p-2.5 bg-white border border-[#7f7668]/40 rounded-xl text-xs focus:border-[#745a27] focus:outline-none"
                        >
                          {field.options?.map((opt: string) => (
                            <option key={opt} value={opt}>
                              {opt}
                            </option>
                          ))}
                        </select>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {validationError && (
                <div className="p-3 bg-red-50 text-red-700 text-xs rounded-xl mb-4 border border-red-200 font-medium">
                  {validationError}
                </div>
              )}

              <div className="flex items-center gap-4 mb-6">
                <span className="text-xs font-semibold uppercase text-[#1b1c1c]">Quantity:</span>
                <div className="flex items-center border border-outline-variant rounded-xl overflow-hidden bg-white">
                  <button
                    type="button"
                    onClick={() => setQuantity((q: number) => Math.max(product.minQuantity || 1, q - 1))}
                    className="px-3 py-1.5 text-sm font-bold text-[#1b1c1c] hover:bg-gray-100"
                  >
                    -
                  </button>
                  <span className="px-4 py-1.5 text-xs font-semibold text-[#1b1c1c]">
                    {quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => setQuantity((q: number) => Math.min(product.maxQuantity || 50, q + 1))}
                    className="px-3 py-1.5 text-sm font-bold text-[#1b1c1c] hover:bg-gray-100"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>

            <div className="space-y-3 pt-4 border-t border-outline-variant/30">
              <button
                type="button"
                disabled={isOutOfStock}
                onClick={handleAddToCart}
                className="w-full bg-[#745a27] hover:bg-[#c9a96e] disabled:bg-gray-400 text-white hover:text-[#1b1c1c] font-semibold text-xs uppercase tracking-widest py-4 rounded-full transition-all duration-300 flex items-center justify-center gap-2 shadow-lg"
              >
                <ShoppingBag size={18} /> Add to Bespoke Bag
              </button>
              <div className="flex items-center justify-center gap-2 text-[10px] text-[#7f7668]">
                <ShieldCheck size={14} className="text-[#745a27]" /> Authenticity & Craftsmanship Guaranteed
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
