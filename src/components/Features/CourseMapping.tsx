import React from 'react';

const data = [
  {
    degree: 'B.Sc.',
    paths: ['Data Analyst', 'Lab Technician', 'Research Assistant', 'Higher Studies (M.Sc., GATE/NET)'],
  },
  {
    degree: 'B.Com.',
    paths: ['Accountant', 'Banking Exams', 'CA/CS/CMA', 'MBA'],
  },
  {
    degree: 'B.A.',
    paths: ['UPSC/State PCS', 'Teacher (B.Ed.)', 'Content/Media', 'NGO/Social Work'],
  },
  {
    degree: 'BBA',
    paths: ['Management Trainee', 'Marketing/Sales', 'Entrepreneurship', 'MBA'],
  },
];

const CourseMapping: React.FC = () => {
  return (
    <div className="p-6">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Course → Career Path Mapping</h1>
        <p className="text-gray-600 mb-6">Explore what common undergraduate degrees can lead to.</p>
        <div className="grid md:grid-cols-2 gap-6">
          {data.map((d) => (
            <div key={d.degree} className="bg-white rounded-xl border border-gray-200 p-5">
              <h2 className="font-semibold text-gray-900 mb-3">{d.degree}</h2>
              <ul className="list-disc list-inside text-gray-800 space-y-1">
                {d.paths.map((p) => (
                  <li key={p}>{p}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CourseMapping;


