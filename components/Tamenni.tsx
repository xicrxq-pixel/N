
import React, { useState } from 'react';
import { generateHealthAdvice } from '../services/geminiService';

interface SymptomConfig {
  id: string;
  label: string;
  icon: string;
  color: string;
  questions: {
    id: string;
    label: string;
    options: string[];
  }[];
  tips: string[];
  warning: string;
}

const SYMPTOMS: Record<string, SymptomConfig> = {
  headache: {
    id: 'headache',
    label: 'صداع',
    icon: 'fas fa-head-side-virus',
    color: 'from-pink-400 to-rose-400',
    questions: [
      { id: 'duration', label: 'مدة الصداع؟', options: ['ساعات', 'يوم', 'أكثر'] },
      { id: 'intensity', label: 'الشدة؟', options: ['خفيف', 'متوسط', 'شديد'] },
      { id: 'others', label: 'غثيان/زغللة؟', options: ['نعم', 'لا'] },
    ],
    tips: ['شرب ماء كافٍ 💧', 'الاسترخاء في هدوء 🕯️', 'كمادة باردة'],
    warning: '🚨 إذا كان الصداع مفاجئاً وشديداً جداً، توجهي للطوارئ.',
  },
  toothache: {
    id: 'toothache',
    label: 'ألم أسنان',
    icon: 'fas fa-tooth',
    color: 'from-cyan-400 to-blue-400',
    questions: [
      { id: 'trigger', label: 'متى يزيد؟', options: ['بارد/ساخن', 'مضغ', 'مستمر'] },
      { id: 'swelling', label: 'تورم لثة؟', options: ['نعم', 'لا'] },
      { id: 'fever', label: 'حرارة؟', options: ['نعم', 'لا'] },
    ],
    tips: ['مضمضة بملح 🧂', 'كمادة باردة 🧊', 'تجنب السكر'],
    warning: '🚨 التورم الذي يصل للوجه يحتاج طبيب فوراً.',
  },
  throat: {
    id: 'throat',
    label: 'التهاب حلق',
    icon: 'fas fa-head-side-cough',
    color: 'from-amber-400 to-orange-400',
    questions: [
      { id: 'swallow', label: 'صعوبة بلع؟', options: ['شديدة', 'بسيطة', 'لا يوجد'] },
      { id: 'tonsils', label: 'بقع بيضاء؟', options: ['نعم', 'لا'] },
      { id: 'voice', label: 'بحة صوت؟', options: ['نعم', 'لا'] },
    ],
    tips: ['يانسون وعسل ☕', 'راحة الصوت', 'بخار ماء'],
    warning: '🚨 صعوبة التنفس تتطلب طوارئ فوراً.',
  },
  dizziness: {
    id: 'dizziness',
    label: 'دوخة',
    icon: 'fas fa-spinner',
    color: 'from-indigo-400 to-purple-400',
    questions: [
      { id: 'motion', label: 'متى تشعرين بها؟', options: ['وقوف فجأة', 'استلقاء', 'مستمر'] },
      { id: 'ear', label: 'طنين أذن؟', options: ['نعم', 'لا'] },
      { id: 'vision', label: 'زغللة؟', options: ['نعم', 'لا'] },
    ],
    tips: ['التحرك ببطء 🚶‍♀️', 'شرب ماء', 'قياس الضغط'],
    warning: '🚨 الإغماء أو ثقل اللسان = طوارئ فوراً.',
  },
  backPain: {
    id: 'backPain',
    label: 'ألم ظهر',
    icon: 'fas fa-user-injured',
    color: 'from-emerald-500 to-teal-600',
    questions: [
      { id: 'location', label: 'المكان؟', options: ['أسفل', 'أعلى', 'العمود'] },
      { id: 'movement', label: 'يزيد بالحركة؟', options: ['نعم', 'لا'] },
      { id: 'numbness', label: 'تنميل ساق؟', options: ['نعم', 'لا'] },
    ],
    tips: ['استلقاء مريح 🛌', 'مرهم مسكن', 'تجنب الأوزان'],
    warning: '🚨 فقدان الإحساس في الأطراف يتطلب طبيب.',
  },
  eyeStrain: {
    id: 'eyeStrain',
    label: 'إجهاد عين',
    icon: 'fas fa-eye',
    color: 'from-blue-400 to-indigo-500',
    questions: [
      { id: 'screen', label: 'وقت الشاشة؟', options: ['طويل', 'متوسط', 'قليل'] },
      { id: 'redness', label: 'احمرار/جفاف؟', options: ['نعم', 'لا'] },
      { id: 'focus', label: 'زغللة؟', options: ['نعم', 'لا'] },
    ],
    tips: ['قاعدة 20-20-20', 'قطرة مرطبة', 'تقليل السطوع'],
    warning: '🚨 فقدان مفاجئ للرؤية = طبيب فوراً.',
  },
  insomnia: {
    id: 'insomnia',
    label: 'أرق',
    icon: 'fas fa-moon',
    color: 'from-slate-700 to-blue-900',
    questions: [
      { id: 'latency', label: 'وقت الدخول؟', options: ['ساعة+', 'نصف ساعة', 'متقطع'] },
      { id: 'caffeine', label: 'قهوة متأخرة؟', options: ['نعم', 'لا'] },
      { id: 'stress', label: 'تفكير؟', options: ['كثير', 'قليل'] },
    ],
    tips: ['ترك الجوال 📵', 'تعتيم الغرفة', 'كتاب هادئ'],
    warning: '🚨 الأرق المزمن يحتاج استشارة مختص.',
  },
  allergy: {
    id: 'allergy',
    label: 'حساسية',
    icon: 'fas fa-hand-dots',
    color: 'from-rose-300 to-pink-500',
    questions: [
      { id: 'rash', label: 'طفح جلدي؟', options: ['منتشر', 'بسيط', 'لا يوجد'] },
      { id: 'swelling', label: 'تورم شفاه؟', options: ['نعم', 'لا'] },
      { id: 'breathing', label: 'ضيق تنفس؟', options: ['نعم', 'لا'] },
    ],
    tips: ['غسول مبرد', 'تجنب العطور', 'ملابس قطنية'],
    warning: '🚨 ضيق التنفس أو تورم اللسان = طوارئ فوراً.',
  }
};

const Tamenni: React.FC = () => {
  const [selectedSymptom, setSelectedSymptom] = useState<string | null>(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [advice, setAdvice] = useState<string | null>(null);

  const currentSymptomData = selectedSymptom ? SYMPTOMS[selectedSymptom] : null;

  const handleSymptomSelect = (id: string) => {
    setSelectedSymptom(id);
    setCurrentStep(0);
    setAnswers({});
  };

  const handleAnswer = (answer: string) => {
    if (!currentSymptomData) return;
    const q = currentSymptomData.questions[currentStep];
    const newAnswers = { ...answers, [q.id]: answer };
    setAnswers(newAnswers);

    if (currentStep < currentSymptomData.questions.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      processHealthResult(newAnswers);
    }
  };

  const processHealthResult = async (finalAnswers: Record<string, string>) => {
    setLoading(true);
    const details = Object.entries(finalAnswers).map(([k, v]) => `${k}: ${v}`).join(', ');
    const aiAdvice = await generateHealthAdvice(`${currentSymptomData?.label}`, details);
    setAdvice(aiAdvice);
    setLoading(false);
  };

  const reset = () => {
    setSelectedSymptom(null);
    setCurrentStep(0);
    setAnswers({});
    setAdvice(null);
  };

  return (
    <div className="w-full animate-fadeIn pb-10">
      <div className="bg-white/95 backdrop-blur-xl shadow-2xl rounded-[40px] w-full p-6 md:p-8 border border-white relative overflow-hidden">
        
        {!selectedSymptom && !loading && !advice && (
          <div className="text-center">
            <div className="mb-6">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-pink-100 rounded-full mb-3">
                    <i className="fas fa-heart-pulse text-2xl text-pink-500"></i>
                </div>
                <h1 className="text-2xl font-bold text-gray-800">طمني عنكِ</h1>
                <p className="text-pink-400 text-sm mt-1 font-medium">ماذا تشعرين اليوم؟</p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {Object.values(SYMPTOMS).map((s) => (
                <button
                  key={s.id}
                  onClick={() => handleSymptomSelect(s.id)}
                  className="flex flex-col items-center p-4 bg-white border border-pink-50 rounded-3xl hover:border-pink-300 hover:shadow-lg transition-all active:scale-95"
                >
                  <div className={`w-12 h-12 bg-gradient-to-br ${s.color} rounded-2xl flex items-center justify-center mb-2 shadow-sm`}>
                    <i className={`${s.icon} text-xl text-white`}></i>
                  </div>
                  <span className="font-bold text-gray-700 text-xs">{s.label}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {selectedSymptom && !advice && !loading && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
                <button onClick={() => setSelectedSymptom(null)} className="w-8 h-8 flex items-center justify-center text-pink-400 bg-pink-50 rounded-full">
                    <i className="fas fa-arrow-right text-sm"></i>
                </button>
                <div className="flex-1 px-4">
                  <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                      <div 
                          className={`h-full bg-gradient-to-r ${currentSymptomData?.color} rounded-full transition-all duration-300`} 
                          style={{ width: `${((currentStep + 1) / currentSymptomData!.questions.length) * 100}%` }}
                      />
                  </div>
                </div>
                <span className="text-[10px] font-bold text-pink-400">{currentStep + 1}/{currentSymptomData?.questions.length}</span>
            </div>

            <div className="text-center">
              <h2 className="text-lg font-bold text-gray-800 mb-6">{currentSymptomData?.questions[currentStep].label}</h2>
              <div className="grid grid-cols-2 gap-3">
                {currentSymptomData?.questions[currentStep].options.map((option, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleAnswer(option)}
                    className="py-4 px-2 bg-pink-50/50 border border-pink-100 rounded-2xl font-bold text-gray-700 text-sm hover:bg-pink-100 hover:border-pink-300 transition-all active:scale-95"
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {loading && (
          <div className="text-center py-16">
            <div className="w-12 h-12 border-4 border-pink-100 border-t-pink-400 rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-pink-400 font-bold">جاري التحليل...</p>
          </div>
        )}

        {advice && (
          <div className="space-y-5 animate-fadeIn">
            <div className="bg-pink-50/30 p-5 rounded-3xl border border-pink-100">
              <p className="text-gray-700 text-sm leading-relaxed font-medium">{advice}</p>
            </div>
            
            <div className="space-y-3">
                <div className="bg-white p-4 rounded-2xl border border-pink-50 shadow-sm">
                    <h3 className="text-xs font-bold text-pink-500 mb-2">💡 نصائح:</h3>
                    <ul className="text-[11px] text-gray-600 space-y-1">
                        {currentSymptomData?.tips.map((tip, i) => <li key={i}>• {tip}</li>)}
                    </ul>
                </div>
                <div className="bg-red-50 p-4 rounded-2xl border border-red-100">
                    <h3 className="text-xs font-bold text-red-500 mb-1">⚠️ تحذير:</h3>
                    <p className="text-[10px] text-red-700 font-bold">{currentSymptomData?.warning}</p>
                </div>
            </div>

            <button onClick={reset} className="w-full py-4 bg-pink-400 text-white font-bold rounded-2xl shadow-lg active:scale-95 transition-transform">
              استشارة جديدة
            </button>
          </div>
        )}

        <div className="mt-8 pt-4 border-t border-pink-50 text-center">
          <p className="text-[10px] text-gray-300 font-bold">Dr. NWAIF NAIF Al-Yami</p>
        </div>
      </div>
    </div>
  );
};

export default Tamenni;
