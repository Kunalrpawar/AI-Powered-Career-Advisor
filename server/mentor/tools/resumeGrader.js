import { generateResponse } from '../../config/gemini.js';

export const resumeGraderTool = {
  name: 'resume_grader',
  description: 'Grade resume summary and suggest improvements',
  async run({ resumeText }) {
    if (!resumeText) return 'No resume provided';
    const prompt = `Grade this resume summary and give actionable improvements (bullet points, quantified):\n"""\n${resumeText}\n"""`;
    const res = await generateResponse(prompt);
    return res.demo ? 'Demo: Add metrics, tailor keywords, clarify impact.' : res.data;
  }
};


