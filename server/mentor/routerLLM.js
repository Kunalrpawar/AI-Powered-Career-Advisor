import { generateResponse } from '../config/gemini.js';

const SYSTEM = `You are a tool router for a career mentor. Decide which tools to call.
Return STRICT JSON with this schema:
{
  "tools": [
    { "name": "roadmap" | "resources" | "resume_grader" | "interest_profiler" | "job_targeter" }
  ]
}
Pick at most 2 tools relevant to the user's message.`;

export async function routeTools(input) {
  const { message, profile, history } = input;
  const prompt = `${SYSTEM}

User profile: ${profile || 'Unknown'}
History: ${history || 'None'}
Message: """
${message}
"""`;
  try {
    const resp = await generateResponse(prompt);
    const text = resp.demo ? '{"tools": []}' : resp.data;
    const jsonStart = text.indexOf('{');
    const jsonEnd = text.lastIndexOf('}');
    const slice = jsonStart >= 0 && jsonEnd >= 0 ? text.slice(jsonStart, jsonEnd + 1) : '{"tools": []}';
    const parsed = JSON.parse(slice);
    const tools = Array.isArray(parsed.tools) ? parsed.tools.map((t) => t.name).filter(Boolean) : [];
    return tools.slice(0, 2);
  } catch (_) {
    return [];
  }
}


