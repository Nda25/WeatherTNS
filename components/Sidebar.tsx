import React from 'react';
import { View } from '../types';
import { 
  CloudSun, 
  MessageCircle, 
  Leaf, 
  Mic, 
  FolderTree, 
  Menu,
  X,
  LogOut
} from 'lucide-react';

interface SidebarProps {
  currentView: View;
  setCurrentView: (view: View) => void;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ currentView, setCurrentView, isOpen, setIsOpen }) => {
  
  const menuItems = [
    { id: View.DASHBOARD, label: 'الطقس والمناخ', icon: CloudSun },
    { id: View.CHAT, label: 'المحادثة الذكية', icon: MessageCircle },
    { id: View.ECO_GENERATOR, label: 'كيف نحمي البيئة', icon: Leaf },
    { id: View.PROJECTS, label: 'مشاريع بيئية', icon: FolderTree },
    { id: View.VOICE_ASSISTANT, label: 'المساعد الصوتي', icon: Mic },
  ];

  const handleLogout = () => {
    if (window.confirm('هل أنت متأكد من تسجيل الخروج؟ سيتم مسح بياناتك المسجلة محلياً.')) {
        localStorage.removeItem('eco_user_profile');
        window.location.reload();
    }
  };

  return (
    <>
      {/* Mobile Overlay */}
      <div 
        className={`fixed inset-0 bg-black bg-opacity-50 z-20 md:hidden transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={() => setIsOpen(false)}
      />

      {/* Sidebar Content */}
      <div className={`fixed top-0 right-0 h-full w-64 bg-white shadow-xl z-30 flex flex-col transform transition-transform duration-300 ease-in-out md:translate-x-0 md:static ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white shadow-md">
              <Leaf size={20} />
            </div>
            <span className="text-2xl font-bold text-primary tracking-tight">EcoSmart</span>
          </div>
          <button onClick={() => setIsOpen(false)} className="md:hidden text-gray-500 hover:text-red-500">
            <X size={24} />
          </button>
        </div>

        <nav className="p-4 space-y-2 flex-1 overflow-y-auto">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setCurrentView(item.id);
                  setIsOpen(false);
                }}
                className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-200 group ${
                  isActive 
                    ? 'bg-purple-50 text-primary font-bold shadow-sm' 
                    : 'text-gray-600 hover:bg-gray-50 hover:text-primary'
                }`}
              >
                <Icon size={22} className={isActive ? 'text-secondary' : 'text-gray-400 group-hover:text-primary'} />
                <span className="text-[15px]">{item.label}</span>
              </button>
            );
          })}
        </nav>

        <div className="p-4 border-t border-gray-100">
             <button 
                onClick={handleLogout}
                className="w-full flex items-center gap-4 px-4 py-3 rounded-xl text-red-500 hover:bg-red-50 transition-colors"
             >
                <LogOut size={22} />
                <span>تسجيل الخروج</span>
             </button>
        </div>
      </div>
    </>
  );
};

export default Sidebar;