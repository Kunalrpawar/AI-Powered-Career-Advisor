import React, { useState } from 'react';
import { TrendingUp, Map } from 'lucide-react';
import SkillGapAnalyzer from './SkillGapAnalyzer';
import CareerExplorer from './CareerExplorer';

const SkillGapJobMatcher: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'skill-gap' | 'career-explorer'>('skill-gap');

  const tabs = [
    {
      id: 'skill-gap',
      label: 'Skill Gap Analysis',
      icon: TrendingUp,
      component: <SkillGapAnalyzer />
    },
    {
      id: 'career-explorer',
      label: 'Career Explorer',
      icon: Map,
      component: <CareerExplorer />
    }
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
            <TrendingUp className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">Skills & Career Tools</h2>
            <p className="text-gray-500 dark:text-gray-400">Analyze your skills and find matching job opportunities</p>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex space-x-1 bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as 'skill-gap' | 'career-explorer')}
                className={`flex-1 flex items-center justify-center space-x-2 px-4 py-3 rounded-md transition-all duration-200 ${
                  activeTab === tab.id
                    ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-gray-100 shadow-sm'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span className="font-medium">{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Active Tab Content */}
      <div className="min-h-[400px]">
        {tabs.find(tab => tab.id === activeTab)?.component}
      </div>
    </div>
  );
};

export default SkillGapJobMatcher;
