import React, { useState } from 'react';
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const loggedIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const auth = getAuth();

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      console.log("User signed in:", user);
      if (user) {
        navigate('/dashboard');
        console.log("Login successful");
      }
    } catch (error) {
      setError('Error signing in: ' + error.message);
      console.error("Error signing in:", error);
    }
  }

  let passwordInputType = 'password';
  if (showPassword) {
    passwordInputType = 'text';
  }

  return (
    <div className="h-screen flex items-center justify-center bg-[#f6fbee]">
      <form className="bg-[#dfeec7] p-8 rounded-lg shadow-md w-full max-w-sm" onSubmit={loggedIn}>
        <h2 className="text-2xl text-center font-bold text-gray-800">Login</h2>

        <div className="flex flex-col mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
          <input type="email" className="border px-2 py-1 bg-[#f6fbee] text-gray-800" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </div>

        <div className="flex flex-col mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
          <input type={passwordInputType} className="border px-2 py-1 bg-[#f6fbee] text-gray-800 w-full" value={password} onChange={(e) => setPassword(e.target.value)} required />
        </div>

        {error && (<div className="text-red-500 text-sm my-4 text-left">{error}</div>)}
        
        <div className="flex items-center mb-4">
          <input type="checkbox" id="showPassword" className="mr-2" checked={showPassword} onChange={() => setShowPassword(!showPassword)} />
          <label htmlFor="showPassword" className="text-sm text-gray-700">Show Password</label>
        </div>

        <button type="submit" className="border px-2 py-1"> Log In </button>
      </form>
    </div>
  );
};