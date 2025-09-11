export const jobTargeterTool = {
  name: 'job_targeter',
  description: 'Hit jobs matcher route to propose target roles',
  async run({ profileSummary, token }) {
    try {
      const res = await fetch('http://localhost:' + (process.env.PORT || 5000) + '/api/jobs/match', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) },
        body: JSON.stringify({ profileSummary: profileSummary || 'Generalist software engineer' })
      });
      const json = await res.json();
      if (json && json.matches) return JSON.stringify(json.matches).slice(0, 2000);
      return 'No matches available';
    } catch (e) {
      return 'Job targeter unavailable';
    }
  }
};


