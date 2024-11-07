"use client";
import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import Exam from '../_components/exam';
import background from '../public/images/Desktop - 4 (1).png';
import PencilIcon from '../public/sidebarIcons/pencil.svg';

// Define the option and question interfaces
interface Option {
    id: number;
    text: string;
    correct: boolean;
}

interface Question {
    id: number;
    question: string;
    options: Option[];
}

const Page = () => {
    const router = useRouter();
    
    const [userData, setUserData] = useState<{ _id: string; name: string; email: string; score: number } | null>(null);
    const [questions, setQuestions] = useState<Question[]>([]);
    const [score, setScore] = useState<number | null>(null);
    const [userLevels, setUserLevels] = useState<{ writing: number; reading: number; grammar: number }>({ writing: 1, reading: 10, grammar: 19 });
    const [topic, setTopic] = useState('grammar');
    
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
    }, [router]);

    useEffect(() => {
        if (userData) {
            startExam();
        }
    }, [userData]);

    const startExam = async () => {
        try {
            const response = await axios.post(
                'https://maeen-production.up.railway.app/first-exam',
                {
                    levels: userLevels,
                    topic: topic
                },
                {
                    headers: {
                        'Content-Type': 'application/json',
                    }
                }
            );

            const { AI } = response.data; // Assuming response has the structure { "AI": "..." }
            // Split the AI response to create four questions
            const questionsArray = AI.split(';'); // Assuming questions are separated by a semicolon
            const fetchedQuestions: Question[] = questionsArray.slice(0, 4).map((questionText: string, index: number) => ({
                id: index + 1, // Assign unique ID
                question: questionText.trim(), // Use the split text as the question
                options: [
                    { id: 1, text: 'Option 1', correct: false }, // Replace with actual options
                    { id: 2, text: 'Option 2', correct: true },  // Ensure at least one correct option
                    { id: 3, text: 'Option 3', correct: false },
                    { id: 4, text: 'Option 4', correct: false },
                ],
            }));

            setQuestions(fetchedQuestions);
        } catch (error: unknown) {
            if (axios.isAxiosError(error) && error.response) {
                console.error('Error starting exam:', error.response.data);
            } else if (axios.isAxiosError(error) && error.request) {
                console.error('No response received:', error.request);
            } else {
                console.error('Error', String((error as Error).message));
            }
        }
    };
const submitAnswer = async (answer: string) => {
        try {
            setUserLevels(prev => ({
                writing: prev.writing + 1,  
                reading: prev.reading + 1,
                grammar: prev.grammar + 1,
            }));

            setUserActivity(prev => prev + 1);

            const currentQuestion = questions[currentQuestionIndex];
            
            // Send the answer to the backend and fetch the next question
            const response = await axios.post('https://maeen-production.up.railway.app/nextQuestion', {
                levels: userLevels,
                topic: topic,
                newTopic: currentQuestion.topic,
                time: 4,  // Example time, adjust as needed
                userActivity: userActivity,
                answer: answer,
            });

            // If there are more questions, move to the next one
            if (response.data && response.data.question) {
                setQuestions(prev => [...prev, response.data]); // Append the next question
                setCurrentQuestionIndex(prevIndex => prevIndex + 1); // Move to the next question
            } else {
                // Final score calculation and handling
                const finalScore = calculateFinalScore();
                handleComplete(finalScore);
            }
        } catch (error) {
            console.error('Error submitting answer:', error);
        }
    };

    // Function to calculate the final score (example)
    const calculateFinalScore = () => {
        return 85;  // Modify as per the exam logic
    };

    // Handle exam completion and update user score
    const handleComplete = async (finalScore: number) => {
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
    };

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
                        <Image src={PencilIcon} alt="Logo" />
                    </h2>
                </div>
                <div className="justify-center items-center w-[540px] mr-4">
                    {score === null ? (
                        questions.length > 0 && (
                            <Exam
                                questions={questions}
                                showCorrectAnswer={false}
                                onComplete={submitAnswer}
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
function setUserActivity(arg0: (prev: any) => any) {
    throw new Error('Function not implemented.');
}

