import React, { useMemo, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Video, Calendar, Clock, Users, User, Phone, Mail, CheckCircle, Star, Award, VideoIcon } from 'lucide-react';
import WebRTCMeeting from './WebRTCMeeting';

type Student = { id: string; name: string; email: string };
type Mentor = { id: string; name: string; expertise: string; rating: number; experience: string; };
type Note = { id: string; studentId: string; text: string; createdAt: string };
type Meeting = {
  id: string;
  studentId: string;
  mentorId: string;
  type: 'student' | 'parent';
  date: string;
  time: string;
  duration: number;
  status: 'scheduled' | 'completed' | 'cancelled';
  zoomLink?: string;
  purpose: string;
};

const mockStudents: Student[] = [
  { id: 's1', name: 'Aarav Gupta', email: 'aarav@example.com' },
  { id: 's2', name: 'Priya Sharma', email: 'priya@example.com' },
];

const mockMentors: Mentor[] = [
  { id: 'm1', name: 'Counselor Ananya', expertise: 'Career Guidance & Psychology', rating: 4.9, experience: '8+ years' },
  { id: 'm2', name: 'Mentor Rohit', expertise: 'Engineering & Technology', rating: 4.8, experience: '5+ years' },
  { id: 'm3', name: 'Dr. Priya Singh', expertise: 'Medical & Life Sciences', rating: 4.9, experience: '12+ years' },
  { id: 'm4', name: 'Prof. Vikram Shah', expertise: 'Business & Management', rating: 4.7, experience: '10+ years' },
];

const initialNotes: Note[] = [];

const MentorPortal: React.FC = () => {
  const { user } = useAuth();
  const [assignments, setAssignments] = useState<Record<string, string>>({}); // studentId -> mentorId
  const [notes, setNotes] = useState<Note[]>(initialNotes);
  const [selectedStudentId, setSelectedStudentId] = useState<string>('s1');
  const [newNote, setNewNote] = useState('');
  const [parentConsent, setParentConsent] = useState<Record<string, boolean>>({});
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [meetingForm, setMeetingForm] = useState({
    type: 'student' as 'student' | 'parent',
    date: '',
    time: '',
    duration: 30,
    purpose: ''
  });
  const [isWebRTCMeetingOpen, setIsWebRTCMeetingOpen] = useState(false);
  const [activeMeetingId, setActiveMeetingId] = useState<string>('');

  const selectedStudent = useMemo(() => mockStudents.find((s) => s.id === selectedStudentId), [selectedStudentId]);
  const studentNotes = useMemo(() => notes.filter((n) => n.studentId === selectedStudentId), [notes, selectedStudentId]);
  const assignedMentor = useMemo(() => {
    const mentorId = assignments[selectedStudentId];
    return mentorId ? mockMentors.find(m => m.id === mentorId) : null;
  }, [assignments, selectedStudentId]);
  const studentMeetings = useMemo(() => meetings.filter(m => m.studentId === selectedStudentId), [meetings, selectedStudentId]);

  const scheduleMeeting = () => {
    if (!meetingForm.date || !meetingForm.time || !meetingForm.purpose || !assignments[selectedStudentId]) {
      alert('Please fill all fields and assign a mentor first.');
      return;
    }
    
    const newMeeting: Meeting = {
      id: Math.random().toString(36).slice(2),
      studentId: selectedStudentId,
      mentorId: assignments[selectedStudentId],
      type: meetingForm.type,
      date: meetingForm.date,
      time: meetingForm.time,
      duration: meetingForm.duration,
      status: 'scheduled',
      zoomLink: `https://zoom.us/j/${Math.random().toString().slice(2, 12)}`,
      purpose: meetingForm.purpose
    };
    
    setMeetings(prev => [...prev, newMeeting]);
    setShowScheduleModal(false);
    setMeetingForm({ type: 'student', date: '', time: '', duration: 30, purpose: '' });
  };

  const addNote = () => {
    if (!newNote.trim()) return;
    setNotes((n) => [
      ...n,
      { id: Math.random().toString(36).slice(2), studentId: selectedStudentId, text: newNote.trim(), createdAt: new Date().toISOString() },
    ]);
    setNewNote('');
  };

  const startWebRTCMeeting = () => {
    const meetingId = `meeting-${Date.now()}-${Math.random().toString(36).slice(2)}`;
    setActiveMeetingId(meetingId);
    setIsWebRTCMeetingOpen(true);
  };

  return (
    <div className="p-6 bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-2">🎓 Mentor & Counselor Portal</h1>
          <p className="text-gray-600 dark:text-gray-400 text-lg">Connect students with expert mentors and schedule meaningful guidance sessions</p>
        </div>

        <div className="grid lg:grid-cols-4 gap-6">
          {/* Left Sidebar - Students & Mentor Assignment */}
          <div className="lg:col-span-1 space-y-6">
            {/* Students List */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
              <h2 className="font-bold text-gray-900 dark:text-gray-100 mb-4 flex items-center">
                <Users className="w-5 h-5 mr-2 text-blue-600" />
                Students
              </h2>
              <div className="space-y-3">
                {mockStudents.map((s) => (
                  <button
                    key={s.id}
                    onClick={() => setSelectedStudentId(s.id)}
                    className={`w-full text-left p-4 rounded-xl border-2 transition-all duration-300 hover:shadow-md ${
                      selectedStudentId === s.id 
                        ? 'bg-gradient-to-r from-blue-500 to-purple-600 border-transparent text-white shadow-lg transform scale-105' 
                        : 'bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600 text-gray-800 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600'
                    }`}
                  >
                    <div className="font-semibold">{s.name}</div>
                    <div className={`text-sm ${selectedStudentId === s.id ? 'text-blue-100' : 'text-gray-500 dark:text-gray-400'}`}>
                      {s.email}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Mentor Assignment */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
              <h2 className="font-bold text-gray-900 dark:text-gray-100 mb-4 flex items-center">
                <Award className="w-5 h-5 mr-2 text-green-600" />
                Assign Mentor
              </h2>
              
              {assignedMentor && (
                <div className="mb-4 p-4 bg-green-50 dark:bg-green-900/20 rounded-xl border border-green-200 dark:border-green-700">
                  <div className="flex items-center mb-2">
                    <CheckCircle className="w-4 h-4 text-green-600 mr-2" />
                    <span className="text-sm font-medium text-green-800 dark:text-green-300">Currently Assigned</span>
                  </div>
                  <div className="font-semibold text-gray-900 dark:text-gray-100">{assignedMentor.name}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">{assignedMentor.expertise}</div>
                  <div className="flex items-center mt-1">
                    <Star className="w-4 h-4 text-yellow-500 mr-1" />
                    <span className="text-sm font-medium">{assignedMentor.rating}</span>
                    <span className="text-xs text-gray-500 dark:text-gray-400 ml-2">{assignedMentor.experience}</span>
                  </div>
                </div>
              )}
              
              <select
                value={assignments[selectedStudentId] || ''}
                onChange={(e) => setAssignments((a) => ({ ...a, [selectedStudentId]: e.target.value }))}
                className="w-full border-2 border-gray-200 dark:border-gray-600 rounded-xl px-4 py-3 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
              >
                <option value="">Select a mentor...</option>
                {mockMentors.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.name} - {m.expertise}
                  </option>
                ))}
              </select>
            </div>

            {/* Parent Consent */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
              <h2 className="font-bold text-gray-900 dark:text-gray-100 mb-4 flex items-center">
                <CheckCircle className="w-5 h-5 mr-2 text-purple-600" />
                Parent Consent
              </h2>
              <label className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 dark:bg-gray-700 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors">
                <input
                  type="checkbox"
                  checked={!!parentConsent[selectedStudentId]}
                  onChange={(e) => setParentConsent((p) => ({ ...p, [selectedStudentId]: e.target.checked }))}
                  className="w-5 h-5 text-purple-600 bg-gray-100 border-gray-300 rounded focus:ring-purple-500 focus:ring-2"
                />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Consent obtained from parent/guardian
                </span>
              </label>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="lg:col-span-3 space-y-6">
            {/* Meeting Scheduling Section */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
              <div className="bg-gradient-to-r from-purple-600 to-blue-600 p-6">
                <h2 className="text-2xl font-bold text-white mb-2 flex items-center">
                  <Video className="w-6 h-6 mr-3" />
                  Schedule Zoom Meeting
                </h2>
                <p className="text-purple-100">Book personalized guidance sessions for students and parents</p>
              </div>
              
              <div className="p-6">
                {/* Start WebRTC Meeting Button */}
                <div className="mb-6">
                  <button
                    onClick={startWebRTCMeeting}
                    disabled={!assignments[selectedStudentId]}
                    className="w-full p-6 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 disabled:from-gray-400 disabled:to-gray-500 text-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 disabled:hover:scale-100 disabled:cursor-not-allowed group"
                  >
                    <div className="flex items-center justify-center mb-4">
                      <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                        <Video className="w-10 h-10 animate-pulse" />
                      </div>
                    </div>
                    <h3 className="text-2xl font-bold mb-3 flex items-center justify-center">
                      🚀 Start Live Meeting
                    </h3>
                    <p className="text-red-100 text-base mb-4">
                      Launch instant WebRTC video call with {selectedStudent?.name || 'student'}
                    </p>
                    <div className="flex items-center justify-center space-x-4 text-red-100">
                      <div className="flex items-center">
                        <Video className="w-5 h-5 mr-2" />
                        <span className="text-sm font-medium">HD Video</span>
                      </div>
                      <div className="flex items-center">
                        <Phone className="w-5 h-5 mr-2" />
                        <span className="text-sm font-medium">Crystal Audio</span>
                      </div>
                      <div className="flex items-center">
                        <Users className="w-5 h-5 mr-2" />
                        <span className="text-sm font-medium">Screen Share</span>
                      </div>
                    </div>
                    {!assignments[selectedStudentId] && (
                      <div className="mt-3 text-gray-300 text-sm">
                        Please assign a mentor first
                      </div>
                    )}
                  </button>
                </div>
                
                <div className="grid md:grid-cols-2 gap-6 mb-6">
                  {/* Schedule for Student */}
                  <div className="group">
                    <button
                      onClick={() => {
                        setMeetingForm({ ...meetingForm, type: 'student' });
                        setShowScheduleModal(true);
                      }}
                      disabled={!assignments[selectedStudentId]}
                      className="w-full p-6 bg-gradient-to-br from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700 disabled:from-gray-400 disabled:to-gray-500 text-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 disabled:hover:scale-100 disabled:cursor-not-allowed"
                    >
                      <div className="flex items-center justify-center mb-4">
                        <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                          <User className="w-8 h-8" />
                        </div>
                      </div>
                      <h3 className="text-xl font-bold mb-2">Schedule Student Meeting</h3>
                      <p className="text-blue-100 text-sm">One-on-one career guidance session</p>
                      <div className="mt-4 flex items-center justify-center text-blue-100">
                        <Calendar className="w-4 h-4 mr-2" />
                        <span className="text-sm">30-60 minutes</span>
                      </div>
                    </button>
                  </div>
                  
                  {/* Schedule for Parent */}
                  <div className="group">
                    <button
                      onClick={() => {
                        setMeetingForm({ ...meetingForm, type: 'parent' });
                        setShowScheduleModal(true);
                      }}
                      disabled={!assignments[selectedStudentId] || !parentConsent[selectedStudentId]}
                      className="w-full p-6 bg-gradient-to-br from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 disabled:from-gray-400 disabled:to-gray-500 text-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 disabled:hover:scale-100 disabled:cursor-not-allowed"
                    >
                      <div className="flex items-center justify-center mb-4">
                        <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                          <Users className="w-8 h-8" />
                        </div>
                      </div>
                      <h3 className="text-xl font-bold mb-2">Schedule Parent Meeting</h3>
                      <p className="text-green-100 text-sm">Family discussion about career paths</p>
                      <div className="mt-4 flex items-center justify-center text-green-100">
                        <Calendar className="w-4 h-4 mr-2" />
                        <span className="text-sm">45-90 minutes</span>
                      </div>
                    </button>
                  </div>
                </div>
                
                {!assignments[selectedStudentId] && (
                  <div className="text-center p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-xl border border-yellow-200 dark:border-yellow-700">
                    <p className="text-yellow-800 dark:text-yellow-300 font-medium">Please assign a mentor first to schedule meetings</p>
                  </div>
                )}
              </div>
            </div>
            
            {/* Scheduled Meetings */}
            {studentMeetings.length > 0 && (
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
                <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4 flex items-center">
                  <Calendar className="w-5 h-5 mr-2 text-indigo-600" />
                  Scheduled Meetings
                </h3>
                <div className="space-y-4">
                  {studentMeetings.map((meeting) => {
                    const mentor = mockMentors.find(m => m.id === meeting.mentorId);
                    return (
                      <div key={meeting.id} className="p-4 border border-gray-200 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-700">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center">
                            <div className={`w-4 h-4 rounded-full mr-3 ${
                              meeting.status === 'scheduled' ? 'bg-green-500' :
                              meeting.status === 'completed' ? 'bg-blue-500' : 'bg-red-500'
                            }`}></div>
                            <h4 className="font-semibold text-gray-900 dark:text-gray-100">
                              {meeting.type === 'student' ? 'Student' : 'Parent'} Meeting
                            </h4>
                          </div>
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                            meeting.status === 'scheduled' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300' :
                            meeting.status === 'completed' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300' :
                            'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
                          }`}>
                            {meeting.status.charAt(0).toUpperCase() + meeting.status.slice(1)}
                          </span>
                        </div>
                        <div className="grid grid-cols-2 gap-4 text-sm text-gray-600 dark:text-gray-400">
                          <div>
                            <strong>Mentor:</strong> {mentor?.name}
                          </div>
                          <div>
                            <strong>Date:</strong> {new Date(meeting.date).toLocaleDateString()}
                          </div>
                          <div>
                            <strong>Time:</strong> {meeting.time}
                          </div>
                          <div>
                            <strong>Duration:</strong> {meeting.duration} minutes
                          </div>
                        </div>
                        <div className="mt-2">
                          <strong className="text-sm text-gray-600 dark:text-gray-400">Purpose:</strong>
                          <p className="text-sm text-gray-800 dark:text-gray-200">{meeting.purpose}</p>
                        </div>
                        {meeting.zoomLink && meeting.status === 'scheduled' && (
                          <div className="mt-3 flex space-x-3">
                            <a
                              href={meeting.zoomLink}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
                            >
                              <Video className="w-4 h-4 mr-2" />
                              Join Zoom Meeting
                            </a>
                            <button
                              onClick={() => {
                                setActiveMeetingId(meeting.id);
                                setIsWebRTCMeetingOpen(true);
                              }}
                              className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white rounded-lg font-medium transition-all transform hover:scale-105 shadow-lg"
                            >
                              <Video className="w-4 h-4 mr-2" />
                              Start WebRTC Call
                            </button>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
            {/* Session Notes */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4 flex items-center">
                <Mail className="w-5 h-5 mr-2 text-orange-600" />
                Session Notes {selectedStudent ? `— ${selectedStudent.name}` : ''}
              </h2>
              <div className="space-y-3 max-h-64 overflow-auto pr-1 mb-4">
                {studentNotes.length === 0 && (
                  <div className="text-center py-8">
                    <p className="text-gray-500 dark:text-gray-400">No session notes yet.</p>
                    <p className="text-sm text-gray-400 dark:text-gray-500">Add notes after counseling sessions</p>
                  </div>
                )}
                {studentNotes.map((n) => (
                  <div key={n.id} className="border border-gray-200 dark:border-gray-600 rounded-xl p-4 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-600">
                    <div className="text-xs text-gray-500 dark:text-gray-400 mb-2 flex items-center">
                      <Clock className="w-3 h-3 mr-1" />
                      {new Date(n.createdAt).toLocaleString()}
                    </div>
                    <div className="text-sm text-gray-800 dark:text-gray-200">{n.text}</div>
                  </div>
                ))}
              </div>
              <div className="flex gap-3">
                <input
                  value={newNote}
                  onChange={(e) => setNewNote(e.target.value)}
                  placeholder="Add session notes..."
                  className="flex-1 border-2 border-gray-200 dark:border-gray-600 rounded-xl px-4 py-3 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                />
                <button 
                  onClick={addNote} 
                  className="px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
                >
                  Add Note
                </button>
              </div>
            </div>

            {/* Recommended Actions */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4 flex items-center">
                <CheckCircle className="w-5 h-5 mr-2 text-green-600" />
                Recommended Actions
              </h2>
              <div className="grid md:grid-cols-2 gap-3">
                {[
                  { icon: '📝', text: 'Complete Aptitude & Interest Quiz', color: 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-700 text-blue-800 dark:text-blue-300' },
                  { icon: '🗺️', text: 'Review Course → Career Mapping', color: 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-700 text-green-800 dark:text-green-300' },
                  { icon: '🏫', text: 'Shortlist 3 nearby colleges', color: 'bg-purple-50 dark:bg-purple-900/20 border-purple-200 dark:border-purple-700 text-purple-800 dark:text-purple-300' },
                  { icon: '📄', text: 'Prepare application documents', color: 'bg-orange-50 dark:bg-orange-900/20 border-orange-200 dark:border-orange-700 text-orange-800 dark:text-orange-300' }
                ].map((action, index) => (
                  <div key={index} className={`p-4 rounded-xl border-2 ${action.color} transition-all hover:shadow-md`}>
                    <div className="flex items-center">
                      <span className="text-2xl mr-3">{action.icon}</span>
                      <span className="font-medium">{action.text}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        
        {/* Meeting Scheduling Modal */}
        {showScheduleModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full">
              <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                  Schedule {meetingForm.type === 'student' ? 'Student' : 'Parent'} Meeting
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mt-1">
                  Book a Zoom session with {assignedMentor?.name}
                </p>
              </div>
              
              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Date</label>
                  <input
                    type="date"
                    value={meetingForm.date}
                    onChange={(e) => setMeetingForm({...meetingForm, date: e.target.value})}
                    className="w-full border-2 border-gray-200 dark:border-gray-600 rounded-xl px-4 py-3 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Time</label>
                  <input
                    type="time"
                    value={meetingForm.time}
                    onChange={(e) => setMeetingForm({...meetingForm, time: e.target.value})}
                    className="w-full border-2 border-gray-200 dark:border-gray-600 rounded-xl px-4 py-3 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Duration (minutes)</label>
                  <select
                    value={meetingForm.duration}
                    onChange={(e) => setMeetingForm({...meetingForm, duration: parseInt(e.target.value)})}
                    className="w-full border-2 border-gray-200 dark:border-gray-600 rounded-xl px-4 py-3 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                  >
                    <option value={30}>30 minutes</option>
                    <option value={45}>45 minutes</option>
                    <option value={60}>60 minutes</option>
                    <option value={90}>90 minutes</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Meeting Purpose</label>
                  <textarea
                    value={meetingForm.purpose}
                    onChange={(e) => setMeetingForm({...meetingForm, purpose: e.target.value})}
                    placeholder="Describe the purpose of this meeting..."
                    rows={3}
                    className="w-full border-2 border-gray-200 dark:border-gray-600 rounded-xl px-4 py-3 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all resize-none"
                  />
                </div>
              </div>
              
              <div className="p-6 border-t border-gray-200 dark:border-gray-700 flex gap-3">
                <button
                  onClick={() => setShowScheduleModal(false)}
                  className="flex-1 px-4 py-3 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-all font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={scheduleMeeting}
                  className="flex-1 px-4 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-xl transition-all font-medium shadow-lg hover:shadow-xl"
                >
                  Schedule Meeting
                </button>
              </div>
            </div>
          </div>
        )}
        
        {/* WebRTC Meeting Component */}
        <WebRTCMeeting
          isOpen={isWebRTCMeetingOpen}
          onClose={() => setIsWebRTCMeetingOpen(false)}
          meetingId={activeMeetingId}
          userName={user?.name || 'Mentor'}
          isHost={true}
        />
      </div>
    </div>
  );
};

export default MentorPortal;


