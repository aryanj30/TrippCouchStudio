
import React, { useState, useEffect, useRef } from 'react';
import { useData } from './DataContext';
import { useAuth } from './AuthContext';
import { useToast } from './ToastContext';
import { db } from '../firebase';
import firebase from 'firebase/compat/app';
import { 
  Save, Plus, Trash2, LogOut, Image as ImageIcon, 
  LayoutDashboard, Layers, BarChart, Megaphone, 
  Phone, Settings, ChevronRight, X, Edit3, List, Type, 
  MessageSquare, Search, Send, User, ShoppingBag, 
  ChevronDown, ChevronUp, Box, CheckCircle, Clock, AlertCircle,
  Users, Calendar, Mail, Copy
} from 'lucide-react';
import { 
  SiteData, AdCardData, ServiceItem, Order, 
  Consultation, ChatSession, ChatMessage, ExecutionSection, ContentSection
} from '../types';

// --- Sub-components ---

const NavButton = ({ id, icon, label, badge, activeTab, setActiveTab }: any) => (
  <button
    onClick={() => setActiveTab(id)}
    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${activeTab === id ? 'bg-blue-600 text-white shadow-lg' : 'text-gray-400 hover:bg-gray-800 hover:text-white'}`}
  >
    {icon}
    {label}
    {badge && <span className="ml-auto w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>}
  </button>
);

const Sidebar = ({ activeTab, setActiveTab, onNavigate, handleSave }: any) => {
    const [expandedMenu, setExpandedMenu] = useState({ web: true, users: true });

    return (
        <aside className="w-64 bg-[#0F172A] text-white fixed h-full flex flex-col z-50 overflow-y-auto border-r border-gray-800">
            <div className="p-6 border-b border-gray-800">
                <h1 className="font-display text-2xl font-bold tracking-tight">CMS Admin</h1>
                <p className="text-xs text-gray-400 mt-1">Manage Tripp Couch Studio</p>
            </div>
            
            <nav className="flex-1 p-4 space-y-6">
                {/* User Relations Group */}
                <div>
                    <button 
                        onClick={() => setExpandedMenu(p => ({...p, users: !p.users}))}
                        className="flex items-center justify-between w-full text-xs font-bold text-gray-500 uppercase tracking-widest mb-3 hover:text-white transition-colors"
                    >
                        User Relations
                        {expandedMenu.users ? <ChevronUp size={14}/> : <ChevronDown size={14}/>}
                    </button>
                    {expandedMenu.users && (
                        <div className="space-y-1 animate-fade-in">
                            <NavButton activeTab={activeTab} setActiveTab={setActiveTab} id="messages" icon={<MessageSquare size={18}/>} label="Live Chat" badge={true} />
                            <NavButton activeTab={activeTab} setActiveTab={setActiveTab} id="consultations" icon={<Users size={18}/>} label="Leads & Requests" />
                            <NavButton activeTab={activeTab} setActiveTab={setActiveTab} id="orders" icon={<ShoppingBag size={18}/>} label="User Orders" />
                        </div>
                    )}
                </div>

                {/* Edit Web Group */}
                <div>
                    <button 
                        onClick={() => setExpandedMenu(p => ({...p, web: !p.web}))}
                        className="flex items-center justify-between w-full text-xs font-bold text-gray-500 uppercase tracking-widest mb-3 hover:text-white transition-colors"
                    >
                        Edit Web
                        {expandedMenu.web ? <ChevronUp size={14}/> : <ChevronDown size={14}/>}
                    </button>
                    {expandedMenu.web && (
                        <div className="space-y-1 animate-fade-in">
                            <NavButton activeTab={activeTab} setActiveTab={setActiveTab} id="general" icon={<Settings size={18}/>} label="General & Brand" />
                            <NavButton activeTab={activeTab} setActiveTab={setActiveTab} id="hero" icon={<LayoutDashboard size={18}/>} label="Hero Section" />
                            <NavButton activeTab={activeTab} setActiveTab={setActiveTab} id="services" icon={<Layers size={18}/>} label="Services" />
                            <NavButton activeTab={activeTab} setActiveTab={setActiveTab} id="stats" icon={<BarChart size={18}/>} label="Stats & Footer" />
                            <NavButton activeTab={activeTab} setActiveTab={setActiveTab} id="adPlatform" icon={<Megaphone size={18}/>} label="Ads Platform" />
                            <NavButton activeTab={activeTab} setActiveTab={setActiveTab} id="contact" icon={<Phone size={18}/>} label="Contact Info" />
                        </div>
                    )}
                </div>
            </nav>

            <div className="p-4 border-t border-gray-800 space-y-2 bg-[#0F172A]">
                <button onClick={() => onNavigate('dashboard')} className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-400 hover:text-white transition-colors">
                    <LayoutDashboard size={16} /> User View
                </button>
                <button onClick={() => onNavigate('home')} className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-400 hover:text-white transition-colors">
                    <LogOut size={16} /> View Site
                </button>
                <button onClick={handleSave} className="w-full flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white py-3 rounded-xl font-bold text-sm shadow-md transition-all hover:shadow-green-500/20">
                    <Save size={16} /> Publish Changes
                </button>
            </div>
        </aside>
    );
};

const EditorModal = ({ 
    editingCard, setEditingCard, saveCardEditor, 
    updateEditCardField, 
    updateGalleryImage, addGalleryImage, removeGalleryImage, 
    addExecSection, removeExecSection, 
    addExecField, removeExecField, updateExecField, updateExecTitle, 
    addContSection, removeContSection, updateContTitle, updateContBody
}: any) => {
    if (!editingCard) return null;

    const safeImages = editingCard.images || [];
    const safeExecDetails = editingCard.executionDetails || [];
    const safeContentSections = editingCard.contentSections || [];

    return (
        <div className="fixed inset-0 z-[100] bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-[#F8FAFC] w-full max-w-[90vw] h-[95vh] rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-scale-in">
                <div className="flex justify-between items-center px-8 py-5 bg-white border-b border-gray-200">
                    <div>
                        <h2 className="text-2xl font-bold text-slate-900 font-display">Editing: {editingCard.title}</h2>
                        <div className="flex items-center gap-2 text-xs font-bold text-gray-400 uppercase tracking-widest mt-1">
                            <span className="w-2 h-2 rounded-full bg-green-500"></span> Live Edit Mode
                        </div>
                    </div>
                    <div className="flex gap-4">
                        <button onClick={() => setEditingCard(null)} className="text-slate-500 hover:text-slate-800 font-bold px-6 py-2 rounded-lg hover:bg-gray-100 transition-colors">Cancel</button>
                        <button onClick={saveCardEditor} className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-2.5 rounded-xl font-bold shadow-lg shadow-blue-500/30 flex items-center gap-2">
                            <Save size={18} /> Save Card
                        </button>
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto p-8">
                    <div className="grid grid-cols-12 gap-8 max-w-[1600px] mx-auto">
                        <div className="col-span-12 xl:col-span-4 space-y-6">
                            <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
                                <h4 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4">Core Information</h4>
                                <div className="space-y-4">
                                    <label className="block text-xs font-bold text-gray-500 uppercase">Title</label>
                                    <input value={editingCard.title || ''} onChange={e => updateEditCardField('title', e.target.value)} className="w-full p-2.5 border rounded-lg font-bold text-slate-900" placeholder="Title"/>
                                    
                                    <label className="block text-xs font-bold text-gray-500 uppercase">Price</label>
                                    <input value={editingCard.price || ''} onChange={e => updateEditCardField('price', e.target.value)} className="w-full p-2.5 border rounded-lg font-bold text-blue-600" placeholder="Price"/>
                                    
                                    <label className="block text-xs font-bold text-gray-500 uppercase">Description</label>
                                    <textarea rows={4} value={editingCard.description || ''} onChange={e => updateEditCardField('description', e.target.value)} className="w-full p-2.5 border rounded-lg text-sm" placeholder="Description" />
                                </div>
                            </div>

                            <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
                                <h4 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4">Detailed Pricing</h4>
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Original Rate</label>
                                        <input 
                                            value={editingCard.pricing?.original || ''} 
                                            onChange={e => setEditingCard({...editingCard, pricing: {...(editingCard.pricing || {}), original: e.target.value}})}
                                            className="w-full p-2.5 border rounded-lg text-sm text-slate-500 line-through" placeholder="e.g. ₹ 10,000"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Discounted Rate</label>
                                        <input 
                                            value={editingCard.pricing?.discounted || ''} 
                                            onChange={e => setEditingCard({...editingCard, pricing: {...(editingCard.pricing || {}), discounted: e.target.value}})}
                                            className="w-full p-2.5 border rounded-lg text-sm font-bold text-blue-600" placeholder="e.g. ₹ 8,000"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Min Billing</label>
                                        <input 
                                            value={editingCard.pricing?.minBilling || ''} 
                                            onChange={e => setEditingCard({...editingCard, pricing: {...(editingCard.pricing || {}), minBilling: e.target.value}})}
                                            className="w-full p-2.5 border rounded-lg text-sm font-medium" placeholder="e.g. ₹ 5,000"
                                        />
                                    </div>
                                </div>
                            </div>
                            
                            <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
                                <div className="flex justify-between items-center mb-4">
                                    <h4 className="text-sm font-bold text-gray-400 uppercase tracking-widest">Image Gallery</h4>
                                    <button onClick={addGalleryImage} className="text-blue-600 text-xs font-bold flex items-center gap-1 hover:bg-blue-50 px-2 py-1 rounded"><Plus size={14}/> Add</button>
                                </div>
                                <div className="space-y-3">
                                    {safeImages.map((img: string, idx: number) => (
                                        <div key={idx} className="flex gap-2 items-center">
                                            <div className="w-10 h-10 bg-gray-100 rounded overflow-hidden flex-shrink-0 border">
                                                {img && <img src={img} className="w-full h-full object-cover" alt="prev" />}
                                            </div>
                                            <input value={img || ''} onChange={e => updateGalleryImage(idx, e.target.value)} className="flex-1 p-2 text-xs border rounded" placeholder="https://..." />
                                            <button onClick={() => removeGalleryImage(idx)} className="text-gray-400 hover:text-red-500"><X size={16}/></button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="col-span-12 xl:col-span-8 space-y-6">
                            <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
                                <h4 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4">Quick Stats (Displayed in Detail Page)</h4>
                                <div className="grid grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Used For</label>
                                        <input 
                                            value={editingCard.stats?.usedFor || ''} 
                                            onChange={e => setEditingCard({...editingCard, stats: {...(editingCard.stats || {}), usedFor: e.target.value}})}
                                            className="w-full p-2.5 border rounded-lg text-sm font-medium" placeholder="e.g. Reach, Awareness"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Ad Type</label>
                                        <input 
                                            value={editingCard.stats?.adType || ''} 
                                            onChange={e => setEditingCard({...editingCard, stats: {...(editingCard.stats || {}), adType: e.target.value}})}
                                            className="w-full p-2.5 border rounded-lg text-sm font-medium" placeholder="e.g. Display, Video"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Lead Time</label>
                                        <input 
                                            value={editingCard.stats?.leadTime || ''} 
                                            onChange={e => setEditingCard({...editingCard, stats: {...(editingCard.stats || {}), leadTime: e.target.value}})}
                                            className="w-full p-2.5 border rounded-lg text-sm font-medium" placeholder="e.g. 24 Hours"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Span</label>
                                        <input 
                                            value={editingCard.stats?.span || ''} 
                                            onChange={e => setEditingCard({...editingCard, stats: {...(editingCard.stats || {}), span: e.target.value}})}
                                            className="w-full p-2.5 border rounded-lg text-sm font-medium" placeholder="e.g. 1 Day"
                                        />
                                    </div>
                                </div>
                            </div>
                            
                            <div className="bg-white p-8 rounded-2xl border border-gray-200 shadow-sm">
                                <div className="flex justify-between items-center mb-6">
                                    <h4 className="text-lg font-bold text-slate-900">Technical Specifications</h4>
                                    <button onClick={addExecSection} className="bg-slate-900 text-white px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 hover:bg-slate-800"><Plus size={16}/> New Spec Group</button>
                                </div>
                                <div className="space-y-4">
                                    {safeExecDetails.map((section: any, sIdx: number) => (
                                        <div key={sIdx} className="border border-gray-200 rounded-xl overflow-hidden">
                                            <div className="bg-gray-50 px-4 py-3 border-b border-gray-200 flex items-center gap-3">
                                                <input value={section.title || ''} onChange={e => updateExecTitle(sIdx, e.target.value)} className="flex-1 bg-white border border-gray-200 rounded px-2 py-1 text-sm font-bold" />
                                                <button onClick={() => removeExecSection(sIdx)} className="text-red-400 hover:text-red-600"><Trash2 size={16}/></button>
                                            </div>
                                            <div className="p-4 bg-white grid grid-cols-2 gap-4">
                                                {section.fields && section.fields.map((f: any, fIdx: number) => (
                                                    <div key={fIdx} className="flex gap-2">
                                                        <div className="flex-1 space-y-1">
                                                            <input value={f.label || ''} onChange={e => updateExecField(sIdx, fIdx, 'label', e.target.value)} className="w-full text-[10px] font-bold text-gray-400 uppercase bg-transparent outline-none" placeholder="LABEL" />
                                                            <input value={f.value || ''} onChange={e => updateExecField(sIdx, fIdx, 'value', e.target.value)} className="w-full text-sm font-medium border-b border-gray-100 focus:border-blue-500 outline-none" placeholder="Value" />
                                                        </div>
                                                        <button onClick={() => removeExecField(sIdx, fIdx)} className="text-gray-300 hover:text-red-500 self-center"><X size={14}/></button>
                                                    </div>
                                                ))}
                                                <button onClick={() => addExecField(sIdx)} className="border border-dashed border-gray-300 rounded text-gray-400 text-xs font-bold hover:bg-gray-50 flex items-center justify-center p-2">+ Add Field</button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="bg-white p-8 rounded-2xl border border-gray-200 shadow-sm">
                                <div className="flex justify-between items-center mb-6">
                                    <h4 className="text-lg font-bold text-slate-900">Detailed Content Sections</h4>
                                    <button onClick={addContSection} className="bg-slate-900 text-white px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 hover:bg-slate-800"><Plus size={16}/> Add Section</button>
                                </div>
                                <div className="space-y-6">
                                    {safeContentSections.map((section: any, idx: number) => (
                                        <div key={idx} className="border border-gray-200 rounded-xl p-4">
                                            <div className="flex justify-between mb-2">
                                                <input value={section.title || ''} onChange={e => updateContTitle(idx, e.target.value)} className="font-bold text-lg border-b border-transparent focus:border-blue-500 outline-none" placeholder="Section Title" />
                                                <button onClick={() => removeContSection(idx)} className="text-red-400 hover:text-red-600"><Trash2 size={16}/></button>
                                            </div>
                                            <textarea 
                                                rows={4} 
                                                value={Array.isArray(section.content) ? section.content.join('\n') : (section.content || '')} 
                                                onChange={e => updateContBody(idx, e.target.value)}
                                                className="w-full p-3 bg-gray-50 rounded-lg text-sm border border-gray-200" 
                                                placeholder="Content..."
                                            />
                                            <p className="text-xs text-gray-400 mt-1">For lists, put each item on a new line.</p>
                                        </div>
                                    ))}
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};


// --- Main Admin Dashboard ---

type TabType = 'general' | 'hero' | 'services' | 'stats' | 'adPlatform' | 'contact' | 'messages' | 'orders' | 'consultations';

const AdminDashboard: React.FC<{ onNavigate: (page: string) => void }> = ({ onNavigate }) => {
  const { siteData, updateSiteData } = useData();
  const { isAuthenticated } = useAuth();
  const { addToast } = useToast();
  
  // State
  const [formData, setFormData] = useState<SiteData>(siteData);
  const [activeTab, setActiveTab] = useState<TabType>('messages');
  const [editingCard, setEditingCard] = useState<AdCardData | null>(null);
  const [permissionError, setPermissionError] = useState<string | null>(null);

  // Live Data State
  const [chatSessions, setChatSessions] = useState<ChatSession[]>([]);
  const [selectedChatId, setSelectedChatId] = useState<string | null>(null);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [adminReply, setAdminReply] = useState('');
  const [allOrders, setAllOrders] = useState<Order[]>([]);
  const [consultations, setConsultations] = useState<Consultation[]>([]);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Sync state when context data loads
  useEffect(() => {
    setFormData(siteData);
  }, [siteData]);
  
  // Auth Check
  useEffect(() => {
    if (!isAuthenticated) onNavigate('login');
  }, [isAuthenticated, onNavigate]);

  // --- Real-time Listeners ---
  useEffect(() => {
      let unsubscribe: () => void;
      
      const setupListener = async () => {
          if (activeTab === 'messages') {
              unsubscribe = db.collection('chats').orderBy('lastUpdated', 'desc').onSnapshot(
                snapshot => setChatSessions(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as ChatSession))),
                error => console.error("Chat sessions error", error)
              );
          } else if (activeTab === 'orders') {
               unsubscribe = db.collection('orders').orderBy('dateOrdered', 'desc').onSnapshot(
                  snapshot => {
                      setAllOrders(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Order)));
                      setPermissionError(null);
                  },
                  error => {
                       if (error.code === 'permission-denied') setPermissionError("Missing permissions to view Orders.");
                  }
               );
          } else if (activeTab === 'consultations') {
              unsubscribe = db.collection('consultations').orderBy('createdAt', 'desc').onSnapshot(
                  snapshot => {
                      setConsultations(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Consultation)));
                      setPermissionError(null);
                  },
                  error => {
                      if (error.code === 'permission-denied') setPermissionError("Missing Permissions for Consultations.");
                  }
              );
          }
      };

      setupListener();
      return () => { if (unsubscribe) unsubscribe(); };
  }, [activeTab]);

  // --- Chat Message Listener ---
  useEffect(() => {
      if (!selectedChatId) return;
      const unsubscribe = db.collection('chats').doc(selectedChatId).collection('messages').orderBy('createdAt', 'asc').onSnapshot(
          snapshot => {
              setChatMessages(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as ChatMessage)));
              setTimeout(() => messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
          }
      );
      return () => unsubscribe();
  }, [selectedChatId]);


  // --- Helper Functions ---
  
  const handleSave = () => {
    updateSiteData(formData);
    addToast('Site content updated successfully!', 'success');
  };

  const updateSection = (section: keyof SiteData, field: string, value: any) => {
    setFormData(prev => ({ ...prev, [section]: { ...prev[section] as any, [field]: value } }));
  };

  const updateAdHeader = (field: string, value: string) => {
      setFormData(prev => ({
          ...prev,
          adPlatform: {
              ...prev.adPlatform,
              header: {
                  ...prev.adPlatform.header,
                  [field]: value
              }
          }
      }));
  };

  const updateStat = (statKey: 'stat1' | 'stat2' | 'stat3', field: 'val' | 'label', value: string) => {
      setFormData(prev => ({
          ...prev,
          stats: {
              ...prev.stats,
              [statKey]: { ...prev.stats[statKey], [field]: value }
          }
      }));
  };

  const updateService = (idx: number, field: keyof ServiceItem, value: string) => {
      const newServices = [...formData.services.topServices];
      newServices[idx] = { ...newServices[idx], [field]: value };
      setFormData(prev => ({ ...prev, services: { ...prev.services, topServices: newServices }}));
  };

  const handleSendAdminMessage = async (e: React.FormEvent) => {
      e.preventDefault();
      if (!selectedChatId || !adminReply.trim()) return;
      try {
        await db.collection('chats').doc(selectedChatId).collection('messages').add({
            text: adminReply, senderId: 'admin', isAdmin: true, createdAt: firebase.firestore.FieldValue.serverTimestamp()
        });
        await db.collection('chats').doc(selectedChatId).update({
            lastMessage: `Admin: ${adminReply}`, lastUpdated: firebase.firestore.FieldValue.serverTimestamp()
        });
        setAdminReply('');
      } catch (e) {
        addToast("Failed to send message", "error");
      }
  };

  const handleUpdateConsultationStatus = async (leadId: string, newStatus: string) => {
      await db.collection('consultations').doc(leadId).update({ status: newStatus });
      addToast(`Lead marked as ${newStatus}`, "info");
  };
  const handleDeleteConsultation = async (leadId: string) => {
      if (confirm("Delete this lead?")) {
        await db.collection('consultations').doc(leadId).delete();
        addToast("Lead deleted", "info");
      }
  };

  const handleUpdateOrderStatus = async (orderId: string, newStatus: string) => {
      await db.collection('orders').doc(orderId).update({ status: newStatus });
      addToast(`Order status updated to ${newStatus}`, "info");
  };

  const addAdCard = () => {
      const newCard: AdCardData = {
        id: Date.now().toString(),
        title: 'New Campaign', description: 'Description...', price: '₹ 5000', imageUrl: 'https://images.unsplash.com/photo-1557838403-996675883e56',
        images: ['https://images.unsplash.com/photo-1557838403-996675883e56'], category: 'top',
        stats: { usedFor: 'Reach', adType: 'Display', leadTime: '24 hrs', span: '1 Week' },
        pricing: { original: '₹ 6000', discounted: '₹ 5000', minBilling: '₹ 5000' },
        executionDetails: [], contentSections: []
      };
      setFormData(prev => ({ ...prev, adPlatform: { ...prev.adPlatform, cards: [newCard, ...prev.adPlatform.cards] } }));
      setEditingCard(newCard);
  };

  const copyAdCard = (card: AdCardData) => {
      const newCard: AdCardData = {
          ...card,
          id: Date.now().toString() + Math.random().toString(36).substr(2, 5),
          title: `${card.title} (Copy)`
      };
      setFormData(prev => ({ ...prev, adPlatform: { ...prev.adPlatform, cards: [newCard, ...prev.adPlatform.cards] } }));
      addToast(`Card "${card.title}" duplicated! Save to publish.`, "success");
  };

  const deleteAdCard = (id: string) => {
      if(window.confirm("Delete?")) {
        setFormData(prev => ({ ...prev, adPlatform: { ...prev.adPlatform, cards: prev.adPlatform.cards.filter(c => c.id !== id) } }));
        addToast("Card deleted locally. Save changes to persist.", "info");
      }
  };
  const saveCardEditor = () => {
      if (!editingCard) return;
      setFormData(prev => ({ ...prev, adPlatform: { ...prev.adPlatform, cards: prev.adPlatform.cards.map(c => c.id === editingCard.id ? editingCard : c) } }));
      setEditingCard(null);
      addToast("Card details updated locally", "success");
  };

  const updateEditCardField = (f: keyof AdCardData, v: any) => setEditingCard(p => p ? ({ ...p, [f]: v }) : null);
  
  const updateGalleryImage = (i: number, v: string) => { 
      setEditingCard(p => {
          if (!p) return null;
          const n = [...(p.images || [])];
          n[i] = v;
          return { ...p, images: n };
      });
  };
  
  const addGalleryImage = () => setEditingCard(p => p ? ({...p, images: [...(p.images || []), '']}) : null);
  
  const removeGalleryImage = (i: number) => { 
      setEditingCard(p => {
          if(!p) return null;
          const n = [...(p.images || [])];
          n.splice(i, 1);
          return { ...p, images: n };
      });
  };

  const addExecSection = () => setEditingCard(p => p ? ({...p, executionDetails: [...(p.executionDetails || []), { title: 'New Section', fields: []}]}) : null);
  const removeExecSection = (i: number) => setEditingCard(p => p ? ({...p, executionDetails: (p.executionDetails || []).filter((_, idx) => idx !== i)}) : null);
  
  const updateExecTitle = (i: number, v: string) => setEditingCard(p => { 
      if(!p) return null; 
      const n = (p.executionDetails || []).map((sec, idx) => idx === i ? { ...sec, title: v } : sec);
      return {...p, executionDetails: n}; 
  });
  
  const addExecField = (sectionIdx: number) => setEditingCard(p => {
       if(!p) return null; 
       const n = (p.executionDetails || []).map((sec, idx) => idx === sectionIdx ? { ...sec, fields: [...sec.fields, { label: 'LABEL', value: 'Value' }] } : sec);
       return {...p, executionDetails: n};
  });
  
  const removeExecField = (sIdx: number, fIdx: number) => setEditingCard(p => {
       if(!p) return null; 
       const n = (p.executionDetails || []).map((sec, idx) => {
           if (idx !== sIdx) return sec;
           const newFields = [...sec.fields];
           newFields.splice(fIdx, 1);
           return { ...sec, fields: newFields };
       });
       return {...p, executionDetails: n};
  });
  
  const updateExecField = (sIdx: number, fIdx: number, field: 'label' | 'value', v: string) => setEditingCard(p => {
       if(!p) return null; 
       const n = (p.executionDetails || []).map((sec, idx) => {
           if (idx !== sIdx) return sec;
           const newFields = sec.fields.map((f, fi) => fi === fIdx ? { ...f, [field]: v } : f);
           return { ...sec, fields: newFields };
       });
       return {...p, executionDetails: n};
  });

  const addContSection = () => setEditingCard(p => p ? ({...p, contentSections: [...(p.contentSections || []), { title: 'New Title', content: 'Content' }]}) : null);
  const removeContSection = (i: number) => setEditingCard(p => p ? ({...p, contentSections: (p.contentSections || []).filter((_, idx) => idx !== i)}) : null);
  
  const updateContTitle = (i: number, v: string) => setEditingCard(p => { 
      if(!p) return null; 
      const n = (p.contentSections || []).map((sec, idx) => idx === i ? { ...sec, title: v } : sec);
      return {...p, contentSections: n}; 
  });
  
  const updateContBody = (i: number, v: string) => setEditingCard(p => { 
      if(!p) return null; 
      const n = (p.contentSections || []).map((sec, idx) => {
          if (idx !== i) return sec;
          const content = v.includes('\n') ? v.split('\n') : v;
          return { ...sec, content };
      });
      return {...p, contentSections: n}; 
  });

  const getOrderTotal = (order: Order) => {
      if (order.totalAmount && order.totalAmount !== 'Calculating...') return order.totalAmount;
      if (!order.items || order.items.length === 0) return '₹ 0';
      
      const total = order.items.reduce((acc, item) => {
          const p = parseFloat(item.price.replace(/[^0-9.]/g, '')) || 0;
          return acc + p;
      }, 0);
      
      return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        maximumFractionDigits: 0
      }).format(total);
  };

  if (!isAuthenticated) return null;

  return (
    <div className="flex min-h-screen bg-[#F0F2F5] font-sans">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} onNavigate={onNavigate} handleSave={handleSave} />

      <main className="ml-64 flex-1 p-10 max-w-[1600px] animate-fade-in h-screen overflow-hidden flex flex-col">
        {activeTab !== 'messages' && (
            <div className="mb-8 flex justify-between items-center flex-shrink-0">
                <h2 className="text-3xl font-bold text-slate-800 font-display capitalize">{activeTab.replace(/([A-Z])/g, ' $1')}</h2>
            </div>
        )}
        
        {permissionError && (
             <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl mb-6 flex items-center gap-3">
                 <AlertCircle size={20} /> <span className="font-bold">{permissionError}</span>
             </div>
        )}

        <div className="flex-1 overflow-y-auto pr-2 pb-20">
            {activeTab === 'messages' && (
                <div className="flex h-full bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
                    <div className="w-80 border-r border-gray-200 bg-gray-50 flex flex-col">
                        <div className="p-4 border-b font-bold text-gray-500 uppercase text-xs tracking-wider">Active Sessions</div>
                        <div className="flex-1 overflow-y-auto">
                            {chatSessions.length === 0 && <div className="p-4 text-sm text-gray-400">No active chats.</div>}
                            {chatSessions.map(session => (
                                <div 
                                    key={session.id} 
                                    onClick={() => setSelectedChatId(session.id)}
                                    className={`p-4 border-b cursor-pointer hover:bg-white transition-colors ${selectedChatId === session.id ? 'bg-white border-l-4 border-l-blue-600 shadow-sm' : ''}`}
                                >
                                    <div className="font-bold text-slate-800">{session.userName || 'Unknown User'}</div>
                                    <div className="text-xs text-slate-500 truncate mt-1">{session.lastMessage}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="flex-1 flex flex-col bg-white">
                        {selectedChatId ? (
                            <>
                                <div className="p-4 border-b bg-white flex justify-between items-center shadow-sm z-10">
                                    <h3 className="font-bold">Chatting with {chatSessions.find(s => s.id === selectedChatId)?.userName}</h3>
                                </div>
                                <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-slate-50">
                                    {chatMessages.map(msg => (
                                        <div key={msg.id} className={`flex ${msg.isAdmin ? 'justify-end' : 'justify-start'}`}>
                                            <div className={`max-w-[70%] rounded-2xl px-5 py-3 text-sm shadow-sm ${msg.isAdmin ? 'bg-blue-600 text-white' : 'bg-white border text-slate-800'}`}>
                                                {msg.text}
                                            </div>
                                        </div>
                                    ))}
                                    <div ref={messagesEndRef} />
                                </div>
                                <form onSubmit={handleSendAdminMessage} className="p-4 border-t bg-white flex gap-3">
                                    <input 
                                        value={adminReply} onChange={e => setAdminReply(e.target.value)} 
                                        className="flex-1 bg-gray-100 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500 transition-all" 
                                        placeholder="Type reply..." 
                                    />
                                    <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-xl transition-colors"><Send size={20}/></button>
                                </form>
                            </>
                        ) : (
                            <div className="flex-1 flex items-center justify-center text-slate-400">Select a chat to view messages</div>
                        )}
                    </div>
                </div>
            )}

            {activeTab === 'consultations' && (
                <div className="grid lg:grid-cols-2 gap-6">
                    {consultations.length === 0 && <p className="text-gray-400">No leads found.</p>}
                    {consultations.map(lead => (
                        <div key={lead.id} className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                             <div className="flex justify-between mb-4">
                                 <div>
                                     <h4 className="font-bold text-lg">{lead.firstName} {lead.lastName}</h4>
                                     <a href={`mailto:${lead.email}`} className="text-sm text-blue-600 hover:underline block">{lead.email}</a>
                                     <a href={`tel:${lead.phone}`} className="text-sm text-gray-500 block">{lead.phone}</a>
                                 </div>
                                 <span className={`px-3 py-1 rounded-full text-xs font-bold h-fit ${lead.status === 'New' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>{lead.status}</span>
                             </div>
                             <div className="bg-gray-50 p-4 rounded-lg text-sm text-slate-700 mb-4 italic border border-gray-100">
                                 "{lead.message}"
                             </div>
                             <div className="flex gap-2 justify-end">
                                 <button onClick={() => handleUpdateConsultationStatus(lead.id, 'Contacted')} className="px-4 py-2 border rounded-lg text-xs font-bold hover:bg-yellow-50 text-slate-600">Mark as Contacted</button>
                                 <button onClick={() => handleDeleteConsultation(lead.id)} className="text-red-400 hover:text-red-600 p-2 hover:bg-red-50 rounded-lg"><Trash2 size={18}/></button>
                             </div>
                        </div>
                    ))}
                </div>
            )}

            {activeTab === 'orders' && (
                <div className="space-y-4">
                    {allOrders.length === 0 && !permissionError && <p className="text-gray-400">No orders found.</p>}
                    {allOrders.map(order => (
                        <div key={order.id} className="bg-white p-6 rounded-xl border shadow-sm flex flex-col md:flex-row justify-between items-center gap-4">
                            <div>
                                <p className="font-bold text-lg">{order.userName || 'Unknown User'}</p>
                                <p className="text-sm text-gray-500">{order.userEmail || 'No Email'} • {order.items?.length || 0} Items</p>
                                <p className="text-xs text-gray-400 mt-1">ID: {order.id}</p>
                            </div>
                            <div className="flex items-center gap-4">
                                <div className="text-right">
                                    <p className="font-bold text-slate-900">{getOrderTotal(order)}</p>
                                    <p className="text-xs text-gray-400">
                                        {order.dateOrdered?.seconds ? new Date(order.dateOrdered.seconds * 1000).toLocaleDateString() : 'Date N/A'}
                                    </p>
                                </div>
                                <select 
                                    value={order.status || 'Pending'} 
                                    onChange={(e) => handleUpdateOrderStatus(order.id, e.target.value)} 
                                    className="border p-2 rounded-lg text-sm bg-gray-50 font-medium"
                                >
                                    <option>Pending</option><option>In Progress</option><option>Completed</option><option>Cancelled</option>
                                </select>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {activeTab === 'general' && (
                 <div className="bg-white p-8 rounded-2xl border max-w-xl space-y-6 shadow-sm">
                     <h3 className="font-bold text-lg border-b pb-4 mb-4">Brand Identity</h3>
                     <div>
                        <label className="text-xs font-bold text-gray-400 uppercase">Brand Line 1</label>
                        <input value={formData.brand.line1} onChange={e => updateSection('brand', 'line1', e.target.value)} className="w-full border p-3 rounded-lg mt-1 font-bold" />
                     </div>
                     <div>
                        <label className="text-xs font-bold text-gray-400 uppercase">Brand Line 2</label>
                        <input value={formData.brand.line2} onChange={e => updateSection('brand', 'line2', e.target.value)} className="w-full border p-3 rounded-lg mt-1 font-bold" />
                     </div>
                 </div>
            )}

            {activeTab === 'hero' && (
                 <div className="bg-white p-8 rounded-2xl border max-w-2xl space-y-6 shadow-sm">
                     <div className="grid gap-6">
                        <div>
                            <label className="text-xs font-bold text-gray-400 uppercase">Main Title</label>
                            <textarea rows={3} value={formData.hero.title} onChange={e => updateSection('hero', 'title', e.target.value)} className="w-full border p-3 rounded-lg mt-1 font-display font-bold text-xl" />
                        </div>
                        <div>
                            <label className="text-xs font-bold text-gray-400 uppercase">Subtitle</label>
                            <input value={formData.hero.subtitle} onChange={e => updateSection('hero', 'subtitle', e.target.value)} className="w-full border p-3 rounded-lg mt-1" />
                        </div>
                        <div>
                            <label className="text-xs font-bold text-gray-400 uppercase">Hero Image URL</label>
                            <input value={formData.hero.imageUrl} onChange={e => updateSection('hero', 'imageUrl', e.target.value)} className="w-full border p-3 rounded-lg mt-1 text-sm text-blue-600" />
                            {formData.hero.imageUrl && <img src={formData.hero.imageUrl} className="w-full h-40 object-cover mt-2 rounded-lg bg-gray-100" />}
                        </div>
                        <div>
                            <label className="text-xs font-bold text-gray-400 uppercase">CTA Text</label>
                            <input value={formData.hero.ctaText} onChange={e => updateSection('hero', 'ctaText', e.target.value)} className="w-full border p-3 rounded-lg mt-1" placeholder="e.g. Start Project" />
                        </div>
                     </div>
                 </div>
            )}

            {activeTab === 'services' && (
                <div className="space-y-6">
                    <h3 className="font-bold text-xl">Top Services</h3>
                    <div className="grid lg:grid-cols-3 gap-6">
                        {formData.services.topServices.map((service, idx) => (
                            <div key={idx} className="bg-white p-6 rounded-2xl border shadow-sm space-y-4">
                                <input value={service.title} onChange={e => updateService(idx, 'title', e.target.value)} className="w-full font-bold text-lg border-b border-transparent focus:border-blue-500 outline-none" placeholder="Title" />
                                <textarea rows={4} value={service.description} onChange={e => updateService(idx, 'description', e.target.value)} className="w-full text-sm text-gray-600 bg-gray-50 p-2 rounded resize-none" placeholder="Desc" />
                                <input value={service.btnText} onChange={e => updateService(idx, 'btnText', e.target.value)} className="w-full text-xs font-bold uppercase text-blue-600" placeholder="Button Text" />
                            </div>
                        ))}
                    </div>
                </div>
            )}
            
            {activeTab === 'stats' && (
                 <div className="bg-white p-8 rounded-2xl border max-w-2xl space-y-8 shadow-sm">
                     <div>
                        <label className="text-xs font-bold text-gray-400 uppercase">Main Headline Text</label>
                        <textarea rows={2} value={formData.stats.mainText} onChange={e => updateSection('stats', 'mainText', e.target.value)} className="w-full border p-3 rounded-lg mt-1 font-medium text-lg" />
                     </div>
                     <div className="grid grid-cols-3 gap-4">
                        {['stat1', 'stat2', 'stat3'].map((key) => (
                            <div key={key} className="bg-gray-50 p-4 rounded-xl border">
                                <label className="text-[10px] font-bold text-gray-400 uppercase mb-1 block">{key}</label>
                                <input value={(formData.stats as any)[key].val} onChange={e => updateStat(key as any, 'val', e.target.value)} className="w-full font-bold text-2xl bg-transparent mb-2" placeholder="00+" />
                                <input value={(formData.stats as any)[key].label} onChange={e => updateStat(key as any, 'label', e.target.value)} className="w-full text-xs text-gray-500 bg-transparent" placeholder="Label" />
                            </div>
                        ))}
                     </div>
                     <div className="border-t pt-6">
                        <label className="text-xs font-bold text-gray-400 uppercase">CTA Banner Title</label>
                        <input value={formData.stats.ctaTitle} onChange={e => updateSection('stats', 'ctaTitle', e.target.value)} className="w-full border p-3 rounded-lg mt-1 mb-4" />
                        <label className="text-xs font-bold text-gray-400 uppercase">CTA Banner Description</label>
                        <textarea value={formData.stats.ctaDescription} onChange={e => updateSection('stats', 'ctaDescription', e.target.value)} className="w-full border p-3 rounded-lg mt-1" />
                     </div>
                 </div>
            )}
            
            {activeTab === 'contact' && (
                 <div className="bg-white p-8 rounded-2xl border max-w-xl space-y-6 shadow-sm">
                     {['address', 'phone', 'email', 'instagram', 'linkedin'].map(field => (
                         <div key={field}>
                            <label className="text-xs font-bold text-gray-400 uppercase">{field}</label>
                            {field === 'address' ? (
                                <textarea rows={3} value={(formData.contact as any)[field]} onChange={e => updateSection('contact', field, e.target.value)} className="w-full border p-3 rounded-lg mt-1" />
                            ) : (
                                <input value={(formData.contact as any)[field]} onChange={e => updateSection('contact', field, e.target.value)} className="w-full border p-3 rounded-lg mt-1" />
                            )}
                         </div>
                     ))}
                 </div>
            )}

            {activeTab === 'adPlatform' && (
                <div className="space-y-6">
                    <div className="flex justify-between items-center">
                         <h3 className="text-xl font-bold">Ads Inventory</h3>
                         <button onClick={addAdCard} className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 hover:bg-blue-700 shadow-md"><Plus size={16}/> Add Product</button>
                    </div>
                    
                    <div className="bg-white p-6 rounded-2xl border shadow-sm mb-8">
                        <h4 className="text-sm font-bold text-gray-400 uppercase mb-4">Hero Section Stats & Branding</h4>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="text-xs font-bold text-slate-500">Monthly Users (Stat 1)</label>
                                <input value={formData.adPlatform.header.monthlyUsers} onChange={e => updateAdHeader('monthlyUsers', e.target.value)} className="w-full border p-2 rounded text-sm" />
                            </div>
                            <div>
                                <label className="text-xs font-bold text-slate-500">Platform Type (Stat 2)</label>
                                <input value={formData.adPlatform.header.platformType} onChange={e => updateAdHeader('platformType', e.target.value)} className="w-full border p-2 rounded text-sm" />
                            </div>
                            <div>
                                <label className="text-xs font-bold text-slate-500">Models (Stat 3)</label>
                                <input value={formData.adPlatform.header.pricingModels} onChange={e => updateAdHeader('pricingModels', e.target.value)} className="w-full border p-2 rounded text-sm" />
                            </div>
                            <div>
                                <label className="text-xs font-bold text-slate-500">Languages/Extra (Stat 4)</label>
                                <input value={formData.adPlatform.header.categories} onChange={e => updateAdHeader('categories', e.target.value)} className="w-full border p-2 rounded text-sm" />
                            </div>
                            <div className="col-span-2">
                                <label className="text-xs font-bold text-slate-500">Logo URL</label>
                                <input value={formData.adPlatform.logoUrl} onChange={e => {
                                    setFormData(prev => ({...prev, adPlatform: {...prev.adPlatform, logoUrl: e.target.value}}))
                                }} className="w-full border p-2 rounded text-sm text-blue-600" />
                                {formData.adPlatform.logoUrl && <img src={formData.adPlatform.logoUrl} className="h-10 mt-2 object-contain border p-1 rounded" alt="logo preview" />}
                            </div>
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-2xl border shadow-sm mb-8">
                         <h4 className="text-sm font-bold text-gray-400 uppercase mb-4">Platform Header Info</h4>
                         <input value={formData.adPlatform.platformName} onChange={e => { const d = {...formData.adPlatform, platformName: e.target.value}; setFormData({...formData, adPlatform: d})}} className="w-full border p-2 mb-2 rounded" placeholder="Platform Name" />
                         <textarea value={formData.adPlatform.intro.p1} onChange={e => { const d = {...formData.adPlatform, intro: {...formData.adPlatform.intro, p1: e.target.value}}; setFormData({...formData, adPlatform: d})}} className="w-full border p-2 rounded text-sm" placeholder="Intro Text" rows={2}/>
                    </div>

                    <div className="grid lg:grid-cols-2 gap-4">
                        {formData.adPlatform.cards.map(card => (
                            <div key={card.id} className="bg-white p-4 rounded-xl border flex justify-between items-center hover:shadow-md transition-shadow">
                                <div className="flex items-center gap-4">
                                    <img src={card.imageUrl} className="w-16 h-16 rounded-lg object-cover bg-gray-100 border" />
                                    <div>
                                        <div className="font-bold text-slate-900">{card.title}</div>
                                        <div className="text-xs text-blue-600 font-bold">{card.price}</div>
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <button onClick={() => setEditingCard(card)} className="text-blue-600 px-4 py-2 bg-blue-50 hover:bg-blue-100 rounded-lg text-xs font-bold transition-colors">Edit</button>
                                    <button onClick={() => copyAdCard(card)} className="text-gray-600 px-4 py-2 bg-gray-50 hover:bg-gray-100 rounded-lg text-xs font-bold transition-colors flex items-center gap-1"><Copy size={14}/> Duplicate</button>
                                    <button onClick={() => deleteAdCard(card.id)} className="text-red-400 hover:text-red-600 p-2 hover:bg-red-50 rounded-lg transition-colors"><Trash2 size={18}/></button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
      </main>

      <EditorModal 
          editingCard={editingCard} 
          setEditingCard={setEditingCard} 
          saveCardEditor={saveCardEditor}
          updateEditCardField={updateEditCardField} 
          updateGalleryImage={updateGalleryImage}
          addGalleryImage={addGalleryImage} 
          removeGalleryImage={removeGalleryImage}
          addExecSection={addExecSection} 
          removeExecSection={removeExecSection}
          addExecField={addExecField} 
          removeExecField={removeExecField} 
          updateExecField={updateExecField} 
          updateExecTitle={updateExecTitle}
          addContSection={addContSection} 
          removeContSection={removeContSection} 
          updateContTitle={updateContTitle} 
          updateContBody={updateContBody}
      />
    </div>
  );
};

export default AdminDashboard;
