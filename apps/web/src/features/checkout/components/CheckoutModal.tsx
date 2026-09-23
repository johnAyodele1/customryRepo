import React, { useState } from 'react';
import { X, CheckCircle, ArrowRight, CreditCard } from 'lucide-react';
import { useCart } from '../../cart/context/CartContext';

interface CheckoutModalProps {
  onClose: () => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({ onClose }) => {
  const { items, subtotal, clearCart } = useCart();
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'PAYSTACK' | 'FLUTTERWAVE' | 'BANK_TRANSFER'>('PAYSTACK');
  const [orderNotes, setOrderNotes] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [completedOrder, setCompletedOrder] = useState<any | null>(null);

  const deliveryFee = subtotal >= 100000 ? 0 : 2500;
  const total = subtotal + deliveryFee;

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!fullName || !phone || !deliveryAddress) {
      setError('Please fill in all required customer fields.');
      return;
    }

    setLoading(true);

    try {
      const orderPayload = {
        customer: {
          fullName,
          phone,
          email: email || undefined,
          deliveryAddress,
        },
        items: items.map((i) => ({
          productId: i.productId,
          variantId: i.variantId,
          quantity: i.quantity,
          customization: i.customization,
        })),
        paymentMethod,
        orderNotes,
      };

      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderPayload),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error?.message || 'Failed to place order');
      }

      const createdOrder = data.data;

      const paymentRes = await fetch('/api/payments/intent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderId: createdOrder.id,
          provider: paymentMethod,
        }),
      });

      const paymentData = await paymentRes.json();

      setCompletedOrder({
        ...createdOrder,
        paymentIntent: paymentData.data,
      });

      clearCart();
    } catch (err: any) {
      setError(err.message || 'An error occurred while creating your order');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-[#1b1c1c]/80 backdrop-blur-md flex items-center justify-center p-4 sm:p-6">
      <div className="bg-surface text-on-surface max-w-2xl w-full rounded-3xl shadow-2xl overflow-hidden border border-outline-variant relative my-8">
        <div className="p-6 bg-[#1b1c1c] text-white flex items-center justify-between border-b border-[#303030]">
          <h2 className="font-serif text-xl font-semibold text-[#c9a96e]">
            {completedOrder ? 'Order Confirmed' : 'Bespoke Order Checkout'}
          </h2>
          <button
            onClick={onClose}
            className="p-1.5 text-gray-400 hover:text-white rounded-full transition"
          >
            <X size={20} />
          </button>
        </div>

        {completedOrder ? (
          <div className="p-8 text-center space-y-6">
            <div className="w-16 h-16 bg-[#745a27]/20 text-[#745a27] rounded-full flex items-center justify-center mx-auto border border-[#745a27]/40">
              <CheckCircle size={36} />
            </div>

            <div>
              <span className="text-xs font-semibold uppercase tracking-widest text-[#745a27] block mb-1">
                Thank You For Your Order
              </span>
              <h3 className="font-serif text-3xl font-bold text-[#1b1c1c] mb-2">
                {completedOrder.orderNumber}
              </h3>
              <p className="text-xs text-[#4d463a] max-w-md mx-auto">
                Your order has been recorded. Our concierge team will review your customization details and contact you via WhatsApp.
              </p>
            </div>

            <div className="p-6 bg-[#f6f3f2] rounded-2xl border border-outline-variant/40 text-left space-y-3 text-xs">
              <div className="flex justify-between">
                <span className="text-[#7f7668]">Client Name:</span>
                <span className="font-semibold text-[#1b1c1c]">{completedOrder.customer.fullName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#7f7668]">WhatsApp Phone:</span>
                <span className="font-semibold text-[#1b1c1c]">{completedOrder.customer.phone}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#7f7668]">Delivery Address:</span>
                <span className="font-semibold text-[#1b1c1c]">{completedOrder.customer.deliveryAddress}</span>
              </div>
              <div className="flex justify-between pt-2 border-t border-outline-variant/30 font-bold">
                <span className="text-[#1b1c1c]">Total Amount:</span>
                <span className="font-serif text-base text-[#745a27]">₦{completedOrder.total.toLocaleString()}</span>
              </div>
            </div>

            {completedOrder.paymentIntent?.authorizationUrl && (
              <a
                href={completedOrder.paymentIntent.authorizationUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 bg-[#745a27] hover:bg-[#c9a96e] text-white hover:text-[#1b1c1c] font-semibold text-xs uppercase tracking-widest px-8 py-4 rounded-full transition-all duration-300 shadow-lg"
              >
                Complete Payment via {completedOrder.paymentMethod} <ArrowRight size={16} />
              </a>
            )}

            <div>
              <button
                onClick={onClose}
                className="text-xs font-semibold uppercase tracking-widest text-[#745a27] hover:underline"
              >
                Return to Storefront
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmitOrder} className="p-6 sm:p-8 space-y-6">
            {error && (
              <div className="p-4 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl font-medium">
                {error}
              </div>
            )}

            <div className="space-y-4">
              <h3 className="text-xs font-semibold uppercase tracking-widest text-[#745a27] border-b border-[#d0c5b5] pb-2">
                1. Client Contact & Delivery Information
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-[#1b1c1c] mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. Chief Adeleke Davies"
                    className="w-full p-3 bg-white border border-[#7f7668]/40 rounded-xl text-xs focus:border-[#745a27] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-[#1b1c1c] mb-1">
                    WhatsApp / Phone Number *
                  </label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+234 800 000 0000"
                    className="w-full p-3 bg-white border border-[#7f7668]/40 rounded-xl text-xs focus:border-[#745a27] focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-[#1b1c1c] mb-1">
                  Email Address (Optional)
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="client@domain.com"
                  className="w-full p-3 bg-white border border-[#7f7668]/40 rounded-xl text-xs focus:border-[#745a27] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-[#1b1c1c] mb-1">
                  Delivery Address *
                </label>
                <textarea
                  rows={2}
                  required
                  value={deliveryAddress}
                  onChange={(e) => setDeliveryAddress(e.target.value)}
                  placeholder="Street address, city, state"
                  className="w-full p-3 bg-white border border-[#7f7668]/40 rounded-xl text-xs focus:border-[#745a27] focus:outline-none"
                />
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-xs font-semibold uppercase tracking-widest text-[#745a27] border-b border-[#d0c5b5] pb-2">
                2. Select Payment Gateway
              </h3>

              <div className="grid grid-cols-3 gap-3">
                {[
                  { id: 'PAYSTACK', label: 'Paystack' },
                  { id: 'FLUTTERWAVE', label: 'Flutterwave' },
                  { id: 'BANK_TRANSFER', label: 'Bank Transfer' },
                ].map((pm) => (
                  <button
                    key={pm.id}
                    type="button"
                    onClick={() => setPaymentMethod(pm.id as any)}
                    className={`p-3 rounded-xl border text-xs font-semibold transition flex flex-col items-center gap-1 ${
                      paymentMethod === pm.id
                        ? 'border-[#745a27] bg-[#f6f3f2] text-[#745a27]'
                        : 'border-outline-variant/40 text-gray-600 hover:border-[#745a27]'
                    }`}
                  >
                    <CreditCard size={18} />
                    <span>{pm.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="p-4 bg-[#f6f3f2] rounded-2xl border border-outline-variant/40 space-y-2 text-xs">
              <div className="flex justify-between text-[#4d463a]">
                <span>Items Subtotal:</span>
                <span className="font-serif font-semibold">₦{subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-[#4d463a]">
                <span>Delivery:</span>
                <span className="font-serif font-semibold">
                  {deliveryFee === 0 ? 'FREE' : `₦${deliveryFee.toLocaleString()}`}
                </span>
              </div>
              <div className="flex justify-between font-bold text-[#1b1c1c] pt-2 border-t border-outline-variant/30">
                <span>Total Payable:</span>
                <span className="font-serif text-base text-[#745a27]">
                  ₦{total.toLocaleString()}
                </span>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#745a27] hover:bg-[#c9a96e] disabled:bg-gray-400 text-white hover:text-[#1b1c1c] font-semibold text-xs uppercase tracking-widest py-4 rounded-full transition-all duration-300 flex items-center justify-center gap-2 shadow-lg"
            >
              {loading ? 'Processing Order...' : 'Confirm & Place Bespoke Order'} <ArrowRight size={16} />
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
