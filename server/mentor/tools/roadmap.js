export const roadmapTool = {
  name: 'roadmap',
  description: 'Generate a 30-60-90 day roadmap tailored to user goal',
  async run({ message, profile }) {
    const who = profile || 'Student';
    const goal = /to (.+)$/i.exec(message)?.[1] || 'target role';
    return `30-60-90 for ${who} — ${goal}
Day 1-30: Foundations — clarify role scope, identify top 5 skills; study 2 hrs/day; build mini-project 1.
Day 31-60: Projects — 2 guided projects with metrics; weekly mock interviews; post learnings.
Day 61-90: Capstone + Applications — ship capstone with README, demo; tailor resume; 10–15 apps/week; 2 mocks/week.`;
  }
};


