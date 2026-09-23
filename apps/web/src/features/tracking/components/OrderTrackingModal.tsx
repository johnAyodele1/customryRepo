import React, { useState } from 'react';
import { X, Search, Package, AlertCircle } from 'lucide-react';

interface OrderTrackingModalProps {
  onClose: () => void;
}

export const OrderTrackingModal: React.FC<OrderTrackingModalProps> = ({ onClose }) => {
  const [orderNumber, setOrderNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [order, setOrder] = useState<any | null>(null);

  const handleTrack = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!orderNumber.trim()) return;

    setLoading(true);
    setError(null);
    setOrder(null);

    try {
      const res = await fetch(`/api/orders/track/${orderNumber.trim()}`);
      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error?.message || 'Order reference not found');
      }

      setOrder(data.data);
    } catch (err: any) {
      setError(err.message || 'Order not found');
    } finally {
      setLoading(false);
    }
  };

  const getStatusStep = (status: string) => {
    const steps = ['PENDING_PAYMENT', 'PAID', 'CONFIRMED', 'PROCESSING', 'READY_FOR_DELIVERY', 'COMPLETED'];
    return steps.indexOf(status);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-[#1b1c1c]/80 backdrop-blur-md flex items-center justify-center p-4 sm:p-6">
      <div className="bg-surface text-on-surface max-w-xl w-full rounded-3xl shadow-2xl overflow-hidden border border-outline-variant relative my-8">
        <div className="p-6 bg-[#1b1c1c] text-white flex items-center justify-between border-b border-[#303030]">
          <div className="flex items-center gap-2">
            <Package size={20} className="text-[#c9a96e]" />
            <h2 className="font-serif text-xl font-semibold text-[#c9a96e]">Track Bespoke Order</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-gray-400 hover:text-white rounded-full transition"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-6 sm:p-8 space-y-6">
          <form onSubmit={handleTrack} className="flex gap-2">
            <input
              type="text"
              required
              value={orderNumber}
              onChange={(e) => setOrderNumber(e.target.value)}
              placeholder="Enter Order Number (e.g. CST-882194-1024)"
              className="flex-1 p-3 bg-white border border-[#7f7668]/40 rounded-xl text-xs focus:border-[#745a27] focus:outline-none font-mono"
            />
            <button
              type="submit"
              disabled={loading}
              className="bg-[#745a27] hover:bg-[#c9a96e] text-white hover:text-[#1b1c1c] font-semibold text-xs uppercase tracking-wider px-6 py-3 rounded-xl transition flex items-center gap-1.5"
            >
              <Search size={16} />
              {loading ? 'Searching...' : 'Track'}
            </button>
          </form>

          {error && (
            <div className="p-4 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl flex items-center gap-2 font-medium">
              <AlertCircle size={16} />
              <span>{error}</span>
            </div>
          )}

          {order && (
            <div className="space-y-6 border-t border-outline-variant/40 pt-6 animate-in fade-in duration-200">
              <div className="flex justify-between items-start">
                <div>
                  <span className="text-[10px] font-semibold uppercase tracking-widest text-[#7f7668]">
                    Order Reference
                  </span>
                  <h3 className="font-serif text-xl font-bold text-[#1b1c1c]">{order.orderNumber}</h3>
                </div>

                <div className="text-right">
                  <span
                    className={`inline-block px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                      order.status === 'COMPLETED'
                        ? 'bg-green-100 text-green-800'
                        : order.status === 'PAID'
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    {order.status.replace(/_/g, ' ')}
                  </span>
                  <span className="block text-[10px] text-[#7f7668] mt-1">
                    Payment: {order.paymentStatus}
                  </span>
                </div>
              </div>

              <div className="p-4 bg-[#f6f3f2] rounded-2xl border border-outline-variant/40 space-y-3">
                <span className="text-[10px] font-semibold uppercase tracking-widest text-[#745a27]">
                  Atelier Status Progress
                </span>
                <div className="grid grid-cols-4 gap-2 text-center text-[10px] font-semibold">
                  {[
                    { label: 'Received', step: 0 },
                    { label: 'Paid', step: 1 },
                    { label: 'Crafting', step: 3 },
                    { label: 'Delivered', step: 5 },
                  ].map((st) => {
                    const currentStep = getStatusStep(order.status);
                    const isActive = currentStep >= st.step;
                    return (
                      <div
                        key={st.label}
                        className={`p-2 rounded-xl transition ${
                          isActive
                            ? 'bg-[#745a27] text-white'
                            : 'bg-white text-gray-400 border border-outline-variant/30'
                        }`}
                      >
                        {st.label}
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="space-y-3">
                <span className="text-xs font-semibold uppercase tracking-widest text-[#1b1c1c]">
                  Order Items ({order.items.length})
                </span>
                {order.items.map((item: any, idx: number) => (
                  <div
                    key={idx}
                    className="flex justify-between items-center p-3 bg-white rounded-xl border border-outline-variant/30 text-xs"
                  >
                    <div>
                      <span className="font-serif font-semibold text-[#1b1c1c]">
                        {item.quantity}x {item.productName}
                      </span>
                      {item.variantName && (
                        <span className="block text-[10px] text-[#745a27] font-semibold">
                          {item.variantName}
                        </span>
                      )}
                    </div>
                    <span className="font-serif font-bold text-[#745a27]">
                      ₦{item.totalPrice.toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>

              <div className="p-4 bg-white rounded-xl border border-outline-variant/30 text-xs space-y-1.5 text-[#4d463a]">
                <div><span className="font-semibold text-[#1b1c1c]">Client:</span> {order.customer.fullName} ({order.customer.phone})</div>
                <div><span className="font-semibold text-[#1b1c1c]">Address:</span> {order.customer.deliveryAddress}</div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
