
import React, { useState } from 'react';
import { useData } from './DataContext';
import { useAuth } from './AuthContext';
import { useToast } from './ToastContext';
import { ArrowLeft, CheckCircle2, Info, Share2, Download, ChevronRight, ChevronLeft, ShoppingBag } from 'lucide-react';

interface AdDetailPageProps {
  adId: string;
  onNavigate: (page: string) => void;
  onBook: () => void;
}

const AdDetailPage: React.FC<AdDetailPageProps> = ({ adId, onNavigate, onBook }) => {
  const { siteData } = useData();
  const { addToCart, isAuthenticated } = useAuth();
  const { addToast } = useToast();
  const ad = siteData.adPlatform.cards.find(c => c.id === adId);
  const [currentImageIdx, setCurrentImageIdx] = useState(0);

  if (!ad) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;

  const displayImages = (ad.images && ad.images.length > 0) ? ad.images : [ad.imageUrl];

  const nextImage = () => {
      setCurrentImageIdx((prev) => (prev + 1) % displayImages.length);
  };

  const prevImage = () => {
      setCurrentImageIdx((prev) => (prev - 1 + displayImages.length) % displayImages.length);
  };

  const handleAddToCart = async () => {
      if (!isAuthenticated) {
          addToast("Please login to add items to cart", "info");
          onNavigate('login');
          return;
      }
      try {
        await addToCart(ad);
        addToast("Added to cart successfully", "success");
      } catch (e) {
        addToast("Failed to add to cart", "error");
      }
  };

  // Helper to map stat keys to Figma labels
  const getStatLabel = (key: string) => {
      switch(key) {
          case 'usedFor': return 'Used For';
          case 'adType': return 'Ad Type';
          case 'leadTime': return 'Lead Time ( In Hours)';
          case 'span': return 'Span';
          default: return key.replace(/([A-Z])/g, ' $1').trim();
      }
  };

  return (
    <div className="bg-[#FAFAFA] min-h-screen font-sans animate-fade-in-up selection:bg-pink-100 selection:text-pink-900 pt-24">
      
      {/* Breadcrumb - Sticky below Navbar */}
      <div className="sticky top-20 z-30 bg-[#FAFAFA]/95 backdrop-blur-sm border-b border-gray-200 px-6 md:px-12 py-3 md:py-4 transition-all">
        <div className="max-w-[1400px] mx-auto flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs md:text-sm font-medium text-slate-500 truncate">
                <span className="cursor-pointer hover:text-slate-900" onClick={() => onNavigate('home')}>Home</span>
                <span>{'>'}</span>
                <span className="cursor-pointer hover:text-slate-900" onClick={() => onNavigate('zee5')}>Digital Ads</span>
                <span className="hidden md:inline">{'>'}</span>
                <span className="text-slate-900 font-bold hidden md:inline">{ad.title}</span>
            </div>
            <button 
                onClick={() => onNavigate('zee5')}
                className="flex items-center gap-1 text-xs md:text-sm font-bold text-slate-900 hover:text-blue-600 transition-colors shrink-0"
            >
                <ArrowLeft size={16} /> Back
            </button>
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto px-6 md:px-12 py-8 md:py-12">
        
        {/* Title */}
        <h1 className="text-2xl md:text-5xl font-bold text-slate-900 mb-6 md:mb-8 tracking-tight">
            {ad.title} on {siteData.adPlatform.platformName}
        </h1>

        <div className="grid lg:grid-cols-12 gap-8 md:gap-12">
          
          {/* LEFT CONTENT COLUMN */}
          <div className="lg:col-span-8">
            
            {/* Image Carousel */}
            <div className="bg-white rounded-3xl border border-slate-200 p-2 mb-8 shadow-sm">
                <div className="bg-slate-100 rounded-2xl aspect-[16/9] overflow-hidden relative group">
                     
                     {displayImages.map((img, idx) => (
                         <div 
                            key={idx}
                            className={`absolute inset-0 transition-opacity duration-500 ${idx === currentImageIdx ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
                         >
                             <img src={img} className="w-full h-full object-cover" alt={`${ad.title} view ${idx + 1}`} />
                         </div>
                     ))}
                     
                     {/* Controls */}
                     {displayImages.length > 1 && (
                         <>
                             <button 
                                onClick={prevImage}
                                className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-slate-800 p-2 rounded-full backdrop-blur-sm shadow-md transition-all opacity-0 group-hover:opacity-100"
                             >
                                 <ChevronLeft size={24} />
                             </button>
                             <button 
                                onClick={nextImage}
                                className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-slate-800 p-2 rounded-full backdrop-blur-sm shadow-md transition-all opacity-0 group-hover:opacity-100"
                             >
                                 <ChevronRight size={24} />
                             </button>

                             {/* Indicators */}
                             <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2">
                                {displayImages.map((_, idx) => (
                                    <button 
                                        key={idx}
                                        onClick={() => setCurrentImageIdx(idx)}
                                        className={`w-2 h-2 rounded-full shadow-sm transition-all ${idx === currentImageIdx ? 'bg-blue-600 w-6' : 'bg-white/70 hover:bg-white'}`}
                                    />
                                ))}
                             </div>
                         </>
                     )}
                </div>
            </div>

            {/* Stats Row (Figma Style) */}
            <div className="bg-white rounded-2xl px-6 py-4 md:px-8 md:py-6 border border-slate-200 flex flex-wrap gap-x-8 md:gap-x-16 gap-y-4 md:gap-y-6 mb-8 items-center shadow-sm">
                {ad.stats && Object.entries(ad.stats).map(([key, value]) => (
                    <div key={key} className="flex flex-col">
                        <span className="text-[#D946EF] text-[10px] md:text-xs font-bold uppercase tracking-wider mb-1">
                            {getStatLabel(key)}
                        </span>
                        <span className="text-base md:text-xl font-medium text-slate-900 leading-none">
                            {value}
                        </span>
                    </div>
                ))}
            </div>

            {/* Description */}
            <div className="mb-12 md:mb-16">
                <p className="text-slate-700 text-base md:text-lg leading-relaxed font-normal">
                    {ad.description}
                </p>
            </div>

            {/* Execution Details Header */}
            <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-6 md:mb-8">Ad Execution Details</h2>

            {/* Execution Cards Grid */}
            <div className="grid md:grid-cols-2 gap-4 md:gap-6 mb-12 md:mb-16">
                {ad.executionDetails && ad.executionDetails.map((section, idx) => (
                    <div 
                        key={idx} 
                        className="rounded-xl overflow-hidden border border-pink-100 bg-white shadow-sm flex flex-col h-full"
                    >
                        {/* Pink Header */}
                        <div className="bg-[#FFE4F2] px-6 py-3 md:py-4 border-b border-pink-100">
                            <h3 className="text-[#BE185D] font-bold uppercase text-xs tracking-widest">
                                {section.title}
                            </h3>
                        </div>
                        
                        {/* Body */}
                        <div className="p-4 md:p-6 flex-grow">
                            <div className="space-y-4 md:space-y-5">
                                {section.fields.map((field, fIdx) => (
                                    <div key={fIdx}>
                                        <span className="block text-[10px] font-bold text-[#D946EF] uppercase mb-1 tracking-wide">
                                            {field.label}
                                        </span>
                                        <p className="text-slate-800 text-sm font-medium leading-snug whitespace-pre-line">
                                            {field.value}
                                        </p>
                                    </div>
                                ))}
                                {section.fields.length === 0 && (
                                    <p className="text-slate-400 text-xs italic">No specific fields.</p>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Expert Guidance Banner */}
            <div className="bg-[#0056D2] rounded-3xl overflow-hidden relative mb-16 md:mb-20 shadow-2xl group">
                 <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
                 
                 <div className="px-6 py-8 md:px-12 md:py-12 relative z-10 flex flex-col md:flex-row items-center justify-between gap-6 md:gap-8">
                     <div className="max-w-lg text-center md:text-left">
                        <h2 className="text-2xl md:text-4xl font-bold text-white mb-3 md:mb-4 leading-tight">Looking for Expert Guidance?</h2>
                        <p className="text-blue-100 text-sm md:text-lg leading-relaxed font-light">
                            Schedule a consultation with our media planner to seamlessly strategize and place your next promotion.
                        </p>
                     </div>
                     <button 
                        onClick={onBook}
                        className="bg-[#D946EF] hover:bg-pink-500 text-white font-bold py-3 md:py-4 px-6 md:px-8 rounded-lg shadow-lg transition-all transform hover:scale-105 whitespace-nowrap uppercase text-xs md:text-sm tracking-widest"
                     >
                        Learn More
                     </button>
                 </div>
                 
                 <div className="absolute -top-10 -right-10 w-48 h-48 bg-white/10 rounded-full blur-2xl"></div>
                 <div className="absolute bottom-4 right-20 text-white/20 hidden md:block">
                      <span className="text-8xl font-black rotate-12 block">?</span>
                 </div>
                 <div className="absolute bottom-10 left-10 text-[#A3E635] opacity-50">
                    <svg width="40" height="40" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" /></svg>
                 </div>
            </div>

            {/* Long Form Content */}
            <div className="space-y-12 md:space-y-16 pb-12 max-w-4xl">
                 {ad.contentSections && ad.contentSections.map((section, idx) => (
                     <div key={idx}>
                         <h2 className="text-2xl md:text-4xl font-bold text-slate-900 mb-6 md:mb-8 tracking-tight">{section.title}</h2>
                         {Array.isArray(section.content) ? (
                             <ul className="space-y-3 md:space-y-4 pl-2">
                                 {section.content.map((item, i) => (
                                     <li key={i} className="flex gap-3 md:gap-4 text-slate-700 leading-relaxed text-base md:text-lg items-start">
                                         <span className="w-1.5 h-1.5 rounded-full bg-slate-900 mt-2.5 flex-shrink-0"></span>
                                         <span>{item}</span>
                                     </li>
                                 ))}
                             </ul>
                         ) : (
                             <p className="text-slate-700 leading-loose text-base md:text-lg whitespace-pre-line">{section.content}</p>
                         )}
                     </div>
                 ))}
            </div>

          </div>

          {/* RIGHT SIDEBAR (Pricing) - Sticky */}
          <div className="lg:col-span-4">
             <div className="sticky top-32 space-y-8">
                 
                 {/* Pricing Card */}
                 <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden transform transition-all hover:shadow-2xl">
                      <div className="p-5 md:p-8">
                          
                          <div className="flex gap-4 mb-6">
                              <div className="flex-1 border border-pink-100 bg-white rounded-xl p-3 md:p-4 flex flex-col justify-center items-center text-center">
                                   <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1">Original Rate</span>
                                   <span className="text-slate-400 line-through text-base md:text-lg font-medium">{ad.pricing?.original}</span>
                                   <span className="text-[9px] text-slate-400 mt-0.5">/ Per Day</span>
                              </div>
                              
                              <div className="flex-1 bg-[#0D9488] rounded-xl p-3 md:p-4 flex flex-col justify-center items-center text-center shadow-lg relative overflow-hidden">
                                   <div className="absolute inset-0 bg-white/10 opacity-0 hover:opacity-100 transition-opacity"></div>
                                   <span className="text-[10px] text-white/90 font-bold uppercase tracking-wider mb-1">Our Exclusive Offer</span>
                                   <span className="text-lg md:text-2xl font-bold text-white tracking-tight">{ad.pricing?.discounted || ad.price}</span>
                                   <span className="text-[9px] text-white/80 mt-0.5">/ Per Day</span>
                              </div>
                          </div>

                          <div className="flex justify-between items-center border border-slate-200 rounded-xl p-4 mb-8 bg-slate-50">
                              <div className="flex flex-col">
                                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Min Billing</span>
                                  <span className="font-bold text-slate-900 text-base md:text-lg">{ad.pricing?.minBilling}</span>
                              </div>
                              <Info size={18} className="text-slate-400" />
                          </div>

                          <button 
                             onClick={handleAddToCart}
                             className="w-full bg-[#0056D2] hover:bg-blue-700 text-white font-bold py-4 rounded-xl shadow-lg transition-all transform hover:-translate-y-0.5 flex flex-col items-center justify-center gap-0.5"
                          >
                              <span className="text-base tracking-wide flex items-center gap-2">
                                  <ShoppingBag size={18} /> Add To Bag
                              </span>
                              <span className="text-[10px] font-medium opacity-80 uppercase tracking-wider">For Early Discount</span>
                          </button>
                      </div>
                 </div>

                 <div className="flex gap-4 justify-center text-slate-400 text-xs font-bold uppercase tracking-widest">
                     <button className="hover:text-slate-900 flex items-center gap-2 transition-colors">
                        <Share2 size={14} /> Share
                     </button>
                     <button className="hover:text-slate-900 flex items-center gap-2 transition-colors">
                        <Download size={14} /> Spec Sheet
                     </button>
                 </div>

             </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default AdDetailPage;
