import React, { useMemo, useState } from 'react';
import { useAuth } from '../../context/AuthContext';

interface Question {
  id: string;
  text: string;
  dimension: 'analytical' | 'creative' | 'social' | 'practical';
}

const QUESTIONS: Question[] = [
  { id: 'q1', text: 'I enjoy solving puzzles and logical problems.', dimension: 'analytical' },
  { id: 'q2', text: 'I like designing visuals, stories, or music.', dimension: 'creative' },
  { id: 'q3', text: 'I feel energized working with and helping people.', dimension: 'social' },
  { id: 'q4', text: 'I prefer hands-on tasks, fixing or building things.', dimension: 'practical' },
  { id: 'q5', text: 'Math or data analysis excites me.', dimension: 'analytical' },
  { id: 'q6', text: 'I often sketch, write, or create content.', dimension: 'creative' },
  { id: 'q7', text: 'I enjoy mentoring, teaching, or counseling.', dimension: 'social' },
  { id: 'q8', text: 'I like tinkering with hardware, tools, or machinery.', dimension: 'practical' },
];

const SCALE = [1, 2, 3, 4, 5];

const AptitudeQuiz: React.FC = () => {
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [isCompleted, setIsCompleted] = useState(false);
  const [badgeEarned, setBadgeEarned] = useState(false);
  const { token } = useAuth();

  const scores = useMemo(() => {
    const s: Record<Question['dimension'], number> = {
      analytical: 0,
      creative: 0,
      social: 0,
      practical: 0,
    };
    QUESTIONS.forEach((q) => {
      const val = answers[q.id] || 0;
      s[q.dimension] += val;
    });
    return s;
  }, [answers]);

  const suggestedStreams = useMemo(() => {
    const entries = Object.entries(scores).sort((a, b) => b[1] - a[1]);
    const top = entries.slice(0, 2).map(([k]) => k);
    const mapping: Record<string, string[]> = {
      analytical: ['Science (PCM/PCB)', 'Commerce (Accounts/Maths)'],
      creative: ['Arts (Design/Media)', 'B.Des / Fine Arts'],
      social: ['Arts (Psychology/Sociology)', 'BBA / Education'],
      practical: ['Vocational/Polytechnic', 'B.Sc. (Applied)'],
    };
    const result = new Set<string>();
    top.forEach((t) => mapping[t].forEach((m) => result.add(m)));
    return Array.from(result);
  }, [scores]);

  const isQuizComplete = useMemo(() => {
    return QUESTIONS.every(q => answers[q.id] !== undefined);
  }, [answers]);

  const handleCompleteQuiz = async () => {
    if (!isQuizComplete || !token) return;
    
    try {
      // Mark task as completed
      await fetch('/api/profile/complete-task', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          taskId: 'aptitude-quiz',
          taskName: 'Complete Aptitude & Interest Quiz'
        })
      });

      // Award badge
      await fetch('/api/profile/award-badge', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          badgeId: 'aptitude-master',
          badgeName: 'Aptitude Master',
          description: 'Completed the aptitude and interest assessment quiz',
          category: 'aptitude'
        })
      });

      setIsCompleted(true);
      setBadgeEarned(true);
    } catch (error) {
      console.error('Failed to complete quiz:', error);
    }
  };

  return (
    <div className="p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">Aptitude & Interest Quiz</h1>
        <p className="text-gray-600 dark:text-gray-300 mb-6">Rate each statement from 1 (Strongly Disagree) to 5 (Strongly Agree).</p>
        
        {badgeEarned && (
          <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
                <span className="text-green-600 dark:text-green-400 text-lg">🏆</span>
              </div>
              <div>
                <p className="font-medium text-green-800 dark:text-green-200">Congratulations!</p>
                <p className="text-sm text-green-700 dark:text-green-300">You've earned the "Aptitude Master" badge!</p>
              </div>
            </div>
          </div>
        )}

        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-4">
            {QUESTIONS.map((q) => (
              <div key={q.id} className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4">
                <p className="text-gray-800 dark:text-gray-100 mb-3">{q.text}</p>
                <div className="flex items-center gap-2">
                  {SCALE.map((n) => (
                    <button
                      key={n}
                      onClick={() => setAnswers((prev) => ({ ...prev, [q.id]: n }))}
                      className={`w-8 h-8 rounded-md text-sm font-medium border transition ${
                        answers[q.id] === n
                          ? 'bg-blue-600 text-white border-blue-600'
                          : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600'
                      }`}
                      type="button"
                    >
                      {n}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div>
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5 mb-4">
              <h2 className="font-semibold text-gray-900 dark:text-gray-100 mb-3">Your Profile</h2>
              <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
                <li>Analytical: <span className="font-medium">{scores.analytical}</span></li>
                <li>Creative: <span className="font-medium">{scores.creative}</span></li>
                <li>Social: <span className="font-medium">{scores.social}</span></li>
                <li>Practical: <span className="font-medium">{scores.practical}</span></li>
              </ul>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5">
              <h2 className="font-semibold text-gray-900 dark:text-gray-100 mb-3">Suggested Streams</h2>
              {suggestedStreams.length === 0 ? (
                <p className="text-sm text-gray-600 dark:text-gray-300">Answer questions to see suggestions.</p>
              ) : (
                <ul className="list-disc list-inside text-gray-800 dark:text-gray-100 space-y-1">
                  {suggestedStreams.map((s) => (
                    <li key={s}>{s}</li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
        
        {isQuizComplete && !isCompleted && (
          <div className="mt-8 text-center">
            <button
              onClick={handleCompleteQuiz}
              className="px-6 py-3 bg-gradient-to-r from-green-600 to-blue-600 text-white rounded-lg hover:from-green-700 hover:to-blue-700 transition-colors font-medium"
            >
              Complete Quiz & Earn Badge
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AptitudeQuiz;


