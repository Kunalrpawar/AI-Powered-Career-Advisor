// Simple BM25 implementation over small in-memory corpora

function tokenize(text) {
  return (text || '')
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .split(/\s+/)
    .filter(Boolean);
}

export class BM25 {
  constructor(docs, k1 = 1.5, b = 0.75) {
    this.k1 = k1;
    this.b = b;
    this.docs = docs;
    this.N = docs.length;
    this.docTokens = docs.map((d) => tokenize(`${d.title} ${d.text}`));
    this.docLengths = this.docTokens.map((toks) => toks.length);
    this.avgdl = this.docLengths.reduce((a, b) => a + b, 0) / (this.N || 1);
    this.df = new Map();
    this.docTermFreqs = this.docTokens.map((toks) => {
      const tf = new Map();
      for (const t of toks) tf.set(t, (tf.get(t) || 0) + 1);
      for (const t of tf.keys()) this.df.set(t, (this.df.get(t) || 0) + 1);
      return tf;
    });
  }

  idf(term) {
    const df = this.df.get(term) || 0;
    // BM25+ smoothing
    return Math.log(1 + (this.N - df + 0.5) / (df + 0.5));
  }

  score(query) {
    const qTokens = tokenize(query);
    return this.docs.map((d, i) => {
      const tf = this.docTermFreqs[i];
      const dl = this.docLengths[i] || 1;
      let s = 0;
      for (const term of qTokens) {
        const f = tf.get(term) || 0;
        if (!f) continue;
        const idf = this.idf(term);
        const denom = f + this.k1 * (1 - this.b + this.b * (dl / (this.avgdl || 1)));
        s += idf * ((f * (this.k1 + 1)) / (denom || 1));
      }
      return { i, score: s };
    });
  }

  topK(query, k = 4) {
    const scored = this.score(query);
    scored.sort((a, b) => b.score - a.score);
    return scored.slice(0, k).map(({ i, score }) => ({ ...this.docs[i], score }));
  }
}


