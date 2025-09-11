import express from 'express';

const router = express.Router();

async function fetchNearbyColleges(lat, lng, radiusKm) {
  const radiusM = Math.max(1000, Math.min(50000, Math.floor(Number(radiusKm) * 1000)));
  const query = `
    [out:json][timeout:25];
    (
      node["amenity"="college"](around:${radiusM},${lat},${lng});
      node["amenity"="university"](around:${radiusM},${lat},${lng});
      way["amenity"="college"](around:${radiusM},${lat},${lng});
      way["amenity"="university"](around:${radiusM},${lat},${lng});
      relation["amenity"="college"](around:${radiusM},${lat},${lng});
      relation["amenity"="university"](around:${radiusM},${lat},${lng});
    );
    out center tags 100;
  `;
  const overpassUrl = 'https://overpass-api.de/api/interpreter';
  const resp = await fetch(overpassUrl, { method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, body: new URLSearchParams({ data: query }) });
  if (!resp.ok) {
    const text = await resp.text();
    throw new Error(`Overpass failed: ${text.slice(0, 500)}`);
  }
  const json = await resp.json();
  const elements = Array.isArray(json?.elements) ? json.elements : [];
  const toCityState = (tags = {}) => ({ city: tags['addr:city'] || tags['is_in:city'] || tags['addr:district'] || '—', state: tags['addr:state'] || tags['is_in:state'] || '—' });
  const isGov = (tags = {}) => {
    const v = (tags.operator || tags['operator:type'] || tags.ownership || '').toString().toLowerCase();
    return v.includes('government') || v.includes('public') || v.includes('govt') || v.includes('municipal');
  };
  const results = elements
    .map((el) => {
      const tags = el.tags || {};
      const center = el.center || el;
      const { city, state } = toCityState(tags);
      return {
        id: String(el.id),
        name: tags.name || tags['name:en'] || 'Unnamed College',
        city,
        state,
        lat: center.lat,
        lng: center.lon,
        degrees: [],
        facilities: [],
        hostel: undefined,
        avgFeesPerYearINR: undefined,
        safetyScore: undefined,
        govOwned: isGov(tags),
        rawTags: tags
      };
    })
    .sort((a, b) => Number(b.govOwned) - Number(a.govOwned))
    .slice(0, 50);
  return results;
}

// POST
router.post('/nearby', async (req, res) => {
  try {
    const { lat, lng, radiusKm = 20 } = req.body || {};
    if (typeof lat !== 'number' || typeof lng !== 'number') {
      return res.status(400).json({ error: 'lat and lng are required numbers' });
    }
    const results = await fetchNearbyColleges(lat, lng, radiusKm);
    return res.json({ success: true, colleges: results });
  } catch (e) {
    console.error('colleges/nearby POST error', e);
    res.status(500).json({ error: 'Failed to fetch nearby colleges' });
  }
});

// Also support GET for flexibility: /api/colleges/nearby?lat=..&lng=..&radiusKm=..
router.get('/nearby', async (req, res) => {
  try {
    const lat = Number(req.query.lat);
    const lng = Number(req.query.lng);
    const radiusKm = Number(req.query.radiusKm || 20);
    if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
      return res.status(400).json({ error: 'lat and lng query params are required' });
    }
    const results = await fetchNearbyColleges(lat, lng, radiusKm);
    return res.json({ success: true, colleges: results });
  } catch (e) {
    console.error('colleges/nearby GET error', e);
    res.status(500).json({ error: 'Failed to fetch nearby colleges' });
  }
});

export default router;


