import React, { useState } from 'react';
import { Lightbulb } from 'lucide-react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { SignedIn, SignedOut, UserButton } from '@clerk/clerk-react';
import { motion } from 'framer-motion';
import ThemeButton from './ThemeButton';
import { useTheme } from '../context/theme-context';

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { theme } = useTheme();
  const [isLogoHovered, setIsLogoHovered] = useState(false);

  const isOnboarding = location?.pathname === '/onboarding';

  const handleNavigation = (section) => {
    if (location.pathname.startsWith('/dashboard')) {
      const element = document.getElementById(section);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      navigate(`/dashboard/1?scrollTo=${section}`);
    }
  };

  // Animation variants for navbar items
  const navItemVariants = {
    initial: { y: 0 },
    hover: {
      y: -3,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 10
      }
    }
  };

  // Animation for logo lightbulb
  const lightbulbVariants = {
    initial: { rotate: 0 },
    hover: {
      rotate: [0, -10, 10, -5, 5, 0],
      transition: {
        duration: 0.6,
        ease: "easeInOut"
      }
    }
  };

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 px-6 py-4
      backdrop-blur-md backdrop-saturate-150 
      ${theme === 'light'
        ? 'bg-white/30 border-b border-white/40 shadow-sm'
        : 'bg-black/30 border-b border-gray-800/50'
      }`}>
      <nav className="max-w-7xl mx-auto flex items-center justify-between">
        <motion.div
          onHoverStart={() => setIsLogoHovered(true)}
          onHoverEnd={() => setIsLogoHovered(false)}
          className="flex items-center space-x-2"
        >
          <Link to="/" className="flex items-center space-x-2">
            <motion.div
              variants={lightbulbVariants}
              initial="initial"
              animate={isLogoHovered ? "hover" : "initial"}
            >
              <Lightbulb className={`w-8 h-8 ${theme === 'light' ? 'text-purple-600' : 'text-white hover:text-blue-400'}`} />
            </motion.div>
            <span className={`text-2xl font-bold ${theme === 'light' ? 'text-purple-900' : 'text-white'}`}>
              StudySync
            </span>
          </Link>
        </motion.div>

        <div className="flex items-center space-x-8">
          {!isOnboarding && (
            <div className="hidden md:flex items-center space-x-8">
              <motion.button
                onClick={() => handleNavigation('features')}
                variants={navItemVariants}
                initial="initial"
                whileHover="hover"
                className={`relative overflow-hidden group ${theme === 'light'
                  ? 'text-purple-700 hover:text-purple-900'
                  : 'text-gray-300 hover:text-white'
                  }`}
              >
                Features
                <motion.span
                  className={`absolute bottom-0 left-0 w-0 h-0.5 group-hover:w-full ${theme === 'light' ? 'bg-purple-500' : 'bg-purple-400'
                    }`}
                  initial={{ width: 0 }}
                  whileHover={{ width: "100%" }}
                  transition={{ duration: 0.3 }}
                />
              </motion.button>

              <motion.button
                onClick={() => handleNavigation('tech-stacks')}
                variants={navItemVariants}
                initial="initial"
                whileHover="hover"
                className={`relative overflow-hidden group ${theme === 'light'
                  ? 'text-purple-700 hover:text-purple-900'
                  : 'text-gray-300 hover:text-white'
                  }`}
              >
                Tech Stacks
                <motion.span
                  className={`absolute bottom-0 left-0 w-0 h-0.5 group-hover:w-full ${theme === 'light' ? 'bg-purple-500' : 'bg-purple-400'
                    }`}
                  initial={{ width: 0 }}
                  whileHover={{ width: "100%" }}
                  transition={{ duration: 0.3 }}
                />
              </motion.button>

              <motion.button
                onClick={() => navigate('/dashboard/plan')}
                variants={navItemVariants}
                initial="initial"
                whileHover="hover"
                className={`relative overflow-hidden group ${theme === 'light'
                  ? 'text-purple-700 hover:text-purple-900'
                  : 'text-gray-300 hover:text-white'
                  }`}
              >
                Learning Paths
                <motion.span
                  className={`absolute bottom-0 left-0 w-0 h-0.5 group-hover:w-full ${theme === 'light' ? 'bg-purple-500' : 'bg-purple-400'
                    }`}
                  initial={{ width: 0 }}
                  whileHover={{ width: "100%" }}
                  transition={{ duration: 0.3 }}
                />
              </motion.button>

              <motion.button
                onClick={() => handleNavigation('community')}
                variants={navItemVariants}
                initial="initial"
                whileHover="hover"
                className={`relative overflow-hidden group ${theme === 'light'
                  ? 'text-purple-700 hover:text-purple-900'
                  : 'text-gray-300 hover:text-white'
                  }`}
              >

                <a href="https://github.com/TechQuanta" target='blank'>Community</a>
                <motion.span
                  className={`absolute bottom-0 left-0 w-0 h-0.5 group-hover:w-full ${theme === 'light' ? 'bg-purple-500' : 'bg-purple-400'
                    }`}
                  initial={{ width: 0 }}
                  whileHover={{ width: "100%" }}
                  transition={{ duration: 0.3 }}
                />
              </motion.button>
            </div>
          )}

          <div>
            <ThemeButton />
          </div>

          <div className="flex items-center space-x-4">
            <SignedOut>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate('/sign-in')}
                className={`hidden sm:block px-4 py-1.5 rounded-lg text-sm font-medium ${theme === 'light'
                  ? 'bg-gradient-to-r from-purple-500 to-purple-600 text-white shadow-md'
                  : 'bg-gradient-to-r from-purple-500 to-blue-500 text-white'
                  }`}
              >
                Sign In
              </motion.button>
            </SignedOut>
            <SignedIn>
              <UserButton appearance={{
                elements: {
                  userButtonAvatarBox: 'w-8 h-8',
                  userButtonPopoverCard: theme === 'light'
                    ? 'bg-white border border-purple-100 shadow-lg'
                    : 'bg-gray-800 border-gray-700'
                }
              }} />
            </SignedIn>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;