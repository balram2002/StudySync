import React, { useContext, useEffect, useState } from 'react'
import SummaryApi from '../../lib/apiUrls';
import { UserDetailContext } from '../../context/UserDetailContext';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { BookOpen, CheckCircle2, ChevronDown, ChevronUp, Circle } from 'lucide-react';
import { useTheme } from '../../context/theme-context';
import { openSourceRoadmap as openSourceRoadmapData, iOSDevelopmentRoadmap, frontendDevelopmentRoadmap, backendDevlopmentRoadmap, androidDevelopmentRoadmap, devRelRoadmap, dataScienceRoadmap, devopsRoadmap } from '../Dashboard/data';

const PlanDetails = () => {
    const { userDetail } = useContext(UserDetailContext);
    const [studyPlan, setStudyPlan] = useState(null);
    const navigate = useNavigate();
    const { id } = useParams();
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
    const [studyPlanId, setStudyPlanId] = useState();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [rawResponse, setRawResponse] = useState(null);
    const [completedTasks, setCompletedTasks] = useState(() => {
        const saved = localStorage.getItem('completedTasks');
        return saved ? JSON.parse(saved) : {};
    });
    const [expandedDays, setExpandedDays] = useState({});
    const newRoadmap = selectroadmap[roadmap];

    useEffect(() => {
        getPlanDetails();
    }, [id])

    const [loadingGetPlanDetails, setLoadingGetPlanDetails] = useState(false);
    const getPlanDetails = async () => {

        try {

            setLoadingGetPlanDetails(true);
            const response = await fetch(SummaryApi.getPlanDetails.url, {
                method: SummaryApi.getPlanDetails.method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    userid: userDetail?.id, planId: id
                }),
            });

            const dataResponse = await response.json();
            if (dataResponse?.success) {
                console.log("Plan Details :: ", dataResponse?.data?.planDetails)
                setStudyPlan(dataResponse?.data?.planDetails);
                console.log("plans : ", dataResponse?.data);
            }
            setStudyPlan(dataResponse?.data?.planDetails);
        } catch (error) {
            console.error('Error during save:', error);
            toast.error("Failed to save study plan");
        } finally {
            setLoadingGetPlanDetails(false);
        }
    }

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

    return (
        <>
            <div className={`min-h-screen pt-20 ${theme === 'light' ? 'bg-purple-50' : 'bg-gray-900'}`}>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
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
                    </div>


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
            </div>
        </>
    )
}

export default PlanDetails