import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

export default function QHeader({title, timer, onExit, onTimerToggle}: {title: string, timer: string, onExit: () => void, onTimerToggle: () => void}) {
    const location = useLocation();
    const navigate = useNavigate();

    const handleExit = () => {
        const path = location.pathname;
        const coursePath = path.split('/unit')[0];
        navigate(coursePath);
        onExit();
    };

    return (
        <div className="w-full h-20 bg-[#dfeec7] border-b shadow-md fixed z-10">
            <div className="max-w-[1240px] m-auto px-6 h-full flex justify-between items-center">
                <div className="text-[#2c3e2e] font-medium">{title}</div>
                <button className="absolute left-1/2 transform -translate-x-1/2 bg-white text-[#2c3e2e] px-4 py-2 rounded hover:bg-[#f3f3f3] font-medium" onClick={onTimerToggle}>{timer}</button>
                <button className="bg-[#7cab3f] hover:bg-[#6ca238] text-white px-4 py-2 rounded-md font-medium" onClick={handleExit}>Exit Exam</button>
            </div>
        </div>
    );
}