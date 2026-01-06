
import React from 'react';
import { useData } from './DataContext';
import { ArrowUpRight } from 'lucide-react';

interface AdCardProps {
  id: string;
  title: string;
  description: string;
  price: string;
  imageUrl: string;
  onNavigate?: () => void;
}

const AdCard: React.FC<AdCardProps> = ({ title, description, price, imageUrl, onNavigate }) => (
  <div 
    className="bg-white rounded-2xl p-4 shadow-sm hover:shadow-xl transition-all duration-300 w-full flex flex-col h-full cursor-pointer group hover:-translate-y-1 border border-slate-100"
    onClick={onNavigate}
  >
    {/* Image Container - Reduced height on mobile from h-44 to h-40 */}
    <div className="h-40 md:h-52 rounded-xl overflow-hidden relative isolate mb-4">
        <img 
          src={imageUrl} 
          alt={title} 
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
        />
        <div className="absolute inset-0 bg-black/5 group-hover:bg-black/0 transition-colors"></div>
        
        {/* Floating Action Button */}
        <div className="absolute top-3 right-3 w-8 h-8 bg-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 shadow-md">
            <ArrowUpRight size={16} className="text-black" />
        </div>
    </div>
    
    <div className="flex flex-col flex-grow">
      <div className="flex justify-between items-start mb-2">
        <h3 className="text-lg font-bold text-slate-900 leading-tight group-hover:text-[#0056D2] transition-colors">{title}</h3>
      </div>
      
      <p className="text-sm text-slate-500 mb-5 leading-relaxed line-clamp-2">
        {description}
      </p>
      
      {/* Price Pill */}
      <div className="mt-auto bg-slate-50 rounded-lg p-3 flex items-center justify-between border border-slate-100">
        <div>
          <span className="text-[10px] text-slate-400 font-bold block uppercase tracking-wider">Starting From</span>
          <div className="text-base font-bold text-slate-900">{price}</div>
        </div>
        <div className="h-8 w-8 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-400 group-hover:text-[#0056D2] group-hover:border-[#0056D2] transition-all">
             <span className="text-lg leading-none mb-1">→</span>
        </div>
      </div>
    </div>
  </div>
);

interface DigitalAdvertisingProps {
  onNavigate?: (page: string) => void;
}

const DigitalAdvertising: React.FC<DigitalAdvertisingProps> = ({ onNavigate }) => {
  const { siteData } = useData();
  const { adPlatform } = siteData;
  const { homeSection } = adPlatform;

  const displayCards = adPlatform.cards.slice(0, 3);

  return (
    <section className="bg-white py-16 md:py-32 px-6 md:px-12 font-sans relative">
      
      <div className="max-w-[1400px] mx-auto">
        
        {/* Section Heading */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 md:mb-16 gap-6">
            <div>
                <span className="text-[#0056D2] font-bold tracking-widest uppercase text-xs mb-2 block">Our Platform Partner</span>
                <h2 className="text-2xl md:text-5xl font-bold text-slate-900 tracking-tight">Digital Advertising</h2>
            </div>
            <p className="text-slate-500 max-w-md text-sm md:text-base leading-relaxed">
                Unlock premium inventory on India's largest OTT platforms. High engagement, precise targeting, and measurable results.
            </p>
        </div>

        {/* Dark Container Block - Reduced Padding on Mobile */}
        <div className="bg-[#0F172A] rounded-[1.5rem] md:rounded-[2rem] p-5 md:p-16 shadow-2xl relative overflow-hidden group">
            
            {/* Minimal Pattern */}
            <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>

            {/* Z5 Header */}
            <div className="mb-10 md:mb-16 relative z-10 flex flex-col md:flex-row items-start md:items-center gap-6 md:gap-8 border-b border-white/10 pb-8 md:pb-12">
                <span className="font-serif italic text-white text-7xl md:text-9xl leading-[0.8] opacity-10 tracking-tighter select-none">
                    Z5
                </span>
                <div className="max-w-xl">
                    <h3 className="text-xl md:text-3xl font-bold text-white mb-3">
                        {homeSection.title}
                    </h3>
                    <p className="text-slate-400 text-sm md:text-base leading-relaxed">
                        {homeSection.description}
                    </p>
                </div>
                <div className="ml-auto w-full md:w-auto">
                     <button 
                      onClick={() => onNavigate?.('zee5')}
                      className="w-full md:w-auto bg-white text-slate-900 font-bold py-3 md:py-4 px-8 rounded-full hover:bg-slate-100 transition-colors text-sm md:text-base"
                    >
                      {homeSection.buttonText}
                    </button>
                </div>
            </div>

            {/* Cards Container */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 relative z-10">
                {displayCards.map((card, idx) => (
                    <div key={card.id} className={`transition-all duration-700 delay-${idx * 100}`}>
                        <AdCard 
                            id={card.id}
                            title={card.title} 
                            description={card.description}
                            price={card.price}
                            imageUrl={card.imageUrl} 
                            onNavigate={() => onNavigate?.('zee5')}
                        />
                    </div>
                ))}
            </div>
            
        </div>
      </div>
    </section>
  );
};

export default DigitalAdvertising;
