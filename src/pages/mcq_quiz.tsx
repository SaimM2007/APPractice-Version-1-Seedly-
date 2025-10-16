import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import QHeader from '../components/quizcomponents/QHeader'
import QuestionCard from '../components/quizcomponents/QuestionCard'
import QuestionFooter from '../components/quizcomponents/QuestionFooter'
import { GoogleGenAI } from "@google/genai";
import { getAuth } from 'firebase/auth';
import { db } from '../firebase';
import { collection, addDoc, Timestamp } from 'firebase/firestore';

const courseTitleMap = { 'ap-calculus-ab': 'AP Calculus AB', 'ap-calculus-bc': 'AP Calculus BC', 'ap-statistics': 'AP Statistics', 'ap-computer-science-principles': 'AP Computer Science Principles', 'ap-computer-science-a': 'AP Computer Science A', 'ap-english-language': 'AP English Language', 'ap-english-literature': 'AP English Literature', 'ap-biology': 'AP Biology', 'ap-chemistry': 'AP Chemistry', 'ap-environmental-science': 'AP Environmental Science', 'ap-physics-I': 'AP Physics I', 'ap-physics-c-mechanics': 'AP Physics C: Mechanics', 'ap-physics-c-e-m': 'AP Physics C: E&M', 'ap-european-history': 'AP European History', 'ap-us-history': 'AP US History', 'ap-world-history': 'AP World History: Modern', 'ap-macroeconomics': 'AP Macroeconomics', 'ap-microeconomics': 'AP Microeconomics', 'ap-psychology': 'AP Psychology', 'ap-us-government': 'AP US Government & Politics', 'ap-african-american-studies': 'AP African American Studies', 'ap-comparative-government': 'AP Comparative Government & Politics' }
const fullLengthTimes = { 'ap-calculus-ab': 105, 'ap-calculus-bc': 105, 'ap-statistics': 90, 'ap-computer-science-principles': 120, 'ap-computer-science-a': 90, 'ap-english-language': 60, 'ap-english-literature': 60, 'ap-biology': 90, 'ap-chemistry': 90, 'ap-environmental-science': 90, 'ap-physics-I': 90, 'ap-physics-c-mechanics': 45, 'ap-physics-c-e-m': 45, 'ap-european-history': 55, 'ap-us-history': 55, 'ap-world-history': 55, 'ap-macroeconomics': 70, 'ap-microeconomics': 70, 'ap-psychology': 70, 'ap-us-government': 60, 'ap-african-american-studies': 60, 'ap-comparative-government': 60 }
const ai = new GoogleGenAI({ apiKey: "AIzaSyADg8CNTarcjmxREso3pbXTKhKxsFSB_As" });

function formatTime(seconds: number) {
    const h = String(Math.floor(seconds / 3600)).padStart(2, '0')
    const m = String(Math.floor((seconds % 3600) / 60)).padStart(2, '0')
    const s = String(seconds % 60).padStart(2, '0')
    return `${h}:${m}:${s}`
}

function formatUnitName(slug: string) {
    return slug.split('-').map(word => word[0].toUpperCase() + word.slice(1)).join(' ')
}

type Question = { course: string, unit: string, question_number: number, question: string, options: string[], answer: string };
{/* informal citation for AI model stuff: https://ai.google.dev/gemini-api/docs/get-started/web */}
async function generateQuestion(courseId: string, unitId: string): Promise<Question[]> {
    let prompt = ""
    if (unitId.toLowerCase() === "all-topics") {
        prompt = "Write 40 AP multiple-choice questions across different units in " + courseTitleMap[courseId] + ". Each question must include 5 choices labeled A to E. Do not include extra text like 'Question', 'Answer:', or any markdown. After the choices, provide the correct answer letter only (e.g., C), with no punctuation."
    } else {
        const unitName = formatUnitName(unitId)
        prompt = "Write 15 AP multiple-choice questions about " + unitName + " from " + courseTitleMap[courseId] + ". Each question must include 5 choices labeled A to E. Do not include extra text like 'Question', 'Answer:', or any markdown. After the choices, provide the correct answer letter only (e.g., C), with no punctuation."
    }

    const result = await ai.models.generateContent({ model: "gemini-1.5-flash", contents: prompt })

    let text = ""
    if (result && result.candidates && result.candidates[0]?.content?.parts?.[0]?.text) {
        text = result.candidates[0].content.parts[0].text
    }

    const lines = text.split("\n").map(line => line.trim()).filter(line => line.length > 0)
    const questions: Question[] = []
    let i = 0
    let number = 1
    let unitName = unitId.toLowerCase() === "all-topics" ? "All Topics" : formatUnitName(unitId)

    while (i + 6 <= lines.length) {
        const questionLine = lines[i]
        const options = [lines[i+1], lines[i+2], lines[i+3], lines[i+4], lines[i+5]].map(line => line.slice(3).trim())
        const answerLine = lines[i+6]

        const isValidAnswer = /^[A-E]$/.test(answerLine)
        const hasAllOptions = options.every(opt => opt.length > 0)

        if (questionLine && isValidAnswer && hasAllOptions) {
            questions.push({
                course: courseId,
                unit: unitName,
                question_number: number,
                question: questionLine,
                options: options,
                answer: answerLine
            })
            number++
        }

        i += 7
    }

    return questions
}

export default function MCQQuiz() {
    const { courseId, unitId } = useParams<{ courseId: string; unitId?: string }>()

    const navigate = useNavigate()

    const [questions, setQuestions] = useState<Question[]>([])
    const [currentIndex, setCurrentIndex] = useState(0)
    const [selected, setSelected] = useState<number | null>(null)
    const [answers, setAnswers] = useState<(number | null)[]>([])
    const [secondsLeft, setSecondsLeft] = useState(0)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const totalQuestions = questions.length

    useEffect(() => {
        let minutes = 20
        if (!unitId || unitId.toLowerCase() === 'all-topics') {
            if (courseId && fullLengthTimes[courseId]) {
                minutes = fullLengthTimes[courseId]
            }
        }
        setSecondsLeft(minutes * 60)
    }, [courseId, unitId])

    useEffect(() => {
        async function fetchAndSet() {
            if (!courseId || !unitId) return
            setLoading(true)
            const q = await generateQuestion(courseId, unitId)
            if (q.length > 0) {
                setQuestions(q)
                setAnswers(Array(q.length).fill(null))
            } else {
                setError("No valid questions generated.")
            }
            setLoading(false)
        }
        fetchAndSet()
    }, [courseId, unitId])

    useEffect(() => {
        if (secondsLeft <= 0) return
        const interval = setInterval(() => {
            setSecondsLeft(prev => prev - 1)
        }, 1000)
        return () => clearInterval(interval)
    }, [secondsLeft])

    useEffect(() => {
        setSelected(answers[currentIndex] ?? null)
    }, [currentIndex])

    const handleSelect = (index: number) => {
        const updated = [...answers]
        updated[currentIndex] = index
        setAnswers(updated)
        setSelected(index)
    }

    const handleBack = () => {
        if (currentIndex > 0) {
            setCurrentIndex(currentIndex - 1)
        }
    }

    const handleNext = async () => {
        if (currentIndex < totalQuestions - 1) {
            setCurrentIndex(currentIndex + 1)
        } else {
            const auth = getAuth();
            const user = auth.currentUser;
            if (user) {
                await addDoc(collection(db, 'scores'), {
                    userId: user.uid,
                    courseId,
                    unitId,
                    correct: 6,
                    total: 15,
                    timestamp: Timestamp.now()
                });
            }
            navigate(`/course/${courseId}`)
        }
    }

    const handleJump = (questionNumber: number) => {
        setCurrentIndex(questionNumber - 1)
    }

    const calculateScore = () => {
        let correct = 0
        for (let i = 0; i < questions.length; i++) {
            const userChoice = answers[i]
            if (userChoice != null) {
                const correctLetter = questions[i].answer.trim()
                const correctIndex = correctLetter.charCodeAt(0) - 65
                if (userChoice === correctIndex) correct++
            }
        }
        return { correct, total: questions.length }
    }

    let title = 'MCQ Practice Test'
    if (courseId) {
        const courseName = courseTitleMap[courseId] || 'Course'
        if (!unitId || unitId.toLowerCase() === 'all-topics') {
            title = `${courseName} MCQ Practice Exam`
        } else {
            const formattedTopic = formatUnitName(unitId)
            title = `${formattedTopic} Progress Check: MCQ`
        }
    }

    return (
        <div className="w-full min-h-screen bg-[#f8f8f3]">
            <QHeader title={title} timer={formatTime(secondsLeft)} onExit={() => navigate(`/course/${courseId}`)} onTimerToggle={() => {}} />
            <div className="pt-24 px-6 flex justify-center">
                {loading && <div className="text-lg text-gray-600">Generating question...</div>}
                {error && <div className="text-red-500 text-lg">{error}</div>}
                {!loading && !error && questions.length > 0 && (
                    <QuestionCard
                        question={questions[currentIndex].question}
                        options={questions[currentIndex].options}
                        selected={selected}
                        onSelect={handleSelect}
                        questionNumber={currentIndex + 1}
                    />
                )}
                {!loading && !error && questions.length === 0 && (
                    <div className="text-gray-500 text-lg">No questions available.</div>
                )}
            </div>
            <QuestionFooter
                current={currentIndex + 1}
                total={totalQuestions}
                onBack={handleBack}
                onNext={handleNext}
                onSubmit={handleNext}
                onJump={handleJump}
            />
        </div>
    )
}