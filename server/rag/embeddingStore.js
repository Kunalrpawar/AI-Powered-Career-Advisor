import fs from 'fs';
import path from 'path';

// Minimal fetch-based OpenAI embeddings client to avoid extra deps
async function embedWithOpenAI(texts) {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) return null;
  const body = {
    input: texts,
    model: process.env.OPENAI_EMBED_MODEL || 'text-embedding-3-small'
  };
  const res = await fetch('https://api.openai.com/v1/embeddings', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    },
    body: JSON.stringify(body)
  });
  if (!res.ok) throw new Error(`OpenAI embeddings failed: ${res.status}`);
  const json = await res.json();
  return json.data.map((d) => d.embedding);
}

function cosineSimilarity(a, b) {
  const dot = a.reduce((sum, v, i) => sum + v * (b[i] || 0), 0);
  const magA = Math.sqrt(a.reduce((sum, v) => sum + v * v, 0));
  const magB = Math.sqrt(b.reduce((sum, v) => sum + v * v, 0));
  return magA && magB ? dot / (magA * magB) : 0;
}

async function upsertPinecone(vectors) {
  const apiKey = process.env.PINECONE_API_KEY;
  const index = process.env.PINECONE_INDEX;
  const host = process.env.PINECONE_HOST;
  if (!apiKey || !index || !host) return false;
  try {
    const url = `https://${host}/vectors/upsert`;
    const body = {
      vectors: vectors.map((v) => ({ id: v.id, values: v.values, metadata: v.metadata })),
      namespace: process.env.PINECONE_NAMESPACE || 'default'
    };
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Api-Key': apiKey },
      body: JSON.stringify(body)
    });
    return res.ok;
  } catch (_) {
    return false;
  }
}

async function queryPinecone(vector, topK = 4) {
  const apiKey = process.env.PINECONE_API_KEY;
  const host = process.env.PINECONE_HOST;
  if (!apiKey || !host) return null;
  try {
    const url = `https://${host}/query`;
    const body = {
      vector,
      topK,
      includeMetadata: true,
      namespace: process.env.PINECONE_NAMESPACE || 'default'
    };
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Api-Key': apiKey },
      body: JSON.stringify(body)
    });
    if (!res.ok) return null;
    const json = await res.json();
    return json.matches || null;
  } catch (_) {
    return null;
  }
}

export class InMemoryVectorStore {
  constructor() {
    this.docs = [];
    this.embeddings = [];
    this.dim = 0;
    this.persisted = false;
  }

  async initFromKnowledgeBase(loadDocsFn) {
    this.docs = loadDocsFn();
    const texts = this.docs.map((d) => `${d.title}\n${d.text}`);
    const openai = await embedWithOpenAI(texts);
    if (openai && openai.length === texts.length) {
      this.embeddings = openai;
      this.dim = openai[0]?.length || 0;
      // Try Pinecone upsert
      const vectors = openai.map((e, i) => ({ id: this.docs[i].id, values: e, metadata: { title: this.docs[i].title } }));
      this.persisted = await upsertPinecone(vectors);
      return;
    }
    // Fallback hashing
    const vocabulary = new Map();
    let next = 0;
    const tokenize = (t) => (t || '').toLowerCase().replace(/[^a-z0-9\s]/g, ' ').split(/\s+/).filter(Boolean);
    for (const t of texts) {
      for (const tok of tokenize(t)) {
        if (!vocabulary.has(tok)) vocabulary.set(tok, next++);
      }
    }
    const dim = Math.min(512, Math.max(64, vocabulary.size));
    const vec = (arr) => {
      const v = new Array(dim).fill(0);
      for (const tok of arr) {
        const idx = vocabulary.get(tok) % dim;
        v[idx] += 1;
      }
      return v.map((x) => x / arr.length);
    };
    this.embeddings = texts.map((t) => vec(tokenize(t)));
    this.dim = dim;
  }

  async retrieve(query, k = 4) {
    const qOpenAI = await embedWithOpenAI([query]);
    let qVec = qOpenAI ? qOpenAI[0] : null;
    if (qVec && this.persisted) {
      const matches = await queryPinecone(qVec, k);
      if (matches) {
        // Map back to docs by id
        const map = new Map(this.docs.map((d) => [d.id, d]));
        return matches
          .map((m) => ({ ...map.get(m.id), score: m.score }))
          .filter(Boolean);
      }
    }
    if (!qVec) {
      // fallback to hashing
      const text = `${query}`;
      const tokens = (text || '').toLowerCase().replace(/[^a-z0-9\s]/g, ' ').split(/\s+/).filter(Boolean);
      const dim = this.dim || 256;
      const v = new Array(dim).fill(0);
      for (const tok of tokens) {
        const idx = Math.abs(hashCode(tok)) % dim;
        v[idx] += 1;
      }
      qVec = v.map((x) => x / Math.max(1, tokens.length));
    }
    const scored = this.embeddings.map((e, i) => ({ i, score: cosineSimilarity(qVec, e) }));
    scored.sort((a, b) => b.score - a.score);
    return scored.slice(0, k).map(({ i, score }) => ({ ...this.docs[i], score }));
  }
}

function hashCode(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const chr = str.charCodeAt(i);
    hash = (hash << 5) - hash + chr;
    hash |= 0;
  }
  return hash;
}

export async function getVectorStore(loadDocsFn) {
  if (!global.__VECTOR_STORE__) {
    const store = new InMemoryVectorStore();
    await store.initFromKnowledgeBase(loadDocsFn);
    global.__VECTOR_STORE__ = store;
  }
  return global.__VECTOR_STORE__;
}


