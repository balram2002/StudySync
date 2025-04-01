import React, { createContext, useState, useContext } from 'react';

const defaultData = {
  personalInfo: {
    fullName: '',
    email: '',
    institution: '',
  },
  academicBackground: {
    educationLevel: '',
    fieldOfStudy: '',
    currentYear: '',
    gpa: '',
    previousEducation: '',
  },
  subjects: [],
  studyPreferences: {
    weekdayHours: [],
    weekendHours: [],
    sessionLength: 45,
    maxDailyHours: 4,
    learningStyle: '',
    goals: [],
  },
};

export const OnboardingContext = createContext({});

export function OnboardingProvider({ children }) {
  const [data, setData] = useState(defaultData || "");

  const updatePersonalInfo = (info) => {
    setData(prev => ({ ...prev, personalInfo: info }));
  };

  const updateAcademicBackground = (info) => {
    setData(prev => ({ ...prev, academicBackground: info }));
  };

  const updateSubjects = (subjects) => {
    setData(prev => ({ ...prev, subjects }));
  };

  const updateStudyPreferences = (prefs) => {
    setData(prev => ({ ...prev, studyPreferences: prefs }));
  };

  const resetOnboarding = () => {
    setData(defaultData);
  };

  return (
    <OnboardingContext.Provider value={{
      data,
      updatePersonalInfo,
      updateAcademicBackground,
      updateSubjects,
      updateStudyPreferences,
      resetOnboarding,
    }}>
      {children}
    </OnboardingContext.Provider>
  );
}

export const useOnboarding = () => useContext(OnboardingContext);