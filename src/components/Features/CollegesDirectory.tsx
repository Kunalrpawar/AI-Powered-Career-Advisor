import React, { useEffect, useMemo, useState } from 'react';

type College = {
  id: string;
  name: string;
  city: string;
  state: string;
  lat?: number;
  lng?: number;
  degrees: string[];
  facilities: string[];
  hostel?: boolean;
  avgFeesPerYearINR?: number;
  safetyScore?: number; // 1-5
  photos?: string[];
};

const mockColleges: College[] = [
  { id: '1', name: 'Govt. Science College', city: 'Pune', state: 'MH', lat: 18.5204, lng: 73.8567, degrees: ['B.Sc.', 'B.Sc. (Comp)'], facilities: ['Hostel', 'Lab', 'Library'], hostel: true, avgFeesPerYearINR: 12000, safetyScore: 4.4, photos: [] },
  { id: '2', name: 'Govt. Arts & Commerce College', city: 'Nashik', state: 'MH', lat: 19.9975, lng: 73.7898, degrees: ['B.A.', 'B.Com.'], facilities: ['Library', 'Internet'], hostel: false, avgFeesPerYearINR: 9000, safetyScore: 4.1, photos: [] },
];

const CollegesDirectory: React.FC = () => {
  const [query, setQuery] = useState('');
  const [list, setList] = useState<College[]>(mockColleges);
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [onlyNearby, setOnlyNearby] = useState(true);
  const [radiusKm, setRadiusKm] = useState(20);
  const [locError, setLocError] = useState<string | null>(null);

  useEffect(() => {
    const q = query.trim().toLowerCase();
    if (!q) {
      setList(mockColleges);
      return;
    }
    setList(
      mockColleges.filter(
        (c) => c.name.toLowerCase().includes(q) || c.city.toLowerCase().includes(q) || c.state.toLowerCase().includes(q)
      )
    );
  }, [query]);

  const requestLocation = () => {
    setLocError(null);
    if (!('geolocation' in navigator)) {
      setLocError('Geolocation not supported in this browser.');
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => setCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
      (err) => setLocError(err?.message || 'Location permission denied'),
      { enableHighAccuracy: true, maximumAge: 60000, timeout: 10000 }
    );
  };

  useEffect(() => {
    async function fetchReal() {
      if (!coords) return;
      try {
        const resp = await fetch('/api/colleges/nearby', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ lat: coords.lat, lng: coords.lng, radiusKm })
        });
        if (!resp.ok) throw new Error('Failed to load colleges');
        const json = await resp.json();
        if (Array.isArray(json?.colleges) && json.colleges.length > 0) {
          setList(json.colleges);
        }
      } catch (e: any) {
        // keep mock list on failure, show soft message
        setLocError(e?.message || 'Could not load real colleges');
      }
    }
    fetchReal();
  }, [coords, radiusKm]);

  const withDistance = useMemo(() => {
    if (!coords) return list.map((c) => ({ college: c, distanceKm: null as number | null }));
    const toRad = (v: number) => (v * Math.PI) / 180;
    const haversine = (aLat: number, aLng: number, bLat: number, bLng: number) => {
      const R = 6371; // km
      const dLat = toRad(bLat - aLat);
      const dLng = toRad(bLng - aLng);
      const x = Math.sin(dLat / 2) ** 2 + Math.cos(toRad(aLat)) * Math.cos(toRad(bLat)) * Math.sin(dLng / 2) ** 2;
      const d = 2 * R * Math.asin(Math.sqrt(x));
      return d;
    };
    let items = list.map((c) => ({
      college: c,
      distanceKm: c.lat && c.lng ? Math.round(haversine(coords.lat, coords.lng, c.lat, c.lng) * 10) / 10 : null,
    }));
    if (onlyNearby) {
      items = items.filter((it) => it.distanceKm != null && it.distanceKm <= radiusKm);
    }
    return items.sort((a, b) => {
      if (a.distanceKm == null) return 1;
      if (b.distanceKm == null) return -1;
      return a.distanceKm - b.distanceKm;
    });
  }, [list, coords, onlyNearby, radiusKm]);

  return (
    <div className="p-6">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Nearby Government Colleges</h1>
        <p className="text-gray-600 mb-4">Search by name, city, or state. Allow location to filter nearby colleges.</p>
        <div className="mb-4 flex items-center gap-3">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search colleges..."
            className="w-full md:w-96 border border-gray-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none"
          />
          <button onClick={requestLocation} className="px-3 py-2 text-sm rounded-lg border border-gray-200 hover:bg-gray-50">{coords ? 'Refresh location' : 'Use my location'}</button>
        </div>
        {locError && <div className="mb-3 text-sm text-red-600">{locError}</div>}
        <div className="mb-6 flex items-center gap-4">
          <label className="flex items-center gap-2 text-sm text-gray-700">
            <input type="checkbox" checked={onlyNearby} onChange={(e) => setOnlyNearby(e.target.checked)} />
            Show only within
          </label>
          <div className="flex items-center gap-2 text-sm">
            <input type="range" min={5} max={50} step={5} value={radiusKm} onChange={(e) => setRadiusKm(Number(e.target.value))} />
            <span className="text-gray-700 font-medium">{radiusKm} km</span>
          </div>
          <span className="text-xs text-gray-500">{coords ? 'Location enabled' : 'Location off'}</span>
        </div>
        <div className="grid md:grid-cols-2 gap-6">
          {withDistance.length === 0 && (
            <div className="md:col-span-2 text-sm text-gray-600">{coords ? 'No colleges found within the selected radius.' : 'Enable location to see nearby colleges within 20km.'}</div>
          )}
          {withDistance.map(({ college: c, distanceKm }) => (
            <div key={c.id} className="bg-white rounded-xl border border-gray-200 p-5">
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="font-semibold text-gray-900">{c.name}</h2>
                  <p className="text-sm text-gray-600">{c.city}, {c.state}</p>
                </div>
                {distanceKm != null && (
                  <span className="text-xs px-2 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">{distanceKm} km</span>
                )}
              </div>
              <div className="mt-3 grid grid-cols-2 gap-3">
                <div>
                  <p className="text-xs text-gray-500">Avg fees / year</p>
                  <p className="text-sm font-medium text-gray-800">₹{c.avgFeesPerYearINR?.toLocaleString() ?? '—'}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Hostel</p>
                  <p className="text-sm font-medium text-gray-800">{c.hostel ? 'Available' : '—'}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Safety</p>
                  <p className="text-sm font-medium text-gray-800">{c.safetyScore ? `${c.safetyScore}/5` : '—'}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Transport</p>
                  <p className="text-sm font-medium text-gray-800">Bus/Local</p>
                </div>
              </div>
              <div className="mt-3">
                <p className="text-sm font-medium text-gray-800">Degrees:</p>
                <div className="flex flex-wrap gap-2 mt-1">
                  {c.degrees.map((d) => (
                    <span key={d} className="text-xs px-2 py-1 bg-blue-50 text-blue-700 rounded-full border border-blue-200">{d}</span>
                  ))}
                </div>
              </div>
              <div className="mt-3">
                <p className="text-sm font-medium text-gray-800">Facilities:</p>
                <div className="flex flex-wrap gap-2 mt-1">
                  {c.facilities.map((f) => (
                    <span key={f} className="text-xs px-2 py-1 bg-purple-50 text-purple-700 rounded-full border border-purple-200">{f}</span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CollegesDirectory;


