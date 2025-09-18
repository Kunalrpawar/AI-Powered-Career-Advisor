import fs from 'fs';
import path from 'path';

function cosineSimilarity(a, b) {
  const dot = a.reduce((sum, v, i) => sum + v * (b[i] || 0), 0);
  const magA = Math.sqrt(a.reduce((sum, v) => sum + v * v, 0));
  const magB = Math.sqrt(b.reduce((sum, v) => sum + v * v, 0));
  return magA && magB ? dot / (magA * magB) : 0;
}

function tokenize(text) {
  return (text || '')
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .split(/\s+/)
    .filter(Boolean);
}

function vectorize(text, vocabulary) {
  const tokens = tokenize(text);
  const vec = new Array(vocabulary.length).fill(0);
  for (const t of tokens) {
    const idx = vocabulary.indexOf(t);
    if (idx >= 0) vec[idx] += 1;
  }
  return vec;
}

export function loadKnowledgeBase() {
  const file = path.resolve(process.cwd(), 'server', 'rag', 'knowledge', 'career_counseling.json');
  const raw = fs.readFileSync(file, 'utf-8');
  const docs = JSON.parse(raw);
  return docs;
}

export function buildIndex(docs) {
  const vocabularySet = new Set();
  docs.forEach((d) => tokenize(`${d.title} ${d.text}`).forEach((t) => vocabularySet.add(t)));
  const vocabulary = Array.from(vocabularySet);
  const vectors = docs.map((d) => vectorize(`${d.title} ${d.text}`, vocabulary));
  return { vocabulary, vectors };
}

export function retrieveTopK(query, docs, index, k = 3) {
  const qVec = vectorize(query, index.vocabulary);
  const scored = index.vectors.map((vec, i) => ({ i, score: cosineSimilarity(qVec, vec) }));
  scored.sort((a, b) => b.score - a.score);
  return scored.slice(0, k).map(({ i, score }) => ({ ...docs[i], score }));
}


