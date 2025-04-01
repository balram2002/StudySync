// OnboardingSteps.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PersonalInfo from '../../components/onboarding/PersonalInfo';
import AcademicBackground from '../../components/onboarding/AcademicBackground';
import SubjectsOfInterest from '../../components/onboarding/SubjectsOfInterest';
import StudyPreferences from '../../components/onboarding/StudyPreferences';
import Review from '../../components/onboarding/Review';
import { useOnboarding } from '../../context/OnboardingContext';
import { useTheme } from '../../context/theme-context';

const steps = [
  { id: 1, name: 'Personal Information', component: PersonalInfo },
  { id: 2, name: 'Academic Background', component: AcademicBackground },
  { id: 3, name: 'Subjects of Interest', component: SubjectsOfInterest },
  { id: 4, name: 'Study Preferences', component: StudyPreferences },
  { id: 5, name: 'Review', component: Review },
];

const OnboardingSteps = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const { data } = useOnboarding();
  const { theme } = useTheme();

  const CurrentStepComponent = steps.find(step => step.id === currentStep)?.component || PersonalInfo;

  const isStepComplete = (stepId) => {
    switch (stepId) {
      case 1:
        return data.personalInfo.fullName && data.personalInfo.email && data.personalInfo.institution;
      case 2:
        return data.academicBackground.educationLevel && data.academicBackground.fieldOfStudy;
      case 3:
        return data.subjects.length > 0;
      case 4:
        return data.studyPreferences.learningStyle && data.studyPreferences.sessionLength > 0;
      case 5:
        return true;
      default:
        return false;
    }
  };

  const getStepStatus = (stepId) => {
    if (stepId < currentStep) return 'completed';
    if (stepId === currentStep) return 'current';
    return 'upcoming';
  };

  const calculateProgress = () => {
    const completedSteps = steps.filter((_, index) => isStepComplete(index + 1)).length;
    return (completedSteps / steps.length) * 100;
  };

  return (
    <div className={`min-h-screen pt-20 px-4 ${theme === 'light' ? 'bg-purple-50' : 'bg-black'
      }`}>
      <div className="max-w-4xl mx-auto py-12">
        <h1 className={`text-3xl md:text-4xl font-bold text-center mb-2 ${theme === 'light' ? 'text-purple-900' : 'text-white'
          }`}>
          Set Up Your StudySync Profile
        </h1>
        <p className={`text-center mb-12 ${theme === 'light' ? 'text-purple-700' : 'text-gray-400'
          }`}>
          Let's personalize your study experience to help you achieve your academic goals.
        </p>

        <div className="mb-12">
          <div className="relative">
            <div className={`absolute top-1/2 left-0 w-full h-1 -translate-y-1/2 ${theme === 'light' ? 'bg-purple-200' : 'bg-gray-800'
              }`}>
              <div
                className={`h-full rounded-full transition-all duration-300 ${theme === 'light' ? 'bg-purple-600' : 'bg-green-500'
                  }`}
                style={{ width: `${calculateProgress()}%` }}
              />
            </div>

            <div className="relative flex justify-between">
              {steps.map((step) => {
                const status = getStepStatus(step.id);
                return (
                  <div key={step.id} className="flex flex-col items-center">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${status === 'completed'
                          ? theme === 'light'
                            ? 'bg-purple-600 text-white'
                            : 'bg-green-500 text-white'
                          : status === 'current'
                            ? theme === 'light'
                              ? 'bg-white text-purple-900 ring-4 ring-purple-300'
                              : 'bg-white text-black ring-4 ring-green-500'
                            : theme === 'light'
                              ? 'bg-purple-100 text-purple-700'
                              : 'bg-gray-800 text-gray-400'
                        }`}
                    >
                      {status === 'completed' ? '✓' : step.id}
                    </div>
                    <div className="absolute top-12 w-max">
                      <span className={`text-sm font-medium ${status === 'completed'
                          ? theme === 'light'
                            ? 'text-purple-600'
                            : 'text-green-500'
                          : status === 'current'
                            ? theme === 'light'
                              ? 'text-purple-900'
                              : 'text-white'
                            : theme === 'light'
                              ? 'text-purple-600'
                              : 'text-gray-400'
                        }`}>
                        {step.name}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className={`rounded-xl p-8 mt-16 ${theme === 'light'
            ? 'bg-white border border-purple-100 shadow-sm'
            : 'bg-gray-900'
          }`}>
          <CurrentStepComponent />
        </div>

        <div className="flex justify-between mt-8">
          {currentStep > 1 && (
            <button
              onClick={() => setCurrentStep(prev => prev - 1)}
              className={`px-6 py-3 rounded-lg transition-colors ${theme === 'light'
                  ? 'bg-purple-100 text-purple-700 hover:bg-purple-200'
                  : 'bg-gray-800 text-white hover:bg-gray-700'
                }`}
            >
              Previous
            </button>
          )}
          {currentStep < steps.length && (
            <button
              onClick={() => setCurrentStep(prev => prev + 1)}
              disabled={!isStepComplete(currentStep)}
              className={`px-6 py-3 rounded-lg transition-colors ml-auto ${isStepComplete(currentStep)
                  ? theme === 'light'
                    ? 'bg-purple-600 text-white hover:bg-purple-700'
                    : 'bg-white text-black hover:bg-gray-100'
                  : theme === 'light'
                    ? 'bg-purple-200 text-purple-400 cursor-not-allowed'
                    : 'bg-gray-700 text-gray-400 cursor-not-allowed'
                }`}
            >
              Continue
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default OnboardingSteps;