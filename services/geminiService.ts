import { GoogleGenAI, Type } from "@google/genai";
import { AIGenerationResponse } from "../types";

// Initialize Gemini Client
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateAppLayout = async (prompt: string): Promise<AIGenerationResponse | null> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Create a mobile app layout for: ${prompt}. Return a JSON structure representing the visual components.
      The components must be one of: 'header', 'text', 'image', 'button', 'hero', 'product'.
      For components that require an image (image, hero, product), set the 'src' field to a string starting with "GENERATE_IMAGE:" followed by a descriptive prompt for the image (e.g., "GENERATE_IMAGE: A modern minimalist hero image of a coffee shop").
      Provide realistic text content and professional styling.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            appName: { type: Type.STRING },
            themeColor: { type: Type.STRING },
            elements: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.STRING },
                  type: { type: Type.STRING, enum: ['header', 'text', 'image', 'button', 'hero', 'product'] },
                  content: {
                    type: Type.OBJECT,
                    properties: {
                      title: { type: Type.STRING },
                      subtitle: { type: Type.STRING },
                      text: { type: Type.STRING },
                      src: { type: Type.STRING },
                      label: { type: Type.STRING },
                      price: { type: Type.STRING },
                    }
                  },
                  style: {
                    type: Type.OBJECT,
                    properties: {
                      backgroundColor: { type: Type.STRING },
                      textColor: { type: Type.STRING },
                      align: { type: Type.STRING },
                      padding: { type: Type.STRING },
                      borderRadius: { type: Type.STRING },
                    }
                  }
                },
                required: ['id', 'type', 'content', 'style']
              }
            }
          },
          required: ['appName', 'elements', 'themeColor']
        }
      }
    });

    const resultText = response.text;
    if (!resultText) return null;
    return JSON.parse(resultText) as AIGenerationResponse;

  } catch (error) {
    console.error("Failed to generate app layout:", error);
    return null;
  }
};

export const generateImage = async (prompt: string): Promise<string | null> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [{ text: prompt }]
      },
      config: {
        imageConfig: {
            aspectRatio: "1:1"
        }
      }
    });

    for (const part of response.candidates[0].content.parts) {
      if (part.inlineData) {
        return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
      }
    }
    return null;
  } catch (error) {
    console.error("Failed to generate image:", error);
    return null;
  }
};
