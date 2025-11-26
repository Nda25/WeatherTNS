import React, { useState } from 'react';
import { generateEcoAdvice } from '../services/geminiService';
import { Leaf, Search, Sparkles, Loader2, ArrowRight } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { UserProfile } from '../types';

interface ProtectEnvironmentProps {
    userProfile?: UserProfile;
}

const ProtectEnvironment: React.FC<ProtectEnvironmentProps> = ({ userProfile }) => {
  const [topic, setTopic] = useState('');
  const [result, setResult] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleGenerate = async () => {
    if (!topic.trim()) return;
    setIsLoading(true);
    setResult(null);
    try {
      const advice = await generateEcoAdvice(topic, userProfile);
      setResult(advice);
    } catch (error) {
      setResult('حدث خطأ أثناء توليد الأفكار. يرجى المحاولة مرة أخرى.');
    } finally {
      setIsLoading(false);
    }
  };

  const suggestions = [
    'تقليل استخدام البلاستيك',
    'توفير المياه في المنزل',
    'إعادة تدوير الورق',
    'الزراعة المنزلية',
    'الطاقة الشمسية'
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-8"> {/* Removed animate-fade-in */}
      <div className="text-center space-y-4 animate-fade-in">
        <div className="inline-flex items-center justify-center p-4 bg-green-100 rounded-full text-green-600 mb-4">
          <Leaf size={40} />
        </div>
        <h1 className="text-4xl font-bold text-gray-900">كيف نحمي البيئة؟</h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          اكتب أي موضوع بيئي يهمك، وسيقوم الذكاء الاصطناعي بتوليد خطة عمل، أفكار مبتكرة، وحلول عملية {userProfile ? `لمدينتك ${userProfile.city}` : ''}.
        </p>
      </div>

      {/* Input Section */}
      <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 animate-fade-in-up">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="مثال: كيف أبدأ حملة تنظيف الشاطئ؟"
              className="w-full pr-12 pl-4 py-4 text-lg rounded-xl border-2 border-gray-100 focus:border-green-500 focus:outline-none transition-colors"
              onKeyDown={(e) => e.key === 'Enter' && handleGenerate()}
            />
          </div>
          <button
            onClick={handleGenerate}
            disabled={isLoading || !topic.trim()}
            className="bg-green-600 hover:bg-green-700 text-white px-8 py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-2 transition-all shadow-lg hover:shadow-green-500/30 disabled:opacity-50 disabled:shadow-none"
          >
            {isLoading ? (
              <>
                <Loader2 className="animate-spin" />
                جاري التفكير...
              </>
            ) : (
              <>
                <Sparkles />
                توليد الأفكار
              </>
            )}
          </button>
        </div>

        {/* Suggestions */}
        <div className="mt-6 flex flex-wrap gap-2">
          <span className="text-sm text-gray-500 ml-2 py-2">مواضيع مقترحة:</span>
          {suggestions.map((s) => (
            <button
              key={s}
              onClick={() => setTopic(s)}
              className="px-4 py-2 bg-gray-50 hover:bg-green-50 text-gray-600 hover:text-green-700 rounded-lg text-sm transition-colors border border-gray-100"
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Results Section */}
      {result && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden animate-fade-in-up">
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-4 border-b border-green-100 flex items-center gap-3">
            <div className="bg-white p-2 rounded-lg shadow-sm">
              <Sparkles className="text-green-600" size={20} />
            </div>
            <h3 className="font-bold text-green-800">النتائج المقترحة لـ: {topic}</h3>
          </div>
          <div className="p-8 prose prose-lg prose-green max-w-none">
            <ReactMarkdown>{result}</ReactMarkdown>
          </div>
          <div className="p-4 bg-gray-50 border-t border-gray-100 flex justify-end">
            <button 
                onClick={() => {
                    setResult(null);
                    setTopic('');
                }}
                className="text-gray-500 hover:text-green-600 flex items-center gap-2 text-sm font-medium"
            >
                بحث جديد <ArrowRight size={16} className="rtl:rotate-180" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProtectEnvironment;