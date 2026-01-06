
import React from 'react';
import { ArrowRight, Instagram, Linkedin, Mail, Phone, MapPin } from 'lucide-react';
import { useData } from './DataContext';

interface StatsAndFooterProps {
  onNavigate?: (page: string) => void;
  onContactClick?: () => void;
}

const StatsAndFooter: React.FC<StatsAndFooterProps> = ({ onNavigate, onContactClick }) => {
  const { siteData } = useData();
  const { stats, contact } = siteData;

  return (
    <div className="bg-[#F2F2F0]"> {/* Beige/Grey background from Figma */}
      
      {/* Stats Section */}
      <section className="px-6 md:px-12 py-16 md:py-24">
        <div className="max-w-[1400px] mx-auto grid lg:grid-cols-2 gap-12 lg:gap-16 items-start">
          <div>
            <h2 className="text-xl md:text-5xl font-medium text-slate-900 leading-[1.3] md:leading-[1.2] max-w-lg tracking-tight">
              {stats.mainText}
            </h2>
          </div>
          
          <div className="space-y-12 md:space-y-16 mt-4 lg:mt-0">
             {/* Stat 1 */}
             <div className="group">
                <div className="text-5xl md:text-8xl font-light text-slate-900 mb-1 md:mb-2 tracking-tighter group-hover:text-[#0056D2] transition-colors duration-500">{stats.stat1.val}</div>
                <p className="text-slate-500 text-xs md:text-base font-medium uppercase tracking-wide">{stats.stat1.label}</p>
                <div className="w-full h-px bg-slate-300 mt-6 md:mt-8 group-hover:scale-x-100 origin-left transition-transform duration-700"></div>
             </div>

             {/* Stat 2 */}
             <div className="group">
                <div className="text-5xl md:text-8xl font-light text-slate-900 mb-1 md:mb-2 tracking-tighter group-hover:text-[#0056D2] transition-colors duration-500">{stats.stat2.val}</div>
                <p className="text-slate-500 text-xs md:text-base font-medium uppercase tracking-wide">{stats.stat2.label}</p>
                <div className="w-full h-px bg-slate-300 mt-6 md:mt-8"></div>
             </div>

             {/* Stat 3 + Link */}
             <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
                <div className="group">
                    <div className="text-5xl md:text-8xl font-light text-slate-900 mb-1 md:mb-2 tracking-tighter group-hover:text-[#0056D2] transition-colors duration-500">{stats.stat3.val}</div>
                    <p className="text-slate-500 text-xs md:text-base font-medium uppercase tracking-wide">{stats.stat3.label}</p>
                </div>
                
                <div 
                    onClick={() => onNavigate?.('about')} 
                    className="flex items-center gap-3 text-slate-900 hover:text-[#0056D2] cursor-pointer text-sm md:text-base font-bold uppercase tracking-wider mb-2 md:mb-4 group transition-colors"
                >
                    About Us 
                    <div className="bg-slate-900 text-white rounded-full p-2 group-hover:bg-[#0056D2] transition-colors">
                        <ArrowRight size={14} className="group-hover:-rotate-45 transition-transform duration-300" />
                    </div>
                </div>
             </div>
          </div>
        </div>
      </section>

      {/* CTA Banner - Reduced padding on mobile */}
      <section className="px-6 md:px-12 pb-16 md:pb-24">
        <div className="max-w-[1400px] mx-auto bg-[#0056D2] rounded-[1.5rem] md:rounded-[2.5rem] p-6 md:p-20 relative overflow-hidden flex flex-col md:flex-row items-center justify-between shadow-2xl group">
          <div className="relative z-10 max-w-xl text-center md:text-left">
            <h2 className="text-2xl md:text-5xl font-bold text-white mb-4 md:mb-6 leading-tight">
              {stats.ctaTitle}
            </h2>
            <p className="text-blue-100 text-base md:text-lg mb-8 md:mb-10 leading-relaxed font-light">
              {stats.ctaDescription}
            </p>
            <button 
                onClick={onContactClick}
                className="bg-[#D946EF] hover:bg-pink-600 text-white text-xs md:text-sm font-bold py-3 md:py-4 px-8 md:px-10 rounded-xl shadow-lg uppercase tracking-widest transition-all transform hover:translate-y-[-2px] hover:shadow-pink-500/30"
            >
              Start a Project
            </button>
          </div>

          {/* Illustration Placeholder */}
          <div className="relative z-10 mt-12 md:mt-0 transform md:group-hover:scale-105 transition-transform duration-700 hidden md:block">
             <div className="w-56 h-56 bg-white/10 rounded-full flex items-center justify-center backdrop-blur-md border border-white/20 shadow-inner">
                <span className="text-8xl text-white font-bold opacity-80">?</span>
             </div>
             {/* Decorative Elements */}
             <div className="absolute -top-6 -right-6 text-[#A3E635] animate-spin-slow">
                 <svg width="60" height="60" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 17h-2v-2h2v2zm2.07-7.75l-.9.92C13.45 12.9 13 13.5 13 15h-2v-.5c0-1.1.45-2.1 1.17-2.83l1.24-1.26c.37-.36.59-.86.59-1.41 0-1.1-.9-2-2-2s-2 .9-2 2H8c0-2.21 1.79-4 4-4s4 1.79 4 4c0 .88-.36 1.68-.93 2.25z"/></svg>
             </div>
             <div className="absolute -bottom-4 -left-8 w-16 h-16 bg-[#FCD34D] rounded-full blur-xl opacity-60"></div>
          </div>

          {/* Abstract background */}
          <div className="absolute right-0 bottom-0 w-[500px] h-[500px] bg-gradient-to-tl from-blue-600 to-transparent rounded-full opacity-30 translate-x-1/4 translate-y-1/4"></div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#EAEAEA] text-slate-900 border-t border-slate-300">
        <div className="max-w-[1400px] mx-auto px-6 md:px-12 pt-16 md:pt-20 pb-12">
            
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 md:mb-20 gap-8">
                <h3 className="font-medium text-2xl md:text-5xl max-w-2xl leading-tight tracking-tight text-slate-800">
                    Connect with us to explore your project's potential.
                </h3>
                
                <button 
                  onClick={onContactClick}
                  className="group flex items-center gap-4 text-lg md:text-xl font-bold border-b-2 border-slate-900 pb-2 hover:border-[#0056D2] hover:text-[#0056D2] transition-colors"
                >
                    Let's Talk
                    <ArrowRight className="group-hover:translate-x-2 transition-transform" />
                </button>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 lg:gap-20 mb-16 md:mb-24">
                <div className="space-y-4 md:space-y-6">
                     <h4 className="font-bold text-slate-400 uppercase text-xs tracking-[0.2em] flex items-center gap-2">
                        <MapPin size={14} /> Office
                     </h4>
                     <p className="text-slate-800 leading-relaxed font-medium text-base md:text-lg whitespace-pre-line">
                         {contact.address}
                     </p>
                </div>
                
                 <div className="space-y-4 md:space-y-6">
                     <h4 className="font-bold text-slate-400 uppercase text-xs tracking-[0.2em] flex items-center gap-2">
                        <Instagram size={14} /> Social
                     </h4>
                     <div className="flex flex-col gap-2 md:gap-3 items-start">
                         <a href={contact.instagram} target="_blank" rel="noreferrer" className="text-slate-800 hover:text-[#0056D2] font-medium text-base md:text-lg hover:translate-x-1 transition-transform inline-flex items-center gap-2">
                            Instagram
                         </a>
                         <a href={contact.linkedin} target="_blank" rel="noreferrer" className="text-slate-800 hover:text-[#0056D2] font-medium text-base md:text-lg hover:translate-x-1 transition-transform inline-flex items-center gap-2">
                            LinkedIn
                         </a>
                     </div>
                </div>

                <div className="space-y-4 md:space-y-6">
                     <h4 className="font-bold text-slate-400 uppercase text-xs tracking-[0.2em]">Links</h4>
                     <div className="flex flex-col gap-2 md:gap-3">
                         <button onClick={() => onNavigate?.('home')} className="text-left text-slate-800 hover:text-[#0056D2] font-medium text-base md:text-lg hover:translate-x-1 transition-transform">Home</button>
                         <button onClick={() => onNavigate?.('about')} className="text-left text-slate-800 hover:text-[#0056D2] font-medium text-base md:text-lg hover:translate-x-1 transition-transform">About Us</button>
                         <button onClick={() => onNavigate?.('zee5')} className="text-left text-slate-800 hover:text-[#0056D2] font-medium text-base md:text-lg hover:translate-x-1 transition-transform">Ads Platform</button>
                     </div>
                </div>

                <div className="space-y-4 md:space-y-6">
                     <h4 className="font-bold text-slate-400 uppercase text-xs tracking-[0.2em] flex items-center gap-2">
                        <Phone size={14} /> Contact
                     </h4>
                     <div className="flex flex-col gap-2 md:gap-4">
                        <a href={`tel:${contact.phone}`} className="text-slate-800 hover:text-[#0056D2] font-medium text-base md:text-lg hover:translate-x-1 transition-transform">{contact.phone}</a>
                        <a href={`mailto:${contact.email}`} className="text-slate-800 hover:text-[#0056D2] font-medium text-base md:text-lg hover:translate-x-1 transition-transform break-words">{contact.email}</a>
                     </div>
                </div>
            </div>

            {/* Bottom Bar */}
            <div className="border-t border-slate-300 pt-8 md:pt-10 flex flex-col md:flex-row justify-between items-center gap-6 text-sm text-slate-500 font-medium">
                <p>&copy; {new Date().getFullYear()} Tripp Couch Studio. All rights reserved.</p>
                <div className="flex gap-6 md:gap-8">
                    <a href="#" className="hover:text-slate-900 transition-colors">Privacy Policy</a>
                    <a href="#" className="hover:text-slate-900 transition-colors">Terms of Service</a>
                </div>
            </div>
            
            {/* Giant Watermark Text */}
            <div className="mt-12 md:mt-20 border-t border-slate-200 pt-8 md:pt-10">
                <h1 className="text-[12vw] leading-none font-black text-slate-300/40 tracking-tighter text-center select-none">
                    TRIPP COUCH
                </h1>
            </div>
        </div>
      </footer>
    </div>
  );
};

export default StatsAndFooter;
