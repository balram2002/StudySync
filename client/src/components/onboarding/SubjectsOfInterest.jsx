// SubjectsOfInterest.js
import React, { useState } from 'react';
import { useOnboarding } from '../../context/OnboardingContext';
import { useTheme } from '../../context/theme-context';

const subjects = [
  'Mathematics',
  'Physics',
  'Chemistry',
  'Biology',
  'Computer Science',
  'Literature',
  'History',
  'Economics',
  'Psychology',
  'Foreign Language',
];

const SubjectsOfInterest = () => {
  const { data, updateSubjects } = useOnboarding();
  const { theme } = useTheme();
  const [customSubject, setCustomSubject] = useState('');
  const [selectedSubjects, setSelectedSubjects] = useState(data.subjects);

  const toggleSubject = (subject) => {
    const newSelection = selectedSubjects.includes(subject)
      ? selectedSubjects.filter(s => s !== subject)
      : [...selectedSubjects, subject];

    setSelectedSubjects(newSelection);
    updateSubjects(newSelection);
  };

  const addCustomSubject = () => {
    if (customSubject.trim() && !selectedSubjects.includes(customSubject)) {
      const newSubjects = [...selectedSubjects, customSubject.trim()];
      setSelectedSubjects(newSubjects);
      updateSubjects(newSubjects);
      setCustomSubject('');
    }
  };

  return (
    <div>
      <h2 className={`text-2xl font-bold mb-2 ${theme === 'light' ? 'text-purple-900' : 'text-white'
        }`}>
        Subjects of Interest
      </h2>
      <p className={`mb-8 ${theme === 'light' ? 'text-purple-700' : 'text-gray-400'
        }`}>
        Select subjects you want to focus on
      </p>

      <div className="grid grid-cols-2 gap-4">
        {subjects.map((subject) => (
          <button
            key={subject}
            onClick={() => toggleSubject(subject)}
            className={`p-4 rounded-lg transition-colors text-center ${selectedSubjects.includes(subject)
                ? theme === 'light'
                  ? 'bg-purple-600 text-white hover:bg-purple-700'
                  : 'bg-white text-black hover:bg-gray-100'
                : theme === 'light'
                  ? 'bg-purple-100 text-purple-800 hover:bg-purple-200'
                  : 'bg-gray-800 text-white hover:bg-gray-700'
              }`}
          >
            {subject}
          </button>
        ))}
      </div>

      <div className="mt-8 flex space-x-4">
        <input
          type="text"
          value={customSubject}
          onChange={(e) => setCustomSubject(e.target.value)}
          placeholder="Add a custom subject"
          className={`flex-1 px-4 py-2 rounded-lg border focus:outline-none ${theme === 'light'
              ? 'bg-white border-purple-200 text-purple-900 focus:border-purple-500'
              : 'bg-gray-800 border-gray-700 text-white focus:border-white'
            }`}
        />
        <button
          onClick={addCustomSubject}
          className={`px-6 py-2 rounded-lg transition-colors ${theme === 'light'
              ? 'bg-purple-600 text-white hover:bg-purple-700'
              : 'bg-white text-black hover:bg-gray-100'
            }`}
        >
          Add Subject
        </button>
      </div>

      {selectedSubjects.length > 0 && (
        <div className="mt-8">
          <h3 className={`mb-4 ${theme === 'light' ? 'text-purple-800' : 'text-white'
            }`}>
            Selected Subjects:
          </h3>
          <div className="flex flex-wrap gap-2">
            {selectedSubjects.map(subject => (
              <span
                key={subject}
                className={`px-3 py-1 rounded-full flex items-center ${theme === 'light'
                    ? 'bg-purple-100 text-purple-800'
                    : 'bg-gray-700 text-white'
                  }`}
              >
                {subject}
                <button
                  onClick={() => toggleSubject(subject)}
                  className={`ml-2 ${theme === 'light' ? 'text-purple-600 hover:text-purple-800' : 'text-gray-400 hover:text-white'
                    }`}
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default SubjectsOfInterest;