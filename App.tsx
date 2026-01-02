
import React, { useState, useEffect } from 'react';
import Tamenni from './components/Tamenni';
import Onboarding from './components/Onboarding';
import { AppTab, UserProfile } from './types';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<AppTab>(AppTab.Tamenni);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem('tamenni_profile');
    if (saved) {
      setUserProfile(JSON.parse(saved));
    }
  }, []);

  const handleOnboardingComplete = (profile: UserProfile) => {
    setUserProfile(profile);
    localStorage.setItem('tamenni_profile', JSON.stringify(profile));
  };

  const handleLogout = () => {
    localStorage.removeItem('tamenni_profile');
    setUserProfile(null);
    setActiveTab(AppTab.Tamenni);
  };

  if (!userProfile) {
    return <Onboarding onComplete={handleOnboardingComplete} />;
  }

  const avatarUrl = `https://api.dicebear.com/7.x/avataaars/svg?seed=${userProfile.name}&backgroundColor=fdf2f8&mouth=smile&eyes=happy`;

  return (
    <div className="min-h-screen pb-28 flex flex-col bg-[#fff5f7] selection:bg-pink-200">
      {/* Premium Header */}
      <header className="bg-white/80 backdrop-blur-lg sticky top-0 z-50 px-6 py-4 border-b border-pink-100 flex justify-between items-center shadow-sm">
        <div className="flex flex-col text-right">
          <div className="flex items-center gap-2 flex-row-reverse">
             <div className="bg-gradient-to-br from-pink-400 to-pink-300 text-white p-2 rounded-xl shadow-md shadow-pink-100">
               <i className="fas fa-heart"></i>
             </div>
             <span className="text-2xl font-bold bg-gradient-to-l from-pink-500 to-pink-300 bg-clip-text text-transparent">طمني</span>
          </div>
          <span className="text-[10px] text-pink-300 font-bold mt-1 pr-1">
            بإشراف د. نويف نايف اليامي
          </span>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="text-right hidden sm:block">
            <p className="text-xs font-bold text-gray-500">أهلاً بكِ</p>
            <p className="text-sm font-bold text-pink-500">{userProfile.name}</p>
          </div>
          <img src={avatarUrl} alt="User" className="w-10 h-10 rounded-full border-2 border-pink-100 bg-white" />
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 container mx-auto px-4 py-6 max-w-2xl">
        <div className="transition-all duration-500 ease-in-out">
          {activeTab === AppTab.Tamenni && <Tamenni />}
          
          {activeTab === AppTab.Profile && (
            <div className="bg-white rounded-[40px] shadow-xl p-8 border border-pink-50 animate-fadeIn text-center">
              <div className="relative inline-block mb-6">
                <img src={avatarUrl} className="w-32 h-32 rounded-full border-4 border-pink-100 shadow-lg mx-auto" alt="profile" />
                <div className="absolute bottom-2 right-2 bg-green-400 w-6 h-6 rounded-full border-4 border-white shadow-sm"></div>
              </div>
              
              <h2 className="text-2xl font-bold text-gray-700">{userProfile.name}</h2>
              <p className="text-pink-400 mb-8 font-medium italic">عضوة في مجتمع طمني الصحي</p>

              <div className="grid grid-cols-2 gap-4 mb-8">
                {[
                  { label: 'العمر', value: `${userProfile.age} عام`, icon: 'cake-candles' },
                  { label: 'الوزن', value: `${userProfile.weight || '55'} كجم`, icon: 'weight' },
                  { label: 'الطول', value: `${userProfile.height || '160'} سم`, icon: 'ruler-vertical' },
                  { label: 'الحالة', value: 'ممتازة', icon: 'star' },
                ].map((stat, i) => (
                  <div key={i} className="bg-pink-50/40 p-4 rounded-3xl border border-pink-100/50 flex flex-col items-center">
                    <i className={`fas fa-${stat.icon} text-pink-300 mb-2`}></i>
                    <span className="text-[10px] font-bold text-gray-400 uppercase">{stat.label}</span>
                    <span className="text-lg font-bold text-pink-600">{stat.value}</span>
                  </div>
                ))}
              </div>

              <button 
                onClick={handleLogout}
                className="w-full py-4 text-red-400 font-bold bg-red-50 rounded-3xl hover:bg-red-100 transition-colors flex items-center justify-center gap-2"
              >
                <i className="fas fa-sign-out-alt"></i>
                تسجيل الخروج
              </button>
            </div>
          )}
          
          {activeTab === AppTab.Home && (
            <div className="text-center p-12 bg-white rounded-[40px] shadow-xl border border-pink-50">
               <i className="fas fa-house-chimney-medical text-6xl text-pink-200 mb-6"></i>
               <h2 className="text-2xl font-bold text-gray-700 mb-4">أهلاً بكِ في الصفحة الرئيسية</h2>
               <p className="text-gray-500 mb-8">نحن هنا لنعتني بكِ وبصحتكِ يومياً.</p>
               <button 
                 onClick={() => setActiveTab(AppTab.Tamenni)}
                 className="px-8 py-4 bg-pink-400 text-white rounded-3xl font-bold shadow-lg shadow-pink-100 hover:scale-105 transition-transform"
               >
                 ابدئي فحصاً جديداً
               </button>
            </div>
          )}
        </div>
      </main>

      {/* Modern Bottom Navigation */}
      <nav className="fixed bottom-6 left-1/2 -translate-x-1/2 w-[90%] max-w-sm bg-white/80 backdrop-blur-2xl border border-white/50 shadow-[0_20px_50px_rgba(244,114,182,0.15)] rounded-[35px] flex justify-around items-center p-3 z-50">
        {[
          { id: AppTab.Home, label: 'الرئيسية', icon: 'house' },
          { id: AppTab.Tamenni, label: 'طمن', icon: 'heart-pulse' },
          { id: AppTab.Profile, label: 'ملفي', icon: 'user' },
        ].map((tab) => (
          <button 
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex flex-col items-center gap-1 transition-all duration-300 flex-1 relative ${activeTab === tab.id ? 'text-pink-500' : 'text-gray-300 hover:text-pink-300'}`}
          >
            <div className={`p-2 px-6 rounded-2xl transition-all ${activeTab === tab.id ? 'bg-pink-100/50 scale-110' : ''}`}>
              <i className={`fas fa-${tab.icon} text-xl`}></i>
            </div>
            <span className={`text-[10px] font-bold transition-opacity ${activeTab === tab.id ? 'opacity-100' : 'opacity-60'}`}>{tab.label}</span>
            {activeTab === tab.id && (
              <span className="absolute -top-1 w-1 h-1 bg-pink-500 rounded-full animate-pulse"></span>
            )}
          </button>
        ))}
      </nav>
      
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(15px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.5s cubic-bezier(0.4, 0, 0.2, 1) forwards;
        }
        body {
          background-color: #fff5f7;
          overflow-x: hidden;
        }
      `}</style>
    </div>
  );
};

export default App;
