import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useOnboarding } from '../../context/OnboardingContext';
import { useAuth } from '../../context/AuthContext';

const Review = () => {
  const navigate = useNavigate();
  const { data } = useOnboarding();
  const { signUp } = useAuth();

  const handleSubmit = async () => {
    try {
      // In a real app, you would validate all the data here
      await signUp(data.personalInfo.email, 'password', data.personalInfo.fullName);
      // Force navigation to dashboard after successful signup
      navigate('/dashboard', { replace: true });
    } catch (error) {
      console.error('Error during signup:', error);
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-white mb-2">Review Your Profile</h2>
      <p className="text-gray-400 mb-8">Please review your information before finalizing</p>

      <div className="space-y-8">
        <section>
          <h3 className="text-xl text-white mb-4">Personal Information</h3>
          <div className="bg-gray-800 rounded-lg p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-gray-400">Full Name</p>
                <p className="text-white">{data.personalInfo.fullName}</p>
              </div>
              <div>
                <p className="text-gray-400">Email</p>
                <p className="text-white">{data.personalInfo.email}</p>
              </div>
              <div>
                <p className="text-gray-400">Institution</p>
                <p className="text-white">{data.personalInfo.institution}</p>
              </div>
            </div>
          </div>
        </section>

        <section>
          <h3 className="text-xl text-white mb-4">Academic Background</h3>
          <div className="bg-gray-800 rounded-lg p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-gray-400">Education Level</p>
                <p className="text-white">{data.academicBackground.educationLevel}</p>
              </div>
              <div>
                <p className="text-gray-400">Field of Study</p>
                <p className="text-white">{data.academicBackground.fieldOfStudy}</p>
              </div>
              <div>
                <p className="text-gray-400">Current Year</p>
                <p className="text-white">{data.academicBackground.currentYear}</p>
              </div>
              {data.academicBackground.gpa && (
                <div>
                  <p className="text-gray-400">GPA</p>
                  <p className="text-white">{data.academicBackground.gpa}</p>
                </div>
              )}
            </div>
          </div>
        </section>

        <section>
          <h3 className="text-xl text-white mb-4">Selected Subjects</h3>
          <div className="bg-gray-800 rounded-lg p-4">
            <div className="flex flex-wrap gap-2">
              {data.subjects.map(subject => (
                <span key={subject} className="px-3 py-1 bg-gray-700 text-white rounded-full">
                  {subject}
                </span>
              ))}
            </div>
          </div>
        </section>

        <section>
          <h3 className="text-xl text-white mb-4">Study Preferences</h3>
          <div className="bg-gray-800 rounded-lg p-4">
            <div className="space-y-4">
              <div>
                <p className="text-gray-400">Learning Style</p>
                <p className="text-white">{data.studyPreferences.learningStyle}</p>
              </div>
              <div>
                <p className="text-gray-400">Preferred Session Length</p>
                <p className="text-white">{data.studyPreferences.sessionLength} minutes</p>
              </div>
              <div>
                <p className="text-gray-400">Maximum Daily Study Hours</p>
                <p className="text-white">{data.studyPreferences.maxDailyHours} hours</p>
              </div>
              {data.studyPreferences.goals.length > 0 && (
                <div>
                  <p className="text-gray-400">Academic Goals</p>
                  <ul className="list-disc list-inside text-white">
                    {data.studyPreferences.goals.map((goal, index) => (
                      <li key={index}>{goal}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </section>
      </div>

      <button
        onClick={handleSubmit}
        className="w-full mt-8 px-6 py-3 bg-white text-black rounded-lg hover:bg-gray-100 transition-colors font-medium"
      >
        Complete Profile Setup
      </button>
    </div>
  );
};

export default Review;