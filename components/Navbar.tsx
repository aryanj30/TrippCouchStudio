
import React, { useState, useEffect } from 'react';
import { Menu, X, User, ArrowUpRight } from 'lucide-react';
import { useAuth } from './AuthContext';
import { useData } from './DataContext';

interface NavbarProps {
  onNavigate: (page: string) => void;
  currentPage: string;
  onContactClick: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ onNavigate, currentPage, onContactClick }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { isAuthenticated } = useAuth();
  const { siteData } = useData();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNav = (page: string, e: React.MouseEvent) => {
    e.preventDefault();
    onNavigate(page);
    setIsOpen(false);
  };

  return (
    <>
      <nav 
        className={`fixed top-4 left-0 right-0 z-50 transition-all duration-500 flex justify-center px-4`}
      >
        <div className={`
          max-w-[1200px] w-full transition-all duration-300 rounded-2xl flex items-center justify-between px-6 md:px-8 py-4
          ${scrolled ? 'bg-white/80 backdrop-blur-xl shadow-lg border border-white/20' : 'bg-transparent'}
        `}>
          
          {/* Logo */}
          <div 
            className="cursor-pointer select-none"
            onClick={(e) => handleNav('home', e)}
          >
            <img 
              src="assets/logo.png" 
              alt={`${siteData.brand.line1} ${siteData.brand.line2}`} 
              className="h-10 md:h-12 w-auto object-contain"
            />
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-1">
             {[
                { id: 'home', label: 'Home' },
                { id: 'about', label: 'About' },
                { id: 'zee5', label: 'Ads Platform' }
             ].map((item) => (
                <button 
                  key={item.id}
                  onClick={(e) => handleNav(item.id, e)}
                  className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                    currentPage === item.id 
                    ? 'bg-slate-100 text-primary' 
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  {item.label}
                </button>
             ))}
          </div>

          {/* Actions */}
          <div className="hidden md:flex items-center gap-3">
             <button 
                onClick={onContactClick} 
                className="bg-primary hover:bg-blue-700 text-white rounded-xl px-5 py-2.5 text-sm font-bold transition-all shadow-lg hover:shadow-blue-500/25 flex items-center gap-2 group"
              >
                Let's Talk
                <ArrowUpRight size={16} className="group-hover:rotate-45 transition-transform" />
              </button>

              {isAuthenticated ? (
                  <button 
                      onClick={(e) => handleNav('dashboard', e)}
                      className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center hover:bg-slate-800 transition-colors shadow-md"
                      title="User Dashboard"
                  >
                      <User size={18} />
                  </button>
              ) : (
                  <button 
                      onClick={(e) => handleNav('login', e)}
                      className="w-10 h-10 rounded-xl bg-white border border-slate-200 text-slate-500 flex items-center justify-center hover:bg-slate-50 transition-colors"
                      title="Login"
                  >
                      <User size={18} />
                  </button>
              )}
          </div>

          {/* Mobile Menu Button */}
          <button 
            onClick={() => setIsOpen(!isOpen)} 
            className="md:hidden text-slate-900 bg-white p-2 rounded-lg shadow-sm border border-slate-100"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <div className={`fixed inset-0 bg-white z-40 transition-transform duration-500 ease-in-out md:hidden ${isOpen ? 'translate-y-0' : 'translate-y-full'}`}>
        <div className="flex flex-col h-full pt-32 px-8 gap-6">
            <a href="#" onClick={(e) => handleNav('home', e)} className="text-4xl font-display font-bold text-slate-900">Home</a>
            <a href="#" onClick={(e) => handleNav('about', e)} className="text-4xl font-display font-bold text-slate-900">About</a>
            <a href="#" onClick={(e) => handleNav('zee5', e)} className="text-4xl font-display font-bold text-slate-900">Ads Platform</a>
            
            <div className="h-px bg-slate-100 w-full my-4"></div>
            
            <button onClick={() => { setIsOpen(false); onContactClick(); }} className="text-2xl font-bold text-primary text-left">Start Project</button>
            <button onClick={(e) => handleNav(isAuthenticated ? 'dashboard' : 'login', e)} className="text-lg font-medium text-slate-500 text-left mt-auto mb-12">
               {isAuthenticated ? 'My Dashboard' : 'Client Login'}
            </button>
        </div>
      </div>
    </>
  );
};

export default Navbar;
