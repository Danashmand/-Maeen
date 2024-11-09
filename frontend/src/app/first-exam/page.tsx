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

  const questions = [
    {
      id: 1,
      question: 'أي من هذه الكلمات هي اسم فاكهة بالعربية؟',
      options: [
        { id: 1, text: 'تفاحة', correct: true },
        { id: 2, text: 'كرسي', correct: false },
        { id: 3, text: 'كتاب', correct: false },
        { id: 4, text: 'قمر', correct: false }
      ]
    },
    {
      id: 2,
      question: 'ما هو عكس كلمة طويل؟',
      options: [
        { id: 1, text: 'قصير', correct: true },
        { id: 2, text: 'ثقيل', correct: false },
        { id: 3, text: 'واسع', correct: false },
        { id: 4, text: 'بطيء', correct: false }
      ]
    },
    {
      id: 3,
      question: 'أي من هذه الألوان يعتبر لونًا دافئًا؟',
      options: [
        { id: 1, text: 'أزرق', correct: false },
        { id: 2, text: 'أحمر', correct: true },
        { id: 3, text: 'أخضر', correct: false },
        { id: 4, text: 'أرجواني', correct: false }
      ]
    },
    {
      id: 4,
      question: 'أي من هذه الحيوانات يطير؟',
      options: [
        { id: 1, text: 'قط', correct: false },
        { id: 2, text: 'فراشة', correct: true },
        { id: 3, text: 'حصان', correct: false },
        { id: 4, text: 'سمكة', correct: false }
      ]
    },
    {
      id: 5,
      question: 'أي من هذه الكلمات هو اسم آلة؟',
      options: [
        { id: 1, text: 'سيارة', correct: true },
        { id: 2, text: 'بحر', correct: false },
        { id: 3, text: 'شجرة', correct: false },
        { id: 4, text: 'جبل', correct: false }
      ]
    }
  ];

  const [score, setScore] = useState<number | null>(null);
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


  return (
    <div className="relative  h-screen w-full overflow-hidden text-right  ">
        
    <Image
      src={background}
      alt="Background Cover"
      fill
      className="-z-10 object-center object-cover  "
    />
            <div className="flex flex-col space-y-3 items-center justify-center min-h-screen ">

    <div className="bg-white/10 p-8 rounded-[10%] items-center text-center justify-center flex  w-[500px] h-[40px]  ">

        <h2 className="flex gap-2 text-3xl font-bold"> 
      اختبار سريع لتحديد المستوى
        <Image src={PencilIcon} alt="Logo" className="" />
      </h2>

    </div>
    <div className='justify-center items-center w-[540px] mr-4'>

      {score === null ? (
          <Exam questions={questions} showCorrectAnswer={false} onComplete={handleComplete} />
        ) : (
           <div className="flex flex-col justify-center items-center  bg-gray-50 rounded-md shadow-lg   h-64  " dir='rtl'>
            <div className='text-center text-primary text-6xl'> 
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
