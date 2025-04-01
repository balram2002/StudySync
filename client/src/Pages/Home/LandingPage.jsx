import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lightbulb, Code, Rocket, Brain, Search, MapPin } from 'lucide-react';
import { useTheme } from '../../context/theme-context';
import { UserDetailContext } from '../../context/UserDetailContext';
import { toast } from 'react-toastify';
import SummaryApi from '../../lib/apiUrls';
import { motion } from 'framer-motion';
import { BackgroundBeams } from '../../components/ui/background-beams';
import { Spotlight } from '../../components/ui/spotlight-new';

const LandingPage = () => {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const { userDetail } = useContext(UserDetailContext);
  const [isDone, setIsDone] = useState(false);
  const [loading, setLoading] = useState(false);
  const handleClickGetSatrted = async () => {
    try {

      setLoading(true);
      const response = await fetch(SummaryApi.getUserPreferencesDetails.url, {
        method: SummaryApi.getUserPreferencesDetails.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userid: userDetail?.id
        }),
      });

      const dataResponse = await response.json();
      console.log("plandone :", dataResponse?.data?.done)
      if (dataResponse?.success) {
        if (dataResponse?.data?.done === "completed") {
          setIsDone(true);
          navigate('/dashboard/plan');
        } else {
          setIsDone(false);
          navigate('/onboarding');
        }
        console.log("plans : ", dataResponse?.data);
      }
    } catch (error) {
      console.error('Error during save:', error);
      toast.error("Failed to save study plan");
    } finally {
      setLoading(false);
    }
  }

  const text = "Master Tech Skills with AI-Powered Learning";
  const textVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05
      }
    }
  };

  const letterVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.4 }
    }
  };

  // Animation variants for the description
  const descriptionVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        delay: 0.3,
        ease: 'easeOut'
      }
    }
  };

  // Animation variants for the buttons
  const buttonVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        delay: 0.6,
        ease: 'easeOut'
      }
    }
  };

  return (
    <>
      <div className={`min-h-screen !z-50 pt-20 ${theme === 'light' ? 'bg-purple-50' : 'bg-black'}`}>
        {/* Hero Section */}
        <section className="max-w-7xl min-h-screen flex items-center justify-center mx-auto px-4 py-16">
          <div className="text-center">
            <motion.h1
              className={`text-5xl font-sans font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r ${theme === 'light' ? 'from-purple-600 to-blue-500' : 'from-gray-100 to-gray-400'} flex justify-center flex-wrap`}
              variants={textVariants}
              initial="hidden"
              animate="visible"
            >
              {text.split("").map((char, index) => (
                <motion.span key={index} variants={letterVariants} className="inline-block">
                  {char === " " ? "\u00A0" : char}
                </motion.span>
              ))}
            </motion.h1>
            <motion.p
              className={`text-xl mb-8 ${theme === 'light' ? 'text-gray-600' : 'text-gray-400'}`}
              initial="hidden"
              animate="visible"
              variants={descriptionVariants}
            >
              StudySync leverages the best internet resources and AI to create personalized learning paths, helping you master tech stacks efficiently and effectively.
            </motion.p>
            <div className="top-buttons-container">
              <div className="flex gap-4 justify-center !z-50">
                <button
                  onClick={() => {
                    handleClickGetSatrted();
                  }}
                  disabled={loading}
                  className={`px-8 py-3 rounded-lg hover:bg-opacity-90 transition-colors cursor-pointer font-medium flex items-center justify-center ${theme === 'light'
                    ? 'bg-purple-600 text-white hover:bg-purple-700'
                    : 'bg-white text-black hover:bg-gray-100'
                    } ${loading ? 'cursor-not-allowed opacity-80' : ''}`}
                >
                  {loading ? (
                    <>
                      <div className="h-5 w-5 mr-3 rounded-full border-2 border-t-transparent border-current animate-spin"></div>
                      Loading...
                    </>
                  ) : (
                    'Start Your Tech Journey'
                  )}
                </button>
                <button
                  className={`px-8 py-3 rounded-lg transition-colors ${theme === 'light'
                    ? 'bg-white text-purple-700 border border-purple-200 hover:bg-purple-50'
                    : 'bg-gray-800 text-white hover:bg-gray-700'
                    }`}
                >
                  Explore Features
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="max-w-7xl mx-auto px-4 py-16">
          <h2 className={`text-3xl font-bold text-center mb-12 ${theme === 'light' ? 'text-purple-900' : 'text-white'}`}>
            Unlock Your Tech Potential
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: <Lightbulb className="w-8 h-8 mb-4" />, title: "AI-Powered Roadmaps", description: "Get personalized learning paths tailored to your skill level and goals." },
              { icon: <Code className="w-8 h-8 mb-4" />, title: "Curated Resource Aggregation", description: "Access the best online resources, handpicked and organized for effective learning." },
              { icon: <Rocket className="w-8 h-8 mb-4" />, title: "Accelerated Learning", description: "Learn tech stacks faster with structured, efficient, and focused study plans." },
              { icon: <Brain className="w-8 h-8 mb-4" />, title: "Adaptive Learning", description: "Our AI adapts to your progress, ensuring you stay challenged and engaged." },
              { icon: <Search className="w-8 h-8 mb-4" />, title: "Comprehensive Tech Coverage", description: "Learn a wide range of tech stacks, from web development to data science." },
              { icon: <MapPin className="w-8 h-8 mb-4" />, title: "Real-World Application", description: "Apply your skills with practical projects and real-world examples." }
            ].map((feature, index) => (
              <div
                key={index}
                className={`rounded-xl p-6 transition-colors ${theme === 'light'
                  ? 'bg-white border border-purple-100 hover:bg-purple-50 shadow-sm'
                  : 'bg-gray-900 hover:bg-gray-800'
                  }`}
              >
                {React.cloneElement(feature.icon, {
                  className: `w-8 h-8 mb-4 ${theme === 'light' ? 'text-purple-600' : 'text-white'}`
                })}
                <h3 className={`text-xl font-semibold mb-2 ${theme === 'light' ? 'text-purple-800' : 'text-white'}`}>
                  {feature.title}
                </h3>
                <p className={theme === 'light' ? 'text-purple-700' : 'text-gray-400'}>
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* CTA Section */}
        <section className="max-w-7xl mx-auto px-4 py-16">
          <div className="text-center">
            <h2 className={`text-3xl font-bold mb-4 ${theme === 'light' ? 'text-purple-900' : 'text-white'}`}>
              Ready to Level Up Your Tech Skills?
            </h2>
            <p className={`mb-8 ${theme === 'light' ? 'text-purple-700' : 'text-gray-400'}`}>
              Join a community of learners and start your journey towards mastering in-demand tech skills with StudySync.
            </p>
            <button
              onClick={() => navigate('/onboarding')}
              className={`px-8 py-3 rounded-lg hover:bg-opacity-90 transition-colors font-medium ${theme === 'light'
                ? 'bg-purple-600 text-white hover:bg-purple-700'
                : 'bg-white text-black hover:bg-gray-100'
                }`}
            >
              Get Started Now
            </button>
          </div>
        </section>
      </div>
      <Spotlight
        translateY={-300}
        gradientFirst={`radial-gradient(68.54% 68.72% at 55.02% 31.46%, ${theme === "light"
          ? "hsla(0, 0%, 70%, .15) 0, hsla(0, 0%, 80%, .08) 50%, hsla(0, 0%, 90%, 0) 80%"
          : "hsla(210, 100%, 85%, .08) 0, hsla(210, 100%, 55%, .02) 50%, hsla(210, 100%, 45%, 0) 80%"
          })`}

        gradientSecond={`radial-gradient(50% 50% at 50% 50%, ${theme === "light"
          ? "hsla(0, 0%, 75%, .12) 0, hsla(0, 0%, 85%, .06) 80%, transparent 100%"
          : "hsla(210, 100%, 85%, .06) 0, hsla(210, 100%, 55%, .02) 80%, transparent 100%"
          })`}

        gradientThird={`radial-gradient(50% 50% at 50% 50%, ${theme === "light"
          ? "hsla(0, 0%, 80%, .10) 0, hsla(0, 0%, 90%, .05) 80%, transparent 100%"
          : "hsla(210, 100%, 85%, .04) 0, hsla(210, 100%, 45%, .02) 80%, transparent 100%"
          })`}
        className={'!z-10'}
      />
      <BackgroundBeams />
    </>
  );
};

export default LandingPage;