import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronLeft, Clock, Calendar, BarChart2, CheckCircle2, Circle } from 'lucide-react';
import { format } from 'date-fns';
import { useTheme } from '../../context/theme-context';

const StudyPlanDetails = () => {
  const { planId } = useParams();
  const navigate = useNavigate();
  const { theme } = useTheme();
  const [plan, setPlan] = useState(null);

  useEffect(() => {
    // In a real app, fetch from API/database
    const mockPlan = {
      id: planId || '',
      name: 'Advanced Mathematics Study Plan',
      startDate: new Date(),
      duration: 30,
      subjects: ['Calculus', 'Linear Algebra', 'Statistics'],
      progress: 35,
      nextSession: new Date(),
      tasks: [
        {
          id: '1',
          title: 'Complete Calculus Chapter 1 Exercises',
          completed: false,
          dueDate: new Date(Date.now() + 86400000),
          category: 'Calculus'
        },
        {
          id: '2',
          title: 'Review Linear Algebra Fundamentals',
          completed: true,
          dueDate: new Date(Date.now() + 172800000),
          category: 'Linear Algebra'
        },
        {
          id: '3',
          title: 'Practice Statistics Problems',
          completed: false,
          dueDate: new Date(Date.now() + 259200000),
          category: 'Statistics'
        }
      ]
    };
    setPlan(mockPlan);
  }, [planId]);

  const toggleTask = (taskId) => {
    if (!plan) return;

    const updatedTasks = plan.tasks.map(task =>
      task.id === taskId ? { ...task, completed: !task.completed } : task
    );

    const completedTasks = updatedTasks.filter(task => task.completed).length;
    const newProgress = Math.round((completedTasks / updatedTasks.length) * 100);

    setPlan({
      ...plan,
      tasks: updatedTasks,
      progress: newProgress
    });
  };

  if (!plan) return null;

  return (
    <div className={`min-h-screen pt-20 ${theme === 'light' ? 'bg-purple-50' : 'bg-black'}`}>
      <div className="max-w-7xl mx-auto px-4 py-12">
        <button
          onClick={() => navigate('/dashboard')}
          className={`flex items-center mb-8 transition-colors ${theme === 'light' ? 'text-purple-600 hover:text-purple-800' : 'text-gray-400 hover:text-white'
            }`}
        >
          <ChevronLeft className="w-5 h-5 mr-2" />
          Back to Dashboard
        </button>

        <div className={`rounded-2xl p-8 mb-8 ${theme === 'light'
            ? 'bg-white border border-purple-100 shadow-sm'
            : 'bg-gray-900'
          }`}>
          <div className="flex justify-between items-start mb-6">
            <div>
              <h1 className={`text-3xl font-bold mb-2 ${theme === 'light' ? 'text-purple-900' : 'text-white'
                }`}>
                {plan.name}
              </h1>
              <div className={`flex items-center ${theme === 'light' ? 'text-purple-700' : 'text-gray-400'
                }`}>
                <Calendar className="w-4 h-4 mr-2" />
                <span>Started {format(plan.startDate, 'MMM d, yyyy')}</span>
                <span className="mx-2">•</span>
                <Clock className="w-4 h-4 mr-2" />
                <span>{plan.duration} days duration</span>
              </div>
            </div>
            <div className="text-right">
              <div className={`text-2xl font-bold mb-1 ${theme === 'light' ? 'text-purple-800' : 'text-white'
                }`}>
                {plan.progress}%
              </div>
              <div className={theme === 'light' ? 'text-purple-700' : 'text-gray-400'}>
                Overall Progress
              </div>
            </div>
          </div>

          <div className={`w-full rounded-full h-3 mb-8 ${theme === 'light' ? 'bg-purple-200' : 'bg-gray-800'
            }`}>
            <div
              className={`rounded-full h-3 transition-all duration-300 ${theme === 'light' ? 'bg-purple-600' : 'bg-white'
                }`}
              style={{ width: `${plan.progress}%` }}
            />
          </div>

          <div className="grid grid-cols-3 gap-6 mb-8">
            {[
              {
                label: 'Next Session',
                value: format(plan.nextSession, 'MMM d, h:mm a'),
                icon: <Clock className="w-4 h-4 mr-2" />
              },
              {
                label: 'Tasks Completed',
                value: `${plan.tasks.filter(t => t.completed).length} / ${plan.tasks.length}`,
                icon: <CheckCircle2 className="w-4 h-4 mr-2" />
              },
              {
                label: 'Subjects',
                value: `${plan.subjects.length} Active`,
                icon: <BarChart2 className="w-4 h-4 mr-2" />
              }
            ].map((stat, index) => (
              <div
                key={index}
                className={`rounded-xl p-6 ${theme === 'light'
                    ? 'bg-purple-50 border border-purple-100'
                    : 'bg-gray-800'
                  }`}
              >
                <div className={`mb-2 flex items-center ${theme === 'light' ? 'text-purple-700' : 'text-gray-400'
                  }`}>
                  {stat.icon}
                  {stat.label}
                </div>
                <div className={`font-semibold ${theme === 'light' ? 'text-purple-900' : 'text-white'
                  }`}>
                  {stat.value}
                </div>
              </div>
            ))}
          </div>

          <div>
            <h2 className={`text-xl font-semibold mb-6 ${theme === 'light' ? 'text-purple-800' : 'text-white'
              }`}>
              Study Tasks
            </h2>
            <div className="space-y-4">
              {plan.tasks.map(task => (
                <div
                  key={task.id}
                  className={`rounded-xl p-6 flex items-center justify-between transition-all duration-200 ${theme === 'light'
                      ? 'bg-purple-50 border border-purple-100 hover:bg-purple-100'
                      : 'bg-gray-800 hover:bg-gray-750'
                    }`}
                >
                  <div className="flex items-center flex-1">
                    <button
                      onClick={() => toggleTask(task.id)}
                      className={`mr-4 transition-colors ${theme === 'light'
                          ? 'text-purple-600 hover:text-purple-800'
                          : 'text-white hover:text-gray-300'
                        }`}
                    >
                      {task.completed ? (
                        <CheckCircle2 className="w-6 h-6" />
                      ) : (
                        <Circle className="w-6 h-6" />
                      )}
                    </button>
                    <div>
                      <div className={`text-lg ${task.completed
                          ? theme === 'light'
                            ? 'text-purple-400 line-through'
                            : 'text-gray-400 line-through'
                          : theme === 'light'
                            ? 'text-purple-900'
                            : 'text-white'
                        }`}>
                        {task.title}
                      </div>
                      <div className={`text-sm ${theme === 'light' ? 'text-purple-600' : 'text-gray-400'
                        }`}>
                        Due {format(task.dueDate, 'MMM d')} • {task.category}
                      </div>
                    </div>
                  </div>
                  <div className={`px-3 py-1 rounded-full text-sm ${task.completed
                      ? theme === 'light'
                        ? 'bg-purple-600 text-white'
                        : 'bg-white text-black'
                      : theme === 'light'
                        ? 'bg-purple-100 text-purple-800'
                        : 'bg-gray-700 text-white'
                    }`}>
                    {task.completed ? 'Completed' : 'Pending'}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className={`rounded-2xl p-8 ${theme === 'light'
            ? 'bg-white border border-purple-100 shadow-sm'
            : 'bg-gray-900'
          }`}>
          <h2 className={`text-xl font-semibold mb-6 ${theme === 'light' ? 'text-purple-800' : 'text-white'
            }`}>
            Progress Analytics
          </h2>
          <div className="grid grid-cols-2 gap-6">
            <div className={`rounded-xl p-6 ${theme === 'light'
                ? 'bg-purple-50 border border-purple-100'
                : 'bg-gray-800'
              }`}>
              <h3 className={`font-semibold mb-4 ${theme === 'light' ? 'text-purple-900' : 'text-white'
                }`}>
                Subject Distribution
              </h3>
              <div className="flex items-center justify-between mb-4">
                {plan.subjects.map((subject, index) => (
                  <div key={subject} className="text-center">
                    <div className={`w-16 h-16 rounded-full mb-2 flex items-center justify-center ${theme === 'light' ? 'bg-purple-100' : 'bg-gray-700'
                      }`}>
                      <BarChart2 className={`w-8 h-8 ${theme === 'light' ? 'text-purple-600' : 'text-white'
                        }`} />
                    </div>
                    <div className={`text-sm ${theme === 'light' ? 'text-purple-700' : 'text-gray-400'
                      }`}>
                      {subject}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className={`rounded-xl p-6 ${theme === 'light'
                ? 'bg-purple-50 border border-purple-100'
                : 'bg-gray-800'
              }`}>
              <h3 className={`font-semibold mb-4 ${theme === 'light' ? 'text-purple-900' : 'text-white'
                }`}>
                Weekly Progress
              </h3>
              <div className="h-32 flex items-end justify-between">
                {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, i) => (
                  <div key={day} className="flex flex-col items-center">
                    <div
                      className={`w-8 rounded-t ${theme === 'light' ? 'bg-purple-200' : 'bg-gray-700'
                        }`}
                      style={{ height: `${Math.random() * 100}%` }}
                    />
                    <div className={`mt-2 text-sm ${theme === 'light' ? 'text-purple-700' : 'text-gray-400'
                      }`}>
                      {day}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudyPlanDetails;