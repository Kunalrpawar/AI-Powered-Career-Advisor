import React, { useMemo, useState } from 'react';

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

  return (
    <div className="p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Aptitude & Interest Quiz</h1>
        <p className="text-gray-600 mb-6">Rate each statement from 1 (Strongly Disagree) to 5 (Strongly Agree).</p>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-4">
            {QUESTIONS.map((q) => (
              <div key={q.id} className="bg-white rounded-xl border border-gray-200 p-4">
                <p className="text-gray-800 mb-3">{q.text}</p>
                <div className="flex items-center gap-2">
                  {SCALE.map((n) => (
                    <button
                      key={n}
                      onClick={() => setAnswers((prev) => ({ ...prev, [q.id]: n }))}
                      className={`w-8 h-8 rounded-md text-sm font-medium border transition ${
                        answers[q.id] === n
                          ? 'bg-blue-600 text-white border-blue-600'
                          : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
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
            <div className="bg-white rounded-xl border border-gray-200 p-5 mb-4">
              <h2 className="font-semibold text-gray-900 mb-3">Your Profile</h2>
              <ul className="space-y-2 text-sm text-gray-700">
                <li>Analytical: <span className="font-medium">{scores.analytical}</span></li>
                <li>Creative: <span className="font-medium">{scores.creative}</span></li>
                <li>Social: <span className="font-medium">{scores.social}</span></li>
                <li>Practical: <span className="font-medium">{scores.practical}</span></li>
              </ul>
            </div>
            <div className="bg-white rounded-xl border border-gray-200 p-5">
              <h2 className="font-semibold text-gray-900 mb-3">Suggested Streams</h2>
              {suggestedStreams.length === 0 ? (
                <p className="text-sm text-gray-600">Answer questions to see suggestions.</p>
              ) : (
                <ul className="list-disc list-inside text-gray-800 space-y-1">
                  {suggestedStreams.map((s) => (
                    <li key={s}>{s}</li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AptitudeQuiz;


