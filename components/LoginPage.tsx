
import React, { useState } from 'react';
import { useAuth } from './AuthContext';
import { Mail, Lock, ArrowRight, User, CheckCircle, ArrowLeft, Loader2, Sparkles } from 'lucide-react';
import { auth, db } from '../firebase';
import { useData } from './DataContext';

interface LoginPageProps {
  onNavigate: (page: string) => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onNavigate }) => {
  const [isLogin, setIsLogin] = useState(true);
  const { login, signup } = useAuth();
  const { siteData } = useData();
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRedirect = async () => {
      const user = auth.currentUser;
      if (user) {
          const adminDoc = await db.collection('admins').doc(user.uid).get();
          if (adminDoc.exists) {
              onNavigate('admin');
          } else {
              onNavigate('dashboard');
          }
      }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
        if (isLogin) {
            await login(email, password);
            await handleRedirect();
        } else {
            if (!name.trim()) throw new Error("Please enter your full name.");
            if (password !== confirmPassword) throw new Error("Passwords do not match.");
            
            await signup(email, password, name);
            // Auto redirect handled by AuthContext listener usually, but here we wait for it
            await handleRedirect();
        }
    } catch (err: any) {
        console.error(err);
        if (err.message) {
             setError(err.message);
        } else if (err.code === 'auth/invalid-credential' || err.code === 'auth/wrong-password') {
            setError('Invalid email or password.');
        } else if (err.code === 'auth/email-already-in-use') {
            setError('Email is already in use.');
        } else if (err.code === 'auth/weak-password') {
            setError('Password should be at least 6 characters.');
        } else {
            setError('An error occurred. Please try again.');
        }
    } finally {
        setLoading(false);
    }
  };

  const toggleMode = () => {
      setIsLogin(!isLogin);
      setError('');
      setName('');
      setEmail('');
      setPassword('');
      setConfirmPassword('');
  };

  return (
    <div className="min-h-screen flex bg-white font-sans">
      
      {/* Left Side - Visual Panel (Hidden on Mobile) */}
      <div className="hidden lg:flex w-1/2 bg-slate-900 relative overflow-hidden items-center justify-center p-12 text-white">
          {/* Abstract Background Elements */}
          <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-600 rounded-full blur-[120px] opacity-20 translate-x-1/2 -translate-y-1/2 animate-pulse"></div>
          <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-purple-600 rounded-full blur-[100px] opacity-20 -translate-x-1/2 translate-y-1/2"></div>
          
          {/* Content */}
          <div className="relative z-10 max-w-lg">
              <div className="w-16 h-16 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center mb-8 border border-white/10 shadow-xl">
                  <Sparkles className="text-blue-400" size={32} />
              </div>
              <h1 className="text-5xl font-display font-bold mb-6 leading-tight">
                  {isLogin ? "Welcome back to the Studio." : "Start your digital journey."}
              </h1>
              <p className="text-slate-400 text-lg leading-relaxed mb-8">
                  Access premium ad inventory, manage your campaigns, and track real-time analytics all in one place.
              </p>
              
              {/* Testimonial / Stat */}
              <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
                  <div className="flex items-center gap-4 mb-4">
                      <div className="flex -space-x-2">
                          {[1,2,3].map(i => (
                              <div key={i} className="w-8 h-8 rounded-full bg-slate-700 border-2 border-slate-900 flex items-center justify-center text-[10px] font-bold">U{i}</div>
                          ))}
                      </div>
                      <p className="text-sm font-bold">Trusted by 500+ Brands</p>
                  </div>
                  <p className="text-xs text-slate-500 uppercase tracking-widest font-bold">Latest Update</p>
                  <p className="text-sm mt-1">Zee5 Ad Inventory now available with real-time bidding slots.</p>
              </div>
          </div>
      </div>

      {/* Right Side - Form Panel */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center px-6 md:px-12 lg:px-24 relative bg-[#FAFAFA] lg:bg-white">
          
          <button 
             onClick={() => onNavigate('home')}
             className="absolute top-8 left-8 flex items-center gap-2 text-slate-500 hover:text-slate-900 font-bold text-sm transition-colors"
          >
              <ArrowLeft size={18} /> Back to Home
          </button>

          <div className="max-w-md w-full mx-auto">
              <div className="mb-10">
                  <h2 className="text-3xl font-bold text-slate-900 tracking-tight mb-2">
                      {isLogin ? 'Sign In' : 'Create Account'}
                  </h2>
                  <p className="text-slate-500">
                      {isLogin ? 'Enter your credentials to access your account.' : 'Fill in the details below to get started.'}
                  </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                  
                  {!isLogin && (
                      <div className="space-y-1 animate-fade-in-up">
                          <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Full Name</label>
                          <div className="relative">
                              <User className="absolute left-4 top-3.5 text-slate-400" size={18} />
                              <input 
                                  type="text" 
                                  value={name} 
                                  onChange={e => setName(e.target.value)}
                                  className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 pl-12 pr-4 text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-all placeholder:text-slate-400"
                                  placeholder="John Doe"
                                  required={!isLogin}
                              />
                          </div>
                      </div>
                  )}

                  <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Email Address</label>
                      <div className="relative">
                          <Mail className="absolute left-4 top-3.5 text-slate-400" size={18} />
                          <input 
                              type="email" 
                              value={email} 
                              onChange={e => setEmail(e.target.value)}
                              className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 pl-12 pr-4 text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-all placeholder:text-slate-400"
                              placeholder="name@company.com"
                              required
                          />
                      </div>
                  </div>

                  <div className="space-y-1">
                      <div className="flex justify-between">
                          <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Password</label>
                          {isLogin && <button type="button" className="text-xs font-bold text-blue-600 hover:text-blue-700">Forgot?</button>}
                      </div>
                      <div className="relative">
                          <Lock className="absolute left-4 top-3.5 text-slate-400" size={18} />
                          <input 
                              type="password" 
                              value={password} 
                              onChange={e => setPassword(e.target.value)}
                              className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 pl-12 pr-4 text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-all placeholder:text-slate-400"
                              placeholder="••••••••"
                              required
                          />
                      </div>
                  </div>

                  {!isLogin && (
                      <div className="space-y-1 animate-fade-in-up">
                          <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Confirm Password</label>
                          <div className="relative">
                              <CheckCircle className="absolute left-4 top-3.5 text-slate-400" size={18} />
                              <input 
                                  type="password" 
                                  value={confirmPassword} 
                                  onChange={e => setConfirmPassword(e.target.value)}
                                  className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 pl-12 pr-4 text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-all placeholder:text-slate-400"
                                  placeholder="••••••••"
                                  required={!isLogin}
                              />
                          </div>
                      </div>
                  )}

                  {error && (
                      <div className="bg-red-50 text-red-600 text-sm font-medium p-4 rounded-xl border border-red-100 flex items-start gap-2 animate-fade-in">
                          <span className="mt-0.5 block w-2 h-2 rounded-full bg-red-500 shrink-0"></span>
                          {error}
                      </div>
                  )}

                  <button 
                      type="submit" 
                      disabled={loading}
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl shadow-lg shadow-blue-500/30 transition-all hover:-translate-y-1 flex items-center justify-center gap-2 disabled:opacity-70 disabled:hover:translate-y-0"
                  >
                      {loading && <Loader2 className="animate-spin" size={20} />}
                      {isLogin ? 'Sign In to Dashboard' : 'Create Free Account'}
                      {!loading && <ArrowRight size={20} />}
                  </button>
              </form>

              <div className="mt-8 text-center">
                  <p className="text-slate-500 text-sm">
                      {isLogin ? "Don't have an account yet?" : "Already have an account?"}
                      <button 
                          onClick={toggleMode}
                          className="text-blue-600 font-bold ml-2 hover:underline focus:outline-none"
                      >
                          {isLogin ? "Sign Up" : "Log In"}
                      </button>
                  </p>
              </div>
          </div>
      </div>
    </div>
  );
};

export default LoginPage;
