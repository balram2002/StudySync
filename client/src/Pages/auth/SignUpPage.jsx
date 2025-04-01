import { SignUp } from '@clerk/clerk-react'
import React from 'react'
import { BackgroundBeamsWithCollision } from './../../components/ui/background-beams-with-collision';
import { Helmet } from "react-helmet";
import { useTheme } from '../../context/theme-context';
import { BackgroundLines } from '../../components/ui/background-lines';

const SignUpPage = () => {
    const { theme } = useTheme();

    const clerkAppearance = {
        elements: {
            rootBox: "w-full max-w-lg mx-auto",
            card: theme === 'light'
                ? "bg-white border border-gray-200 shadow-lg"
                : "bg-gray-900 border-gray-800",
            headerTitle: theme === 'light' ? "text-gray-900" : "text-white",
            headerSubtitle: theme === 'light' ? "text-gray-600" : "text-gray-400",
            formFieldLabel: theme === 'light' ? "text-gray-700" : "text-gray-300",
            formFieldInput: theme === 'light'
                ? "bg-white border-gray-300 focus:border-purple-500"
                : "bg-gray-800 border-gray-700 focus:border-white",
            formButtonPrimary: theme === 'light'
                ? "bg-purple-600 hover:bg-purple-700"
                : "bg-white text-black hover:bg-gray-100",
            footerActionText: theme === 'light' ? "text-gray-600" : "text-gray-400",
            footerActionLink: theme === 'light'
                ? "text-purple-600 hover:text-purple-800"
                : "text-white hover:text-gray-300"
        }
    };

    return (
        <>
            <Helmet>
                <title>Signup | StudySync</title>
                <meta name="description" content="Create your StudySync account" />
            </Helmet>

            <div className={`fixed inset-0 flex flex-col ${theme === 'light' ? 'bg-white' : 'bg-black'}`}>
                {/* This ensures content stays below any existing header */}
                <div className="flex-1 overflow-y-scroll">
                    <BackgroundLines className={`flex items-center justify-center min-h-fit w-full px-4 ${theme === 'light' ? 'bg-purple-50' : 'bg-gray-950'
                        }`}>
                        <div className="relative flex min-h-full items-center justify-center p-4">
                            <div className="w-full max-w-lg py-12 pt-24">
                                <SignUp
                                    appearance={clerkAppearance}
                                    path="/sign-up"
                                    routing="path"
                                    signInUrl="/sign-in"
                                    afterSignUpUrl="/onboarding"
                                />
                            </div>
                        </div>
                    </BackgroundLines>
                </div>
            </div>
        </>
    )
}

export default SignUpPage