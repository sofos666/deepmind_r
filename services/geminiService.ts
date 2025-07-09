import { GoogleGenAI, GenerateContentResponse } from "@google/genai";

// Ensure the process polyfill is available in the browser context
declare const process: {
  env: {
    API_KEY: string;
  };
};

const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      // result is a data URL like `data:image/jpeg;base64,....`
      // We only need the part after the comma.
      if (typeof reader.result === 'string') {
        resolve(reader.result.split(',')[1]);
      } else {
        reject(new Error("Failed to read file as base64 string."));
      }
    };
    reader.onerror = (error) => reject(error);
  });
};

export const analyzeImage = async (imageFile: File, prompt: string): Promise<string> => {
  if (!process.env.API_KEY) {
    throw new Error(
      "API key not found. Make sure you have configured the API_KEY environment variable."
    );
  }

  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  try {
    const base64Image = await fileToBase64(imageFile);

    const imagePart = {
      inlineData: {
        mimeType: imageFile.type,
        data: base64Image,
      },
    };

    const textPart = {
      text: prompt,
    };

    const response: GenerateContentResponse = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: { parts: [imagePart, textPart] },
    });
    
    const analysisText = response.text;
    if (!analysisText) {
        throw new Error("The AI did not return an analysis. Try again with a different image.");
    }

    return analysisText.trim();

  } catch (error) {
    console.error("Error calling Gemini API:", error);
    if (error instanceof Error) {
        if (error.message.includes('API key not valid')) {
            return "The API key is not valid. Please check it.";
        }
        return `There was a problem with the AI service: ${error.message}`;
    }
    return "An unexpected error occurred during the analysis.";
  }
};