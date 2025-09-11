export const resourcesTool = {
  name: 'resources',
  description: 'Suggest learning resources by topic',
  async run({ message }) {
    const lower = message.toLowerCase();
    if (/(frontend|react|web)/.test(lower)) {
      return `Web/Frontend resources:
- MDN Web Docs
- React Docs
- Frontend Mentor
- System Design Primer (basics)`;
    }
    if (/(data|analytics|sql|python)/.test(lower)) {
      return `Data resources:
- Practical SQL
- pandas docs
- Kaggle
- Power BI / Tableau tutorials`;
    }
    return `General career resources:
- Cracking the Coding Interview
- NeetCode roadmap
- Refactoring UI
- ByteByteGo (system design)`;
  }
};


