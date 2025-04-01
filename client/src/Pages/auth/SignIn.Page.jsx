import { SignIn } from '@clerk/clerk-react';
import React from 'react';
import { Helmet } from 'react-helmet';
import { BackgroundLines } from '../../components/ui/background-lines';
import { useTheme } from '../../context/theme-context';

const SignInPage = () => {
    const { theme } = useTheme();

    // Clerk appearance configuration with full theme support
    const clerkAppearance = {
        layout: {
            logoPlacement: 'inside',
            logoImageUrl: theme === 'light'
                ? '/logo-dark.svg'
                : '/logo-light.svg',
            socialButtonsPlacement: 'bottom',
            socialButtonsVariant: 'iconButton',
            termsPageUrl: '/terms',
            privacyPageUrl: '/privacy'
        },
        variables: {
            colorPrimary: theme === 'light' ? '#7c3aed' : '#ffffff',
            colorText: theme === 'light' ? '#1e1b4b' : '#f8fafc',
            colorTextSecondary: theme === 'light' ? '#4c1d95' : '#e2e8f0',
            colorBackground: theme === 'light' ? '#ffffff' : '#09090b',
            colorInputBackground: theme === 'light' ? '#ffffff' : '#18181b',
            colorInputText: theme === 'light' ? '#1e1b4b' : '#f8fafc',
        },
        elements: {
            // Root container
            rootBox: 'w-full max-w-md mx-auto animate-fade-in',

            // Card container
            card: `rounded-xl shadow-lg transition-all duration-300 ${theme === 'light'
                ? 'bg-white border border-purple-100'
                : 'bg-gray-900 border-gray-800'
                }`,

            // Header
            headerTitle: `text-2xl font-bold tracking-tight ${theme === 'light' ? 'text-purple-900' : 'text-white'
                }`,
            headerSubtitle: `mt-1 ${theme === 'light' ? 'text-purple-700' : 'text-gray-400'
                }`,

            // Social buttons
            socialButtonsBlockButton: `transition-colors ${theme === 'light'
                ? 'border-purple-200 hover:bg-purple-50 text-purple-800'
                : 'border-purple-200 hover:bg-purple-50 text-purple-800'
                }`,
            socialButtonsBlockButtonText: 'text-sm font-medium',
            socialButtonsBlockButtonArrow: 'text-current',

            // Divider
            dividerLine: theme === 'light' ? 'bg-purple-200' : 'bg-gray-700',
            dividerText: `text-xs uppercase tracking-wider ${theme === 'light' ? 'text-purple-600' : 'text-gray-500'
                }`,

            // Form fields
            formFieldLabel: `text-sm font-medium ${theme === 'light' ? 'text-purple-800' : 'text-gray-300'
                }`,
            formFieldInput: `rounded-lg transition-all ${theme === 'light'
                ? 'border-purple-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-200'
                : 'border-gray-700 focus:border-white focus:ring-2 focus:ring-gray-600'
                }`,
            formFieldInputShowPasswordButton: theme === 'light'
                ? 'text-purple-600 hover:text-purple-800'
                : 'text-gray-400 hover:text-white',

            // Buttons
            formButtonPrimary: `rounded-lg font-medium transition-colors ${theme === 'light'
                ? 'bg-purple-600 hover:bg-purple-700 shadow-sm'
                : 'bg-white text-black hover:bg-gray-100'
                }`,
            formButtonReset: `text-sm ${theme === 'light'
                ? 'text-purple-600 hover:text-purple-800'
                : 'text-gray-400 hover:text-white'
                }`,

            // Footer links
            footerActionText: theme === 'light' ? 'text-purple-700' : 'text-gray-400',
            footerActionLink: `font-medium ${theme === 'light'
                ? 'text-purple-600 hover:text-purple-800'
                : 'text-white hover:text-gray-300'
                }`,

            // Error states
            formFieldWarningText: 'text-yellow-600 text-xs mt-1',
            formFieldSuccessText: 'text-green-600 text-xs mt-1',
            formFieldErrorText: 'text-red-600 text-xs mt-1',

            // Animations
            logoImage: 'transition-transform hover:scale-105',
        }
    };

    return (
        <>
            <Helmet>
                <title>Sign In | StudySync</title>
                <meta name="description" content="Sign in to your StudySync account" />
            </Helmet>

            <BackgroundLines className={`flex items-center justify-center min-h-fit w-full px-4 ${theme === 'light' ? 'bg-purple-50' : 'bg-gray-950'
                }`}>
                <div className="w-full max-w-md py-8 pt-24">
                    <SignIn
                        path="/sign-in"
                        routing="path"
                        signUpUrl="/sign-up"
                        appearance={clerkAppearance}
                        afterSignInUrl="/"
                        afterSignUpUrl="/"
                    />

                </div>
            </BackgroundLines>
        </>
    );
};

export default SignInPage;