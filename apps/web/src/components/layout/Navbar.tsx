import React, { useState } from 'react';
import { ShoppingBag, Menu, X, Shield, PackageCheck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../features/cart/context/CartContext';

interface NavbarProps {
  onOpenTracking?: () => void;
  onOpenAdmin?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenTracking, onOpenAdmin }) => {
  const { totalCount, openCart } = useCart();
  const navigate = useNavigate();

  const openBag = () => {
    if (window.matchMedia('(max-width: 1023px)').matches) {
      navigate('/bag');
      return;
    }
    openCart();
  };
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-[#1b1c1c] text-white border-b border-[#303030]">
      <div className="max-w-container mx-auto px-6 lg:px-16 h-20 flex items-center justify-between">
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="lg:hidden text-[#c9a96e] hover:text-white transition"
          aria-label="Toggle Menu"
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        <button onClick={() => navigate("/")} className="flex items-center gap-2 group">
          <span className="font-serif text-2xl lg:text-3xl font-semibold tracking-tight text-[#c9a96e] group-hover:text-white transition">
            CUSTOMRY
          </span>
          <span className="text-[10px] tracking-widest uppercase text-[#7f7668] hidden sm:inline-block border-l border-[#4d463a] pl-2 font-sans">
            Bespoke Atelier
          </span>
        </button>

        <nav className="hidden lg:flex items-center gap-8 text-xs font-semibold tracking-widest uppercase text-gray-300">
          <button onClick={() => navigate("/categories/jewelry-accessories")} className="hover:text-[#c9a96e] transition">
            Jewelry
          </button>
          <button onClick={() => navigate("/categories/journals-books")} className="hover:text-[#c9a96e] transition">
            Journals
          </button>
          <button onClick={() => navigate("/categories/water-bottles")} className="hover:text-[#c9a96e] transition">
            Bottles
          </button>
          <button onClick={() => navigate("/categories/gift-boxes")} className="hover:text-[#c9a96e] transition">
            Gift Boxes
          </button>
          <button onClick={() => navigate("/categories/wristwatches")} className="hover:text-[#c9a96e] transition">
            Watches
          </button>
        </nav>

        <div className="flex items-center gap-4">
          {onOpenTracking && (
          <button
            onClick={onOpenTracking}
            className="flex items-center gap-1.5 text-xs text-[#c9a96e] hover:text-white transition px-3 py-1.5 rounded-full border border-[#745a27]/40 hover:border-[#c9a96e]"
          >
            <PackageCheck size={16} />
            <span className="hidden sm:inline">Track Order</span>
          </button>
          )}

          <button
            onClick={openBag}
            className="relative p-2 text-[#c9a96e] hover:text-white transition"
            aria-label="Cart"
          >
            <ShoppingBag size={22} />
            {totalCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-[#745a27] text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center border-2 border-[#1b1c1c]">
                {totalCount}
              </span>
            )}
          </button>

          {onOpenAdmin && (
          <button
            onClick={onOpenAdmin}
            className="p-2 text-gray-400 hover:text-[#c9a96e] transition ml-1"
            title="Admin Portal"
          >
            <Shield size={18} />
          </button>
          )}
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#1b1c1c] border-b border-[#303030] px-6 py-6 space-y-4">
          <nav className="flex flex-col space-y-3 text-xs font-semibold tracking-widest uppercase text-gray-300">
            <button onClick={() => { setMobileMenuOpen(false); navigate("/categories/jewelry-accessories"); }} className="text-left hover:text-[#c9a96e]">
              Jewelry & Accessories
            </button>
            <button onClick={() => { setMobileMenuOpen(false); navigate("/categories/journals-books"); }} className="text-left hover:text-[#c9a96e]">
              Journals & Books
            </button>
            <button onClick={() => { setMobileMenuOpen(false); navigate("/categories/water-bottles"); }} className="text-left hover:text-[#c9a96e]">
              Water Bottles
            </button>
            <button onClick={() => { setMobileMenuOpen(false); navigate("/categories/gift-boxes"); }} className="text-left hover:text-[#c9a96e]">
              Gifts & Gift Boxes
            </button>
            <button onClick={() => { setMobileMenuOpen(false); navigate("/categories/wristwatches"); }} className="text-left hover:text-[#c9a96e]">
              Wristwatches
            </button>
          </nav>
        </div>
      )}
    </header>
  );
};
