import { GoogleGenAI, Type } from "@google/genai";
import type { VoiceAnalysisResult } from "../types";

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

function blobToBase64(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64data = reader.result as string;
      // remove the prefix `data:audio/webm;base64,`
      resolve(base64data.split(',')[1]);
    };
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

export async function analyzeVoice(audioBlob: Blob): Promise<VoiceAnalysisResult> {
  const base64Audio = await blobToBase64(audioBlob);

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: {
      parts: [
        {
          inlineData: {
            mimeType: audioBlob.type,
            data: base64Audio,
          },
        },
        {
          text: `
            Analise este áudio de uma pessoa falando. 
            Identifique sinais de ansiedade como tremor na voz, ritmo da fala (lento, normal, rápido) e o uso de palavras de preenchimento ('uhm', 'tipo', 'er').
            Sua resposta DEVE ser JSON. Forneça um feedback curto e encorajador em uma única frase (no campo 'feedback') em português do Brasil.
          `,
        },
      ],
    },
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          feedback: {
            type: Type.STRING,
            description: "Feedback curto, gentil e encorajador sobre a fala."
          },
          pace: {
            type: Type.STRING,
            description: "Ritmo da fala, pode ser 'lento', 'normal', ou 'rápido'."
          },
          tremor: {
            type: Type.BOOLEAN,
            description: "Se há um tremor perceptível na voz."
          },
          fillers: {
            type: Type.INTEGER,
            description: "Contagem aproximada de palavras de preenchimento."
          },
        },
      },
    },
  });
  
  try {
    const jsonText = response.text.trim();
    const result = JSON.parse(jsonText);
    return result as VoiceAnalysisResult;
  } catch (e) {
    console.error("Failed to parse Gemini response as JSON", e);
    console.error("Raw response:", response.text);
    throw new Error("Formato de resposta da IA inválido.");
  }
}

export async function getMotivationalQuote(): Promise<string> {
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: `
      Gere uma mensagem motivacional curta, poderosa e gentil para alguém que se sente ansioso antes de uma apresentação.
      A mensagem deve ser em português do Brasil e ter no máximo 25 palavras. Seja direto e encorajador.
    `,
    config: {
        thinkingConfig: { thinkingBudget: 0 }
    }
  });

  return response.text.trim();
}