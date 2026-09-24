import React from 'react';
import { X, Trash2, ArrowRight, ShoppingBag } from 'lucide-react';
import { useCart } from '../context/CartContext';

interface CartDrawerProps {
  onCheckout: () => void;
  embedded?: boolean;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({ onCheckout, embedded = false }) => {
  const { items, isCartOpen, closeCart, removeItem, updateQuantity, subtotal } = useCart();

  if (!isCartOpen && !embedded) return null;

  const deliveryFee = subtotal >= 100000 ? 0 : 2500;
  const total = subtotal + deliveryFee;

  return (
    <div className={embedded
      ? 'min-h-[calc(100vh-5rem)] bg-[#f6f3f2] py-6 sm:py-10'
      : 'fixed inset-0 z-50 overflow-hidden bg-[#1b1c1c]/70 backdrop-blur-sm flex justify-end'}>
      <div className={embedded
        ? 'max-w-4xl mx-auto w-full bg-surface min-h-[calc(100vh-8rem)] shadow-sm sm:rounded-3xl overflow-hidden border border-outline-variant/40 flex flex-col justify-between'
        : 'w-full max-w-md bg-surface h-full shadow-2xl flex flex-col justify-between border-l border-outline-variant animate-in slide-in-from-right duration-300'}>
        <div className="p-6 border-b border-outline-variant/40 flex items-center justify-between bg-[#1b1c1c] text-white">
          <div className="flex items-center gap-2">
            <ShoppingBag size={20} className="text-[#c9a96e]" />
            <h2 className="font-serif text-xl font-semibold">Your Bespoke Bag</h2>
          </div>
          {!embedded && (
            <button
              onClick={closeCart}
              className="p-1.5 text-gray-400 hover:text-white rounded-full transition"
            >
              <X size={20} />
            </button>
          )}
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {items.length === 0 ? (
            <div className="text-center py-16 text-[#7f7668]">
              <ShoppingBag size={48} className="mx-auto mb-4 opacity-40 text-[#745a27]" />
              <p className="font-serif text-lg font-medium text-[#1b1c1c]">Your bag is empty</p>
              <p className="text-xs text-[#7f7668] mt-1">Explore our bespoke catalogue to add custom pieces.</p>
            </div>
          ) : (
            items.map((item, idx) => (
              <div
                key={idx}
                className="flex gap-4 p-4 rounded-2xl bg-[#f6f3f2] border border-outline-variant/30 relative"
              >
                <img
                  src={
                    item.imageUrl ||
                    'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&q=80&w=800'
                  }
                  alt={item.productName}
                  className="w-20 h-20 object-cover rounded-xl bg-surface-container"
                />

                <div className="flex-1 flex flex-col justify-between pr-6">
                  <div>
                    <h4 className="font-serif text-sm font-semibold text-[#1b1c1c]">
                      {item.productName}
                    </h4>
                    {item.variantName && (
                      <span className="text-[10px] text-[#745a27] font-semibold block">
                        Option: {item.variantName}
                      </span>
                    )}

                    {item.customization && Object.keys(item.customization).length > 0 && (
                      <div className="mt-1 text-[10px] text-[#4d463a] bg-white/70 p-1.5 rounded-lg border border-[#d0c5b5]/50 space-y-0.5">
                        {Object.entries(item.customization).map(([k, v]) => (
                          <div key={k}>
                            <span className="font-medium text-[#745a27] capitalize">{k.replace('_', ' ')}:</span>{' '}
                            {v}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="flex items-center justify-between mt-2">
                    <div className="flex items-center border border-outline-variant rounded-lg overflow-hidden bg-white">
                      <button
                        onClick={() => updateQuantity(idx, item.quantity - 1)}
                        className="px-2 py-0.5 text-xs font-bold hover:bg-gray-100"
                      >
                        -
                      </button>
                      <span className="px-2 py-0.5 text-xs font-medium">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(idx, item.quantity + 1)}
                        className="px-2 py-0.5 text-xs font-bold hover:bg-gray-100"
                      >
                        +
                      </button>
                    </div>

                    <span className="font-serif text-sm font-bold text-[#745a27]">
                      ₦{(item.unitPrice * item.quantity).toLocaleString()}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => removeItem(idx)}
                  className="absolute top-3 right-3 text-gray-400 hover:text-red-600 transition"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))
          )}
        </div>

        {items.length > 0 && (
          <div className="p-6 bg-white border-t border-outline-variant/40 space-y-4">
            <div className="space-y-2 text-xs">
              <div className="flex justify-between text-[#4d463a]">
                <span>Subtotal</span>
                <span className="font-serif font-semibold">₦{subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-[#4d463a]">
                <span>Estimated Delivery</span>
                <span className="font-serif font-semibold">
                  {deliveryFee === 0 ? 'FREE' : `₦${deliveryFee.toLocaleString()}`}
                </span>
              </div>
              <div className="flex justify-between text-sm font-bold text-[#1b1c1c] pt-2 border-t border-outline-variant/30">
                <span>Total</span>
                <span className="font-serif text-lg text-[#745a27]">
                  ₦{total.toLocaleString()}
                </span>
              </div>
            </div>

            <button
              onClick={() => {
                closeCart();
                onCheckout();
              }}
              className="w-full bg-[#745a27] hover:bg-[#c9a96e] text-white hover:text-[#1b1c1c] font-semibold text-xs uppercase tracking-widest py-4 rounded-full transition-all duration-300 flex items-center justify-center gap-2 shadow-lg"
            >
              Proceed to Bespoke Checkout <ArrowRight size={16} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
