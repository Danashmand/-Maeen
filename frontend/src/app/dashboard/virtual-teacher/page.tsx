"use client";
import React, { useState, useEffect, useRef } from "react";
import Sidebar from "@/app/_components/sidebar";
import StudentIcon from "../../public/R.png";
import Image from "next/image";
import { useRouter } from "next/navigation";
import LogoColored from '../../public/logocolored.svg'
import Face from "../../public/face.svg";
import face2 from "../../public/images/1500 Memoji Pack.svg"

// import background from '../../public/images/Desktop - 4 (1).png';
function Page() {
const [chat, setChat] = useState<{
    createdAt: string; prompt: string; answer: string 
}[]>([]);
  const [loading, setLoading] = useState(false);
  const [userInput, setUserInput] = useState("");
  const messagesEndRef = useRef<null | HTMLDivElement>(null);
  const [userData, setUserData] = useState<{ _id: string; name: string; email: string, score: number } | null>(null);
  const [chatId, setChatId] = useState<string | null>(null);
  const router = useRouter();
  const [colorClass, setColorClass] = useState("text-secondary");
  const [displayedScore, setDisplayedScore] = useState(userData ? userData.score : 0);

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
  



  useEffect(() => {
    const createNewChatSession = async () => {
  
      try {
        const response = await fetch("https://maeen-production.up.railway.app/virtual-teacher/start-session", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId: userData?._id }),
        });

        if (!response.ok) {
          throw new Error("Failed to create a new chat session");
        }

        const data = await response.json();
        setChatId(data.ChatId);

        if (data.ChatId) {
          localStorage.setItem("chatId", data.ChatId);
        } else {
          throw new Error("Chat ID not returned from the server");
        }
      } catch (error) {
        console.error("Error creating chat session", error);
      }
    };

    if (userData) {
      createNewChatSession();
    }
  }, [userData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  
    const userPrompt = { createdAt: new Date().toISOString(), prompt: userInput, answer: "" };
    setChat((prev) => [...prev, userPrompt]); 
    setUserInput("");
  
    if (userData) {
      const newScore = userData.score + 10; // or any other logic for score calculation
      setUserData({ ...userData, score: newScore }); // Update userData with new score
  
      // Change color class sequence
      setColorClass("text-green-500");
      setTimeout(() => setColorClass("text-green-500"), 900);
      setTimeout(() => setColorClass("text-secondary"), 2000);
  
      // Start score increment animation
      incrementScore(userData.score, newScore, 1000); // Duration in milliseconds
    }
  
    setLoading(true);
  
    try {
      if (!chatId) {
        throw new Error("Chat ID is missing. Please start a new chat session.");
      }
  
      const response = await fetch("https://maeen-production.up.railway.app/virtual-teacher/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: userInput,
          userId: userData?._id,
          chatId: chatId, 
        }),
      });
  
      if (!response.ok) {
        throw new Error("Failed to fetch teacher response");
      }
  
      const data = await response.json();
      const teacherResponse = { prompt: "", answer: formatResponse(data.text) };
  
      setChat((prev) => {
        const updatedChat = [...prev];
        updatedChat[updatedChat.length - 1].answer = teacherResponse.answer;
        return updatedChat;
      });
    } catch (error) {
      console.error("Error fetching the API", error);
    } finally {
      setLoading(false);
      scrollToBottom();
    }
  };
  
  
  const incrementScore = (start: number, end: number, duration: number) => {
    const totalSteps = 10; // Total increments
    const increment = (end - start) / totalSteps;
    let currentScore = start;
    let step = 0;
  
    const interval = setInterval(() => {
      if (step >= totalSteps) {
        clearInterval(interval);
        return;
      }
      currentScore += increment;
      setDisplayedScore(Math.round(currentScore)); // Round to the nearest integer
      step++;
    }, duration / totalSteps);
  };
  
 
  
  
  

  const formatResponse = (response: string) => {
    return response
    
      
        .replace(/\bAI\b/g, '').replace(/ AI/g, '').replace(/AI\b/g, '') // Remove AI from the response
    
        .replace(/(.*?):/g, "<b style='font-weight: 900; font-size: 1rem;'>$1</b>:") // Bold the line before the colon
        .replace(/\*\*(.*?)\*\*/g, "<b style='font-weight: 900; font-size: 1rem;'>$1</b>") // Bold text wrapped in **
        .replace(/(\d+\.\s+)/g, "<br>$1"); // Add line breaks before numbered lists
};


  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };
  useEffect(() => {
    scrollToBottom();
  }, [chat]);
  return (
       <div className="relative  h-screen flex flex-roww-full overflow-hidden text-right bg-white/95  ">

      <div className="mb-20">
        <Sidebar />
      </div>

      <div className="flex flex-col space-y-4 overflow-y-auto  bg-white/90 mb-5 mt-10 mr-1  w-[119vh] bg-opacity-10 p-6 rounded-3xl shadow-xl backdrop-blur-md " dir="ltr">
<div className="flex flex-row  justify-between  text-secondary2 text-3xl  font-extrabold ">

  <div className='flex flex-row justify-start ml-3  border-2 rounded-xl text-lg border-white/50'>
        <div className='w-14 flex justify-center bg-white rounded-full border-4 border-secondary mr-4 '> 
        <Image src={Face} alt="Logo" className="w-16" />

        </div>
        <div className='flex-col flex'>
          <div> {userData ? userData.name : 'مستخدم'}</div>
          <div className={colorClass}>نقاطك: {displayedScore}</div>
          </div>
      </div>
  <Image src={LogoColored} alt="logo" className="w-10"/>
  <div className="flex justify-center text-center mt-1 ">ياقوت</div>
  </div> 
  {/* <hr className="border-2 border-secondary" /> */}
  
  
   <div className="flex flex-col space-y-2 overflow-y-auto flex-grow bg-white bg-opacity-10 p-6 h-[75vh] backdrop-blur-md transition-transform duration-300 ease-in-out" dir="rtl">
  {chat.map((item, index) => (
  <div key={index} className="flex flex-col">
    {/* Render user's prompt */}
    {item.prompt && item.prompt.trim() !== ""&& (
      <div className="flex items-center mb-2">
        <Image src={StudentIcon} alt="Student Icon" className="w-8 h-8 rounded-full ml-2" />
        <div className="border border-secondary2 p-3 rounded-xl text-secondary2 animate-fade-in-up text-md leading-relaxed max-w-[75%]">
          {item.prompt}
        </div>
      </div>
    )}
    {/* Render chatbot's answer */}
    {item.answer && (
      <div className="flex items-center justify-end mt-2">
        <div className=" p-3 max-w-[75%] rounded-xl text-black animate-fade-in-up text-lg leading-relaxed border-r-2  border-secondary2" dangerouslySetInnerHTML={{ __html: item.answer }} />
        <Image src={StudentIcon} alt="Teacher Icon" className="w-8 h-8 rounded-full mr-2" />
      </div>
    )}
   
  </div>
))}

    {loading && <div className="self-end italic text-primary animate-pulse text-lg">المعلم يكتب  ...</div>}
    <div ref={messagesEndRef} />
  </div>

  <form onSubmit={handleSubmit} className="flex items-center space-x-4 pt-6">
    <input type="text" className="flex-grow p-2 text-right rounded-full border-2  border-primary focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition duration-200 ease-in-out text-gray-900 bg-white text-lg leading-relaxed" placeholder="...اسأل شيئًا" value={userInput} onChange={(e) => setUserInput(e.target.value)} />
    <button type="submit" className="bg-primary text-white rounded-full px-6 py-2 transition duration-200 ease-in-out hover:bg-secondary">
      إرسال
    </button>
  </form>
</div>


<div className="flex flex-col bg-gradient-to-b from-primary to-secondary2 p-8 rounded-[10%] items-center text-center justify-center flex w-80 mx-4 mt-2 h-3/4">
        <h2 className="flex gap-1 text-2xl font-bold" dir="rtl">
          أنا ياقوت معلمك الافتراضي اسألني ما شئت !      </h2>
<div>
<Image src={face2} alt="face" className="w-52" />

</div>
      </div>
      
    </div>
  );
}

export default Page;