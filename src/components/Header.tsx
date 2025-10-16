import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import TitleLogo from '../assets/TitleLogo.png';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import firebaseApp from '../firebase';

/* Informal citation for tutorial (not entirely used): https://www.youtube.com/watch?v=UKAbQnCHy4M */
export default function Header() {
    const [user, setUser] = useState<any>(null);

    useEffect(() => {
        const auth = getAuth(firebaseApp);
        const unsubscribe = onAuthStateChanged(auth, (u) => {
            setUser(u);
        });
        return () => unsubscribe();
    }, []);

    return (
        <div className="w-full h-20 bg-[#dfeec7] fixed border-b shadow-md">
            <div className="max-w-[1240px] m-auto px-6 h-full flex justify-between items-center">
                <div className="flex-1">
                    <Link to="/"><img src={TitleLogo} className="h-10" alt="Logo" /></Link>
                </div>

                <div className="flex-1 flex justify-center">
                    <ul className="flex gap-8 text-[#2c3e2e] font-medium">
                        <li><Link to="/" className="text-[#2c3e2e] hover:text-[#89b02e] no-underline">Home</Link></li>
                        <li><Link to="/about" className="text-[#2c3e2e] hover:text-[#89b02e] no-underline">About</Link></li>
                        <li><Link to="/dashboard" className="text-[#2c3e2e] hover:text-[#89b02e] no-underline">Dashboard</Link></li>
                    </ul>
                </div>

                <div className="flex-1 flex justify-end items-center gap-4">
                    {(() => {
                        if (user) {
                            return <span className="text-2xl" title="You are logged in">🌱</span>;
                        }
                        return (
                            <div>
                                <Link to="/login" className="text-[#2c3e2e] hover:text-[#89b02e] font-medium">Login</Link>
                                <Link to="/signup" className="bg-[#7cab3f] hover:bg-[#6ca238] text-white hover:text-white px-4 py-2 rounded-md font-medium">Sign Up</Link>
                            </div>
                        );
                    })()}
                </div>
            </div>
        </div>
    );
}