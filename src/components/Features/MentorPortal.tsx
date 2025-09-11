import React, { useMemo, useState } from 'react';
import { useAuth } from '../../context/AuthContext';

type Student = { id: string; name: string; email: string };
type Mentor = { id: string; name: string };
type Note = { id: string; studentId: string; text: string; createdAt: string };

const mockStudents: Student[] = [
  { id: 's1', name: 'Aarav Gupta', email: 'aarav@example.com' },
  { id: 's2', name: 'Priya Sharma', email: 'priya@example.com' },
];

const mockMentors: Mentor[] = [
  { id: 'm1', name: 'Counselor Ananya' },
  { id: 'm2', name: 'Mentor Rohit' },
];

const initialNotes: Note[] = [];

const MentorPortal: React.FC = () => {
  const { user } = useAuth();
  const [assignments, setAssignments] = useState<Record<string, string>>({}); // studentId -> mentorId
  const [notes, setNotes] = useState<Note[]>(initialNotes);
  const [selectedStudentId, setSelectedStudentId] = useState<string>('s1');
  const [newNote, setNewNote] = useState('');
  const [parentConsent, setParentConsent] = useState<Record<string, boolean>>({});

  const selectedStudent = useMemo(() => mockStudents.find((s) => s.id === selectedStudentId), [selectedStudentId]);
  const studentNotes = useMemo(() => notes.filter((n) => n.studentId === selectedStudentId), [notes, selectedStudentId]);

  const addNote = () => {
    if (!newNote.trim()) return;
    setNotes((n) => [
      ...n,
      { id: Math.random().toString(36).slice(2), studentId: selectedStudentId, text: newNote.trim(), createdAt: new Date().toISOString() },
    ]);
    setNewNote('');
  };

  return (
    <div className="p-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Mentor & Counselor Portal</h1>
        <p className="text-gray-600 mb-6">Assign mentors, log session notes, and track recommended actions. Parent consent is recorded per student.</p>

        <div className="grid md:grid-cols-3 gap-6">
          <div className="md:col-span-1 space-y-4">
            <div className="bg-white rounded-xl border border-gray-200 p-4">
              <h2 className="font-semibold text-gray-900 mb-3">Students</h2>
              <ul className="space-y-2">
                {mockStudents.map((s) => (
                  <li key={s.id}>
                    <button
                      onClick={() => setSelectedStudentId(s.id)}
                      className={`w-full text-left px-3 py-2 rounded-lg border ${
                        selectedStudentId === s.id ? 'bg-blue-50 border-blue-200 text-blue-700' : 'bg-white border-gray-200 text-gray-800 hover:bg-gray-50'
                      }`}
                    >
                      <div className="font-medium">{s.name}</div>
                      <div className="text-xs text-gray-500">{s.email}</div>
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 p-4">
              <h2 className="font-semibold text-gray-900 mb-3">Assign Mentor</h2>
              <select
                value={assignments[selectedStudentId] || ''}
                onChange={(e) => setAssignments((a) => ({ ...a, [selectedStudentId]: e.target.value }))}
                className="w-full border border-gray-200 rounded-lg px-3 py-2"
              >
                <option value="">Select mentor</option>
                {mockMentors.map((m) => (
                  <option key={m.id} value={m.id}>{m.name}</option>
                ))}
              </select>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 p-4">
              <h2 className="font-semibold text-gray-900 mb-3">Parent Consent</h2>
              <label className="flex items-center gap-2 text-sm text-gray-700">
                <input
                  type="checkbox"
                  checked={!!parentConsent[selectedStudentId]}
                  onChange={(e) => setParentConsent((p) => ({ ...p, [selectedStudentId]: e.target.checked }))}
                />
                Consent obtained from parent/guardian
              </label>
            </div>
          </div>

          <div className="md:col-span-2 space-y-4">
            <div className="bg-white rounded-xl border border-gray-200 p-4">
              <h2 className="font-semibold text-gray-900 mb-3">Session Notes {selectedStudent ? `— ${selectedStudent.name}` : ''}</h2>
              <div className="space-y-3 max-h-64 overflow-auto pr-1">
                {studentNotes.length === 0 && <p className="text-sm text-gray-600">No notes yet.</p>}
                {studentNotes.map((n) => (
                  <div key={n.id} className="border border-gray-200 rounded-lg p-3">
                    <div className="text-xs text-gray-500 mb-1">{new Date(n.createdAt).toLocaleString()}</div>
                    <div className="text-sm text-gray-800">{n.text}</div>
                  </div>
                ))}
              </div>
              <div className="mt-3 flex gap-2">
                <input
                  value={newNote}
                  onChange={(e) => setNewNote(e.target.value)}
                  placeholder="Add note..."
                  className="flex-1 border border-gray-200 rounded-lg px-3 py-2"
                />
                <button onClick={addNote} className="px-4 py-2 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 text-white">Add</button>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 p-4">
              <h2 className="font-semibold text-gray-900 mb-3">Recommended Actions</h2>
              <ul className="list-disc list-inside text-sm text-gray-800 space-y-1">
                <li>Attempt Aptitude & Interest Quiz</li>
                <li>Review Course → Career Mapping</li>
                <li>Shortlist 3 nearby colleges</li>
                <li>Upload documents to Application Tracker (coming soon)</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MentorPortal;


