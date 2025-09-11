import { generateResponse } from '../../config/gemini.js';

export const interestProfilerTool = {
  name: 'interest_profiler',
  description: 'Infer interests from short quiz answers and map to roles',
  async run({ answers }) {
    const a = Array.isArray(answers) ? answers : [];
    const prompt = `Given these interest clues, infer Holland codes and suggest 3 roles:\n${JSON.stringify(a).slice(0, 1000)}`;
    const res = await generateResponse(prompt);
    return res.demo ? 'Demo: RIASEC = I, A; Roles: Data Analyst, UX, Product.' : res.data;
  }
};


