// AcademicBackground.js
import React from 'react';
import { useOnboarding } from '../../context/OnboardingContext';
import { useTheme } from '../../context/theme-context';

const AcademicBackground = () => {
  const { data, updateAcademicBackground } = useOnboarding();
  const { theme } = useTheme();
  const { academicBackground } = data;

  const handleChange = (e) => {
    const { name, value } = e.target;
    updateAcademicBackground({
      ...academicBackground,
      [name]: value
    });
  };

  return (
    <div>
      <h2 className={`text-2xl font-bold mb-2 ${theme === 'light' ? 'text-purple-900' : 'text-white'
        }`}>
        Academic Background
      </h2>
      <p className={`mb-8 ${theme === 'light' ? 'text-purple-700' : 'text-gray-400'
        }`}>
        Tell us about your educational journey
      </p>

      <div className="space-y-6">
        <div>
          <label className={`block mb-2 ${theme === 'light' ? 'text-purple-800' : 'text-white'
            }`}>
            Current Education Level
          </label>
          <select
            name="educationLevel"
            value={academicBackground.educationLevel}
            onChange={handleChange}
            className={`w-full px-4 py-2 rounded-lg border focus:outline-none ${theme === 'light'
                ? 'bg-white border-purple-200 text-purple-900 focus:border-purple-500'
                : 'bg-gray-800 border-gray-700 text-white focus:border-white'
              }`}
          >
            <option value="">Select your education level</option>
            <option value="high-school">High School</option>
            <option value="undergraduate">Undergraduate</option>
            <option value="graduate">Graduate</option>
            <option value="phd">PhD</option>
            <option value="other">Other</option>
          </select>
        </div>

        {[
          { id: 'fieldOfStudy', label: 'Field of Study', placeholder: 'e.g., Computer Science, Biology, etc.' },
          { id: 'currentYear', label: 'Current Year/Semester', placeholder: 'e.g., 2nd Year, 3rd Semester' },
          { id: 'gpa', label: 'GPA (Optional)', placeholder: 'Enter your current GPA', type: 'number' }
        ].map((field) => (
          <div key={field.id}>
            <label className={`block mb-2 ${theme === 'light' ? 'text-purple-800' : 'text-white'
              }`}>
              {field.label}
            </label>
            <input
              type={field.type || 'text'}
              name={field.id}
              value={academicBackground[field.id]}
              onChange={handleChange}
              className={`w-full px-4 py-2 rounded-lg border focus:outline-none ${theme === 'light'
                  ? 'bg-white border-purple-200 text-purple-900 focus:border-purple-500'
                  : 'bg-gray-800 border-gray-700 text-white focus:border-white'
                }`}
              placeholder={field.placeholder}
              {...(field.type === 'number' ? { step: "0.01", min: "0", max: "4" } : {})}
            />
          </div>
        ))}

        <div>
          <label className={`block mb-2 ${theme === 'light' ? 'text-purple-800' : 'text-white'
            }`}>
            Previous Education
          </label>
          <textarea
            name="previousEducation"
            value={academicBackground.previousEducation}
            onChange={handleChange}
            className={`w-full px-4 py-2 rounded-lg border focus:outline-none h-32 ${theme === 'light'
                ? 'bg-white border-purple-200 text-purple-900 focus:border-purple-500'
                : 'bg-gray-800 border-gray-700 text-white focus:border-white'
              }`}
            placeholder="Briefly describe your previous educational experience"
          />
        </div>
      </div>
    </div>
  );
};

export default AcademicBackground;