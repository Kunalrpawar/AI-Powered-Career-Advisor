import React, { useState } from 'react';
import InterviewAssist from './InterviewAssist';
import AIMentorChat from './AIMentorChat';

const AIAssistance: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'interview' | 'mentor'>('interview');

  return (
    <div className="p-6 space-y-6">
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="border-b border-gray-100 px-6 pt-6">
          <h2 className="text-2xl font-bold text-gray-800">AI Assistance</h2>
          <p className="text-gray-500 mb-4">Choose between Interview Assist or AI Mentor</p>
          <div className="flex space-x-2">
            <button
              onClick={() => setActiveTab('interview')}
              className={`px-4 py-2 rounded-t-lg border-b-2 -mb-px ${
                activeTab === 'interview'
                  ? 'border-indigo-600 text-indigo-700'
                  : 'border-transparent text-gray-600 hover:text-gray-800'
              }`}
            >
              Interview Assist
            </button>
            <button
              onClick={() => setActiveTab('mentor')}
              className={`px-4 py-2 rounded-t-lg border-b-2 -mb-px ${
                activeTab === 'mentor'
                  ? 'border-indigo-600 text-indigo-700'
                  : 'border-transparent text-gray-600 hover:text-gray-800'
              }`}
            >
              AI Mentor
            </button>
          </div>
        </div>

        <div className="px-0">
          {activeTab === 'interview' ? (
            <InterviewAssist />
          ) : (
            <AIMentorChat />
          )}
        </div>
      </div>
    </div>
  );
};

export default AIAssistance;


