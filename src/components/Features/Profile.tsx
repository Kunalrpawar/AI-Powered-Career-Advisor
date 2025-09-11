import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';

const Profile: React.FC = () => {
  const { user } = useAuth();
  const [age, setAge] = useState<string>('');
  const [gender, setGender] = useState<string>('');
  const [classStd, setClassStd] = useState<string>('12');
  const [interests, setInterests] = useState<string>('');

  return (
    <div className="p-6">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Your Profile</h1>
        <p className="text-gray-600 mb-6">Customize your preferences to get better recommendations.</p>

        <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
            <input value={user?.name || ''} readOnly className="w-full border border-gray-200 rounded-lg px-3 py-2 bg-gray-50 text-gray-700" />
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Age</label>
              <input value={age} onChange={(e) => setAge(e.target.value)} className="w-full border border-gray-200 rounded-lg px-3 py-2" placeholder="18" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
              <select value={gender} onChange={(e) => setGender(e.target.value)} className="w-full border border-gray-200 rounded-lg px-3 py-2">
                <option value="">Select</option>
                <option value="female">Female</option>
                <option value="male">Male</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Class</label>
              <select value={classStd} onChange={(e) => setClassStd(e.target.value)} className="w-full border border-gray-200 rounded-lg px-3 py-2">
                <option value="10">Class 10</option>
                <option value="11">Class 11</option>
                <option value="12">Class 12</option>
                <option value="grad">Undergraduate</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Academic Interests</label>
              <input value={interests} onChange={(e) => setInterests(e.target.value)} className="w-full border border-gray-200 rounded-lg px-3 py-2" placeholder="Math, Biology, Arts..." />
            </div>
          </div>

          <div className="flex justify-end">
            <button className="px-4 py-2 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 text-white">Save (stub)</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;


