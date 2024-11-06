"use client";
import React, { useEffect, useState } from 'react';
import Exam from '../_components/exam';
import Image from 'next/image';
import background from '../public/images/Desktop - 4 (1).png';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import PencilIcon from '../public/sidebarIcons/pencil.svg';

const Page = () => {
    const router = useRouter();
    const [userData, setUserData] = useState<{ _id: string; name: string; email: string; score: number } | null>(null);
    const [questions, setQuestions] = useState<any[]>([]);
    const [score, setScore] = useState<number | null>(null);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [userLevels, setUserLevels] = useState<{ writing: number; reading: number; grammer: number }>({ writing: 1, reading: 10, grammer: 19 });
    const [topic, setTopic] = useState('grammer');
    const [userActivity, setUserActivity] = useState(0);

    useEffect(() => {
        const fetchUserData = async () => {
            const user = localStorage.getItem("user");
            if (!user) {
                router.push('/auth/signin');
            } else {
                const parsedUser = JSON.parse(user).userData;
                setUserData(parsedUser);
            }
        };

        fetchUserData();
    }, []);

    // Function to start the exam and get the first question
    const startExam = async () => {
        try {
            const response = await axios.post('https://maeen-production.up.railway.app/first-exam', {
                levels: userLevels,
                topic: topic,
                userId: userData?._id,
            });
            const { questions: fetchedQuestions } = response.data;
            setQuestions(fetchedQuestions);
        } catch (error) {
            console.error('Error starting exam:', error);
        }
    };

    // Handle submitting the answer for the current question
    const submitAnswer = async (score: number) => {
        try {
            setUserLevels((prev) => ({
                ...prev,
                writing: prev.writing + 1,  
                reading: prev.reading + 1,
                grammer: prev.grammer + 1,
            }));

            setUserActivity((prev) => prev + 1);

            // Simulate submitting the answer (e.g., storing data on the backend)
            await axios.post('https://maeen-production.up.railway.app/first-exam', {
                levels: userLevels,
                topic: topic,
                userId: userData?._id,
            });

            // If there are more questions, move to the next one
            if (currentQuestionIndex < questions.length - 1) {
                setCurrentQuestionIndex(currentQuestionIndex + 1);
            } else {
                // Final score calculation
                const finalScore = calculateFinalScore();
                handleComplete(finalScore);
            }
        } catch (error) {
            console.error('Error submitting answer:', error);
        }
    };

    // Function to calculate the final score (example)
    const calculateFinalScore = () => {
        return 85;  // Modify this to suit your needs
    };

    // Handle completing the exam and submitting the final score
    async function handleComplete(finalScore: number): Promise<void> {
        setScore(finalScore);
        console.log('Final Score:', finalScore);

        try {
            await axios.post('https://maeen-production.up.railway.app/users/update-user-level', {
                userId: userData?._id,
                score: finalScore,
            });

            router.push('/dashboard/virtual-teacher');
        } catch (error) {
            console.error('Error updating user level:', error);
        }
    }

    // Start the exam when user data is available
    useEffect(() => {
        if (userData) {
            startExam();
        }
    }, [userData]);

    return (
        <div className="relative h-screen w-full overflow-hidden text-right">
            <Image
                src={background}
                alt="Background Cover"
                fill
                className="-z-10 object-center object-cover"
            />
            <div className="flex flex-col space-y-3 items-center justify-center min-h-screen">
                <div className="bg-white/10 p-8 rounded-[10%] items-center text-center justify-center flex w-[500px] h-[40px]">
                    <h2 className="flex gap-2 text-3xl font-bold">
                        اختبار سريع لتحديد المستوى
                        <Image src={PencilIcon} alt="Logo" className="" />
                    </h2>
                </div>
                <div className="justify-center items-center w-[540px] mr-4">
                    {score === null ? (
                        questions.length > 0 && (
                            <Exam
                                questions={questions[currentQuestionIndex]} // Pass current question
                                showCorrectAnswer={false}
                                onComplete={submitAnswer} // Pass submitAnswer
                            />
                        )
                    ) : (
                        <div className="flex flex-col justify-center items-center bg-gray-50 rounded-md shadow-lg h-64" dir="rtl">
                            <div className="text-center text-primary text-6xl">
                                أحسنت!
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Page;
