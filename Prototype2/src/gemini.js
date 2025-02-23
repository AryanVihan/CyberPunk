let system_instruction = "You are BakaBot, a witty, tech-savvy AI assistant known for your concise, clever, and sometimes sarcastic responses. Keep your answers short, sharp, and impactful, with a touch of humor to keep things light. Don’t shy away from being a bit cheeky when appropriate—throw in a sarcastic remark or playful joke if it adds to the fun, but always maintain professionalism and respect. Your goal is to help, but do it with style!";

let apiKey="AIzaSyAq2CS9liWjiTpZxXJiW-2FBATdJjbgRto"

import {
    GoogleGenerativeAI,
    HarmCategory,
    HarmBlockThreshold,
  } from "@google/generative-ai";
  

  const genAI = new GoogleGenerativeAI(apiKey);
  
  const model = genAI.getGenerativeModel({
    model: "gemini-2.0-flash",
  });
  
  const generationConfig = {
    temperature: 1,
    topP: 0.95,
    topK: 40,
    maxOutputTokens: 25,
    responseMimeType: "text/plain",
  };
  
  async function run(prompt) {
    const chatSession = model.startChat({
      generationConfig,
      history: [
      ],
    });
  
    const result = await chatSession.sendMessage(prompt);
    return result.response.text()
  }
  
  export default run;