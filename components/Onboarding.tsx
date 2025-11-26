import React, { useState, useEffect } from 'react';
import { UserProfile } from '../types';
import { User, MapPin, ArrowLeft, Leaf } from 'lucide-react';

interface OnboardingProps {
  onComplete: (profile: UserProfile) => void;
}

const LOCATIONS: Record<string, string[]> = {
  "المملكة العربية السعودية": ["الرياض", "جدة", "مكة المكرمة", "المدينة المنورة", "الدمام", "الخبر", "أبها", "تبوك", "حائل", "جازان", "نجران", "بريدة", "الهفوف"],
  "الإمارات العربية المتحدة": ["دبي", "أبو ظبي", "الشارقة", "عجمان", "رأس الخيمة", "الفجيرة", "أم القيوين"],
  "مصر": ["القاهرة", "الإسكندرية", "الجيزة", "شرم الشيخ", "الغردقة", "الأقصر", "أسوان", "المنصورة", "طنطا"],
  "الأردن": ["عمان", "إربد", "الزرقاء", "العقبة", "السلط", "مادبا"],
  "الكويت": ["مدينة الكويت", "حولي", "السالمية", "الجهراء", "الفروانية", "الأحمدي"],
  "قطر": ["الدوحة", "الريان", "الوكرة", "الخور"],
  "البحرين": ["المنامة", "المحرق", "الرفاع", "مدينة حمد", "مدينة عيسى"],
  "سلطنة عمان": ["مسقط", "صلالة", "صحار", "نزوى", "صور"],
  "العراق": ["بغداد", "البصرة", "الموصل", "أربيل", "النجف", "كربلاء"],
  "المغرب": ["الدار البيضاء", "الرباط", "مراكش", "فاس", "طنجة", "أغادير"],
  "أخرى": ["مدينة أخرى"]
};

const Onboarding: React.FC<OnboardingProps> = ({ onComplete }) => {
  const [step, setStep] = useState(1);
  const [name, setName] = useState('');
  const [gender, setGender] = useState<'male' | 'female'>('male');
  const [country, setCountry] = useState('');
  const [city, setCity] = useState('');
  const [availableCities, setAvailableCities] = useState<string[]>([]);

  // Reset city when country changes
  useEffect(() => {
    if (country && LOCATIONS[country]) {
      setAvailableCities(LOCATIONS[country]);
      setCity('');
    } else if (country === 'أخرى') {
        setAvailableCities([]);
        setCity('');
    }
  }, [country]);

  const handleNext = () => {
    if (step === 1 && name.trim()) {
      setStep(2);
    } else if (step === 2 && country && city) {
      onComplete({ name, gender, country, city });
    }
  };

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-3xl p-8 w-full max-w-md shadow-2xl animate-fade-in relative overflow-hidden">
        
        {/* Decorative elements */}
        <div className="absolute top-0 left-0 w-32 h-32 bg-green-100 rounded-br-full -z-0 opacity-50"></div>
        <div className="absolute bottom-0 right-0 w-32 h-32 bg-purple-100 rounded-tl-full -z-0 opacity-50"></div>

        <div className="relative z-10">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-primary to-secondary rounded-2xl mx-auto flex items-center justify-center text-white mb-4 shadow-lg transform -rotate-6">
              <Leaf size={32} />
            </div>
            <h2 className="text-2xl font-bold text-gray-800">مرحباً بك في EcoSmart</h2>
            <p className="text-gray-500 text-sm mt-2">لنقم بإعداد حسابك للحصول على أفضل تجربة بيئية</p>
          </div>

          {step === 1 ? (
            <div className="space-y-6 animate-fade-in">
              <div className="group">
                <label className="block text-sm font-medium text-gray-700 mb-2 transition-colors group-focus-within:text-primary">ما هو اسمك؟</label>
                <div className="relative transition-transform duration-300 hover:scale-[1.02]">
                  <User className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors" size={20} />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full pr-10 pl-4 py-4 rounded-xl border-2 border-gray-100 text-gray-900 font-bold placeholder-gray-400 focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all duration-300 bg-gray-50 focus:bg-white hover:shadow-md"
                    placeholder="أدخل اسمك هنا"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">الجنس</label>
                <div className="grid grid-cols-2 gap-4">
                  <button
                    onClick={() => setGender('male')}
                    className={`p-4 rounded-xl border-2 font-bold transition-all duration-300 transform hover:scale-105 ${gender === 'male' ? 'border-primary bg-purple-50 text-primary shadow-md' : 'border-gray-100 text-gray-500 hover:bg-gray-50'}`}
                  >
                    ذكر
                  </button>
                  <button
                    onClick={() => setGender('female')}
                    className={`p-4 rounded-xl border-2 font-bold transition-all duration-300 transform hover:scale-105 ${gender === 'female' ? 'border-secondary bg-pink-50 text-secondary shadow-md' : 'border-gray-100 text-gray-500 hover:bg-gray-50'}`}
                  >
                    أنثى
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-6 animate-fade-in">
              <div className="group">
                <label className="block text-sm font-medium text-gray-700 mb-2 transition-colors group-focus-within:text-primary">الدولة</label>
                <div className="relative transition-transform duration-300 hover:scale-[1.02]">
                  <MapPin className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors pointer-events-none" size={20} />
                  <select
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    className="w-full pr-10 pl-4 py-4 rounded-xl border-2 border-gray-100 text-gray-900 font-bold focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all duration-300 appearance-none bg-gray-50 focus:bg-white hover:shadow-md cursor-pointer"
                  >
                    <option value="" disabled className="text-gray-400">اختر الدولة</option>
                    {Object.keys(LOCATIONS).map(c => (
                        <option key={c} value={c} className="text-gray-900 font-medium py-2">{c}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="group">
                <label className="block text-sm font-medium text-gray-700 mb-2 transition-colors group-focus-within:text-primary">المدينة</label>
                <div className="relative transition-transform duration-300 hover:scale-[1.02]">
                  <MapPin className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors pointer-events-none" size={20} />
                  {country === 'أخرى' ? (
                      <input 
                        type="text"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        placeholder="أدخل اسم المدينة"
                        className="w-full pr-10 pl-4 py-4 rounded-xl border-2 border-gray-100 text-gray-900 font-bold placeholder-gray-400 focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all duration-300 bg-gray-50 focus:bg-white hover:shadow-md"
                      />
                  ) : (
                      <select
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        disabled={!country}
                        className="w-full pr-10 pl-4 py-4 rounded-xl border-2 border-gray-100 text-gray-900 font-bold focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all duration-300 appearance-none bg-gray-50 focus:bg-white hover:shadow-md disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed cursor-pointer"
                      >
                        <option value="" disabled className="text-gray-400">اختر المدينة</option>
                        {availableCities.map(c => (
                            <option key={c} value={c} className="text-gray-900 font-medium py-2">{c}</option>
                        ))}
                      </select>
                  )}
                </div>
              </div>
            </div>
          )}

          <div className="mt-8 flex gap-3">
             {step === 2 && (
                <button
                    onClick={() => setStep(1)}
                    className="px-6 py-3 rounded-xl bg-gray-100 text-gray-600 font-bold hover:bg-gray-200 transition-colors transform hover:scale-105"
                >
                    <ArrowLeft className="rtl:rotate-180" size={20} />
                </button>
             )}
            <button
              onClick={handleNext}
              disabled={step === 1 ? !name : (!country || !city)}
              className="flex-1 bg-gradient-to-r from-primary to-secondary text-white font-bold py-3 rounded-xl shadow-lg hover:shadow-xl hover:opacity-90 transition-all duration-300 transform hover:scale-[1.02] disabled:opacity-50 disabled:shadow-none disabled:transform-none"
            >
              {step === 1 ? 'التالي' : 'ابدأ الرحلة'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Onboarding;