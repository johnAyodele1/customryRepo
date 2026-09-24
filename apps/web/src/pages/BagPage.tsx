import React, { useState } from 'react';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';
import { CartDrawer } from '../features/cart/components/CartDrawer';
import { CheckoutModal } from '../features/checkout/components/CheckoutModal';

export const BagPage: React.FC = () => {
  const [checkoutOpen, setCheckoutOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-surface text-on-surface">
      <Navbar />

      <main className="flex-1">
        <CartDrawer
          embedded
          onCheckout={() => setCheckoutOpen(true)}
        />
      </main>

      <Footer />

      {checkoutOpen && (
        <CheckoutModal onClose={() => setCheckoutOpen(false)} />
      )}
    </div>
  );
};
