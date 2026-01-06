
import React from 'react';
import { Target, PenTool, Layout, ArrowRight } from 'lucide-react';
import { useData } from './DataContext';

interface TopServiceCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  btnText: string;
  imageUrl?: string;
}

const TopServiceCard: React.FC<TopServiceCardProps> = ({ title, description, icon, btnText, imageUrl }) => (
  <div className="bg-white rounded-[2rem] p-2 shadow-sm border border-slate-100 hover:shadow-2xl transition-all duration-500 group">
    {/* Reduced height on mobile from h-56 to h-48 */}
    <div className="bg-slate-50 rounded-[1.5rem] h-48 md:h-64 overflow-hidden relative mb-6">
         {imageUrl ? (
             <img src={imageUrl} alt={title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
         ) : (
            <div className="w-full h-full flex items-center justify-center text-primary/20 group-hover:text-primary transition-colors">
                {React.cloneElement(icon as React.ReactElement<any>, { size: 64, strokeWidth: 1 })}
            </div>
         )}
    </div>
    
    <div className="px-4 md:px-6 pb-5 md:pb-6">
        <h3 className="text-lg md:text-2xl font-display font-bold text-slate-900 mb-3">{title}</h3>
        <p className="text-slate-500 text-sm leading-relaxed mb-6 line-clamp-3">
          {description}
        </p>
        
        <button className="w-full flex items-center justify-between bg-white border border-slate-200 rounded-xl px-5 py-3 text-sm font-bold text-slate-900 group-hover:bg-slate-900 group-hover:text-white transition-colors">
            {btnText}
            <ArrowRight size={16} />
        </button>
    </div>
  </div>
);

const Services: React.FC = () => {
  const { siteData } = useData();
  const { topServices, moreServices } = siteData.services;

  const icons = [
    <Target key="1" />,
    <PenTool key="2" />,
    <Layout key="3" />
  ];

  return (
    <section className="bg-white relative z-10">
      
      {/* Top Services */}
      <div className="py-16 md:py-24 px-6 md:px-12 max-w-[1400px] mx-auto">
        <div className="mb-10 md:mb-16">
            <span className="text-primary font-bold uppercase tracking-widest text-xs">What we do</span>
            <h2 className="text-2xl md:text-5xl font-display font-bold text-slate-900 mt-2">Core Services</h2>
        </div>
        
        <div className="grid md:grid-cols-3 gap-6 md:gap-8">
          {topServices.map((service, index) => (
            <TopServiceCard 
              key={service.id}
              title={service.title} 
              description={service.description}
              icon={icons[index % icons.length]} 
              btnText={service.btnText}
              imageUrl={service.imageUrl}
            />
          ))}
        </div>
      </div>

      {/* Detailed Services List */}
      <div className="bg-slate-900 py-16 md:py-24 px-6 md:px-12 text-white">
          <div className="max-w-[1400px] mx-auto">
            <div className="grid lg:grid-cols-12 gap-10 lg:gap-16">
                <div className="lg:col-span-4">
                    <h2 className="text-2xl md:text-5xl font-display font-bold mb-4 md:mb-6">Capabilities</h2>
                    <p className="text-slate-400 text-sm md:text-lg leading-relaxed">
                        Beyond our core offerings, we provide a comprehensive suite of digital and creative services tailored to scale your brand.
                    </p>
                </div>
                
                <div className="lg:col-span-8 grid sm:grid-cols-2 gap-10 md:gap-12">
                    {moreServices.map((category) => (
                        <div key={category.id} className="group">
                            <h4 className="text-accent font-bold uppercase text-xs tracking-[0.2em] mb-4 md:mb-6 pb-2 border-b border-white/10">{category.categoryName}</h4>
                            <ul className="space-y-3">
                                {category.items.map((item, i) => (
                                    <li key={i} className="text-slate-300 text-sm md:text-lg hover:text-white transition-colors cursor-default flex items-center gap-3">
                                        <span className="w-1.5 h-1.5 bg-slate-600 rounded-full group-hover:bg-primary transition-colors"></span>
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
            </div>
          </div>
      </div>
    </section>
  );
};

export default Services;
