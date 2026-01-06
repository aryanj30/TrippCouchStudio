
import React, { useState, useEffect } from 'react';
import { X, Loader, Check } from 'lucide-react';
import { db } from '../firebase';
import firebase from 'firebase/compat/app';

interface BookCallPopupProps {
  isOpen: boolean;
  onClose: () => void;
}

const BookCallPopup: React.FC<BookCallPopupProps> = ({ isOpen, onClose }) => {
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    message: ''
  });

  useEffect(() => {
    if (isOpen) {
      setIsSuccess(false); // Reset success state on open
      setTimeout(() => setShow(true), 50);
    } else {
      setShow(false);
    }
  }, [isOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.firstName || !formData.email || !formData.phone) {
        alert("Please fill in the required fields.");
        return;
    }

    setLoading(true);
    try {
        await db.collection('consultations').add({
            ...formData,
            status: 'New', // New, Contacted, Closed
            createdAt: firebase.firestore.FieldValue.serverTimestamp()
        });
        
        // Show success animation state instead of alert
        setIsSuccess(true);
        setFormData({ firstName: '', lastName: '', email: '', phone: '', message: '' });
        
    } catch (error: any) {
        console.error("Error submitting form:", error);
        if (error.code === 'permission-denied') {
            alert("Database Permission Error: Please update your Firestore Security Rules to allow 'create' on the 'consultations' collection.");
        } else {
            alert("Something went wrong. Please try again.");
        }
    } finally {
        setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className={`fixed inset-0 z-[100] flex items-center justify-center transition-all duration-500 ${show ? 'bg-black/60 backdrop-blur-sm opacity-100' : 'bg-transparent opacity-0 pointer-events-none'}`}>
      <div className={`relative bg-white rounded-2xl w-full max-w-4xl mx-4 shadow-2xl overflow-hidden flex flex-col md:flex-row transition-all duration-500 transform ${show ? 'scale-100 translate-y-0' : 'scale-95 translate-y-10'}`}>
        
        {/* --- SUCCESS STATE OVERLAY --- */}
        {isSuccess && (
            <div className="absolute inset-0 z-50 bg-white flex flex-col items-center justify-center p-8 animate-fade-in">
                <div className="w-24 h-24 bg-green-50 rounded-full flex items-center justify-center mb-6 animate-scale-in shadow-inner">
                    <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center shadow-lg shadow-green-500/30">
                        <Check className="text-white w-8 h-8 stroke-[3]" />
                    </div>
                </div>
                
                <h2 className="text-3xl font-display font-bold text-slate-900 mb-3 text-center animate-fade-in-up">Request Received!</h2>
                <p className="text-slate-500 text-center max-w-sm mb-8 leading-relaxed animate-fade-in-up delay-100">
                    Thank you for contacting Tripp Couch Studio. Our team has received your project details and will be in touch with you shortly.
                </p>
                
                <button 
                    onClick={onClose}
                    className="bg-slate-900 text-white font-bold py-3 px-8 rounded-xl shadow-lg hover:bg-slate-800 transition-all transform hover:scale-105 animate-fade-in-up delay-200"
                >
                    Continue Browsing
                </button>
            </div>
        )}

        {/* Left Side - Form */}
        <div className="w-full md:w-1/2 p-8 md:p-12 relative">
          
          <div className="relative z-10">
             <h2 className="text-2xl font-bold text-slate-900 mb-6">Let's discuss your project</h2>
             <form className="space-y-4" onSubmit={handleSubmit}>
                    <div className="space-y-4">
                        <input 
                            name="firstName"
                            value={formData.firstName}
                            onChange={handleChange}
                            type="text" 
                            placeholder="First Name *" 
                            required
                            className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 text-sm text-slate-700 placeholder-slate-400 focus:ring-2 focus:ring-[#0056D2] outline-none transition-all"
                        />
                        <input 
                            name="lastName"
                            value={formData.lastName}
                            onChange={handleChange}
                            type="text" 
                            placeholder="Last Name" 
                            className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 text-sm text-slate-700 placeholder-slate-400 focus:ring-2 focus:ring-[#0056D2] outline-none transition-all"
                        />
                        <input 
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            type="email" 
                            placeholder="Email *" 
                            required
                            className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 text-sm text-slate-700 placeholder-slate-400 focus:ring-2 focus:ring-[#0056D2] outline-none transition-all"
                        />
                         <input 
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            type="tel" 
                            placeholder="Contact Number *" 
                            required
                            className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 text-sm text-slate-700 placeholder-slate-400 focus:ring-2 focus:ring-[#0056D2] outline-none transition-all"
                        />
                        <textarea 
                            name="message"
                            value={formData.message}
                            onChange={handleChange}
                            placeholder="Leave us a message" 
                            rows={3}
                            className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 text-sm text-slate-700 placeholder-slate-400 focus:ring-2 focus:ring-[#0056D2] outline-none resize-none transition-all"
                        />
                    </div>
                    
                    <button 
                        type="submit" 
                        disabled={loading}
                        className="w-full bg-[#0056D2] hover:bg-[#0044a6] text-white font-bold py-3.5 rounded-lg shadow-sm transition-all transform hover:scale-[1.01] mt-4 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                        {loading ? <Loader className="animate-spin" size={20}/> : 'Book a call'}
                    </button>
             </form>
          </div>
        </div>

        {/* Right Side - Clean Illustration */}
        <div className="hidden md:flex w-1/2 bg-slate-50 relative items-center justify-center p-8 overflow-hidden border-l border-slate-100">
             <img 
                src="assets/pop_up.png" 
                alt="Project Illustration" 
                className="relative z-10 w-full max-w-sm object-contain"
             />

             {/* Minimal 'Later' Button */}
             <button 
                onClick={onClose}
                className="absolute bottom-6 right-6 text-slate-400 hover:text-slate-600 font-medium text-sm px-4 py-2 hover:bg-slate-200 rounded-lg transition-colors"
            >
                Later
            </button>
        </div>

        {/* Close Button */}
        <button 
            onClick={onClose}
            className="absolute top-4 right-4 p-2 hover:bg-slate-100 rounded-full text-slate-500 hover:text-slate-800 transition-colors z-50"
        >
            <X size={20} />
        </button>

      </div>
    </div>
  );
};

export default BookCallPopup;
