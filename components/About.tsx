import React from 'react';

interface AboutProps {
  onNavigate: (page: string) => void;
}

const About: React.FC<AboutProps> = ({ onNavigate }) => {
  return (
    <div className="pt-8 pb-20 px-6 md:px-12 max-w-[1400px] mx-auto bg-gray-50 min-h-screen flex flex-col font-sans animate-fade-in-up">
      {/* Breadcrumb */}
      <div className="text-sm text-slate-500 mb-16 font-medium">
        <span 
          className="cursor-pointer hover:text-slate-900 transition-colors" 
          onClick={() => onNavigate('home')}
        >
          Home
        </span> 
        <span className="mx-2">&gt;</span> 
        <span className="text-slate-900">About Us</span>
      </div>

      {/* Main Content Grid */}
      <div className="grid lg:grid-cols-12 gap-8 lg:gap-24 mb-32">
        {/* Title Column */}
        <div className="lg:col-span-4 animate-fade-in-up delay-100">
          <h1 className="text-5xl md:text-6xl font-black text-slate-900 tracking-tighter leading-none mb-8 lg:mb-0">
            About Us
          </h1>
        </div>

        {/* Text Column */}
        <div className="lg:col-span-8 pt-2 animate-fade-in-up delay-200">
          <h2 className="text-xl text-slate-400 font-medium mb-6">Who We Are</h2>
          
          <p className="text-slate-800 text-lg md:text-xl leading-relaxed md:leading-loose font-normal text-left">
            At TripCouch Studio, we understand that in a crowded market, a brand requires a distinct identity, a compelling story, and connecting visuals to truly stand out. We partner with ambitious brands to build a professional and memorable presence through a bespoke blend of branding, marketing, and digital creativity, ensuring they don't just show up - they get noticed and thrive. Our strategic expertise is demonstrated by managing substantial digital advertising budgets and driving growth across diverse sectors like digital gaming, lifestyle, and luxury. This is guided by leadership with a background in lifestyle design, which provides deep insight into luxury branding and is further enhanced by significant experience in the gaming industry, overseeing projects from concept to campaign. This unique fusion of high-end aesthetic sensibilities and digital performance storytelling brings a fresh, modern approach to building brand experiences.
          </p>
        </div>
      </div>

      {/* Footer Section */}
      <div className="mt-auto animate-fade-in-up delay-300">
        {/* Top Divider */}
        <div className="w-full border-t border-slate-900 mb-10"></div>
        
        <h3 className="text-2xl md:text-3xl font-bold text-slate-900 text-center mb-10 px-4">
          Connect with us to explore your project's potential.
        </h3>
        
        {/* Bottom Divider */}
        <div className="w-full border-t border-slate-900 mb-16"></div>

        {/* Footer Info Grid */}
        <div className="grid lg:grid-cols-12 gap-8 lg:gap-24 text-base">
           
           {/* Left Column matching "About Us" width */}
           <div className="lg:col-span-4 flex flex-col gap-12">
             {/* Office */}
             <div>
                <h4 className="font-bold text-slate-900 mb-4 uppercase tracking-wider text-sm">OFFICE</h4>
                <p className="text-slate-700 leading-relaxed">
                  Tidke Nagar, Behind City Center mall<br />
                  Nashik, MH.<br />
                  422009
                </p>
             </div>

             {/* Contact */}
             <div>
                <h4 className="font-bold text-slate-900 mb-4 uppercase tracking-wider text-sm">CONTACT</h4>
                <div className="flex flex-col gap-1">
                  <p className="text-slate-700 mb-1">+91-7416155266</p>
                  <a href="mailto:Contact@trippcouchstudio.com" className="text-slate-700 hover:text-blue-600 break-all">Contact@trippcouchstudio.com</a>
                </div>
             </div>
           </div>

           {/* Right Column matching Content width */}
           <div className="lg:col-span-8">
              {/* Social */}
              <div>
                <h4 className="font-bold text-slate-900 mb-4 uppercase tracking-wider text-sm">SOCIAL</h4>
                <div className="flex flex-col gap-2">
                  <a href="#" className="text-slate-700 hover:text-blue-600 underline decoration-slate-400 underline-offset-4 w-max">Instagram</a>
                  <a href="#" className="text-slate-700 hover:text-blue-600 underline decoration-slate-400 underline-offset-4 w-max">LinkedIn</a>
                </div>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default About;