// Review.js
import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useOnboarding } from '../../context/OnboardingContext';
import { useTheme } from '../../context/theme-context';
import SummaryApi from '../../lib/apiUrls';
import { UserDetailContext } from '../../context/UserDetailContext';
import { toast } from 'react-toastify';

const Review = () => {
  const navigate = useNavigate();
  const { userDetail } = useContext(UserDetailContext);
  const { data } = useOnboarding();
  const { theme } = useTheme();
  const [loadingSavePref, setLoadingSavePref] = useState(false);

  const handleSubmit = async () => {
    if (!userDetail?.id) {
      toast.info("You have to login first!");
      return;
    }
    try {
      setLoadingSavePref(true);
      const userId = userDetail?.id;
      const done = "completed";
      const personalInfo = {
        fullName: data.personalInfo.fullName,
        email: data.personalInfo.email,
        institute: data.personalInfo.institution
      };
      const academic = {
        edulevel: data.academicBackground.educationLevel,
        fieldofstudy: data.academicBackground.fieldOfStudy,
        currentyear: data.academicBackground.currentYear,
        gpa: data.academicBackground.gpa
      };
      const interestedsubjects = data.subjects || [];
      const studypreferences = {
        style: data.studyPreferences.learningStyle,
        sessionlength: data.studyPreferences.sessionLength,
        dailyhours: data.studyPreferences.maxDailyHours
      }
      const response = await fetch(SummaryApi.addUserPreferences.url, {
        method: SummaryApi.addUserPreferences.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: userDetail?.id || userId, done: done, personalInfo: personalInfo, academic: academic, interestedsubjects: interestedsubjects, studypreferences: studypreferences }),
      },
      );
      const dataResponse = await response.json()
      console.log("id...", dataResponse)
      if (dataResponse?.success) {
        setLoadingSavePref(false);
        toast.success("Preferences Saved Successfully!");
      }
      if (dataResponse?.redirect) {
        navigate('/dashboard/plan');
      }
      else {
        setLoadingSavePref(false);
        return;
      }
      setLoadingSavePref(false);
    } catch (error) {
      setLoadingSavePref(false);
      console.error('Error during signup:', error);
    }
    setLoadingSavePref(false);
  };

  console.log(data?.subjects)

  return (
    <div>
      <h2 className={`text-2xl font-bold mb-2 ${theme === 'light' ? 'text-purple-900' : 'text-white'
        }`}>
        Review Your Profile
      </h2>
      <p className={`mb-8 ${theme === 'light' ? 'text-purple-700' : 'text-gray-400'
        }`}>
        Please review your information before finalizing
      </p>

      <div className="space-y-8">
        {[
          {
            title: 'Personal Information',
            data: [
              { label: 'Full Name', value: data.personalInfo.fullName },
              { label: 'Email', value: data.personalInfo.email },
              { label: 'Institution', value: data.personalInfo.institution }
            ]
          },
          {
            title: 'Academic Background',
            data: [
              { label: 'Education Level', value: data.academicBackground.educationLevel },
              { label: 'Field of Study', value: data.academicBackground.fieldOfStudy },
              { label: 'Current Year', value: data.academicBackground.currentYear },
              ...(data.academicBackground.gpa ? [{ label: 'GPA', value: data.academicBackground.gpa }] : [])
            ]
          },
          {
            title: 'Selected Subjects',
            isList: true,
            value: data.subjects
          },
          {
            title: 'Study Preferences',
            data: [
              { label: 'Learning Style', value: data.studyPreferences.learningStyle },
              { label: 'Preferred Session Length', value: `${data.studyPreferences.sessionLength} minutes` },
              { label: 'Maximum Daily Study Hours', value: `${data.studyPreferences.maxDailyHours} hours` },
              ...(data.studyPreferences.goals.length > 0 ? [{
                label: 'Academic Goals',
                isList: true,
                value: data.studyPreferences.goals
              }] : [])
            ]
          }
        ].map((section, index) => (
          <section key={index}>
            <h3 className={`text-xl mb-4 ${theme === 'light' ? 'text-purple-800' : 'text-white'
              }`}>
              {section.title}
            </h3>
            <div className={`rounded-lg p-4 ${theme === 'light' ? 'bg-purple-50 border border-purple-100' : 'bg-gray-800'
              }`}>
              {section.isList ? (
                <div className="flex flex-wrap gap-2">
                  {section.value.map((item, i) => (
                    <span key={i} className={`px-3 py-1 rounded-full ${theme === 'light' ? 'bg-purple-100 text-purple-800' : 'bg-gray-700 text-white'
                      }`}>
                      {item}
                    </span>
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-4">
                  {section.data.map((item, i) => (
                    <div key={i}>
                      <p className={theme === 'light' ? 'text-purple-600' : 'text-gray-400'}>
                        {item.label}
                      </p>
                      {item.isList ? (
                        <ul className="list-disc list-inside">
                          {item.value.map((goal, j) => (
                            <li key={j} className={theme === 'light' ? 'text-purple-800' : 'text-white'}>
                              {goal}
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p className={theme === 'light' ? 'text-purple-900' : 'text-white'}>
                          {item.value}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </section>
        ))}
      </div>

      <button
        onClick={handleSubmit}
        className={`w-full mt-8 px-6 py-3 rounded-lg transition-colors font-medium ${theme === 'light'
          ? 'bg-purple-600 text-white hover:bg-purple-700'
          : 'bg-white text-black hover:bg-gray-100'
          }`}
      >
        {loadingSavePref ? 'Saving Preferences...' : 'Complete Profile Setup'}
      </button>
    </div>
  );
};

export default Review;