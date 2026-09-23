import React from 'react';

export const Hero: React.FC = () => {
  return (
    <section className="relative bg-[#1b1c1c] text-white py-24 lg:py-36 overflow-hidden border-b border-[#303030]">
      <div className="absolute inset-0 bg-[radial-gradient(#c9a96e_1px,transparent_1px)] [background-size:32px_32px] opacity-10" />
      <div className="max-w-container mx-auto px-6 lg:px-16 relative z-10 text-center max-w-4xl">
        <span className="inline-block text-xs font-semibold tracking-[0.25em] uppercase text-[#c9a96e] mb-4 border-b border-[#745a27] pb-1">
          Handcrafted Bespoke Luxury
        </span>
        <h1 className="font-serif text-4xl sm:text-6xl lg:text-7xl font-semibold leading-tight mb-6">
          Personalised Elegance, <br />
          <span className="italic text-[#c9a96e]">Crafted for Eternity.</span>
        </h1>
        <p className="text-gray-300 font-sans text-base sm:text-lg max-w-2xl mx-auto mb-10 leading-relaxed font-normal">
          Customry transforms luxury jewelry, leather journals, thermal flasks, and fine timepieces into unforgettable personalized heirlooms.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <a
            href="#jewelry-accessories"
            className="bg-[#745a27] hover:bg-[#c9a96e] text-white hover:text-[#1b1c1c] font-medium text-xs tracking-widest uppercase px-8 py-4 rounded-full transition-all duration-300 shadow-lg hover:scale-105"
          >
            Explore Collection
          </a>
          <a
            href="#catalogue"
            className="border border-[#7f7668] hover:border-[#c9a96e] text-[#c9a96e] hover:text-white font-medium text-xs tracking-widest uppercase px-8 py-4 rounded-full transition-all duration-300"
          >
            Bespoke Customization
          </a>
        </div>
      </div>
    </section>
  );
};
