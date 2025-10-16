import React from 'react';
import Header from '../components/Header';
import { Link } from 'react-router-dom';

export default function Dashboard() {
    return (
        <div>
            <Header />
            <div className="pt-28 px-4 pb-20 min-h-screen bg-[#f5fbef] text-[#2c3e2e]">
                <div className="max-w-screen-lg mx-auto">
                    <h1 className="text-4xl font-bold mb-2">Dashboard</h1>
                    <p className="text-lg mb-10">Comprehensive AP prep with multiple-choice practice exams.</p>

                    <div className="flex flex-wrap gap-6 justify-center">
                        <div className="w-[700px] border-2 border-[#b3cde0] bg-[#e2ecf5] rounded-xl p-6 shadow">
                            <h2 className="text-2xl font-semibold mb-4 text-[#427aa1]">Math and Computer Science</h2>
                            <div className="grid grid-cols-3 gap-x-12">
                                <ul className="space-y-1">
                                    <li><Link to="/course/ap-calculus-ab" className="text-[#427aa1] hover:underline hover:text-[#427aa1]">AP Calculus AB</Link></li>
                                    <li><Link to="/course/ap-calculus-bc" className="text-[#427aa1] hover:underline hover:text-[#427aa1]">AP Calculus BC</Link></li>
                                    <li><Link to="/course/ap-statistics" className="text-[#427aa1] hover:underline hover:text-[#427aa1]">AP Statistics</Link></li>
                                </ul>
                                <ul className="space-y-1">
                                    <li className="whitespace-nowrap"><Link to="/course/ap-computer-science-principles" className="text-[#427aa1] hover:underline hover:text-[#427aa1]">AP Computer Science Principles</Link></li>
                                    <li><Link to="/course/ap-computer-science-a" className="text-[#427aa1] hover:underline hover:text-[#427aa1]">AP Computer Science A</Link></li>
                                </ul>
                            </div>
                        </div>

                        <div className="w-[300px] border-2 border-[#ffadad] bg-[#ffeaea] rounded-xl p-6 shadow">
                            <h2 className="text-2xl font-semibold mb-4 text-[#e63946]">English</h2>
                            <ul className="space-y-1">
                                <li><Link to="/course/ap-english-language" className="text-[#e63946] hover:underline hover:text-[#e63946]">AP English Language</Link></li>
                                <li><Link to="/course/ap-english-literature" className="text-[#e63946] hover:underline hover:text-[#e63946]">AP English Literature</Link></li>
                            </ul>
                        </div>

                        <div className="w-[700px] border-2 border-[#b2dfdb] bg-[#e0f7f5] rounded-xl p-6 shadow">
                            <h2 className="text-2xl font-semibold mb-4 text-[#00897b]">Sciences</h2>
                            <div className="grid grid-cols-3 gap-x-12">
                                <ul className="space-y-1">
                                    <li><Link to="/course/ap-physics-I" className="text-[#00897b] hover:underline hover:text-[#00897b]">AP Physics I</Link></li>
                                    <li><Link to="/course/ap-physics-c-mechanics" className="text-[#00897b] hover:underline hover:text-[#00897b]">AP Physics C: Mechanics</Link></li>
                                    <li><Link to="/course/ap-physics-c-e-m" className="text-[#00897b] hover:underline hover:text-[#00897b]">AP Physics C: E&M</Link></li>
                                </ul>
                                <ul className="space-y-1"> 
                                    <li><Link to="/course/ap-biology" className="text-[#00897b] hover:underline hover:text-[#00897b]">AP Biology</Link></li>
                                    <li><Link to="/course/ap-chemistry" className="text-[#00897b] hover:underline hover:text-[#00897b]">AP Chemistry</Link></li>
                                    <li className="whitespace-nowrap"><Link to="/course/ap-environmental-science" className="text-[#00897b] hover:underline hover:text-[#00897b]">AP Environmental Science</Link></li>
                                </ul>
                            </div>
                        </div>

                        <div className="w-[300px] border-2 border-[#d4a5c2] bg-[#fce9f1] rounded-xl p-6 shadow">
                            <h2 className="text-2xl font-semibold mb-4 text-[#9b1d61]">History</h2>
                            <ul className="space-y-1">
                                <li><Link to="/course/ap-european-history" className="text-[#9b1d61] hover:underline hover:text-[#9b1d61]">AP European History</Link></li>
                                <li><Link to="/course/ap-us-history" className="text-[#9b1d61] hover:underline hover:text-[#9b1d61]">AP US History</Link></li>
                                <li><Link to="/course/ap-world-history" className="text-[#9b1d61] hover:underline hover:text-[#9b1d61]">AP World History: Modern</Link></li>
                            </ul>
                        </div>

                        <div className="w-full border-2 border-[#ffcf91] bg-[#fff5e1] rounded-xl p-6 shadow">
                            <h2 className="text-2xl font-semibold mb-4 text-[#ff8000]">Social Sciences</h2>
                            <div className="grid grid-cols-3 gap-x-12">
                                <ul className="space-y-1">
                                    <li><Link to="/course/ap-macroeconomics" className="text-[#ff8000] hover:underline hover:text-[#ff8000]">AP Macroeconomics</Link></li>
                                    <li><Link to="/course/ap-microeconomics" className="text-[#ff8000] hover:underline hover:text-[#ff8000]">AP Microeconomics</Link></li>
                                    <li><Link to="/course/ap-psychology" className="text-[#ff8000] hover:underline hover:text-[#ff8000]">AP Psychology</Link></li>
                                </ul>
                                <ul className="space-y-1">
                                    <li><Link to="/course/ap-us-government" className="text-[#ff8000] hover:underline hover:text-[#ff8000]">AP US Government & Politics</Link></li>
                                    <li><Link to="/course/ap-african-american-studies" className="text-[#ff8000] hover:underline hover:text-[#ff8000]">AP African American Studies</Link></li>
                                    <li><Link to="/course/ap-comparative-government" className="text-[#ff8000] hover:underline hover:text-[#ff8000]">AP Comparative Government & Politics</Link></li>                                   
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}