"use client";
import React, { useState, useEffect } from "react";
import Sidebar from "@/app/_components/sidebar";
import Image from "next/image";
import { useRouter } from "next/navigation";
import LogoColored from '../../public/logocolored.svg';
import Face from "../../public/face.svg";
import Exam from "@/app/_components/exam";
import axios from "axios";

function Page() {
  const [score, setScore] = useState<number | null>(null);
  const [userData, setUserData] = useState<{ _id: string; name: string } | null>(null);
  const router = useRouter();

  // Fetch user data from local storage and redirect if not signed in
  useEffect(() => {
    const fetchUserData = async () => {
      const user = localStorage.getItem("user");
      if (!user) {
        router.push("/auth/signin");
      } else {
        const parsedUser = JSON.parse(user).userData;
        setUserData(parsedUser);
      }
    };
    fetchUserData();
  }, []);

  // Handle the completion of the exam and send the score to the backend
  async function handleComplete(finalScore: number): Promise<void> {
    setScore(finalScore);
    try {
      await axios.post("https://maeen-production.up.railway.app/users/update-user-level", {
        userId: userData?._id,
        score: finalScore,
      });
    } catch (error) {
      console.error("Error updating user level:", error);
    }
  }

  // Reset the score to allow retaking the exam
  const retakeExam = () => {
    setScore(null);
  };

  // Sample questions for the exam
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

  return (
    <div className="relative h-screen flex flex-row overflow-hidden text-right bg-white/95">
      <div className="mb-20">
        <Sidebar />
      </div>

      <div className="flex flex-col space-y-4 overflow-y-auto bg-gradient-to-b from-primary/5 to-secondary2/30 mb-5 mt-10 mr-1 w-[119vh] bg-opacity-10 p-6 rounded-3xl shadow-xl backdrop-blur-md" dir="ltr">
        <div className="flex flex-row justify-between text-secondary2 text-4xl font-extrabold">
          <div className="flex flex-row justify-start ml-3 border-2 rounded-xl text-lg border-none">
            <div className="w-14 flex justify-center bg-white rounded-full border-4 border-secondary mr-4">
              <Image src={Face} alt="Logo" className="w-20" />
            </div>
            <div className="flex-col flex">
              <div>{userData ? userData.name : "مستخدم"}</div>
            </div>
          </div>
          <Image src={LogoColored} alt="logo" className="w-12" />
          <div className="flex justify-center text-center mt-2">اختبر نفسك</div>
        </div>
        <hr className="border-2 border-secondary" />

        <div className="justify-center items-center">
          {score === null ? (
            <Exam questions={questions} showCorrectAnswer={true} onComplete={handleComplete} />
          ) : (
            <div className="flex flex-col justify-center items-center bg-gray-50 rounded-md shadow-lg" dir="rtl">
              <div className="text-center text-secondary2 text-4xl p-20">
                أحسنت!
                <br />
                درجتك: {score} من 5
                <br />
                <button onClick={retakeExam} className="bg-secondary text-white p-2 rounded-lg m-4">
                  إعادة الإختبار
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="bg-gradient-to-b from-primary to-secondary2 p-8 rounded-[10%] items-center text-center justify-center flex w-80 mx-4 mt-40 h-2/3">
        <h2 className="flex gap-1 text-3xl font-bold" dir="rtl">
          اختبر معرفتك!
        </h2>
      
      </div>
    </div>
  );
}

export default Page;
