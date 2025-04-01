// src/pages/VideoPlayer.js
import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { X } from 'lucide-react';
import { useTheme } from '../../context/theme-context';

const VideoPlayer = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { theme } = useTheme();
    const videoUrl = location.state?.videoUrl;
    const videoId = videoUrl?.split('v=')[1]?.split('&')[0];
    const fromPath = location.state?.from || '/dashboard'; // Default to dashboard if no from path

    const handleClose = () => {
        navigate(fromPath);
    };

    return (
        <div className={`fixed inset-0 z-50 ${theme === 'light' ? 'bg-purple-50' : 'bg-black'}`}>
            <div className="relative h-full w-full flex justify-center items-center">
                {/* Close Button */}
                <button
                    onClick={handleClose}
                    className={`absolute top-4 right-4 p-2 rounded-full z-10 ${theme === 'light'
                        ? 'bg-white text-purple-800 hover:bg-purple-100'
                        : 'bg-gray-800 text-white hover:bg-gray-700'
                        }`}
                >
                    <X className="w-6 h-6" />
                </button>

                {/* Video Container */}
                {videoId ? (
                    <div className={`w-full max-w-4xl mx-4 ${theme === 'light' ? 'bg-white' : 'bg-gray-900'} rounded-lg shadow-xl overflow-hidden`}>
                        <div className="relative pt-[56.25%]"> {/* 16:9 Aspect Ratio */}
                            <iframe
                                className="absolute top-0 left-0 w-full h-full"
                                src={`https://www.youtube.com/embed/${videoId}?autoplay=1`}
                                title="YouTube video player"
                                frameBorder="0"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                            ></iframe>
                        </div>
                    </div>
                ) : (
                    <div className={`p-8 rounded-lg ${theme === 'light' ? 'bg-white text-purple-800' : 'bg-gray-900 text-white'}`}>
                        <p>No video URL provided</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default VideoPlayer;