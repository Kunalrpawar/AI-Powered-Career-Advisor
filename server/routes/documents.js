import express from 'express';
import multer from 'multer';
import jwt from 'jsonwebtoken';
import Document from '../schema/Document.js';

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });
const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-change-me';

function requireAuth(req, res, next) {
  try {
    const auth = req.headers.authorization || '';
    const token = auth.startsWith('Bearer ') ? auth.slice(7) : null;
    if (!token) return res.status(401).json({ error: 'Unauthorized' });
    const payload = jwt.verify(token, JWT_SECRET);
    req.userId = payload.userId;
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
}

// Upload document (metadata only; buffer not persisted here)
router.post('/upload', requireAuth, upload.single('file'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
    const doc = await Document.create({
      userId: req.userId,
      filename: req.file.originalname,
      mimetype: req.file.mimetype,
      size: req.file.size,
    });
    res.json({ success: true, document: doc });
  } catch (err) {
    res.status(500).json({ error: 'Upload failed' });
  }
});

// List user documents
router.get('/', requireAuth, async (req, res) => {
  try {
    const docs = await Document.find({ userId: req.userId })
      .sort({ createdAt: -1 })
      .lean();
    res.json({ documents: docs });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch documents' });
  }
});

export default router;


