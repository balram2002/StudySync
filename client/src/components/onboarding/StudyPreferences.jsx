// StudyPreferences.js
import React, { useState } from 'react';
import { useOnboarding } from '../../context/OnboardingContext';
import { useTheme } from '../../context/theme-context';

const timeSlots = Array.from({ length: 24 }, (_, i) => {
  const hour = i % 12 || 12;
  const period = i < 12 ? 'AM' : 'PM';
  return `${hour} ${period}`;
});

const StudyPreferences = () => {
  const { data, updateStudyPreferences } = useOnboarding();
  const { theme } = useTheme();
  const [newGoal, setNewGoal] = useState('');
  const { studyPreferences } = data;

  const toggleTimeSlot = (time, type) => {
    const currentSlots = type === 'weekday' ? studyPreferences.weekdayHours : studyPreferences.weekendHours;
    const newSlots = currentSlots.includes(time)
      ? currentSlots.filter(t => t !== time)
      : [...currentSlots, time];

    updateStudyPreferences({
      ...studyPreferences,
      [type === 'weekday' ? 'weekdayHours' : 'weekendHours']: newSlots
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    updateStudyPreferences({
      ...studyPreferences,
      [name]: parseInt(value) || 0
    });
  };

  const handleLearningStyleChange = (style) => {
    updateStudyPreferences({
      ...studyPreferences,
      learningStyle: style
    });
  };

  const addGoal = () => {
    if (newGoal.trim()) {
      updateStudyPreferences({
        ...studyPreferences,
        goals: [...studyPreferences.goals, newGoal.trim()]
      });
      setNewGoal('');
    }
  };

  return (
    <div>
      <h2 className={`text-2xl font-bold mb-2 ${theme === 'light' ? 'text-purple-900' : 'text-white'
        }`}>
        Study Preferences
      </h2>
      <p className={`mb-8 ${theme === 'light' ? 'text-purple-700' : 'text-gray-400'
        }`}>
        When and how do you like to study?
      </p>

      <div className="space-y-8">
        <div>
          <h3 className={`text-xl mb-4 ${theme === 'light' ? 'text-purple-800' : 'text-white'
            }`}>
            Preferred Study Times
          </h3>

          <div className="space-y-6">
            {['weekday', 'weekend'].map((type) => (
              <div key={type}>
                <h4 className={`mb-2 ${theme === 'light' ? 'text-purple-700' : 'text-white'
                  }`}>
                  {type === 'weekday' ? 'Weekday Hours' : 'Weekend Hours'}
                </h4>
                <div className="grid grid-cols-8 gap-2">
                  {timeSlots.map((time) => (
                    <button
                      key={time}
                      onClick={() => toggleTimeSlot(time, type)}
                      className={`p-2 rounded text-sm transition-colors ${studyPreferences[`${type}Hours`].includes(time)
                          ? theme === 'light'
                            ? 'bg-purple-600 text-white hover:bg-purple-700'
                            : 'bg-white text-black hover:bg-gray-100'
                          : theme === 'light'
                            ? 'bg-purple-100 text-purple-800 hover:bg-purple-200'
                            : 'bg-gray-800 text-white hover:bg-gray-700'
                        }`}
                    >
                      {time}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h3 className={`text-xl mb-4 ${theme === 'light' ? 'text-purple-800' : 'text-white'
            }`}>
            Study Session Preferences
          </h3>

          <div className="space-y-4">
            {[
              { id: 'sessionLength', label: 'Preferred Session Length (minutes)', placeholder: 'e.g., 45' },
              { id: 'maxDailyHours', label: 'Maximum Daily Study Hours', placeholder: 'e.g., 4' }
            ].map((field) => (
              <div key={field.id}>
                <label className={`block mb-2 ${theme === 'light' ? 'text-purple-700' : 'text-white'
                  }`}>
                  {field.label}
                </label>
                <input
                  type="number"
                  name={field.id}
                  value={studyPreferences[field.id]}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-2 rounded-lg border focus:outline-none ${theme === 'light'
                      ? 'bg-white border-purple-200 text-purple-900 focus:border-purple-500'
                      : 'bg-gray-800 border-gray-700 text-white focus:border-white'
                    }`}
                  placeholder={field.placeholder}
                />
              </div>
            ))}
          </div>
        </div>

        <div>
          <h3 className={`text-xl mb-4 ${theme === 'light' ? 'text-purple-800' : 'text-white'
            }`}>
            Learning Style
          </h3>
          <div className="space-y-3">
            {[
              'Visual - Learn best from images, diagrams, and videos',
              'Auditory - Learn best from lectures and discussions',
              'Reading/Writing - Learn best from reading and taking notes',
              'Kinesthetic - Learn best from hands-on activities'
            ].map((style) => (
              <label key={style} className="flex items-center space-x-3">
                <input
                  type="radio"
                  name="learning-style"
                  checked={studyPreferences.learningStyle === style}
                  onChange={() => handleLearningStyleChange(style)}
                  className={`form-radio ${theme === 'light' ? 'text-purple-600' : 'text-white'
                    }`}
                />
                <span className={theme === 'light' ? 'text-purple-800' : 'text-white'}>
                  {style}
                </span>
              </label>
            ))}
          </div>
        </div>

        <div>
          <h3 className={`text-xl mb-4 ${theme === 'light' ? 'text-purple-800' : 'text-white'
            }`}>
            Academic Goals
          </h3>
          <p className={`mb-4 ${theme === 'light' ? 'text-purple-700' : 'text-gray-400'
            }`}>
            What do you want to achieve with your studies? Add specific, measurable goals.
          </p>

          {studyPreferences.goals.length > 0 && (
            <div className="mb-4 space-y-2">
              {studyPreferences.goals.map((goal, index) => (
                <div key={index} className={`flex items-center justify-between p-2 rounded ${theme === 'light' ? 'bg-purple-100' : 'bg-gray-800'
                  }`}>
                  <span className={theme === 'light' ? 'text-purple-800' : 'text-white'}>
                    {goal}
                  </span>
                  <button
                    onClick={() => {
                      const newGoals = studyPreferences.goals.filter((_, i) => i !== index);
                      updateStudyPreferences({
                        ...studyPreferences,
                        goals: newGoals
                      });
                    }}
                    className={theme === 'light' ? 'text-purple-600 hover:text-purple-800' : 'text-gray-400 hover:text-white'}
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}

          <div className="flex space-x-4">
            <input
              type="text"
              value={newGoal}
              onChange={(e) => setNewGoal(e.target.value)}
              className={`flex-1 px-4 py-2 rounded-lg border focus:outline-none ${theme === 'light'
                  ? 'bg-white border-purple-200 text-purple-900 focus:border-purple-500'
                  : 'bg-gray-800 border-gray-700 text-white focus:border-white'
                }`}
              placeholder="e.g., Score 90% or higher on my final exam"
            />
            <button
              onClick={addGoal}
              className={`px-6 py-2 rounded-lg transition-colors ${theme === 'light'
                  ? 'bg-purple-600 text-white hover:bg-purple-700'
                  : 'bg-white text-black hover:bg-gray-100'
                }`}
            >
              Add Goal
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudyPreferences;