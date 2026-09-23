import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[#1b1c1c] text-white pt-16 pb-12 border-t border-[#303030]">
      <div className="max-w-container mx-auto px-6 lg:px-16 grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
        <div className="md:col-span-2">
          <h3 className="font-serif text-2xl font-semibold text-[#c9a96e] mb-4">CUSTOMRY</h3>
          <p className="text-gray-400 text-sm leading-relaxed max-w-sm mb-6">
            A bespoke atelier specializing in luxury personalized accessories, journals, timepieces, and curated gift boxes.
          </p>
          <div className="text-xs text-[#7f7668]">
            © {new Date().getFullYear()} Customry Bespoke Atelier. All Rights Reserved.
          </div>
        </div>

        <div>
          <h4 className="text-xs font-semibold uppercase tracking-widest text-[#c9a96e] mb-4">
            Catalogue Categories
          </h4>
          <ul className="space-y-2 text-xs text-gray-300">
            <li><a href="#jewelry-accessories" className="hover:text-white transition">Jewelry & Accessories</a></li>
            <li><a href="#journals-books" className="hover:text-white transition">Journals & Books</a></li>
            <li><a href="#water-bottles" className="hover:text-white transition">Water Bottles</a></li>
            <li><a href="#gifts-gift-boxes" className="hover:text-white transition">Gifts & Gift Boxes</a></li>
            <li><a href="#wristwatches" className="hover:text-white transition">Wristwatches</a></li>
          </ul>
        </div>

        <div>
          <h4 className="text-xs font-semibold uppercase tracking-widest text-[#c9a96e] mb-4">
            Client Concierge
          </h4>
          <ul className="space-y-2 text-xs text-gray-300">
            <li>WhatsApp Concierge: +234 800 CUSTOMRY</li>
            <li>Email: concierge@customry.com</li>
            <li>Delivery: Worldwide Express</li>
          </ul>
        </div>
      </div>
    </footer>
  );
};
