
import React, { useState } from 'react';
import Navbar from './components/Navbar';
import Home from './components/Home';
import About from './components/About';
import Zee5Detail from './components/Zee5Detail';
import AdDetailPage from './components/AdDetailPage';
import AdminDashboard from './components/AdminDashboard';
import UserPanel from './components/UserPanel';
import LoginPage from './components/LoginPage';
import BookCallPopup from './components/BookCallPopup';
import { DataProvider } from './components/DataContext';
import { AuthProvider } from './components/AuthContext';

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState('home');
  const [currentAdId, setCurrentAdId] = useState<string>('');
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNavigate = (page: string, id?: string) => {
    if (id) {
      setCurrentAdId(id);
    }
    setCurrentPage(page);
    scrollToTop();
  };

  const handleContactClick = () => {
    setIsPopupOpen(true);
  };

  return (
    <AuthProvider>
      <DataProvider>
        <div className="min-h-screen bg-gray-50 text-slate-900 overflow-x-hidden font-sans">
          {/* Hide Navbar on Login and Admin pages only. Show on Dashboard. */}
          {currentPage !== 'login' && currentPage !== 'admin' && (
            <Navbar onNavigate={handleNavigate} currentPage={currentPage} onContactClick={handleContactClick} />
          )}
          
          {currentPage === 'home' ? (
            <Home onNavigate={handleNavigate} onContactClick={handleContactClick} />
          ) : currentPage === 'about' ? (
            <About onNavigate={handleNavigate} />
          ) : currentPage === 'zee5' ? (
            <Zee5Detail onNavigate={handleNavigate} />
          ) : currentPage === 'ad-detail' ? (
            <AdDetailPage adId={currentAdId} onNavigate={handleNavigate} onBook={handleContactClick} />
          ) : currentPage === 'admin' ? (
            <AdminDashboard onNavigate={handleNavigate} />
          ) : currentPage === 'dashboard' ? (
            <UserPanel onNavigate={handleNavigate} />
          ) : currentPage === 'login' ? (
            <LoginPage onNavigate={handleNavigate} />
          ) : (
            <Home onNavigate={handleNavigate} onContactClick={handleContactClick} />
          )}

          {/* Global Popup */}
          <BookCallPopup isOpen={isPopupOpen} onClose={() => setIsPopupOpen(false)} />
        </div>
      </DataProvider>
    </AuthProvider>
  );
};

export default App;
