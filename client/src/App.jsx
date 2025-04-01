import { useEffect, useState } from 'react'
import './App.css'
import { OnboardingProvider } from './context/OnboardingContext'
import { Navigate, Route, Routes, BrowserRouter } from 'react-router-dom'
import Header from './components/Header';
import LandingPage from './Pages/Home/LandingPage';
import OnboardingSteps from './Pages/OnBoarding/OnboardingSteps';
import Dashboard from './Pages/Dashboard/Dashboard';
import StudyPlanDetails from './Pages/StudyPlanDetails/StudyPlanDetails';
import { ThemeProvider } from './context/theme-context';
import LoadingBar from 'react-top-loading-bar';
import { ToastContainer } from 'react-toastify';
import { ValuesContext } from './context/ValuesContext';
import SignInPage from './Pages/auth/SignIn.Page';
import SignUpPage from './Pages/auth/SignUpPage';
import { useUser } from '@clerk/clerk-react';
import { UserDetailContext } from './context/UserDetailContext';
import PlanDetails from './Pages/PlanDetails/PlanDetails';
import VideoPlayer from './Pages/Video/VideoPlayer';

function App() {
  const { user } = useUser();
  const [count, setCount] = useState(0);
  const [progress, setProgress] = useState(0);
  const [userDetail, setUserDetail] = useState(user);

  useEffect(() => {
    setUserDetail(user);
  }, [user])

  return (
    <>
      <OnboardingProvider>
        <ThemeProvider>
          <ValuesContext.Provider value={{ setProgress, progress }}>
            <UserDetailContext.Provider value={{ userDetail, setUserDetail }}>
              <LoadingBar
                color='#A855F7'
                progress={progress}
                onLoaderFinished={() => setProgress(0)}
                height={2.7}
              />
              <BrowserRouter>
                <div className="min-h-screen bg-black">
                  <Header />
                  <ToastContainer
                    position="top-center"
                    autoClose={3000}
                    hideProgressBar={false}
                    newestOnTop={true}
                    closeOnClick
                    pauseOnFocusLoss
                    draggable
                    pauseOnHover
                    draggablePercent={60}
                    theme={"dark"}
                  />
                  <Routes>
                    <Route path="/" element={<LandingPage />} />
                    <Route path="/onboarding" element={<OnboardingSteps />} />
                    <Route path="/dashboard/:id" element={<Dashboard />} />
                    <Route path="/plan/plandetails/:id" element={<PlanDetails />} />
                    <Route path="/plan/plandetails/:id/video" element={<VideoPlayer />} />
                    <Route path="/study-plan/:planId" element={<StudyPlanDetails />} />
                    <Route path="/sign-in" element={<SignInPage />} />
                    <Route path="/sign-up" element={<SignUpPage />} />
                    <Route path="*" element={<Navigate to="/" replace />} />
                  </Routes>
                </div>
              </BrowserRouter>
            </UserDetailContext.Provider>
          </ValuesContext.Provider>
        </ThemeProvider>
      </OnboardingProvider>
    </>
  )
}

export default App