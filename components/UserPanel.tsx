
import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from './AuthContext';
import { useToast } from './ToastContext';
import { db } from '../firebase';
import { 
  MessageSquare, ShoppingBag, Settings, LogOut, Send, 
  Package, Trash2, AlertCircle
} from 'lucide-react';
import firebase from 'firebase/compat/app';
import { Order, ChatMessage } from '../types';

interface UserPanelProps {
  onNavigate: (page: string) => void;
}

const UserPanel: React.FC<UserPanelProps> = ({ onNavigate }) => {
  const { currentUser, logout, cart, removeFromCart, checkout, userProfile, updateUserProfile, isAdmin } = useAuth();
  const { addToast } = useToast();
  const [activeTab, setActiveTab] = useState<'chat' | 'orders' | 'cart' | 'settings'>('chat');
  
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [permissionError, setPermissionError] = useState(false);
  const [orders, setOrders] = useState<Order[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const [formData, setFormData] = useState(userProfile);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (!currentUser) onNavigate('login');
    else setFormData(userProfile);
  }, [currentUser, userProfile, onNavigate]);

  // --- Chat Logic ---
  useEffect(() => {
    if (!currentUser) return;
    const unsubscribe = db.collection('chats').doc(currentUser.uid).collection('messages').orderBy('createdAt', 'asc').onSnapshot(
        snap => {
            setMessages(snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as ChatMessage)));
            setPermissionError(false);
            setTimeout(() => messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
        },
        err => { if (err.code === 'permission-denied') setPermissionError(true); }
    );
    return () => unsubscribe();
  }, [currentUser]);

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !currentUser) return;
    const chatId = currentUser.uid;
    try {
        await db.collection('chats').doc(chatId).collection('messages').add({
            text: newMessage, senderId: currentUser.uid, createdAt: firebase.firestore.FieldValue.serverTimestamp(), isAdmin: false
        });
        await db.collection('chats').doc(chatId).set({
            lastMessage: newMessage, lastUpdated: firebase.firestore.FieldValue.serverTimestamp(), 
            userName: userProfile.name || currentUser.email, userId: currentUser.uid
        }, { merge: true });
        setNewMessage('');
    } catch (err) { addToast("Failed to send message", "error"); }
  };

  // --- Orders Logic ---
  useEffect(() => {
      if(!currentUser) return;
      const unsubscribe = db.collection('orders').where('userId', '==', currentUser.uid).onSnapshot(
          snap => setOrders(snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Order)).sort((a,b) => (b.dateOrdered?.seconds || 0) - (a.dateOrdered?.seconds || 0)))
      );
      return () => unsubscribe();
  }, [currentUser]);

  const handleSaveProfile = async () => {
      setIsSaving(true);
      try {
        await updateUserProfile(formData);
        addToast("Profile updated successfully", "success");
      } catch (error) {
        addToast("Failed to update profile", "error");
      } finally {
        setIsSaving(false);
      }
  };

  // Calculate estimated total for display
  const cartTotalDisplay = cart.reduce((acc, item) => {
     // Basic helper to strip non-digits to show an estimate before checkout
     const price = parseFloat(item.price.replace(/[^0-9.]/g, '')) || 0;
     return acc + price;
  }, 0);

  const handleCheckout = async () => {
      if(cart.length === 0) return;
      
      try {
          await checkout();
          addToast("Order request placed successfully!", "success");
          setActiveTab('orders');
      } catch (e) {
          addToast("Failed to place order", "error");
      }
  };

  const SidebarItem = ({ id, icon: Icon, label, count }: any) => (
      <button 
        onClick={() => setActiveTab(id)}
        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === id ? 'bg-blue-50 text-blue-600' : 'text-slate-500 hover:bg-slate-50'}`}
      >
        <div className="relative">
            <Icon size={20} />
            {count > 0 && <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 rounded-full border border-white"></span>}
        </div>
        <span className="hidden lg:block font-medium text-sm">{label}</span>
      </button>
  );

  return (
    <div className="flex h-screen bg-[#F8FAFC] overflow-hidden pt-28">
      <aside className="w-20 lg:w-64 bg-white border-r border-slate-200 flex flex-col py-6 z-20">
          <div className="px-6 mb-8 hidden lg:block"><h1 className="font-display font-bold text-xl text-slate-900">User Panel</h1></div>
          <nav className="flex-1 space-y-2 px-3">
              <SidebarItem id="chat" icon={MessageSquare} label="Live Chat" />
              <SidebarItem id="orders" icon={Package} label="Orders" />
              <SidebarItem id="cart" icon={ShoppingBag} label="Cart" count={cart.length} />
              <SidebarItem id="settings" icon={Settings} label="Settings" />
          </nav>
          <div className="p-3 border-t border-slate-100 space-y-2">
              <button onClick={() => { logout(); onNavigate('home'); }} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-500 hover:bg-red-50 transition-all">
                  <LogOut size={20} /> <span className="hidden lg:block font-medium text-sm">Sign Out</span>
              </button>
          </div>
      </aside>

      <main className="flex-1 p-6 lg:p-10 overflow-y-auto">
          {activeTab === 'chat' && (
              <div className="flex flex-col h-full bg-white rounded-2xl border overflow-hidden max-h-[600px]">
                  <div className="p-4 border-b bg-slate-50"><h3 className="font-bold">Support Chat</h3></div>
                  <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/50">
                      {permissionError && <div className="text-red-500 text-sm">Permission Error.</div>}
                      {messages.map(msg => (
                          <div key={msg.id} className={`flex ${msg.senderId === currentUser?.uid ? 'justify-end' : 'justify-start'}`}>
                              <div className={`max-w-[75%] rounded-2xl px-4 py-3 text-sm shadow-sm ${msg.senderId === currentUser?.uid ? 'bg-blue-600 text-white' : 'bg-white border'}`}>{msg.text}</div>
                          </div>
                      ))}
                      <div ref={messagesEndRef} />
                  </div>
                  <form onSubmit={sendMessage} className="p-4 bg-white border-t flex gap-2">
                      <input value={newMessage} onChange={e => setNewMessage(e.target.value)} className="flex-1 bg-slate-100 rounded-xl px-4 py-2 outline-none" placeholder="Type..." />
                      <button type="submit" className="bg-blue-600 text-white p-2 rounded-xl"><Send size={18}/></button>
                  </form>
              </div>
          )}

          {activeTab === 'orders' && (
              <div className="space-y-4">
                  <h2 className="text-2xl font-bold mb-6">Order History</h2>
                  {orders.length === 0 && <p className="text-slate-400">No orders yet.</p>}
                  {orders.map(order => (
                      <div key={order.id} className="bg-white p-6 rounded-2xl border shadow-sm">
                          <div className="flex justify-between mb-4">
                              <span className="font-mono text-xs bg-slate-100 px-2 py-1 rounded">#{order.id.slice(0,8)}</span>
                              <span className="font-bold text-sm text-blue-600">{order.status}</span>
                          </div>
                          <div className="mb-4">
                             {order.items.map((item, i) => (
                                <div key={i} className="flex gap-4 items-center mb-2">
                                    <img src={item.imageUrl} className="w-10 h-10 rounded object-cover bg-gray-100"/>
                                    <div>
                                        <p className="font-bold text-sm">{item.title}</p>
                                        <p className="text-xs text-gray-500">{item.price}</p>
                                    </div>
                                </div>
                             ))}
                          </div>
                          <div className="pt-4 border-t border-gray-100 flex justify-end">
                              <p className="font-bold text-slate-900">Total: {order.totalAmount}</p>
                          </div>
                      </div>
                  ))}
              </div>
          )}

          {activeTab === 'cart' && (
              <div className="max-w-4xl">
                  <h2 className="text-2xl font-bold mb-6">Shopping Cart</h2>
                  {cart.length === 0 ? <p className="text-slate-400">Cart is empty.</p> : (
                      <div className="grid lg:grid-cols-3 gap-8">
                          <div className="lg:col-span-2 space-y-4">
                              {cart.map(item => (
                                  <div key={item.cartId} className="bg-white p-4 rounded-xl border flex gap-4 items-center shadow-sm">
                                      <img src={item.imageUrl} className="w-16 h-16 rounded-lg object-cover"/>
                                      <div className="flex-1">
                                        <h3 className="font-bold text-slate-900">{item.title}</h3>
                                        <p className="text-blue-600 font-bold text-sm">{item.price}</p>
                                      </div>
                                      <button onClick={() => removeFromCart(item.cartId)} className="text-red-400 hover:text-red-600 p-2 hover:bg-red-50 rounded-full transition-colors">
                                        <Trash2 size={18}/>
                                      </button>
                                  </div>
                              ))}
                          </div>
                          <div className="bg-white p-6 rounded-2xl border h-fit sticky top-4 shadow-sm">
                              <h3 className="font-bold mb-4 text-lg">Summary</h3>
                              <div className="flex justify-between mb-2 text-sm">
                                <span className="text-slate-500">Items</span>
                                <span className="font-bold">{cart.length}</span>
                              </div>
                              <div className="flex justify-between mb-6 text-sm">
                                <span className="text-slate-500">Est. Total</span>
                                <span className="font-bold text-lg">₹ {cartTotalDisplay.toLocaleString('en-IN')}</span>
                              </div>
                              <button 
                                onClick={handleCheckout} 
                                className="w-full bg-blue-600 text-white py-3.5 rounded-xl font-bold hover:bg-blue-700 shadow-lg shadow-blue-500/20 transition-all transform hover:-translate-y-1"
                              >
                                Request Order
                              </button>
                              <p className="text-xs text-slate-400 mt-3 text-center">We will contact you to confirm final pricing and billing.</p>
                          </div>
                      </div>
                  )}
              </div>
          )}

          {activeTab === 'settings' && (
              <div className="max-w-xl bg-white p-8 rounded-2xl border shadow-sm">
                  <h2 className="text-2xl font-bold mb-6">Profile</h2>
                  <div className="space-y-4">
                      <div><label className="text-xs font-bold text-slate-500 uppercase">Name</label><input value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full border p-2 rounded-lg mt-1"/></div>
                      <div><label className="text-xs font-bold text-slate-500 uppercase">Phone</label><input value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} className="w-full border p-2 rounded-lg mt-1"/></div>
                      <button onClick={handleSaveProfile} disabled={isSaving} className="bg-slate-900 text-white px-6 py-2.5 rounded-xl font-bold text-sm hover:bg-slate-800 transition-colors shadow-lg shadow-slate-900/10">
                          {isSaving ? 'Saving...' : 'Save Changes'}
                      </button>
                  </div>
              </div>
          )}
      </main>
    </div>
  );
};

export default UserPanel;
