
import React from 'react';
import { useData } from './DataContext';
import { ArrowRight, PlayCircle } from 'lucide-react';

interface HeroProps {
  onContactClick: () => void;
}

const Hero: React.FC<HeroProps> = ({ onContactClick }) => {
  const { siteData } = useData();
  const { hero } = siteData;

  return (
    <section className="relative pt-24 md:pt-32 pb-12 md:pb-20 px-6 md:px-12 overflow-hidden min-h-[85vh] md:min-h-[90vh] flex items-center bg-gradient-to-b from-white to-slate-50">
      
      {/* Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          <div className="absolute -top-[10%] -right-[10%] w-[50%] h-[50%] bg-blue-100 rounded-full blur-[120px] opacity-40 animate-pulse"></div>
          <div className="absolute top-[20%] -left-[10%] w-[40%] h-[40%] bg-pink-100 rounded-full blur-[100px] opacity-30"></div>
      </div>

      <div className="max-w-[1400px] mx-auto w-full grid lg:grid-cols-2 gap-12 md:gap-16 items-center relative z-10">
        
        {/* Left Content */}
        <div className="flex flex-col items-start text-left animate-fade-in-up">
          
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white border border-slate-200 shadow-sm mb-6 md:mb-8">
             <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
             <span className="text-sm font-bold tracking-[0.1em] uppercase text-slate-500">{hero.subtitle}</span>
          </div>
          
          <h1 className="text-3xl md:text-6xl lg:text-8xl font-display font-bold leading-[1.1] md:leading-[0.95] mb-6 md:mb-8 tracking-tighter text-secondary">
             {hero.title.split('\n')[0]}
             <span className="block text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent pb-1 md:pb-2">
                {hero.title.split('\n')[1] || "Digital Impact"}
             </span>
          </h1>
          
          <p className="text-base md:text-xl text-slate-600 mb-8 md:mb-10 max-w-lg leading-relaxed font-light">
             We blend creative strategy with data-driven execution to help brands launch, scale, and dominate their market niche.
          </p>

          <div className="flex flex-col sm:flex-row w-full sm:w-auto gap-4">
              <button 
                onClick={onContactClick}
                className="bg-primary text-white font-bold py-3.5 px-8 rounded-full shadow-xl shadow-blue-500/20 hover:bg-blue-700 hover:-translate-y-1 transition-all flex items-center justify-center gap-2 text-base"
              >
                  {hero.ctaText || "Start Project"}
                  <ArrowRight size={18} />
              </button>
              
              <button className="bg-white text-slate-900 border border-slate-200 font-bold py-3.5 px-8 rounded-full hover:bg-slate-50 hover:border-slate-300 transition-all flex items-center justify-center gap-2 text-base">
                  <PlayCircle size={18} />
                  Showreel
              </button>
          </div>
        </div>
        
        {/* Right Composition */}
        <div className="relative animate-fade-in delay-200 flex justify-center lg:justify-end mt-4 md:mt-0">
             <div className="relative w-full max-w-xl aspect-[4/3] md:aspect-auto md:h-[600px] rounded-[2rem] md:rounded-[3rem] overflow-hidden shadow-2xl border-4 border-white transform rotate-1 hover:rotate-0 transition-transform duration-700">
                <img 
                    src={hero.imageUrl} 
                    alt="Hero Visual" 
                    className="w-full h-full object-cover scale-105 hover:scale-100 transition-transform duration-1000"
                />
                
                {/* Glass Cards Overlay */}
                <div className="absolute bottom-6 left-6 right-6 md:bottom-8 md:left-8 md:right-8 glass-panel p-4 md:p-6 rounded-2xl shadow-lg border-white/40">
                    <div className="flex justify-between items-end">
                        <div>
                            <p className="text-[10px] md:text-xs font-bold uppercase tracking-widest text-slate-500 mb-1">Current Campaign</p>
                            <h3 className="text-lg md:text-2xl font-bold text-slate-900">Zee5 Integration</h3>
                        </div>
                        <div className="w-10 h-10 md:w-12 md:h-12 bg-primary rounded-full flex items-center justify-center text-white">
                            <ArrowRight size={18} className="-rotate-45"/>
                        </div>
                    </div>
                </div>
             </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
