
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
          case 'usedFor': return 'USED FOR';
          case 'adType': return 'AD TYPE';
          case 'leadTime': return 'LEAD TIME ( IN HOURS)';
          case 'span': return 'SPAN';
          default: return key.replace(/([A-Z])/g, ' $1').trim().toUpperCase();
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
        <h1 className="text-2xl md:text-5xl font-bold text-slate-900 mb-6 md:mb-10 tracking-tight">
            {ad.title} on {siteData.adPlatform.platformName}
        </h1>

        {/* Top Grid: Image + Pricing */}
        <div className="grid lg:grid-cols-12 gap-8 md:gap-10 mb-8 items-start">
          
          {/* Image Carousel */}
          <div className="lg:col-span-8">
            <div className="bg-white rounded-[2rem] border border-slate-200 p-2 shadow-sm">
                <div className="bg-slate-100 rounded-[1.75rem] aspect-[16/9] overflow-hidden relative group">
                     {displayImages.map((img, idx) => (
                         <div 
                            key={idx}
                            className={`absolute inset-0 transition-opacity duration-500 ${idx === currentImageIdx ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
                         >
                             <img src={img} className="w-full h-full object-cover" alt={`${ad.title} view ${idx + 1}`} />
                         </div>
                     ))}
                     {displayImages.length > 1 && (
                         <>
                             <button onClick={prevImage} className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-slate-800 p-2 rounded-full backdrop-blur-sm shadow-md transition-all opacity-0 group-hover:opacity-100"><ChevronLeft size={24} /></button>
                             <button onClick={nextImage} className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-slate-800 p-2 rounded-full backdrop-blur-sm shadow-md transition-all opacity-0 group-hover:opacity-100"><ChevronRight size={24} /></button>
                             <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2">
                                {displayImages.map((_, idx) => (
                                    <button key={idx} onClick={() => setCurrentImageIdx(idx)} className={`w-2 h-2 rounded-full shadow-sm transition-all ${idx === currentImageIdx ? 'bg-blue-600 w-6' : 'bg-white/70 hover:bg-white'}`} />
                                ))}
                             </div>
                         </>
                     )}
                </div>
            </div>
          </div>

          {/* Pricing Card Sidebar */}
          <div className="lg:col-span-4 h-full">
             <div className="bg-white rounded-[2rem] shadow-xl border border-gray-200 overflow-hidden h-full flex flex-col justify-between">
                  <div className="p-6 md:p-8 flex flex-col h-full">
                      <div className="flex gap-4 mb-6">
                          <div className="flex-1 border border-pink-100 bg-white rounded-2xl p-4 flex flex-col justify-center items-center text-center">
                               <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1">ORIGINAL RATE</span>
                               <span className="text-slate-400 line-through text-sm md:text-lg font-medium whitespace-nowrap">{ad.pricing?.original}</span>
                               <span className="text-[9px] text-slate-400 mt-0.5">/ Per Day</span>
                          </div>
                          
                          <div className="flex-1 bg-[#0D9488] rounded-2xl p-4 flex flex-col justify-center items-center text-center shadow-lg relative overflow-hidden">
                               <span className="text-[10px] text-white/90 font-bold uppercase tracking-wider mb-1">OUR EXCLUSIVE OFFER</span>
                               <span className="text-base md:text-xl font-bold text-white tracking-tight whitespace-nowrap">{ad.pricing?.discounted || ad.price}</span>
                               <span className="text-[9px] text-white/80 mt-0.5">/ Per Day</span>
                          </div>
                      </div>

                      <div className="flex justify-between items-center border border-slate-200 rounded-2xl p-4 mb-8 bg-slate-50">
                          <div className="flex flex-col">
                              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">MIN BILLING</span>
                              <span className="font-bold text-slate-900 text-base md:text-lg">{ad.pricing?.minBilling}</span>
                          </div>
                          <Info size={18} className="text-slate-400" />
                      </div>

                      <div className="mt-auto">
                        <button 
                           onClick={handleAddToCart}
                           className="w-full bg-[#0056D2] hover:bg-blue-700 text-white font-bold py-5 rounded-2xl shadow-lg transition-all transform hover:-translate-y-0.5 flex flex-col items-center justify-center gap-1"
                        >
                            <span className="text-lg tracking-wide flex items-center gap-2 uppercase">
                                <ShoppingBag size={20} /> Add To Bag
                            </span>
                            <span className="text-[10px] font-medium opacity-80 uppercase tracking-widest">FOR EARLY DISCOUNT</span>
                        </button>
                        <div className="mt-4 flex gap-6 justify-center text-slate-400 text-[10px] font-bold uppercase tracking-[0.2em]">
                             <button className="hover:text-slate-900 flex items-center gap-2 transition-colors"><Share2 size={12} /> Share</button>
                             <button className="hover:text-slate-900 flex items-center gap-2 transition-colors"><Download size={12} /> Spec Sheet</button>
                        </div>
                      </div>
                  </div>
             </div>
          </div>
        </div>

        {/* Stats Row - Spanning Full Width (Matched width of components) */}
        <div className="bg-white rounded-3xl px-8 py-6 md:px-12 md:py-8 border border-slate-200 flex flex-wrap gap-x-12 md:gap-x-24 gap-y-6 mb-12 items-center shadow-sm w-full">
            {ad.stats && Object.entries(ad.stats).map(([key, value]) => (
                <div key={key} className="flex flex-col">
                    <span className="text-[#D946EF] text-[10px] md:text-xs font-bold uppercase tracking-[0.2em] mb-2">
                        {getStatLabel(key)}
                    </span>
                    <span className="text-lg md:text-2xl font-bold text-slate-900 leading-none tracking-tight">
                        {value}
                    </span>
                </div>
            ))}
        </div>

        {/* Main Content Area */}
        <div className="w-full">
            {/* Description */}
            <div className="mb-12 md:mb-16">
                <p className="text-slate-700 text-lg md:text-xl leading-relaxed font-light">
                    {ad.description}
                </p>
            </div>

            {/* Execution Details Header */}
            <h2 className="text-2xl md:text-4xl font-bold text-slate-900 mb-8 md:mb-10 tracking-tight">Ad Execution Details</h2>

            {/* Execution Cards Grid - MAX 4 BLOCKS IN ROW ON DESKTOP */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16 md:mb-20">
                {ad.executionDetails && ad.executionDetails.map((section, idx) => (
                    <div key={idx} className="rounded-2xl overflow-hidden border border-pink-100 bg-white shadow-sm flex flex-col hover:shadow-md transition-shadow">
                        {/* Pink Header */}
                        <div className="bg-[#FFE4F2] px-6 py-4 border-b border-pink-100">
                            <h3 className="text-[#BE185D] font-bold uppercase text-[10px] tracking-[0.2em]">
                                {section.title}
                            </h3>
                        </div>
                        {/* Body */}
                        <div className="p-6 flex-grow">
                            <div className="space-y-6">
                                {section.fields.map((field, fIdx) => (
                                    <div key={fIdx}>
                                        <span className="block text-[10px] font-bold text-[#D946EF] uppercase mb-2 tracking-[0.2em]">
                                            {field.label}
                                        </span>
                                        <p className="text-slate-800 text-sm md:text-base font-bold leading-tight whitespace-pre-line">
                                            {field.value}
                                        </p>
                                    </div>
                                ))}
                                {section.fields.length === 0 && <p className="text-slate-400 text-xs italic">No specific fields.</p>}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Content Sections */}
            <div className="space-y-16 md:space-y-24 pb-12 max-w-5xl">
                 {ad.contentSections && ad.contentSections.map((section, idx) => (
                     <div key={idx} className="animate-fade-in-up">
                         <h2 className="text-2xl md:text-4xl font-bold text-slate-900 mb-6 md:mb-8 tracking-tight">{section.title}</h2>
                         {Array.isArray(section.content) ? (
                             <ul className="space-y-4 md:space-y-6 pl-2">
                                 {section.content.map((item, i) => (
                                     <li key={i} className="flex gap-4 md:gap-6 text-slate-700 leading-relaxed text-base md:text-xl items-start">
                                         <span className="w-2 h-2 rounded-full bg-slate-900 mt-3 flex-shrink-0"></span>
                                         <span>{item}</span>
                                     </li>
                                 ))}
                             </ul>
                         ) : (
                             <p className="text-slate-700 leading-loose text-base md:text-xl whitespace-pre-line font-light">{section.content}</p>
                         )}
                     </div>
                 ))}
            </div>

            {/* Expert Guidance Banner */}
            <div className="bg-[#0056D2] rounded-[3rem] overflow-hidden relative mt-12 mb-20 shadow-2xl group">
                 <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
                 <div className="px-8 py-12 md:px-20 md:py-20 relative z-10 flex flex-col md:flex-row items-center justify-between gap-8 md:gap-12">
                     <div className="max-w-xl text-center md:text-left">
                        <h2 className="text-3xl md:text-5xl font-bold text-white mb-4 md:mb-8 leading-tight">Looking for Expert Guidance?</h2>
                        <p className="text-blue-100 text-base md:text-xl leading-relaxed font-light">
                            Schedule a consultation with our media planner to seamlessly strategize and place your next promotion.
                        </p>
                     </div>
                     <button onClick={onBook} className="bg-[#D946EF] hover:bg-pink-500 text-white font-bold py-4 md:py-6 px-10 md:px-16 rounded-2xl shadow-xl transition-all transform hover:scale-105 whitespace-nowrap uppercase text-sm md:text-base tracking-[0.2em]">Learn More</button>
                 </div>
                 <div className="absolute -top-10 -right-10 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
                 <div className="absolute bottom-10 right-32 text-white/10 hidden md:block"><span className="text-[12rem] font-black rotate-12 block select-none">?</span></div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default AdDetailPage;
