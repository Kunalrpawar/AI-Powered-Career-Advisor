import React, { useMemo, useState } from 'react';

type TimelineItem = {
  id: string;
  title: string;
  date: string; // ISO
  type: 'admission' | 'scholarship' | 'exam' | 'counseling';
};

const initialItems: TimelineItem[] = [
  { id: 't1', title: 'State University B.Sc. Admissions Open', date: '2025-06-01', type: 'admission' },
  { id: 't2', title: 'National Scholarship Portal Deadline', date: '2025-07-15', type: 'scholarship' },
  { id: 't3', title: 'BBA Entrance Test', date: '2025-05-20', type: 'exam' },
  { id: 't4', title: 'Centralized Counseling Round 1', date: '2025-08-05', type: 'counseling' },
];

const typeColor: Record<TimelineItem['type'], string> = {
  admission: 'bg-blue-100 text-blue-700 border-blue-200',
  scholarship: 'bg-emerald-100 text-emerald-700 border-emerald-200',
  exam: 'bg-amber-100 text-amber-800 border-amber-200',
  counseling: 'bg-purple-100 text-purple-700 border-purple-200',
};

const TimelineTracker: React.FC = () => {
  const [items] = useState<TimelineItem[]>(initialItems);
  const [filter, setFilter] = useState<'all' | TimelineItem['type']>('all');

  const upcoming = useMemo(() => {
    const now = new Date();
    return items
      .filter((i) => (filter === 'all' ? true : i.type === filter))
      .filter((i) => new Date(i.date) >= now)
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }, [items, filter]);

  return (
    <div className="p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Timeline Tracker</h1>
        <p className="text-gray-600 mb-4">Stay on top of admissions, scholarships, exams, and counseling.</p>

        <div className="flex items-center gap-2 mb-6">
          {(['all', 'admission', 'scholarship', 'exam', 'counseling'] as const).map((t) => (
            <button
              key={t}
              onClick={() => setFilter(t)}
              className={`px-3 py-1.5 rounded-lg border text-sm ${
                filter === t ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'
              }`}
            >
              {t[0].toUpperCase() + t.slice(1)}
            </button>
          ))}
        </div>

        <div className="space-y-4">
          {upcoming.map((i) => (
            <div key={i.id} className="bg-white rounded-xl border border-gray-200 p-5 flex items-center justify-between">
              <div>
                <p className="text-gray-900 font-medium">{i.title}</p>
                <p className="text-sm text-gray-600">{new Date(i.date).toLocaleDateString()}</p>
              </div>
              <span className={`text-xs px-2 py-1 rounded-full border ${typeColor[i.type]}`}>{i.type}</span>
            </div>
          ))}
          {upcoming.length === 0 && (
            <p className="text-sm text-gray-600">No items match your filters.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default TimelineTracker;


