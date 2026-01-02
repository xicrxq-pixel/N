
import React, { useState } from 'react';
import { UserProfile } from '../types';

interface OnboardingProps {
  onComplete: (profile: UserProfile) => void;
}

const Onboarding: React.FC<OnboardingProps> = ({ onComplete }) => {
  const [profile, setProfile] = useState<UserProfile>({
    name: '',
    age: '',
    height: '',
    weight: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (profile.name && profile.age) {
      onComplete(profile);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-pink-50 via-white to-pink-50 animate-fadeIn">
      <div className="bg-white shadow-2xl rounded-[40px] w-full max-w-md p-8 border-t-8 border-pink-200 relative">
        
        {/* Pink Heart Avatar Section */}
        <div className="flex flex-col items-center -mt-24 mb-6">
          <div className="relative group">
            <div className="absolute -inset-4 bg-pink-100 rounded-full blur-xl opacity-40 animate-pulse"></div>
            <div className="relative bg-white p-2 rounded-full shadow-2xl border-4 border-pink-50 w-40 h-40 flex items-center justify-center overflow-hidden">
              <div className="w-full h-full rounded-full bg-pink-50/50 flex items-center justify-center">
                <i className="fas fa-heart text-pink-300 text-7xl animate-pulse"></i>
              </div>
            </div>
          </div>
          
          <div className="text-center mt-4">
            <h1 className="text-3xl font-bold text-gray-700 mb-1">مرحباً بك!</h1>
            <p className="text-pink-400 font-bold text-lg">في عالم طمني الصحي ✨</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2 text-right">
            <label className="text-sm font-bold text-gray-500 block px-1">الاسم الكريم</label>
            <div className="relative">
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-pink-200">
                <i className="fas fa-heart"></i>
              </span>
              <input 
                required
                type="text" 
                placeholder="ما هو اسمك الجميل؟"
                className="w-full p-4 pr-12 bg-pink-50/30 border-2 border-pink-100/50 rounded-3xl focus:outline-none focus:border-pink-300 transition-all text-gray-700 text-right placeholder:text-pink-200"
                value={profile.name}
                onChange={(e) => setProfile({...profile, name: e.target.value})}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 text-right">
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-500 block px-1">العمر</label>
              <div className="relative">
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-pink-200">
                  <i className="fas fa-cake-candles"></i>
                </span>
                <input 
                  required
                  type="number" 
                  placeholder="20"
                  className="w-full p-4 pr-12 bg-pink-50/30 border-2 border-pink-100/50 rounded-3xl focus:outline-none focus:border-pink-300 transition-all text-gray-700 text-right"
                  value={profile.age}
                  onChange={(e) => setProfile({...profile, age: e.target.value})}
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-500 block px-1">الطول (سم)</label>
              <div className="relative">
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-pink-200">
                  <i className="fas fa-ruler-vertical"></i>
                </span>
                <input 
                  type="number" 
                  placeholder="160"
                  className="w-full p-4 pr-12 bg-pink-50/30 border-2 border-pink-100/50 rounded-3xl focus:outline-none focus:border-pink-300 transition-all text-gray-700 text-right"
                  value={profile.height}
                  onChange={(e) => setProfile({...profile, height: e.target.value})}
                />
              </div>
            </div>
          </div>

          <div className="space-y-2 text-right">
            <label className="text-sm font-bold text-gray-500 block px-1">الوزن (كجم)</label>
            <div className="relative">
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-pink-200">
                <i className="fas fa-weight"></i>
              </span>
              <input 
                type="number" 
                placeholder="55"
                className="w-full p-4 pr-12 bg-pink-50/30 border-2 border-pink-100/50 rounded-3xl focus:outline-none focus:border-pink-300 transition-all text-gray-700 text-right"
                value={profile.weight}
                onChange={(e) => setProfile({...profile, weight: e.target.value})}
              />
            </div>
          </div>

          <button 
            type="submit"
            className="w-full py-5 bg-pink-300 text-white font-bold rounded-3xl shadow-lg shadow-pink-100 hover:bg-pink-400 transition-all active:scale-95 mt-4 flex items-center justify-center gap-2"
          >
            دخول عالم طمني
            <i className="fas fa-magic text-sm"></i>
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-pink-50 text-center">
          <p className="text-[10px] text-pink-200 mb-1">تم التطوير بإشراف</p>
          <p className="text-xs font-bold text-pink-400 uppercase tracking-tight">Dr. NWAIF NAIF Al-Yami</p>
        </div>
      </div>
    </div>
  );
};

export default Onboarding;
