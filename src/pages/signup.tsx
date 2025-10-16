import React from 'react';
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { useNavigate } from 'react-router-dom';
import firebaseApp from '../firebase';

/* Informal citation "Authenticate with Firebase using Password-Based Accounts using Javascript": https://firebase.google.com/docs/auth/web/password-auth */

export default function Signup() {
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [confirmPassword, setConfirmPassword] = React.useState('');
  const [error, setError] = React.useState('');
  const [showPassword, setShowPassword] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const navigate = useNavigate();

  const signedUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    const auth = getAuth(firebaseApp);

    if (!email || !password || !confirmPassword) {
      setError('All fields are required');
      setLoading(false);
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters long');
      setLoading(false);
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      setLoading(false);
      navigate('/dashboard');
    } catch (err: any) {
      let message = 'Unknown error';
      if (err && err.message) {
        message = err.message;
      }
      setError('Error creating account: ' + message);
      console.error('Error signing up:', err);
      setLoading(false);
      return;
    }

    setLoading(false);
  };

  let passwordInputType = 'password';
  if (showPassword) {
    passwordInputType = 'text';
  }

  let buttonLabel = 'Sign Up';
  if (loading) {
    buttonLabel = 'Signing Up...';
  }

  return (
    <div className="h-screen flex items-center justify-center bg-[#f6fbee]">
      <form className="bg-[#dfeec7] p-8 rounded-lg shadow-md w-full max-w-sm" onSubmit={signedUp}>
        <h2 className="text-2xl text-center font-bold text-gray-800">Sign Up</h2>

        <div className="flex flex-col mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
          <input type="email" className="border px-2 py-1 bg-[#f6fbee] text-gray-800" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </div>

        <div className="flex flex-col mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
          <input type={passwordInputType} className="border px-2 py-1 bg-[#f6fbee] text-gray-800" value={password} onChange={(e) => setPassword(e.target.value)} required />
        </div>

        <div className="flex flex-col mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
          <input type={passwordInputType} className="border px-2 py-1 bg-[#f6fbee] text-gray-800" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
        </div>

        {error && (<div className="text-red-500 text-sm my-4 text-left">{error}</div>)}
        
        <div className="flex items-center mb-4">
          <input type="checkbox" id="showPassword" className="mr-2" checked={showPassword} onChange={() => setShowPassword(!showPassword)} />
          <label htmlFor="showPassword" className="text-sm text-gray-700">Show Password</label>
        </div>

        <button type="submit" className="border px-2 py-1" disabled={loading}>{buttonLabel}</button>
      </form>
    </div>
  );
}