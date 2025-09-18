import React from 'react';

const Recommendations: React.FC = () => {
  return (
    <div className="p-6">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Your Recommendations</h1>
        <p className="text-gray-600 mb-6">AI-driven suggestions combining your quiz results and profile (stubbed).</p>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <h2 className="font-semibold text-gray-900 mb-2">Courses to apply</h2>
            <ul className="list-disc list-inside text-gray-800 space-y-1">
              <li>B.Sc. (Computer Science)</li>
              <li>BBA</li>
            </ul>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <h2 className="font-semibold text-gray-900 mb-2">Nearby colleges</h2>
            <ul className="list-disc list-inside text-gray-800 space-y-1">
              <li>Govt. Science College, Pune</li>
              <li>Govt. Arts & Commerce College, Nashik</li>
            </ul>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <h2 className="font-semibold text-gray-900 mb-2">Career paths</h2>
            <ul className="list-disc list-inside text-gray-800 space-y-1">
              <li>Data Analyst</li>
              <li>Management Trainee</li>
            </ul>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <h2 className="font-semibold text-gray-900 mb-2">Study materials</h2>
            <ul className="list-disc list-inside text-gray-800 space-y-1">
              <li>Open-source CS e-books</li>
              <li>Aptitude prep resources</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Recommendations;


