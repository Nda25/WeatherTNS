import { GoogleGenAI, Modality } from "@google/genai";
import { UserProfile } from "../types";

// Initialize Gemini Client
const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

/**
 * Generate text content for general chat with User Context
 */
export const generateChatResponse = async (
  history: {role: string, parts: {text: string}[]}[], 
  message: string,
  userProfile?: UserProfile
) => {
  try {
    const model = 'gemini-2.5-flash';
    
    // Construct System Instruction based on profile
    let systemInstruction = "أنت مساعد ذكي في تطبيق 'EcoSmart' للوعي البيئي. اسمك 'إيكو بوت'. تحدث باللغة العربية.";
    
    if (userProfile) {
      const genderAddress = userProfile.gender === 'male' ? 'صيغة المذكر' : 'صيغة المؤنث';
      systemInstruction += ` المستخدم اسمه "${userProfile.name}". خاطبه ب${genderAddress}.
      موقع المستخدم الحالي هو: ${userProfile.city}, ${userProfile.country}.
      استخدم معلومات الموقع لتقديم نصائح بيئية ومناخية دقيقة تناسب منطقته.
      اجعل إجاباتك ودودة، مشجعة، ومختصرة.`;
    }

    const chat = ai.chats.create({
      model: model,
      config: {
        systemInstruction: systemInstruction,
      },
      history: history 
    });

    const result = await chat.sendMessage({ message });
    return result.text;
  } catch (error) {
    console.error("Gemini Chat Error:", error);
    throw error;
  }
};

/**
 * Generate a quick weather/climate analysis based on location
 */
export const generateWeatherInsight = async (userProfile: UserProfile) => {
  try {
    const prompt = `قم بإنشاء تقرير مناخي موجز جداً (أقل من 40 كلمة) لمدينة ${userProfile.city} في دولة ${userProfile.country} لهذا الوقت من السنة.
    توقع حالة الطقس العامة (درجة الحرارة التقريبية) وقدم نصيحة بيئية واحدة تناسب هذا الجو.`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });
    return response.text;
  } catch (error) {
    console.error("Weather Insight Error:", error);
    return "لا يمكن تحديد حالة الطقس حالياً.";
  }
};

/**
 * Generate eco advice
 */
export const generateEcoAdvice = async (topic: string, userProfile?: UserProfile) => {
  try {
    let prompt = `أنا طالب مهتم بالبيئة. أريد أن أكتب موضوعاً أو أنفذ مشروعاً حول: "${topic}".`;
    if (userProfile) {
        prompt += ` أعيش في ${userProfile.city}, ${userProfile.country}. اجعل النصائح مناسبة لبيئتي المحلية.`;
    }
    prompt += ` قم بتوليد قائمة من الأفكار العملية والنصائح المبتكرة.`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });
    return response.text;
  } catch (error) {
    console.error("Gemini Advice Error:", error);
    throw error;
  }
};

/**
 * Text-to-Speech using Gemini with Gender-based Voice Selection
 */
export const speakText = async (text: string, gender: 'male' | 'female' = 'male'): Promise<ArrayBuffer> => {
  try {
    const textToSpeak = text.length > 500 ? text.substring(0, 500) + "..." : text;
    
    // Select voice based on gender
    // Male: Fenrir, Charon
    // Female: Zephyr, Puck (Puck is sometimes generic, Zephyr is clear female)
    const voiceName = gender === 'female' ? 'Zephyr' : 'Fenrir';

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-preview-tts",
      contents: [{ parts: [{ text: textToSpeak }] }],
      config: {
        responseModalities: [Modality.AUDIO],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: voiceName },
          },
        },
      },
    });

    const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
    
    if (!base64Audio) {
      throw new Error("No audio data received from Gemini.");
    }

    const binaryString = atob(base64Audio);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes.buffer;

  } catch (error) {
    console.error("Gemini TTS Error:", error);
    throw error;
  }
};

/**
 * Handle Voice Interaction
 */
export const processVoiceInteraction = async (userSpokenText: string, userProfile?: UserProfile) => {
  // 1. Get Text Response
  const textResponse = await generateChatResponse([], userSpokenText, userProfile);
  
  if (!textResponse) throw new Error("No text response generated");

  // 2. Convert to Audio (pass gender)
  const gender = userProfile?.gender || 'male';
  const audioBuffer = await speakText(textResponse, gender);

  return {
    text: textResponse,
    audio: audioBuffer
  };
};
