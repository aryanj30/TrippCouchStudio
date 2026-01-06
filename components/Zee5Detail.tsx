
import React, { useState } from 'react';
import { Users, Smartphone, BarChart3, PieChart, ArrowRight } from 'lucide-react';
import { useData } from './DataContext';
import BookCallPopup from './BookCallPopup';

interface Zee5DetailProps {
  onNavigate: (page: string, id?: string) => void;
}

interface DetailAdCardProps {
  id: string;
  title: string;
  description: string;
  price: string;
  imageUrl: string;
  onNavigate: (page: string, id: string) => void;
}

const DetailAdCard: React.FC<DetailAdCardProps> = ({ id, title, description, price, imageUrl, onNavigate }) => (
  <div 
    className="rounded-2xl overflow-hidden flex flex-col h-full bg-white cursor-pointer hover:shadow-xl transition-all duration-300 group hover:-translate-y-1 border border-slate-100 shadow-md" 
    onClick={() => onNavigate('ad-detail', id)}
  >
    {/* Image Section - Reduced height mobile h-40 */}
    <div className="h-40 md:h-56 relative overflow-hidden bg-gray-100">
      <img src={imageUrl} alt={title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
      <div className="absolute inset-0 bg-black/5 group-hover:bg-black/0 transition-colors"></div>
    </div>
    
    {/* Content Section */}
    <div className="p-4 md:p-5 flex flex-col flex-grow bg-white">
      <h3 className="text-lg font-bold text-slate-900 group-hover:text-blue-600 transition-colors mb-2">{title}</h3>
      
      <p className="text-xs text-slate-500 mb-4 leading-relaxed line-clamp-2">
          {description}
      </p>
      
      {/* Price */}
      <div className="mt-auto pt-3 border-t border-gray-50 flex justify-between items-center">
        <div>
           <span className="text-[10px] text-slate-400 font-bold block uppercase tracking-wider">STARTING AT</span>
           <div className="text-base font-bold text-slate-900">{price}</div>
        </div>
        <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-blue-600 group-hover:text-white transition-all">
            <ArrowRight size={16} className="-rotate-45 group-hover:rotate-0 transition-transform" />
        </div>
      </div>
    </div>
  </div>
);

const Zee5Detail: React.FC<Zee5DetailProps> = ({ onNavigate }) => {
  const { siteData } = useData();
  const { adPlatform } = siteData;
  const { header, intro, logoUrl } = adPlatform; 
  
  const [showPopup, setShowPopup] = useState(false);

  return (
    <div className="bg-[#FAFAFA] min-h-screen pb-20 font-sans text-slate-900 animate-fade-in-up relative overflow-hidden pt-24 md:pt-28">
      
      <div className="max-w-[1400px] mx-auto px-6 md:px-12 relative z-10">
        
        {/* HERO SECTION */}
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-20 mb-16 md:mb-20 items-center">
            
            {/* Left Column: Branding & Text (Left Aligned) */}
            <div className="lg:col-span-7 flex flex-col items-start text-left animate-fade-in-up delay-100 order-2 lg:order-1">
                 {logoUrl && (
                     <div className="w-16 h-16 md:w-24 md:h-24 bg-white rounded-2xl shadow-lg flex items-center justify-center p-3 md:p-4 mb-6 md:mb-8 border border-slate-100 transform hover:scale-105 transition-transform">
                         <img src={logoUrl} alt={`${adPlatform.platformName} Logo`} className="w-full h-full object-contain" />
                     </div>
                 )}
                 
                 <h1 className="text-3xl md:text-7xl font-bold text-slate-900 mb-4 md:mb-6 tracking-tight leading-[1.1]">
                    Advertise on <br/>
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#0056D2] to-purple-600">{adPlatform.platformName}</span>
                 </h1>
                 
                 <p className="text-slate-500 text-base md:text-xl leading-relaxed mb-8 md:mb-10 max-w-2xl font-light">
                    {intro.p1}
                 </p>

                 <div className="flex flex-wrap gap-4">
                     <button 
                        onClick={() => setShowPopup(true)}
                        className="bg-[#0056D2] text-white hover:bg-blue-700 font-bold py-3 md:py-4 px-6 md:px-8 rounded-full shadow-xl shadow-blue-500/20 transition-all flex items-center gap-2 text-sm md:text-base"
                     >
                         Start Campaign
                         <ArrowRight size={18} />
                     </button>
                     <button 
                        onClick={() => onNavigate('home')}
                        className="bg-white text-slate-700 border border-slate-200 hover:bg-slate-50 font-bold py-3 md:py-4 px-6 md:px-8 rounded-full transition-all text-sm md:text-base"
                     >
                         Contact Sales
                     </button>
                 </div>
            </div>

            {/* Right Column: Stats Grid (Replaces Ad Cards) */}
            <div className="lg:col-span-5 relative animate-fade-in-up delay-200 order-1 lg:order-2">
                 {/* Decorative background blob */}
                 <div className="absolute inset-0 bg-blue-50/50 rounded-[3rem] rotate-6 scale-110 blur-3xl -z-10 pointer-events-none"></div>
                 
                 <div className="grid grid-cols-2 gap-3 md:gap-4 relative z-10">
                     
                     {/* Stat 1: Users - Reduced Height h-32 */}
                     <div className="bg-white p-4 md:p-6 rounded-2xl shadow-md border border-slate-100 flex flex-col items-center justify-center text-center h-32 md:h-48 hover:-translate-y-1 transition-transform duration-300 group">
                         <div className="w-10 h-10 md:w-12 md:h-12 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mb-2 md:mb-3 group-hover:scale-110 transition-transform">
                            <Users size={20} />
                         </div>
                         <div className="text-xl md:text-3xl font-bold text-slate-900">{header.monthlyUsers}</div>
                         <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Users</div>
                     </div>

                     {/* Stat 2: Platform */}
                     <div className="bg-white p-4 md:p-6 rounded-2xl shadow-md border border-slate-100 flex flex-col items-center justify-center text-center h-32 md:h-48 hover:-translate-y-1 transition-transform duration-300 group">
                         <div className="w-10 h-10 md:w-12 md:h-12 bg-pink-50 text-pink-600 rounded-full flex items-center justify-center mb-2 md:mb-3 group-hover:scale-110 transition-transform">
                            <Smartphone size={20} />
                         </div>
                         <div className="text-base md:text-xl font-bold text-slate-900 uppercase">{header.platformType}</div>
                         <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Platform</div>
                     </div>

                     {/* Stat 3: Models */}
                     <div className="bg-white p-4 md:p-6 rounded-2xl shadow-md border border-slate-100 flex flex-col items-center justify-center text-center h-32 md:h-48 hover:-translate-y-1 transition-transform duration-300 group">
                         <div className="w-10 h-10 md:w-12 md:h-12 bg-green-50 text-green-600 rounded-full flex items-center justify-center mb-2 md:mb-3 group-hover:scale-110 transition-transform">
                            <BarChart3 size={20} />
                         </div>
                         <div className="text-base md:text-xl font-bold text-slate-900">{header.pricingModels}</div>
                         <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Models</div>
                     </div>

                     {/* Stat 4: Languages (Mapped to categories in Data) */}
                     <div className="bg-white p-4 md:p-6 rounded-2xl shadow-md border border-slate-100 flex flex-col items-center justify-center text-center h-32 md:h-48 hover:-translate-y-1 transition-transform duration-300 group">
                         <div className="w-10 h-10 md:w-12 md:h-12 bg-purple-50 text-purple-600 rounded-full flex items-center justify-center mb-2 md:mb-3 group-hover:scale-110 transition-transform">
                            <PieChart size={20} />
                         </div>
                         <div className="text-base md:text-xl font-bold text-slate-900">{header.categories}</div>
                         <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Languages</div>
                     </div>

                 </div>
            </div>
        </div>

        {/* Detailed Ads List */}
        <div className="mb-16 md:mb-24">
            <h2 className="text-xl md:text-2xl font-bold text-slate-900 mb-8 md:mb-10 flex items-center gap-4">
                Explore All Formats
                <div className="h-px bg-gray-200 flex-grow"></div>
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                {adPlatform.cards.map(card => (
                    <DetailAdCard 
                        key={card.id}
                        id={card.id}
                        title={card.title}
                        description={card.description}
                        price={card.price}
                        imageUrl={card.imageUrl}
                        onNavigate={onNavigate}
                    />
                ))}
            </div>
        </div>

        {/* Expert Guidance Banner */}
        <div className="bg-slate-900 rounded-[2rem] md:rounded-[2.5rem] p-8 md:p-12 text-white flex flex-col md:flex-row items-center justify-between relative overflow-hidden mb-16 md:mb-24 shadow-2xl">
             <div className="relative z-10 max-w-2xl text-center md:text-left">
                 <h2 className="text-2xl md:text-5xl font-bold mb-4 md:mb-6 leading-tight">Need a custom media plan?</h2>
                 <p className="text-slate-300 text-sm md:text-lg mb-8 font-light leading-relaxed">Our experts can help you mix and match formats to reach your specific target audience demographics effectively.</p>
                 <button 
                    onClick={() => setShowPopup(true)}
                    className="bg-white text-slate-900 hover:bg-blue-50 font-bold py-3 md:py-4 px-8 md:px-10 rounded-full uppercase text-xs md:text-sm tracking-widest transition-all shadow-lg transform hover:-translate-y-1"
                 >
                     Book Consultation
                 </button>
             </div>
             <div className="relative z-10 mt-10 md:mt-0">
                 <div className="w-32 h-32 md:w-40 md:h-40 bg-white/10 rounded-full flex items-center justify-center border border-white/20 backdrop-blur-md">
                     <span className="text-4xl md:text-6xl">✨</span>
                 </div>
             </div>
             
             {/* Abstract BG */}
             <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-600/20 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2"></div>
        </div>

        {/* FAQ Section */}
        <div className="max-w-4xl mx-auto">
             <h3 className="text-2xl md:text-3xl font-bold mb-8 md:mb-10 text-slate-900 text-center">Frequently Asked Questions</h3>
             <div className="grid gap-4 md:gap-6">
                {adPlatform.faqs.map((faq, index) => (
                    <div key={faq.id} className="bg-white p-6 md:p-8 rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                        <h4 className="font-bold text-base md:text-lg mb-2 md:mb-3 text-slate-900">{faq.question}</h4>
                        <div className="space-y-2">
                            {faq.answer.map((ans, i) => (
                                <p key={i} className="text-slate-500 leading-relaxed text-sm md:text-base">{ans}</p>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>

      </div>
      
      <BookCallPopup isOpen={showPopup} onClose={() => setShowPopup(false)} />
    </div>
  );
};

export default Zee5Detail;
