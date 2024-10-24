"use client";
import React, { useState, useEffect, useRef } from "react";
import Sidebar from "@/app/_components/sidebar";
import StudentIcon from "../../public/R.png";
import Image from "next/image";
import RightSidebar from "@/app/_components/rightSidebar";
import { useRouter } from "next/navigation";

function Page() {
const [chat, setChat] = useState<{
    createdAt: string; prompt: string; answer: string 
}[]>([]);
  const [loading, setLoading] = useState(false);
  const [userInput, setUserInput] = useState("");
  const messagesEndRef = useRef<null | HTMLDivElement>(null);
  const [userData, setUserData] = useState<{ _id: string; name: string; email: string } | null>(null);
  const [chatHistory, setChatHistory] = useState<{ id: string; firstMessage: string; date: string }[]>([]);
  const [chatId, setChatId] = useState<string | null>(null);
  const router = useRouter();
  useEffect(() => {
    const fetchUserData = async () => {
      const user = localStorage.getItem("user");
      if (user) {
        setUserData(JSON.parse(user));
      }
      else{
        router.push('/auth/signin');

      }
    };

    fetchUserData();
  }, []);



  useEffect(() => {
    const createNewChatSession = async () => {
  
      try {
        const response = await fetch("http://localhost:3000/virtual-teacher/start-session", {
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
          console.log("Chat ID saved:", data.ChatId);
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
  useEffect(() => {
    const fetchChatHistory = async () => {
      if (userData || chatId) {
        try {
          const response = await fetch("http://localhost:3000/virtual-teacher/All", {
            method: "GET",
            headers: { "Content-Type": "application/json" },
          });
    
          if (!response.ok) {
            throw new Error("Failed to fetch chat history");
          }
    
          const data = await response.json();
    
          // Log the data to check its structure
    
          // Check if data is an array before mapping
          if (Array.isArray(data)) {
            const formattedHistory = data.map((chat) => ({
              id: chat.chatId,
              firstMessage: chat.messages[0] ? chat.messages[0].text.substring(0, 12) : 'Blank',
              date: new Date(chat.createdAt).toLocaleDateString(),
            })).reverse();
          
          
          
            setChatHistory(formattedHistory);
          } else {
            console.error("Expected data to be an array but got:", data);
          }
        } catch (error) {
          console.error("Error fetching chat history:", error);
        }
      }
    };
    

    fetchChatHistory();
  }, [userData, chatId]);
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const userPrompt = { createdAt: new Date().toISOString(), prompt: userInput, answer: "" };
    setChat((prev) => [...prev, userPrompt]);
    setUserInput("");

    setLoading(true);

    try {

      if (!chatId) {
        throw new Error("Chat ID is missing. Please start a new chat session.");
      }

      const response = await fetch("http://localhost:3000/virtual-teacher/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: userInput,
          userId: userData?._id,
          chatId: chatId, // Pass chatId in the request
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to fetch teacher response");
      }

      const data = await response.json();
      const teacherResponse = { prompt: userInput, answer: formatResponse(data.text) }; // Use data.text for the answer

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

  const handleChatClick = async (id: string) => {
    try {
      const response = await fetch(`http://localhost:3000/virtual-teacher/${id}`);
      const chatData = await response.json();
  
      const formattedMessages = chatData.messages.map((message: { text: string; source: string; createdAt: Date }) => {
        return {
          text: message.text, // Keep the message text
          source: message.source, // Keep the message source (user or chatbot)
          createdAt: message.createdAt, // Include createdAt timestamp
          prompt: message.source === 'user' ? message.text : null, // Keep the prompt if it's from the user
          answer: message.source === 'chatbot' ? formatResponse(message.text) : null, // Keep the answer if it's from the chatbot
        };
      }).filter((message: { prompt: any; answer: any; }) => message.prompt || message.answer); // Filter out messages that are empty
  
      setChat(formattedMessages); // Set the chat state with formatted messages
    } catch (error) {
      console.error("Error fetching chat data:", error);
    }
  };
  
  
  

  const formatResponse = (response: string) => {
    return response
      .replace(/:/g, ":<br>")
      .replace(/\*\*(.*?)\*\*/g, "<b>$1</b>") 
      .replace(/(\d+\.\s+)/g, "<br>$1");
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="h-screen flex flex-row bg-gradient-to-r bg-white/95">
      <div className="mb-20">
        <Sidebar />
      </div>

      <div className="flex flex-col space-y-4 overflow-y-auto  bg-white/90 mb-5 mt-10 mr-1  w-[119vh] bg-opacity-10 p-6 rounded-3xl shadow-xl backdrop-blur-md " dir="ltr">
  <div className="flex flex-col space-y-4 overflow-y-auto flex-grow bg-white bg-opacity-10 p-6 h-[75vh] backdrop-blur-md transition-transform duration-300 ease-in-out" dir="rtl">
  {chat.map((item, index) => (
  <div key={index} className="flex flex-col">
    {/* Render user's prompt */}
    {item.prompt && item.prompt.trim() !== ""&& (
      <div className="flex items-center mb-2">
        <Image src={StudentIcon} alt="Student Icon" className="w-8 h-8 rounded-full ml-2" />
        <div className="bg-secondary2/90 p-3 rounded-xl text-white animate-fade-in-up text-lg leading-relaxed max-w-[75%]">
          {item.prompt}
        </div>
      </div>
    )}
    {/* Render chatbot's answer */}
    {item.answer && (
      <div className="flex items-center justify-end mt-2">
        <div className="bg-secondary p-3 max-w-[75%] rounded-xl text-white animate-fade-in-up text-xl leading-relaxed" dangerouslySetInnerHTML={{ __html: item.answer }} />
        <Image src={StudentIcon} alt="Teacher Icon" className="w-8 h-8 rounded-full mr-2" />
      </div>
    )}
   
  </div>
))}

    {loading && <div className="self-end italic text-primary animate-pulse text-lg">المعلم يكتب  ...</div>}
    <div ref={messagesEndRef} />
  </div>

  <form onSubmit={handleSubmit} className="flex items-center space-x-4 pt-6">
    <input type="text" className="flex-grow p-4 text-right rounded-full border-2 border-primary focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition duration-200 ease-in-out text-gray-900 bg-white text-lg leading-relaxed" placeholder="...اسأل شيئًا" value={userInput} onChange={(e) => setUserInput(e.target.value)} />
    <button type="submit" className="bg-primary text-white rounded-full px-6 py-4 transition duration-200 ease-in-out hover:bg-secondary">
      إرسال
    </button>
  </form>
</div>

      <RightSidebar chatHistory={chatHistory} onChatClick={handleChatClick} />
    </div>
  );
}

export default Page;
