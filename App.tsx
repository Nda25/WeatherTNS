import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import ChatInterface from './components/ChatInterface';
import ProtectEnvironment from './components/ProtectEnvironment';
import ProjectManager from './components/ProjectManager';
import VoiceAssistant from './components/VoiceAssistant';
import Onboarding from './components/Onboarding';
import { View, UserProfile } from './types';
import { Menu } from 'lucide-react';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<View>(View.DASHBOARD);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);

  useEffect(() => {
    const savedProfile = localStorage.getItem('eco_user_profile');
    if (savedProfile) {
      setUserProfile(JSON.parse(savedProfile));
    }
  }, []);

  const handleOnboardingComplete = (profile: UserProfile) => {
    setUserProfile(profile);
    localStorage.setItem('eco_user_profile', JSON.stringify(profile));
  };

  const renderContent = () => {
    if (!userProfile) return null; // Wait for profile

    switch (currentView) {
      case View.DASHBOARD:
        return <Dashboard userProfile={userProfile} />;
      case View.CHAT:
        return <ChatInterface userProfile={userProfile} />;
      case View.ECO_GENERATOR:
        return <ProtectEnvironment userProfile={userProfile} />;
      case View.PROJECTS:
        return <ProjectManager />;
      case View.VOICE_ASSISTANT:
        return <VoiceAssistant userProfile={userProfile} />;
      default:
        return <Dashboard userProfile={userProfile} />;
    }
  };

  if (!userProfile) {
    return <Onboarding onComplete={handleOnboardingComplete} />;
  }

  return (
    <div className="flex min-h-screen bg-[#f8f9fa] text-gray-800 font-sans">
      <Sidebar 
        currentView={currentView} 
        setCurrentView={setCurrentView} 
        isOpen={isSidebarOpen}
        setIsOpen={setIsSidebarOpen}
      />

      <div className="flex-1 flex flex-col min-h-screen">
        {/* Mobile Header */}
        <header className="bg-white p-4 shadow-sm md:hidden flex items-center gap-4 sticky top-0 z-10">
          <button 
            onClick={() => setIsSidebarOpen(true)}
            className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
          >
            <Menu size={24} />
          </button>
          <span className="font-bold text-primary text-lg">EcoSmart</span>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 p-4 md:p-8 max-w-7xl mx-auto w-full">
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

export default App;
