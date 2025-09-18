import React, { useEffect, useRef, useState } from 'react';
import { Mic, MicOff, MessageSquare, Zap } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTranslation } from 'react-i18next';
import { toHtmlFromMarkdownLite } from '../../utils/markdown';

const InterviewAssist: React.FC = () => {
  const { t } = useTranslation();
  const { token } = useAuth();
  const [recording, setRecording] = useState(false);
  const [role, setRole] = useState('Software Engineer');
  const [topic, setTopic] = useState('general');
  const [question, setQuestion] = useState<string>('');
  const [feedback, setFeedback] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const [transcript, setTranscript] = useState('');
  const recognitionRef = useRef<any>(null);
  const [previousQuestions, setPreviousQuestions] = useState<string[]>([]);

  useEffect(() => {
    // Feature detection for Web Speech API
    const w: any = window as any;
    const SpeechRecognition = w.SpeechRecognition || w.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recog = new SpeechRecognition();
      recog.lang = 'en-US';
      recog.interimResults = true;
      recog.continuous = true;
      recog.onresult = (e: any) => {
        let t = '';
        for (let i = e.resultIndex; i < e.results.length; i++) {
          t += e.results[i][0].transcript;
        }
        setTranscript(t);
      };
      recognitionRef.current = recog;
    }
  }, []);

  const startInterview = async () => {
    setError(null);
    setFeedback('');
    setTranscript('');
    try {
      const res = await fetch('/api/interview/start', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) },
        body: JSON.stringify({ role, topic }),
      });
      const data = await res.json();
      setQuestion(data.question || 'Tell me about yourself.');
      setPreviousQuestions([data.question || 'Tell me about yourself.']);
    } catch (e: any) {
      setError(e?.message || 'Failed to start');
    }
  };

  const toggleRecording = async () => {
    if (recording) {
      setRecording(false);
      try { recognitionRef.current && recognitionRef.current.stop(); } catch (_) {}
      const finalTranscript = transcript.trim();
      if (!finalTranscript) return;
      await submitAnswer(finalTranscript);
      setTranscript('');
      return;
    }
    setRecording(true);
    try {
      // Start speech recognition only (we don't need audio upload for now)
      recognitionRef.current && recognitionRef.current.start();
    } catch (e: any) {
      setError('Microphone permission denied or speech recognition unsupported');
      setRecording(false);
    }
  };

  const submitAnswer = async (t: string) => {
    setError(null);
    setFeedback('');
    try {
      const res = await fetch('/api/interview/answer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) },
        body: JSON.stringify({ transcript: t, previousQuestions }),
      });
      const data = await res.json();
      setFeedback(data.feedback || '');
      if (data.nextQuestion) {
        setQuestion(data.nextQuestion);
        setPreviousQuestions((prev) => [...prev, data.nextQuestion]);
      }
    } catch (e: any) {
      setError(e?.message || 'Failed to process answer');
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
            <MessageSquare className="w-5 h-5 text-indigo-600" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">{t('interview_assist.title')}</h2>
            <p className="text-gray-500 dark:text-gray-400">{t('interview_assist.subtitle')}</p>
          </div>
        </div>

        {error && <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-2 rounded">{error}</div>}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <input value={role} onChange={(e) => setRole(e.target.value)} className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100" placeholder="Role (e.g., Software Engineer)" />
          <input value={topic} onChange={(e) => setTopic(e.target.value)} className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100" placeholder="Topic (e.g., system design)" />
          <button onClick={startInterview} className="px-4 py-2 bg-indigo-600 text-white rounded">Start Interview</button>
        </div>

        <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded mb-4">
          <p className="text-sm text-gray-600 dark:text-gray-300 mb-1">Current Question</p>
          <p className="text-gray-800 dark:text-gray-100 font-medium">{question || 'Click Start Interview to get the first question.'}</p>
        </div>

        <div className="p-4 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded mb-4">
          <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">Your Answer (live transcript)</p>
          <div className="min-h-[80px] text-gray-800 dark:text-gray-100 whitespace-pre-wrap">{transcript}</div>
        </div>

        <div className="flex items-center space-x-3">
          <button onClick={toggleRecording} className={`px-4 py-2 rounded text-white ${recording ? 'bg-red-600' : 'bg-green-600'}`}>
            {recording ? <MicOff className="w-4 h-4 inline mr-2" /> : <Mic className="w-4 h-4 inline mr-2" />}
            {recording ? 'Stop & Submit' : 'Start Speaking'}
          </button>
        </div>
      </div>

      {feedback && (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
          <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-4">Feedback & Improvements</h3>
          <div className="text-gray-700 dark:text-gray-300 text-sm" dangerouslySetInnerHTML={{ __html: toHtmlFromMarkdownLite(feedback) }} />
        </div>
      )}
    </div>
  );
};

export default InterviewAssist;


