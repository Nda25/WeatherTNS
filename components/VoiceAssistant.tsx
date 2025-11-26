import React, { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, Volume2, Loader2, StopCircle, User, AlertCircle } from 'lucide-react';
import { processVoiceInteraction } from '../services/geminiService';
import { UserProfile } from '../types';

interface VoiceAssistantProps {
    userProfile: UserProfile;
}

const VoiceAssistant: React.FC<VoiceAssistantProps> = ({ userProfile }) => {
  const [isListening, setIsListening] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [response, setResponse] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSupported, setIsSupported] = useState(true);
  
  const recognitionRef = useRef<any>(null);
  const audioContextRef = useRef<AudioContext | null>(null);

  useEffect(() => {
    // Check support
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      setIsSupported(false);
      return;
    }

    try {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = 'ar-SA'; // Arabic

      recognitionRef.current.onresult = (event: any) => {
        const text = event.results[0][0].transcript;
        setTranscript(text);
        handleVoiceInput(text);
      };

      recognitionRef.current.onerror = (event: any) => {
        console.error('Speech recognition error', event.error);
        setIsListening(false);
        setError('لم أتمكن من سماعك بوضوح، حاول مرة أخرى.');
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
    } catch (e) {
      console.error("Speech Init Error", e);
      setIsSupported(false);
    }

    return () => {
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, []);

  const toggleListening = () => {
    setError(null);
    if (isListening) {
      recognitionRef.current?.stop();
    } else {
      setTranscript('');
      setResponse('');
      try {
        recognitionRef.current?.start();
        setIsListening(true);
      } catch (e) {
        console.error("Start Error", e);
        setError("تعذر بدء الميكروفون. تأكد من السماح بالوصول.");
      }
    }
  };

  const handleVoiceInput = async (text: string) => {
    setIsProcessing(true);
    try {
      const { text: aiText, audio } = await processVoiceInteraction(text, userProfile);
      setResponse(aiText);
      playAudio(audio);
    } catch (error) {
      console.error(error);
      setResponse('عذراً، حدث خطأ في الاتصال بالخدمة الذكية.');
    } finally {
      setIsProcessing(false);
    }
  };

  const playAudio = async (arrayBuffer: ArrayBuffer) => {
    try {
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      }

      // Resume context if suspended (browser policy)
      if (audioContextRef.current.state === 'suspended') {
        await audioContextRef.current.resume();
      }

      const audioBuffer = await audioContextRef.current.decodeAudioData(arrayBuffer);
      const source = audioContextRef.current.createBufferSource();
      source.buffer = audioBuffer;
      source.connect(audioContextRef.current.destination);
      
      source.onended = () => setIsSpeaking(false);
      
      setIsSpeaking(true);
      source.start(0);
    } catch (e) {
      console.error("Audio Playback Error", e);
      setIsSpeaking(false);
      setError("حدث خطأ في تشغيل الصوت.");
    }
  };

  if (!isSupported) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] p-8 text-center bg-red-50 rounded-3xl border border-red-100">
        <AlertCircle size={48} className="text-red-500 mb-4" />
        <h3 className="text-xl font-bold text-red-700">المتصفح غير مدعوم</h3>
        <p className="text-red-600 mt-2">عذراً، خاصية التعرف الصوتي غير مدعومة في هذا المتصفح. يرجى استخدام Google Chrome أو Edge.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[600px] relative overflow-hidden bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 rounded-3xl p-8 text-white shadow-2xl">
      {/* Removed wrapper animate-fade-in to prevent layout issues */}
      
      {/* Background Ambience */}
      <div className="absolute inset-0 opacity-20 pointer-events-none">
        <div className="absolute top-0 left-0 w-64 h-64 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl animate-blob"></div>
        <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-0 left-20 w-64 h-64 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-4000"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 text-center space-y-8 w-full max-w-2xl animate-fade-in">
        <div>
          <h2 className="text-3xl font-bold mb-2">المساعد الصوتي المناخي</h2>
          <p className="text-purple-200">أهلاً {userProfile.name}، أنا جاهز للتحدث معك...</p>
        </div>

        {/* Visualizer / Status Area */}
        <div className="h-40 flex items-center justify-center">
            {isListening ? (
                <div className="flex gap-2 items-center">
                    {[1,2,3,4,5].map(i => (
                        <div key={i} className="w-2 bg-pink-400 rounded-full animate-bounce" style={{height: `${Math.random() * 40 + 20}px`, animationDelay: `${i * 0.1}s`}}></div>
                    ))}
                </div>
            ) : isProcessing ? (
                <Loader2 size={64} className="animate-spin text-purple-300" />
            ) : isSpeaking ? (
                 <div className="relative">
                    <div className="absolute inset-0 bg-blue-500 rounded-full animate-ping opacity-25"></div>
                    <Volume2 size={64} className="text-blue-300 relative z-10" />
                 </div>
            ) : (
                <button 
                  onClick={toggleListening}
                  className="group relative transition-transform hover:scale-105 focus:outline-none"
                >
                    <div className="absolute inset-0 bg-white/20 rounded-full blur-xl group-hover:bg-white/30 transition-all"></div>
                    <span className="text-6xl relative z-10 block">🎙️</span>
                </button>
            )}
        </div>

        {/* Error Message */}
        {error && (
            <div className="bg-red-500/20 text-red-200 p-3 rounded-xl text-sm border border-red-500/30">
                {error}
            </div>
        )}

        {/* Transcripts */}
        <div className="space-y-4 min-h-[100px]">
          {transcript && (
            <div className="bg-white/10 backdrop-blur-md p-4 rounded-xl border border-white/20 animate-fade-in-up">
              <p className="text-sm text-purple-200 mb-1 flex items-center justify-center gap-1">
                 <User size={12} /> {userProfile.name}:
              </p>
              <p className="text-lg">{transcript}</p>
            </div>
          )}
          {response && !isProcessing && (
            <div className="bg-black/30 backdrop-blur-md p-4 rounded-xl border border-white/10 animate-fade-in-up">
              <p className="text-sm text-green-300 mb-1">الرد:</p>
              <p className="text-lg leading-relaxed">{response}</p>
            </div>
          )}
        </div>

        {/* Controls Text */}
        {!isListening && !isProcessing && (
           <p className="text-sm text-purple-300 mt-4 opacity-75">
              اضغط على الميكروفون للبدء
           </p>
        )}
      </div>
    </div>
  );
};

export default VoiceAssistant;