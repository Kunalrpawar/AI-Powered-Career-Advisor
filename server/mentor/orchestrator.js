import { roadmapTool } from './tools/roadmap.js';
import { resourcesTool } from './tools/resources.js';
import { resumeGraderTool } from './tools/resumeGrader.js';
import { interestProfilerTool } from './tools/interestProfiler.js';
import { jobTargeterTool } from './tools/jobTargeter.js';
import { routeTools } from './routerLLM.js';

const tools = [roadmapTool, resourcesTool, resumeGraderTool, interestProfilerTool, jobTargeterTool];

export async function runMentorOrchestrator(input) {
  const { message, profile, history } = input;
  const chosen = await routeTools({ message, profile, history });

  const results = [];
  for (const name of chosen) {
    const tool = tools.find((t) => t.name === name);
    if (!tool) continue;
    try {
      const out = await tool.run(input);
      if (out) results.push({ name, output: out });
    } catch (e) {
      // swallow tool errors, continue
    }
  }

  const summary = results
    .map((r, i) => `Tool[${i + 1}] ${r.name}:\n${r.output}`)
    .join('\n\n');

  return {
    usedTools: chosen,
    toolOutput: summary
  };
}


