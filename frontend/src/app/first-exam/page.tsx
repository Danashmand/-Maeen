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
    const [userData, setUserData] = useState<{ _id: string; name: string; email: string, score: number } | null>(null);
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
            const response = await axios.post('http://www.maeenmodelserver.site/start-exam', {
                levels: userLevels,
                topic: topic,
            });
            const firstQuestion = response.data;  // Assuming the response contains the first question
            setQuestions([firstQuestion]); // Set the first question in the questions array
        } catch (error) {
            console.error('Error fetching first question:', error);
        }
    };

    // Function to get the next question
    const getNextQuestion = async (answer: boolean) => {
        try {
            const response = await axios.post('http://www.maeenmodelserver.site/nextQuestion', {
                levels: userLevels,
                topic: topic,
                newTopic: topic,  // Assuming the next question is for the same topic
                time: 4,  // Can be adjusted or dynamically passed if required
                userActivity: userActivity,
                answer: answer,
            });
            const nextQuestion = response.data;  // Assuming the response contains the next question
            setQuestions((prevQuestions) => [...prevQuestions, nextQuestion]);
            setCurrentQuestionIndex((prevIndex) => prevIndex + 1); // Move to the next question
        } catch (error) {
            console.error('Error fetching next question:', error);
        }
    };

    // Handle completing the exam
    async function handleComplete(finalScore: number): Promise<void> {
        setScore(finalScore);
        console.log('Final Score:', finalScore);

        try {
            // Send score to backend to update user level
            const response = await axios.post('https://maeen-production.up.railway.app/users/update-user-level', {
                userId: userData?._id,
                score: finalScore,
            });

            console.log('User Level Updated:', response.data.level);

            // Optionally redirect to the dashboard or display a success message
            router.push('/dashboard/virtual-teacher');
        } catch (error) {
            console.error('Error updating user level:', error);
            // Handle the error (e.g., show an error message to the user)
        }
    };

    // Start the exam when the component loads
    useEffect(() => {
        if (userData) {
            startExam();  // Start fetching the first question as soon as user data is available
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
                                questions={questions}
                                showCorrectAnswer={false}
                                onComplete={handleComplete}
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
