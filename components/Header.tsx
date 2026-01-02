
import React, { useState, useRef, useEffect } from 'react';
import { Search, Sun, Bell, Sparkles, ChevronDown, Check, Clock, AlertTriangle, Info, Wrench, ShieldAlert } from 'lucide-react';
import { View } from '../types';

interface HeaderProps {
  sidebarOpen: boolean;
  toggleAdvisor: () => void;
  setCurrentView: (view: View) => void;
}

interface Notification {
  id: string;
  title: string;
  desc: string;
  time: string;
  type: 'maintenance' | 'security' | 'system' | 'advisor';
  isUnread: boolean;
}

const MOCK_NOTIFICATIONS: Notification[] = [
  { id: '1', title: 'HVAC Filter Due', desc: 'Lakeside Cabin main unit needs a filter swap.', time: '12m ago', type: 'maintenance', isUnread: true },
  { id: '2', title: 'Warranty Expiring', desc: 'LG Refrigerator warranty ends in 3 days.', time: '2h ago', type: 'security', isUnread: true },
  { id: '3', title: 'AI Recommendation', desc: 'New layout suggested for your Library view.', time: '5h ago', type: 'advisor', isUnread: false },
  { id: '4', title: 'System Update', desc: 'Nestlog Pro v2.4.1 is now active.', time: '1d ago', type: 'system', isUnread: false },
];

const Header: React.FC<HeaderProps> = ({ sidebarOpen, toggleAdvisor, setCurrentView }) => {
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>(MOCK_NOTIFICATIONS);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const unreadCount = notifications.filter(n => n.isUnread).length;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setNotificationsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const markAsRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, isUnread: false } : n));
  };

  const markAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, isUnread: false })));
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'maintenance': return <Wrench size={14} className="text-[#a47148]" />;
      case 'security': return <ShieldAlert size={14} className="text-[#b45c43]" />;
      case 'advisor': return <Sparkles size={14} className="text-indigo-500" />;
      default: return <Info size={14} className="text-slate-400" />;
    }
  };

  return (
    <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 sticky top-0 z-30">
      <div className="flex-1 flex items-center max-w-xl">
        <div className="relative w-full group">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 transition-colors group-focus-within:text-slate-800" />
          <input 
            type="text" 
            placeholder="Search tasks, items, or properties..." 
            className="w-full bg-slate-50 border border-slate-100 rounded-lg pl-10 pr-12 py-2 text-sm text-slate-900 focus:outline-none focus:ring-4 focus:ring-slate-900/5 focus:border-slate-400 transition-all"
          />
          <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center space-x-1">
            <kbd className="hidden sm:inline-flex px-1.5 py-0.5 rounded border border-slate-200 bg-white text-[10px] text-slate-400 font-sans shadow-sm">Ctrl</kbd>
            <kbd className="hidden sm:inline-flex px-1.5 py-0.5 rounded border border-slate-200 bg-white text-[10px] text-slate-400 font-sans shadow-sm">K</kbd>
          </div>
        </div>
      </div>

      <div className="flex items-center space-x-4">
        <div className="hidden lg:flex items-center space-x-6 text-xs text-slate-500 border-r border-slate-200 pr-6 mr-2">
          <div className="flex items-center space-x-2">
            <span className="uppercase font-bold tracking-tight text-[10px]">Household</span>
            <button className="flex items-center px-2 py-1 bg-slate-50 border border-slate-200 rounded font-medium text-slate-900 hover:bg-slate-100 transition-colors">
              Cabin Household <ChevronDown size={12} className="ml-1 text-slate-400" />
            </button>
          </div>
          <div className="flex items-center space-x-2">
            <span className="uppercase font-bold tracking-tight text-[10px]">Property</span>
            <button className="flex items-center px-2 py-1 bg-slate-50 border border-slate-200 rounded font-medium text-slate-900 hover:bg-slate-100 transition-colors">
              Lakeside Cabin <ChevronDown size={12} className="ml-1 text-slate-400" />
            </button>
          </div>
        </div>

        <button 
          onClick={toggleAdvisor}
          className="p-2 text-slate-500 hover:bg-slate-50 hover:text-slate-900 rounded-lg transition-colors relative group"
        >
          <Sparkles size={18} />
          <span className="absolute -top-1 -right-1 w-2 h-2 bg-slate-800 rounded-full ring-2 ring-white"></span>
          <span className="absolute top-full left-1/2 -translate-x-1/2 mt-2 px-2 py-1 bg-slate-900 text-white text-[10px] rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">AI Advisor</span>
        </button>

        <button className="p-2 text-slate-500 hover:bg-slate-50 rounded-lg transition-colors">
          <Sun size={18} />
        </button>
        
        {/* Notifications Dropdown Container */}
        <div className="relative" ref={dropdownRef}>
          <button 
            onClick={() => setNotificationsOpen(!notificationsOpen)}
            className={`p-2 hover:bg-slate-50 rounded-lg transition-colors relative ${notificationsOpen ? 'bg-slate-50 text-slate-900' : 'text-slate-500'}`}
          >
            <Bell size={18} />
            {unreadCount > 0 && (
              <span className="absolute top-2 right-2 w-1.5 h-1.5 bg-[#b45c43] rounded-full ring-2 ring-white"></span>
            )}
          </button>

          {notificationsOpen && (
            <div className="absolute right-0 mt-3 w-80 bg-white border border-slate-200 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
              <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                <h3 className="text-xs font-black text-slate-900 uppercase tracking-widest">Alert Console</h3>
                {unreadCount > 0 && (
                  <button 
                    onClick={markAllRead}
                    className="text-[10px] font-black text-indigo-600 hover:text-indigo-700 uppercase tracking-tighter"
                  >
                    Clear All
                  </button>
                )}
              </div>
              <div className="max-h-96 overflow-y-auto divide-y divide-slate-50">
                {notifications.length > 0 ? (
                  notifications.map((n) => (
                    <div 
                      key={n.id} 
                      onClick={() => markAsRead(n.id)}
                      className={`px-5 py-4 flex space-x-4 transition-colors cursor-pointer ${n.isUnread ? 'bg-indigo-50/30' : 'hover:bg-slate-50'}`}
                    >
                      <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 border shadow-sm ${n.isUnread ? 'bg-white border-slate-200' : 'bg-slate-50 border-slate-100'}`}>
                        {getNotificationIcon(n.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-0.5">
                          <p className={`text-sm tracking-tight truncate ${n.isUnread ? 'font-black text-slate-900' : 'font-bold text-slate-600'}`}>
                            {n.title}
                          </p>
                          <span className="text-[9px] font-black text-slate-400 uppercase ml-2 whitespace-nowrap">{n.time}</span>
                        </div>
                        <p className="text-[11px] text-slate-500 leading-tight line-clamp-2">{n.desc}</p>
                      </div>
                      {n.isUnread && (
                        <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full shrink-0 mt-1.5 self-start"></div>
                      )}
                    </div>
                  ))
                ) : (
                  <div className="px-5 py-12 text-center">
                    <Check size={32} className="mx-auto text-slate-100 mb-2" />
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Console clear</p>
                  </div>
                )}
              </div>
              <div className="p-3 bg-slate-50 border-t border-slate-100">
                <button 
                  className="w-full py-2 text-[10px] font-black text-slate-500 uppercase tracking-widest hover:text-slate-900 transition-colors"
                  onClick={() => {
                    setNotificationsOpen(false);
                    setCurrentView('notifications_archive');
                  }}
                >
                  View full archive
                </button>
              </div>
            </div>
          )}
        </div>

        <button 
          onClick={() => setCurrentView('profile')}
          className="flex items-center space-x-2 p-1 hover:bg-slate-50 rounded-lg transition-colors border border-transparent hover:border-slate-100 ml-2 group"
        >
          <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-900 flex items-center justify-center text-white font-bold text-xs transition-transform group-hover:scale-105">
            JD
          </div>
          <div className="hidden sm:block text-left leading-none">
            <div className="text-sm font-semibold text-slate-900">John Doe</div>
            <div className="text-[10px] text-slate-500">Member</div>
          </div>
        </button>
      </div>
    </header>
  );
};

export default Header;
