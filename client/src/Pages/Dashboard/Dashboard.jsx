import React, { useContext, useState, useEffect } from 'react';
import { Calendar, BarChart2, Trophy, Users, Clock, Laptop, Plus, ChevronRight, CheckCircle2, Circle, ChevronDown, ChevronUp, BookOpen, ChevronLeft, GitMerge, Smartphone, Apple, Layout, Server, Database, Settings, Mic } from 'lucide-react';
import { format } from 'date-fns';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { UserDetailContext } from '../../context/UserDetailContext';
import { useTheme } from '../../context/theme-context';
import { openSourceRoadmap as openSourceRoadmapData, iOSDevelopmentRoadmap, frontendDevelopmentRoadmap, backendDevlopmentRoadmap, androidDevelopmentRoadmap, devRelRoadmap, dataScienceRoadmap, devopsRoadmap } from './data';
import { toast } from 'react-toastify';
import SummaryApi from '../../lib/apiUrls';

const Dashboard = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [studyPlans, setStudyPlans] = useState([]);
  const { userDetail } = useContext(UserDetailContext);
  const { theme } = useTheme();
  const [showCreatePlan, setShowCreatePlan] = useState(false);
  const [newPlan, setNewPlan] = useState({
    name: '',
    startDate: '',
    duration: 30,
    subjects: [],
  });

  const [showRoadmapGenerator, setShowRoadmapGenerator] = useState(false);
  const [level, setLevel] = useState('beginner');
  const [roadmap, setRoadmap] = useState('openSource');
  const [selectroadmap, setSelectedRoadmap] = useState({
    openSource: openSourceRoadmapData,
    iOSDevelopment: iOSDevelopmentRoadmap,
    frontendDevelopment: frontendDevelopmentRoadmap,
    backendDevelopment: backendDevlopmentRoadmap,
    androidDevelopment: androidDevelopmentRoadmap,
    devRel: devRelRoadmap,
    dataScience: dataScienceRoadmap,
    devops: devopsRoadmap,
  });
  const [days, setDays] = useState(30);
  const [studyPlan, setStudyPlan] = useState(null);
  const [studyPlanId, setStudyPlanId] = useState();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [rawResponse, setRawResponse] = useState(null);
  const [completedTasks, setCompletedTasks] = useState(() => {
    const saved = localStorage.getItem('completedTasks');
    return saved ? JSON.parse(saved) : {};
  });
  const [expandedDays, setExpandedDays] = useState({});

  const apiKey = 'AIzaSyA8op0ZPAmPVaLY4wL8NRc79j8A9FjFa24';
  const newRoadmap = selectroadmap[roadmap];

  useEffect(() => {
    localStorage.setItem('completedTasks', JSON.stringify(completedTasks));
  }, [completedTasks]);

  // useEffect(() => {
  //   if (studyPlan && studyPlan.length > 0) {
  //     saveStudyPlan();
  //   }
  // }, [studyPlan]);

  useEffect(() => {
    if (studyPlanId && studyPlanId.length > 0) {
      savePlans();
    }
  }, [studyPlanId]);

  const handleCreatePlan = () => {
    if (!newPlan.name || !newPlan.startDate) return;

    const plan = {
      id: Math.random().toString(36).substr(2, 9),
      name: newPlan.name,
      startDate: new Date(newPlan.startDate),
      duration: newPlan.duration,
      subjects: newPlan.subjects,
      progress: 0,
      nextSession: new Date(newPlan.startDate),
    };

    setStudyPlans([...studyPlans, plan]);
    setShowCreatePlan(false);
    setNewPlan({ name: '', startDate: '', duration: 30, subjects: [] });
  };

  const generateStudyPlan = async () => {
    setLoading(true);
    setError(null);
    setRawResponse(null);
    setStudyPlan(null);
    setCompletedTasks({});

    try {
      const prompt = `Generate a personalized ${days}-day study roadmap for learning ${roadmap} based on the user's proficiency level (${level}). 

Format requirements:
- Return a valid JSON array of arrays ONLY, with no explanations or markdown
- Each inner array represents exactly one day's study plan
- The total number of days must be exactly ${days} (no more, no less)
- Each study item must include: description, link, duration, and type properties

Content guidelines:
- Use ONLY resources from the provided data: ${JSON.stringify(newRoadmap)}
- For beginner level: prioritize video content with longer durations
- For intermediate level: balance documentation and video content equally 
- For advanced level: emphasize documentation with supplementary short videos
- Ensure daily content is reasonably balanced (avoid overloading any single day)
- Total study time per day should be realistic (2-4 hours recommended)
- Design progression from foundational to more complex topics

Return ONLY the JSON array with no additional text.`;

      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            contents: [
              {
                parts: [
                  {
                    text: prompt,
                  },
                ],
              },
            ],
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`API request failed with status ${response.status}: ${errorData.error?.message || 'Unknown error'}`);
      }

      const result = await response.json();
      setRawResponse(JSON.stringify(result, null, 2));

      console.log("aidata : ", result?.candidates?.[0]?.content?.parts?.[0]?.text);

      const aiResponse = result?.candidates?.[0]?.content?.parts?.[0]?.text;

      if (!aiResponse) {
        throw new Error("Empty response from AI service");
      }

      try {
        let jsonContent = aiResponse;
        const jsonMatch = aiResponse.match(/```json\n([\s\S]*?)\n```/);
        if (jsonMatch && jsonMatch[1]) {
          jsonContent = jsonMatch[1].trim();
        }

        const parsedPlan = await JSON.parse(jsonContent);

        if (!Array.isArray(parsedPlan)) {
          throw new Error("Parsed result is not an array");
        }

        setStudyPlan(parsedPlan);
        saveStudyPlan(parsedPlan);

      } catch (parseError) {
        console.error("Parse error:", parseError);
        setStudyPlan(createFallbackPlan());
        setError(`AI response format issue, using fallback plan: ${parseError.message}`);
      }

    } catch (err) {
      console.error("Error in generateStudyPlan:", err);
      setError(err.message);
      setStudyPlan(createFallbackPlan());
    } finally {
      setLoading(false);
    }
  };

  const createFallbackPlan = () => {
    const fallbackPlan = [];
    const topics = Object.keys(newRoadmap);

    for (let i = 0; i < days; i++) {
      const dayPlan = [];
      const topicIndex = i % topics.length;
      const topic = topics[topicIndex];
      const topicItems = newRoadmap[topic];
      const itemCount = Math.min(3, topicItems.length);

      for (let j = 0; j < itemCount; j++) {
        if (topicItems[j]) {
          dayPlan.push(topicItems[j]);
        }
      }

      fallbackPlan.push(dayPlan);
    }

    return fallbackPlan;
  };

  const toggleTaskCompletion = (dayIndex, itemIndex) => {
    const taskId = `${dayIndex}-${itemIndex}`;
    setCompletedTasks(prev => ({
      ...prev,
      [taskId]: !prev[taskId]
    }));
  };

  const calculateProgress = () => {
    if (!studyPlan) return 0;

    const totalTasks = studyPlan.reduce((acc, day) => acc + day.length, 0);
    const completedCount = Object.values(completedTasks).filter(Boolean).length;

    return (completedCount / totalTasks) * 100;
  };

  const isCurrentDay = (dayIndex) => {
    if (!studyPlan) return false;
    const progress = calculateProgress();
    const daysCompleted = Math.floor((progress / 100) * studyPlan.length);
    return dayIndex === daysCompleted;
  };

  const toggleDayExpansion = (dayIndex) => {
    setExpandedDays(prev => ({
      ...prev,
      [dayIndex]: !prev[dayIndex]
    }));
  };

  const openResourceInApp = (link, type) => {
    if (type === 'video') {
      // Navigate to video player page with the video URL
      navigate(`/plan/plandetails/${studyPlanId}/video`, {
        state: {
          videoUrl: link,
          from: location.pathname // Pass current path for return navigation
        }
      });
    } else {
      // Open documentation URLs in a new window
      window.open(link, '_blank');
    }
  };

  const [loadingSaveStudyPlan, setLoadingSaveStudyPlan] = useState(false);

  const saveStudyPlan = async (data) => {
    if (!userDetail?.id) {
      toast.info("You have to login first!");
      return;
    }

    try {
      setLoadingSaveStudyPlan(true);
      const response = await fetch(SummaryApi.addUserStudyPlan.url, {
        method: SummaryApi.addUserStudyPlan.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: userDetail?.id,
          name: roadmap,
          planDetails: data
        }),
      });

      const dataResponse = await response.json();
      if (dataResponse?.success) {
        setStudyPlanId(dataResponse?.id);
        toast.success("Study Plan Saved Successfully!");
      }
    } catch (error) {
      console.error('Error during save:', error);
      toast.error("Failed to save study plan");
    } finally {
      setLoadingSaveStudyPlan(false);
    }
  }

  console.log("idddd : ", studyPlanId)

  const [loadingSavePlans, setLoadingSavePlans] = useState(false);

  const savePlans = async () => {
    if (!userDetail?.id) {
      toast.info("You have to login first!");
      return;
    }

    try {
      const plans = {
        planid: studyPlanId,
        name: userDetail?.username,
        description: roadmap,
        course: roadmap,
        level: level,
        days: days,
      };

      setLoadingSavePlans(true);
      const response = await fetch(SummaryApi.addUserPlans.url, {
        method: SummaryApi.addUserPlans.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: userDetail?.id,
          name: roadmap,
          plans: plans,
          userPlanId: studyPlanId
        }),
      });

      const dataResponse = await response.json();
    } catch (error) {
      console.error('Error during save:', error);
      toast.error("Failed to save study plan");
    } finally {
      setLoadingSavePlans(false);
    }
  }

  console.log(id);

  useEffect(() => {
    getUserPlans();
  }, [userDetail?.id])

  const [loadingGetPlans, setLoadingGetPlans] = useState(false);
  const getUserPlans = async () => {

    try {

      setLoadingGetPlans(true);
      const response = await fetch(SummaryApi.getUserPlans.url, {
        method: SummaryApi.getUserPlans.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userid: userDetail?.id,
        }),
      });

      const dataResponse = await response.json();
      if (dataResponse?.success) {
        setStudyPlans(dataResponse?.data);
        console.log("plans : ", dataResponse?.data);
      }
    } catch (error) {
      console.error('Error during save:', error);
      toast.error("Failed to save study plan");
    } finally {
      setLoadingGetPlans(false);
    }
  }

  const location = useLocation();

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const scrollTo = searchParams.get('scrollTo');

    if (scrollTo) {
      setTimeout(() => {
        const element = document.getElementById(scrollTo);
        if (element) {
          element.style.scrollMarginTop = '80px'; // Header height
          element.scrollIntoView({ behavior: 'smooth' });

        }
      }, 100);
    }
  }, [location.search]);

  return (
    <div className={`min-h-screen pt-20 ${theme === 'light' ? 'bg-purple-50' : 'bg-gray-900'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {!showRoadmapGenerator ? (
          <>
            <div className="mb-16">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
                <h1 className={`text-3xl sm:text-4xl font-bold ${theme === 'light' ? 'text-purple-900' : 'text-white'}`}>
                  Your Study Dashboard
                </h1>
                <div className="flex items-center space-x-4">
                  <span className={`text-sm sm:text-base ${theme === 'light' ? 'text-purple-700' : 'text-gray-300'}`}>
                    Welcome back, {userDetail?.username}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className={`rounded-xl p-6 ${theme === 'light'
                  ? 'bg-white border border-purple-100 shadow-sm'
                  : 'bg-gray-800 border-gray-700'}`}>
                  <h2 className={`text-xl font-semibold mb-4 ${theme === 'light' ? 'text-purple-800' : 'text-white'}`}>
                    Study Overview
                  </h2>
                  {studyPlans.length > 0 ? (
                    <div className="space-y-4">
                      {studyPlans.map((plan) => {
                        const progressPercentage = Math.floor(Math.random() * (30 - 10 + 1)) + 10;
                        const formattedStartDate = plan?.plans?.startDate
                          ? format(plan.plans.startDate, 'MMM d, yyyy')
                          : 'Not started';
                        const hasNextSession = false; // You can add logic to calculate this

                        return (
                          <div
                            key={plan._id}
                            className={`rounded-lg p-6 transition-all duration-200 ${theme === 'light'
                              ? 'bg-purple-50 border border-purple-100 hover:bg-purple-100'
                              : 'bg-gray-700 hover:bg-gray-600'
                              }`}
                          >
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-2">
                              <h3 className={`text-lg sm:text-xl font-semibold ${theme === 'light' ? 'text-purple-900' : 'text-white'
                                }`}>
                                {plan.name}
                              </h3>
                              <span className={`text-sm sm:text-base ${theme === 'light' ? 'text-purple-700' : 'text-gray-300'
                                }`}>
                                {progressPercentage}% Complete
                              </span>
                            </div>
                            <div className={`w-full rounded-full h-2 mb-4 ${theme === 'light' ? 'bg-purple-200' : 'bg-gray-600'
                              }`}>
                              <div
                                className={`rounded-full h-2 transition-all duration-300 ${theme === 'light' ? 'bg-purple-600' : 'bg-purple-400'
                                  }`}
                                style={{ width: `${progressPercentage}%` }}
                              />
                            </div>
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between text-sm gap-4">
                              <div className="space-y-1">
                                <div className={theme === 'light' ? 'text-purple-700' : 'text-gray-300'}>
                                  Started {formattedStartDate}
                                </div>
                                <div className={theme === 'light' ? 'text-purple-700' : 'text-gray-300'}>
                                  Next session: {hasNextSession ? 'Set' : 'Not Set'}
                                </div>
                              </div>
                              <button
                                onClick={() => navigate(`/plan/plandetails/${plan?.userPlanId}`)}
                                className={`px-4 py-2 rounded-lg transition-colors flex items-center justify-center ${theme === 'light'
                                  ? 'bg-purple-100 text-purple-800 hover:bg-purple-200'
                                  : 'bg-gray-600 text-white hover:bg-gray-500'
                                  }`}
                              >
                                View Details
                                <ChevronRight className="w-4 h-4 ml-2" />
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className={`text-center py-8 ${theme === 'light' ? 'text-purple-700' : 'text-gray-400'}`}>
                      <p className="mb-4">No study plans created yet</p>
                      <button
                        onClick={() => setShowRoadmapGenerator(true)}
                        className={`px-4 py-2 rounded-lg transition-colors flex items-center mx-auto ${theme === 'light'
                          ? 'bg-purple-600 text-white hover:bg-purple-700'
                          : 'bg-purple-500 text-white hover:bg-purple-600'
                          }`}
                      >
                        <Plus className="w-5 h-5 mr-2" />
                        Create Your First Plan
                      </button>
                    </div>
                  )}
                </div>

                <div className={`rounded-xl p-6 ${theme === 'light'
                  ? 'bg-white border border-purple-100 shadow-sm'
                  : 'bg-gray-800 border-gray-700'}`}>
                  <h2 className={`text-xl font-semibold mb-4 ${theme === 'light' ? 'text-purple-800' : 'text-white'}`}>
                    Quick Actions
                  </h2>
                  <div className="grid grid-cols-1 gap-4">
                    <button
                      onClick={() => setShowRoadmapGenerator(true)}
                      className={`flex items-center justify-between px-6 py-4 rounded-lg transition-colors ${theme === 'light'
                        ? 'bg-purple-50 text-purple-800 hover:bg-purple-100 border border-purple-100'
                        : 'bg-gray-700 text-white hover:bg-gray-600 border-gray-600'
                        }`}
                    >
                      <div className="flex items-center">
                        <BookOpen className="w-5 h-5 mr-3" />
                        <span>Generate Tech Roadmap</span>
                      </div>
                      <ChevronRight className="w-5 h-5" />
                    </button>
                    {/* <button
                      onClick={() => setShowCreatePlan(true)}
                      className={`flex items-center justify-between px-6 py-4 rounded-lg transition-colors ${theme === 'light'
                        ? 'bg-purple-50 text-purple-800 hover:bg-purple-100 border border-purple-100'
                        : 'bg-gray-700 text-white hover:bg-gray-600 border-gray-600'
                        }`}
                    >
                      <div className="flex items-center">
                        <Plus className="w-5 h-5 mr-3" />
                        <span>Create Custom Plan</span>
                      </div>
                      <ChevronRight className="w-5 h-5" />
                    </button> */}
                  </div>
                </div>
              </div>
            </div>

            <div id="features">
              <h2 className={`text-3xl font-bold text-center mb-12 ${theme === 'light' ? 'text-purple-900' : 'text-white'}`}>
                Everything You Need to Excel
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[
                  {
                    icon: <Calendar className="w-8 h-8" />,
                    title: "Personalized Study Plans",
                    description: "Get customized study schedules based on your preferences, priorities, and learning style."
                  },
                  {
                    icon: <BarChart2 className="w-8 h-8" />,
                    title: "Progress Tracking",
                    description: "Visualize your study journey with interactive dashboards showing tasks completed and time spent studying."
                  },
                  {
                    icon: <Trophy className="w-8 h-8" />,
                    title: "Achievements & Rewards",
                    description: "Earn badges and points for reaching milestones, maintaining consistency, and showing exceptional progress."
                  },
                  {
                    icon: <Users className="w-8 h-8" />,
                    title: "Community Learning",
                    description: "Connect with peers, share resources, and collaborate in study groups to enhance your learning experience."
                  },
                  {
                    icon: <Clock className="w-8 h-8" />,
                    title: "Smart Scheduling",
                    description: "Automatically generate optimal study schedules that adapt to your calendar and learning preferences."
                  },
                  {
                    icon: <Laptop className="w-8 h-8" />,
                    title: "Resource Integration",
                    description: "Access a curated list of learning resources such as documents, articles, and videos aligned with your topics."
                  }
                ].map((feature, index) => (
                  <div
                    key={index}
                    className={`rounded-xl p-6 transition-all duration-200 ${theme === 'light'
                      ? 'bg-white border border-purple-100 hover:shadow-md hover:border-purple-200'
                      : 'bg-gray-800 border-gray-700 hover:border-gray-600'
                      }`}
                  >
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-4 ${theme === 'light' ? 'bg-purple-100' : 'bg-gray-700'}`}>
                      {React.cloneElement(feature.icon, {
                        className: `w-6 h-6 ${theme === 'light' ? 'text-purple-600' : 'text-white'}`
                      })}
                    </div>
                    <h3 className={`text-lg font-semibold mb-2 ${theme === 'light' ? 'text-purple-800' : 'text-white'}`}>
                      {feature.title}
                    </h3>
                    <p className={`text-sm ${theme === 'light' ? 'text-purple-700' : 'text-gray-300'}`}>
                      {feature.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div id="tech-stacks">
              <h2 className={`text-3xl font-bold text-center mb-12 mt-12 ${theme === 'light' ? 'text-purple-900' : 'text-white'}`}>
                Tech Stack & Courses Offered
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[
                  {
                    icon: <GitMerge className="w-8 h-8" />,
                    title: "Open Source",
                    description: "Learn collaborative development, version control, and community-driven project contributions."
                  },
                  {
                    icon: <Smartphone className="w-8 h-8" />,
                    title: "Android Development",
                    description: "Master Kotlin, Jetpack Compose, and build modern Android applications with best practices."
                  },
                  {
                    icon: <Apple className="w-8 h-8" />,
                    title: "iOS Development",
                    description: "Develop iOS apps using SwiftUI, UIKit, and explore Apple's ecosystem and frameworks."
                  },
                  {
                    icon: <Layout className="w-8 h-8" />,
                    title: "Frontend Development",
                    description: "Learn React, Vue, Angular, and modern JavaScript frameworks for building interactive UIs."
                  },
                  {
                    icon: <Server className="w-8 h-8" />,
                    title: "Backend Development",
                    description: "Build scalable servers with Node.js, Django, Spring Boot, and database management systems."
                  },
                  {
                    icon: <Database className="w-8 h-8" />,
                    title: "Data Science",
                    description: "Explore Python, R, machine learning, data visualization, and statistical analysis techniques."
                  },
                  {
                    icon: <Settings className="w-8 h-8" />,
                    title: "DevOps",
                    description: "Master CI/CD pipelines, containerization with Docker, Kubernetes, and cloud infrastructure."
                  },
                  {
                    icon: <Mic className="w-8 h-8" />,
                    title: "DevRel",
                    description: "Learn developer advocacy, technical writing, community building, and developer marketing."
                  }
                ].map((feature, index) => (
                  <div
                    key={index}
                    className={`rounded-xl p-6 transition-all duration-200 ${theme === 'light'
                      ? 'bg-white border border-purple-100 hover:shadow-md hover:border-purple-200'
                      : 'bg-gray-800 border-gray-700 hover:border-gray-600'
                      }`}
                  >
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-4 ${theme === 'light' ? 'bg-purple-100' : 'bg-gray-700'}`}>
                      {React.cloneElement(feature.icon, {
                        className: `w-6 h-6 ${theme === 'light' ? 'text-purple-600' : 'text-white'}`
                      })}
                    </div>
                    <h3 className={`text-lg font-semibold mb-2 ${theme === 'light' ? 'text-purple-800' : 'text-white'}`}>
                      {feature.title}
                    </h3>
                    <p className={`text-sm ${theme === 'light' ? 'text-purple-700' : 'text-gray-300'}`}>
                      {feature.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </>
        ) : (
          <div className="space-y-8">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
              <h1 className={`text-2xl sm:text-3xl font-bold ${theme === 'light' ? 'text-purple-900' : 'text-white'}`}>
                Learning Roadmap Generator
              </h1>
              <button
                onClick={() => setShowRoadmapGenerator(false)}
                className={`px-4 py-2 rounded-lg transition-colors flex items-center ${theme === 'light'
                  ? 'bg-purple-100 text-purple-800 hover:bg-purple-200'
                  : 'bg-gray-700 text-white hover:bg-gray-600'
                  }`}
              >
                <ChevronLeft className="w-5 h-5 mr-1" />
                Back to Dashboard
              </button>
            </div>

            <div className={`rounded-xl p-6 ${theme === 'light'
              ? 'bg-white border border-purple-100 shadow-sm'
              : 'bg-gray-800 border-gray-700'}`}>
              <h2 className={`text-xl font-semibold mb-6 ${theme === 'light' ? 'text-purple-800' : 'text-white'}`}>
                Generate Your Custom Roadmap
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <label className={`block text-sm font-medium mb-2 ${theme === 'light' ? 'text-purple-700' : 'text-gray-300'}`}>
                    Tech Stack
                  </label>
                  <select
                    value={roadmap}
                    onChange={(e) => setRoadmap(e.target.value)}
                    className={`w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 ${theme === 'light'
                      ? 'bg-white border-purple-200 text-purple-900 focus:border-purple-500 focus:ring-purple-200'
                      : 'bg-gray-700 border-gray-600 text-white focus:border-purple-400 focus:ring-gray-600'
                      }`}
                  >
                    <option value="openSource">Open Source</option>
                    <option value="androidDevelopment">Android Development</option>
                    <option value="iOSDevelopment">iOS Development</option>
                    <option value="frontendDevelopment">Frontend Development</option>
                    <option value="backendDevelopment">Backend Development</option>
                    <option value="dataScience">Data Science</option>
                    <option value="devops">DevOps</option>
                    <option value="devRel">DevRel</option>
                  </select>
                </div>

                <div>
                  <label className={`block text-sm font-medium mb-2 ${theme === 'light' ? 'text-purple-700' : 'text-gray-300'}`}>
                    Proficiency Level
                  </label>
                  <select
                    value={level}
                    onChange={(e) => setLevel(e.target.value)}
                    className={`w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 ${theme === 'light'
                      ? 'bg-white border-purple-200 text-purple-900 focus:border-purple-500 focus:ring-purple-200'
                      : 'bg-gray-700 border-gray-600 text-white focus:border-purple-400 focus:ring-gray-600'
                      }`}
                  >
                    <option value="beginner">Beginner</option>
                    <option value="intermediate">Intermediate</option>
                    <option value="advance">Advanced</option>
                  </select>
                </div>

                <div>
                  <label className={`block text-sm font-medium mb-2 ${theme === 'light' ? 'text-purple-700' : 'text-gray-300'}`}>
                    Duration (days)
                  </label>
                  <input
                    type="number"
                    value={days}
                    onChange={(e) => setDays(parseInt(e.target.value) || 1)}
                    min="1"
                    className={`w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 ${theme === 'light'
                      ? 'bg-white border-purple-200 text-purple-900 focus:border-purple-500 focus:ring-purple-200'
                      : 'bg-gray-700 border-gray-600 text-white focus:border-purple-400 focus:ring-gray-600'
                      }`}
                  />
                </div>

                <div className="flex items-end">
                  <button
                    onClick={generateStudyPlan}
                    disabled={loading}
                    className={`w-full px-4 py-2 rounded-lg transition-colors focus:outline-none focus:ring-2 ${theme === 'light'
                      ? 'bg-purple-600 text-white hover:bg-purple-700 focus:ring-purple-300 disabled:bg-purple-300'
                      : 'bg-purple-500 text-white hover:bg-purple-600 focus:ring-purple-800 disabled:bg-gray-600'
                      }`}
                  >
                    {loading ? (
                      <span className="flex items-center justify-center">
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Generating...
                      </span>
                    ) : 'Generate Plan'}
                  </button>
                </div>
              </div>
            </div>

            {error && (
              <div className={`rounded-xl p-4 ${theme === 'light' ? 'bg-red-50 border border-red-200' : 'bg-red-900 bg-opacity-20 border-red-800'}`}>
                <p className={`flex items-center ${theme === 'light' ? 'text-red-800' : 'text-red-200'}`}>
                  <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd"></path>
                  </svg>
                  {error}
                </p>
              </div>
            )}

            {studyPlan && (
              <div className="space-y-6">
                <div className={`rounded-xl p-6 ${theme === 'light'
                  ? 'bg-white border border-purple-100 shadow-sm'
                  : 'bg-gray-800 border-gray-700'}`}>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4">
                    <h2 className={`text-lg font-semibold ${theme === 'light' ? 'text-purple-800' : 'text-white'}`}>
                      Your Progress
                    </h2>
                    <span className={`text-sm ${theme === 'light' ? 'text-purple-600' : 'text-gray-300'}`}>
                      {Math.round(calculateProgress())}% Complete
                    </span>
                  </div>
                  <div className={`w-full rounded-full h-3 ${theme === 'light' ? 'bg-purple-100' : 'bg-gray-700'}`}>
                    <div
                      className={`h-3 rounded-full transition-all duration-500 ${theme === 'light' ? 'bg-purple-600' : 'bg-purple-400'}`}
                      style={{ width: `${calculateProgress()}%` }}
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  {studyPlan.map((dayPlan, dayIndex) => (
                    <div
                      key={dayIndex}
                      className={`rounded-xl overflow-hidden transition-all duration-200 ${isCurrentDay(dayIndex) ? 'ring-2 ring-purple-500' : ''} ${theme === 'light'
                        ? 'bg-white border border-purple-100 hover:shadow-md'
                        : 'bg-gray-800 border-gray-700 hover:border-gray-600'
                        }`}
                    >
                      <div
                        className="p-6 cursor-pointer"
                        onClick={() => toggleDayExpansion(dayIndex)}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <span className={`mr-3 flex h-6 w-6 items-center justify-center rounded-full text-sm font-medium ${isCurrentDay(dayIndex)
                              ? 'bg-purple-100 text-purple-800'
                              : theme === 'light'
                                ? 'bg-gray-100 text-gray-800'
                                : 'bg-gray-700 text-gray-300'
                              }`}>
                              {dayIndex + 1}
                            </span>
                            <h3 className={`text-lg font-medium ${theme === 'light' ? 'text-purple-900' : 'text-white'}`}>
                              Day {dayIndex + 1}
                            </h3>
                          </div>
                          {expandedDays[dayIndex] ? (
                            <ChevronUp className={`w-5 h-5 ${theme === 'light' ? 'text-purple-600' : 'text-gray-400'}`} />
                          ) : (
                            <ChevronDown className={`w-5 h-5 ${theme === 'light' ? 'text-purple-600' : 'text-gray-400'}`} />
                          )}
                        </div>
                      </div>

                      {expandedDays[dayIndex] && (
                        <div className={`border-t ${theme === 'light' ? 'border-purple-100' : 'border-gray-700'}`}>
                          <ul className="divide-y divide-purple-100">
                            {dayPlan.map((item, itemIndex) => {
                              const taskId = `${dayIndex}-${itemIndex}`;
                              const isCompleted = completedTasks[taskId];

                              return (
                                <li
                                  key={itemIndex}
                                  className={`p-4 ${theme === 'light'
                                    ? isCompleted
                                      ? 'bg-green-50'
                                      : 'hover:bg-purple-50'
                                    : isCompleted
                                      ? 'bg-gray-700'
                                      : 'hover:bg-gray-700'
                                    }`}
                                >
                                  <div className="flex items-start">
                                    <button
                                      onClick={() => toggleTaskCompletion(dayIndex, itemIndex)}
                                      className="mt-0.5 mr-3 focus:outline-none"
                                    >
                                      {isCompleted ? (
                                        <CheckCircle2 className="w-5 h-5 text-green-500" />
                                      ) : (
                                        <Circle className={`w-5 h-5 ${theme === 'light' ? 'text-purple-300' : 'text-gray-500'}`} />
                                      )}
                                    </button>
                                    <div className="flex-1 min-w-0">
                                      <div className="flex items-center justify-between">
                                        <button
                                          onClick={() => openResourceInApp(item.link, item.type)}
                                          className={`text-left text-sm font-medium truncate ${isCompleted
                                            ? theme === 'light'
                                              ? 'text-purple-400 line-through'
                                              : 'text-gray-500 line-through'
                                            : theme === 'light'
                                              ? 'text-purple-700 hover:text-purple-900'
                                              : 'text-white hover:text-gray-300'
                                            }`}
                                        >
                                          {item.description}
                                        </button>
                                        <BookOpen
                                          className={`ml-2 w-4 h-4 flex-shrink-0 ${theme === 'light'
                                            ? 'text-purple-400'
                                            : 'text-gray-500'
                                            }`}
                                        />
                                      </div>
                                      <div className={`mt-1 flex flex-wrap gap-2 text-xs ${theme === 'light'
                                        ? 'text-purple-600'
                                        : 'text-gray-400'
                                        }`}>
                                        <span className={`px-2 py-0.5 rounded ${theme === 'light'
                                          ? 'bg-purple-100'
                                          : 'bg-gray-700'
                                          }`}>
                                          {item.duration}
                                        </span>
                                        <span className={`px-2 py-0.5 rounded capitalize ${theme === 'light'
                                          ? 'bg-purple-100'
                                          : 'bg-gray-700'
                                          }`}>
                                          {item.type}
                                        </span>
                                      </div>
                                    </div>
                                  </div>
                                </li>
                              );
                            })}
                          </ul>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;