import React, { createContext, useContext, useState, useEffect } from 'react';

export interface CartItemState {
  productId: string;
  variantId?: string;
  productName: string;
  variantName?: string;
  unitPrice: number;
  quantity: number;
  customization: Record<string, string>;
  imageUrl?: string;
}

interface CartContextType {
  items: CartItemState[];
  isCartOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  addItem: (item: CartItemState) => void;
  removeItem: (index: number) => void;
  updateQuantity: (index: number, quantity: number) => void;
  clearCart: () => void;
  subtotal: number;
  totalCount: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItemState[]>(() => {
    const saved = localStorage.getItem('customry_cart');
    return saved ? JSON.parse(saved) : [];
  });
  const [isCartOpen, setIsCartOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem('customry_cart', JSON.stringify(items));
  }, [items]);

  const openCart = () => setIsCartOpen(true);
  const closeCart = () => setIsCartOpen(false);

  const addItem = (newItem: CartItemState) => {
    setItems((prev) => {
      const existingIdx = prev.findIndex(
        (i) =>
          i.productId === newItem.productId &&
          i.variantId === newItem.variantId &&
          JSON.stringify(i.customization) === JSON.stringify(newItem.customization)
      );

      if (existingIdx > -1) {
        const updated = [...prev];
        updated[existingIdx].quantity += newItem.quantity;
        return updated;
      }
      return [...prev, newItem];
    });
    setIsCartOpen(true);
  };

  const removeItem = (index: number) => {
    setItems((prev) => prev.filter((_, idx) => idx !== index));
  };

  const updateQuantity = (index: number, quantity: number) => {
    if (quantity <= 0) {
      removeItem(index);
      return;
    }
    setItems((prev) => {
      const updated = [...prev];
      updated[index].quantity = quantity;
      return updated;
    });
  };

  const clearCart = () => {
    setItems([]);
  };

  const subtotal = items.reduce((acc, item) => acc + item.unitPrice * item.quantity, 0);
  const totalCount = items.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        isCartOpen,
        openCart,
        closeCart,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        subtotal,
        totalCount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
};
