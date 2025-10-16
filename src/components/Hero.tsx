import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function Hero() {
    const navigate = useNavigate();
    return (
        <div className="w-full min-h-[60vh] flex flex-col items-center justify-center bg-[#dfeec7] text-[#2c3e2e] py-20">
            <h1 className="text-4xl md:text-5xl font-extrabold mb-4 text-center">Unlimited AP Multiple Choice Test Prep</h1>
            <h2 className="text-xl md:text-2xl font-semibold mb-8 text-center">Created for you to score a 5</h2>
            <button
                className="bg-[#7cab3f] hover:bg-[#6ca238] text-white px-8 py-4 rounded-lg text-lg font-bold mb-4 shadow"
                onClick={() => navigate('/dashboard')}
            >
                Access our free exams
            </button>
        </div>
    );
}