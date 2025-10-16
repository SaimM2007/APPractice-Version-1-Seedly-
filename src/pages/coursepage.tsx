import { useParams } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { db } from '../firebase';
import { collection, addDoc, getDocs, query, where, Timestamp } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

export default function CoursePage() {
    const { courseId } = useParams<{ courseId: string }>()
    const navigate = useNavigate()
    const [scores, setScores] = useState<any[]>([])
    const [loadingScores, setLoadingScores] = useState(true)
    const [userId, setUserId] = useState<string | null>(null)

    const courseTitleMap: Record<string, string> = { 'ap-calculus-ab': 'AP Calculus AB', 'ap-calculus-bc': 'AP Calculus BC', 'ap-statistics': 'AP Statistics', 'ap-computer-science-principles': 'AP Computer Science Principles', 'ap-computer-science-a': 'AP Computer Science A', 'ap-english-language': 'AP English Language', 'ap-english-literature': 'AP English Literature', 'ap-biology': 'AP Biology', 'ap-chemistry': 'AP Chemistry', 'ap-environmental-science': 'AP Environmental Science', 'ap-physics-I': 'AP Physics I', 'ap-physics-c-mechanics': 'AP Physics C: Mechanics', 'ap-physics-c-e-m': 'AP Physics C: E&M', 'ap-european-history': 'AP European History', 'ap-us-history': 'AP US History', 'ap-world-history': 'AP World History: Modern', 'ap-macroeconomics': 'AP Macroeconomics', 'ap-microeconomics': 'AP Microeconomics', 'ap-psychology': 'AP Psychology', 'ap-us-government': 'AP US Government & Politics', 'ap-african-american-studies': 'AP African American Studies', 'ap-comparative-government': 'AP Comparative Government & Politics' };

    const calcABUnits = ['All Topics', 'Limits and Continuity', 'Differentiation: Definition and Basic Derivative Rules', 'Differentiation: Composite, Implicit, and Inverse Functions', 'Contextual Applications of Differentiation', 'Analytical Applications of Differentiation', 'Integration and Accumulation of Change', 'Differential Equations', 'Applications of Integration']
    const calcBCUnits = [...calcABUnits, 'Parametric Equations, Polar Coordinates, and Vector-Valued Functions', 'Infinite Sequences and Series']
    const statsUnits = ['All Topics', 'Exploring One-Variable Data', 'Exploring Two-Variable Data', 'Collecting Data', 'Probability, Random Variables, and Probability Distributions', 'Sampling Distributions', 'Inference for Categorical Data: Proportions', 'Inference for Quantitative Data: Means', 'Inference for Categorical Data: Chi-Square', 'Inference for Quantitative Data: Slopes']
    const cspUnits = ['All Topics', 'Creative Development', 'Data', 'Algorithms and Programming', 'Computer Systems and Networks', 'Impact of Computing']
    const csaUnits = ['All Topics', 'Primitive Types', 'Using Objects', 'Boolean Expressions & If Statements', 'Iteration', 'Writing Classes', 'Array', 'ArrayList', '2D Array', 'Inheritance', 'Recursion']
    const englishLangUnits = ['All Topics', 'Unit 1', 'Unit 2', 'Unit 3', 'Unit 4', 'Unit 5', 'Unit 6', 'Unit 7', 'Unit 8', 'Unit 9']
    const englishLitUnits = ['All Topics', 'Short Fiction I', 'Poetry I', 'Longer Fiction or Drama I', 'Short Fiction II', 'Poetry II', 'Longer Fiction or Drama II', 'Short Fiction III', 'Poetry III', 'Longer Fiction or Drama III']
    const bioUnits = ['All Topics', 'Chemistry of Life', 'Cell Structure and Function', 'Cellular Energetics', 'Cell Communication and Cell Cycle', 'Heredity', 'Gene Expression and Regulation', 'Natural Selection', 'Ecology', 'Practice Test']
    const chemUnits = ['All Topics', 'Atomic Structure and Properties', 'Compound Structure and Properties', 'Properties of Substances and Mixtures', 'Chemical Reactions', 'Kinetics', 'Thermochemistry', 'Equilibrium', 'Acids and Bases', 'Thermodynamics and Electrochemistry']
    const envSciUnits = ['All Topics', 'The Living World: Ecosystems', 'The Living World: Biodiversity', 'Populations', 'Earth Systems and Resources', 'Land and Water Use', 'Energy Resources and Consumption', 'Atmospheric Pollution', 'Aquatic and Terrestrial Pollution', 'Global Change']
    const physics1Units = ['All Topics', 'Kinematics', 'Force and Translational Dynamics', 'Work, Energy, and Power', 'Linear Momentum', 'Torque and Rotational Dynamics', 'Energy and Momentum of Rotating Systems', 'Oscillations', 'Fluids']
    const physicsCEMUnits = ['All Topics', 'Electric Charges, Fields, and Gauss’s Law', 'Electric Potential', 'Conductors and Capacitors', 'Electric Circuits', 'Magnetic Fields and Electromagnetism', 'Electromagnetic Induction']
    const physicsCMechUnits = ['All Topics', 'Kinematics', 'Force and Translational Dynamics', 'Work, Energy, and Power', 'Linear Momentum', 'Torque and Rotational Dynamics', 'Energy and Momentum of Rotating Systems', 'Oscillations']
    const euroHistUnits = ['All Topics', 'Renaissance and Exploration', 'Age of Reformation', 'Absolutism and Constitutionalism', 'Scientific, Philosophical, and Political Developments', 'Conflict, Crisis, and Reaction in the Late 18th Century', 'Industrialization and Its Effects', '19th-Century Perspectives and Political Developments', '20th-Century Global Conflicts', 'Cold War and Contemporary Europe']
    const usHistUnits = ['All Topics', 'Period 1: 1491–1607', 'Period 2: 1607–1754', 'Period 3: 1754–1800', 'Period 4: 1800–1848', 'Period 5: 1844–1877', 'Period 6: 1865–1898', 'Period 7: 1890–1945', 'Period 8: 1945–1980', 'Period 9: 1980–Present']
    const worldHistUnits = ['All Topics', 'The Global Tapestry', 'Networks of Exchange', 'Land-Based Empires', 'Transoceanic Interconnections', 'Revolutions', 'Consequences of Industrialization', 'Global Conflict', 'Cold War and Decolonization', 'Globalization']
    const macroEconUnits = ['All Topics', 'Basic Economic Concepts', 'Economic Indicators and the Business Cycle', 'National Income and Price Determination', 'Financial Sector', 'Long-Run Consequences of Stabilization Policies', 'Open Economy— International Trade and Finance']
    const microEconUnits = ['All Topics', 'Basic Economic Concepts', 'Supply and Demand', 'Production, Cost, and the Perfect Competition Model', 'Imperfect Competition', 'Factor Markets', 'Market Failure and the Role of Government']
    const psychUnits = ['All Topics', 'Biological Bases of Behavior', 'Cognition', 'Development and Learning', 'Social Psychology and Personality', 'Mental and Physical Health']
    const govUnits = ['All Topics', 'Foundations of American Democracy', 'Interactions Among Branches of Government', 'Civil Liberties and Civil Rights', 'American Political Ideologies and Beliefs', 'Political Participation']
    const africanAmUnits = ['All Topics', 'Origins of the African Diaspora', 'Freedom, Enslavement, and Resistance', 'The Practice of Freedom', 'Movements and Debates']
    const comparativeGovUnits = ['All Topics', 'Political Systems, Regimes, and Governments', 'Political Institutions', 'Political Culture and Participation', 'Party and Electoral Systems and Citizen Organizations', 'Economic Changes and Development']
    
    const unitMap: Record<string, string[]> = { 'ap-statistics': statsUnits, 'ap-calculus-ab': calcABUnits, 'ap-calculus-bc': calcBCUnits, 'ap-computer-science-principles': cspUnits, 'ap-computer-science-a' : csaUnits, 'ap-english-language': englishLangUnits, 'ap-english-literature': englishLitUnits, 'ap-biology': bioUnits, 'ap-chemistry': chemUnits, 'ap-environmental-science': envSciUnits, 'ap-physics-I': physics1Units, 'ap-physics-c-e-m': physicsCEMUnits, 'ap-physics-c-mechanics': physicsCMechUnits, 'ap-european-history': euroHistUnits, 'ap-us-history': usHistUnits, 'ap-world-history': worldHistUnits, 'ap-macroeconomics': macroEconUnits, 'ap-microeconomics': microEconUnits, 'ap-psychology': psychUnits, 'ap-us-government': govUnits, 'ap-african-american-studies': africanAmUnits, 'ap-comparative-government': comparativeGovUnits };

    const units = unitMap[courseId || ''] || []

    async function fetchScores(userId: string, courseId: string) {
        const q = query(collection(db, 'scores'), where('userId', '==', userId), where('courseId', '==', courseId));
        const snapshot = await getDocs(q);
        return snapshot.docs.map(doc => doc.data());
    }

    useEffect(() => {
        const auth = getAuth();
        const unsubscribe = auth.onAuthStateChanged(async (user) => {
            if (user) {
                setUserId(user.uid);
            } else {
                setUserId(null);
                setScores([]);
                setLoadingScores(false);
            }
        });
        return () => unsubscribe();
    }, [courseId]);

    useEffect(() => {
        async function fetchAndSetScores() {
            if (userId && courseId) {
                setLoadingScores(true);
                const userScores = await fetchScores(userId, courseId);
                setScores(userScores);
                setLoadingScores(false);
            }
        }
        fetchAndSetScores();
    }, [userId, courseId]);

    const totalCorrect = scores.reduce((sum, s) => sum + (s.correct || 0), 0);
    const totalQuestions = scores.reduce((sum, s) => sum + (s.total || 0), 0);
    const totalIncorrect = totalQuestions - totalCorrect;

    return (
        <div className="flex h-screen">
            <div className="w-64 h-screen overflow-y-auto border-r pt-28 px-4 space-y-6 bg-[#eff6e5] text-[#2c3e2e] shadow custom-scroll">
                <h1 className="text-xl font-bold border-b border-[#2c3e2e] pb-2">
                    {courseTitleMap[courseId || ''] || 'Course'}
                </h1>
                <div>
                    <div className="w-full rounded px-1 py-0.5">
                        <h2 className="text-sm font-semibold">Multiple Choice</h2>
                    </div>
                    <ul className="pt-1 space-y-1 text-sm">
                        {units.map(unit => (
                            <li key={unit} className="pl-4">
                                <div onClick={() => navigate(`/course/${courseId}/unit/${unit.replaceAll(' ', '-').toLowerCase()}`)} className="w-full block rounded px-1 py-0.5 hover:bg-[#e3edd2] cursor-pointer box-border">{unit}</div>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
            <div className="flex-1 p-10 bg-[#f8fbf3] flex flex-col items-center justify-center">
                <h2 className="text-2xl font-bold text-[#2c3e2e] mb-6">Your MCQ Practice Stats</h2>
                {
                    (() => {
                        if (loadingScores) {
                            return <div>Loading scores...</div>;
                        }
                        if (scores.length > 0) {
                            return (
                                <div className="flex space-x-8">
                                    <div className="w-48 h-48 rounded-full bg-white border border-[#2c3e2e] shadow flex flex-col justify-center items-center">
                                        <p className="text-2xl font-bold text-[#2c3e2e]">
                                            {Math.round((totalCorrect / totalQuestions) * 100)}%
                                        </p>
                                        <p className="text-sm text-[#2c3e2e] text-center">
                                            Answered correctly<br />
                                            {totalCorrect} / {totalQuestions}
                                        </p>
                                    </div>
                                    <div className="w-48 h-48 rounded-full bg-white border border-[#2c3e2e] shadow flex flex-col justify-center items-center">
                                        <p className="text-2xl font-bold text-[#2c3e2e]">
                                            {Math.round((totalIncorrect / totalQuestions) * 100)}%
                                        </p>
                                        <p className="text-sm text-[#2c3e2e] text-center">
                                            Answered incorrectly<br />
                                            {totalIncorrect} / {totalQuestions}
                                        </p>
                                    </div>
                                </div>
                            );
                        }
                        return <div className="text-[#2c3e2e]">No scores yet. Complete a quiz to see your stats!</div>;
                    })()
                }
            </div>
        </div>
    )
}