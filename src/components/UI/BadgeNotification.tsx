import React, { useState, useEffect } from 'react';
import { X, Trophy, Star } from 'lucide-react';

interface Badge {
  id: string;
  name: string;
  description: string;
  image: string;
  earnedAt: string;
}

interface BadgeNotificationProps {
  badge: Badge | null;
  isVisible: boolean;
  onClose: () => void;
}

const BadgeNotification: React.FC<BadgeNotificationProps> = ({ badge, isVisible, onClose }) => {
  const [showAnimation, setShowAnimation] = useState(false);

  useEffect(() => {
    if (isVisible && badge) {
      setShowAnimation(true);
      const timer = setTimeout(onClose, 5000);
      return () => clearTimeout(timer);
    }
  }, [isVisible, badge, onClose]);

  if (!isVisible || !badge) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className={`relative bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 max-w-md w-full mx-4 transform transition-all duration-500 ${showAnimation ? 'scale-100 opacity-100' : 'scale-95 opacity-0'}`}>
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
          <X className="w-5 h-5" />
        </button>

        <div className="text-center">
          <div className="mb-4 flex justify-center">
            <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center shadow-lg animate-bounce">
              <Trophy className="w-8 h-8 text-white" />
            </div>
          </div>

          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">🎉 Congratulations!</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">You've earned a new badge!</p>

          <div className="bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 rounded-xl p-6 mb-6">
            <img src={badge.image} alt={badge.name} className="w-20 h-20 mb-3 mx-auto animate-pulse" />
            <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">{badge.name}</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">{badge.description}</p>
          </div>

          <button onClick={onClose} className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold py-3 px-6 rounded-lg transition-all">
            Awesome! 🚀
          </button>
        </div>
      </div>
    </div>
  );
};

export default BadgeNotification;