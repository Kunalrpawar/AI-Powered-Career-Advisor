import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const testGeminiConnection = async () => {
  console.log('🧪 Testing Gemini API Connection...');
  console.log('API Key:', process.env.GEMINI_API_KEY ? '***' + process.env.GEMINI_API_KEY.slice(-4) : 'NOT FOUND');
  
  if (!process.env.GEMINI_API_KEY) {
    console.error('❌ No API key found in environment variables');
    return;
  }

  try {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    
    // Test with gemini-2.0-flash
    console.log('🔄 Testing gemini-2.0-flash...');
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });
    const result = await model.generateContent('Hello, can you respond with "API connection successful"?');
    const response = await result.response;
    console.log('✅ gemini-2.0-flash response:', response.text());
    
  } catch (error) {
    console.error('❌ Error with gemini-2.0-flash:', error.message);
    
    // Try gemini-1.5-pro as fallback
    try {
      console.log('🔄 Trying gemini-1.5-pro as fallback...');
      const genAI2 = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
      const model2 = genAI2.getGenerativeModel({ model: 'gemini-1.5-pro' });
      const result2 = await model2.generateContent('Hello, can you respond with "API connection successful"?');
      const response2 = await result2.response;
      console.log('✅ gemini-1.5-pro response:', response2.text());
    } catch (error2) {
      console.error('❌ Both models failed:', error2.message);
    }
  }
};

testGeminiConnection();
