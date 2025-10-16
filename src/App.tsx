import { Routes, Route, useLocation } from 'react-router-dom';
import Header from './components/Header';
import Dashboard from './pages/dashboard';
import CoursePage from './pages/coursepage';
import Quiz from './pages/mcq_quiz';
import Login from './pages/login';
import Signup from './pages/signup';
import About from './pages/about';
import Hero from './components/Hero';

export default function() {
  const location = useLocation()
  const quizPg = location.pathname.includes('/unit/')

  return (
    <div className="min-h-screen bg-[#f6fbee]">
      {!quizPg && <Header />}
      <Routes>
        <Route path="/" element={<Hero />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/course/:courseId" element={<CoursePage />} />
        <Route path="/course/:courseId/unit/:unitId" element={<Quiz />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/about" element={<About />} />
      </Routes>
    </div>
  );
}