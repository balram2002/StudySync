// PersonalInfo.js
import React from 'react';
import { useOnboarding } from '../../context/OnboardingContext';
import { useTheme } from '../../context/theme-context';

const PersonalInfo = () => {
  const { data, updatePersonalInfo } = useOnboarding();
  const { theme } = useTheme();
  const { personalInfo } = data;

  const handleChange = (e) => {
    const { name, value } = e.target;
    updatePersonalInfo({
      ...personalInfo,
      [name]: value
    });
  };

  return (
    <div>
      <h2 className={`text-2xl font-bold mb-2 ${theme === 'light' ? 'text-purple-900' : 'text-white'
        }`}>
        Personal Information
      </h2>
      <p className={`mb-8 ${theme === 'light' ? 'text-purple-700' : 'text-gray-400'
        }`}>
        Tell us a bit about yourself
      </p>

      <div className="space-y-6">
        {[
          { id: 'fullName', label: 'Full Name', placeholder: 'Enter your full name' },
          { id: 'email', label: 'Email Address', placeholder: 'Enter your email address', type: 'email' },
          { id: 'institution', label: 'Educational Institution', placeholder: 'Enter your school/university name' }
        ].map((field) => (
          <div key={field.id}>
            <label htmlFor={field.id} className={`block mb-2 ${theme === 'light' ? 'text-purple-800' : 'text-white'
              }`}>
              {field.label}
            </label>
            <input
              type={field.type || 'text'}
              id={field.id}
              name={field.id}
              value={personalInfo[field.id]}
              onChange={handleChange}
              placeholder={field.placeholder}
              className={`w-full px-4 py-2 rounded-lg border focus:outline-none ${theme === 'light'
                  ? 'bg-white border-purple-200 text-purple-900 focus:border-purple-500'
                  : 'bg-gray-800 border-gray-700 text-white focus:border-white'
                }`}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default PersonalInfo;