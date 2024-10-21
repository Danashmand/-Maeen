"use client";

import React, { useState, useEffect, useRef } from "react";
import Sidebar from "@/app/_components/sidebar";
import StudentIcon from "../../public/R.png";
import TeacherIcon from "../../public/techer).png";
import Image from "next/image";
function Page() {
  const [chat, setChat] = useState<{ prompt: string; answer: string }[]>([]);
  const [loading, setLoading] = useState(false);
  const [userInput, setUserInput] = useState("");
  const messagesEndRef = useRef<null | HTMLDivElement>(null);
  const [userData, setUserData] = useState<{ _id: string; name: string; email: string } | null>(null);

  // Scroll to bottom of the chat when new messages are added
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Fetch user data from local storage
  useEffect(() => {
    const fetchUserData = async () => {
      const user = localStorage.getItem("user"); // Retrieve the user data
      if (user) {
        setUserData(JSON.parse(user));
      }
    };

    fetchUserData();
  }, []);

  // Handle user input submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Append the user's prompt to the chat
    const userPrompt = { prompt: userInput, answer: "" };
    setChat((prev) => [...prev, userPrompt]);
    setUserInput(""); // Clear input

    // Call the API to get the answer
    setLoading(true);
    try {
      const response = await fetch("http://localhost:3000/virtual-teacher/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: userInput,
          userId: userData?._id, // Pass userId from userData
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to fetch teacher response");
      }

      const data = await response.json();
      const teacherResponse = { prompt: userInput, answer: data.answer };

      // Update the chat with the response
      setChat((prev) => {
        const updatedChat = [...prev];
        updatedChat[updatedChat.length - 1].answer = teacherResponse.answer;
        return updatedChat;
      });
    } catch (error) {
      console.error("Error fetching the API", error);
    } finally {
      setLoading(false);
      scrollToBottom(); // Ensure the latest message is visible
    }
  };

  return (
    <div className="h-screen flex flex-row bg-gradient-to-r bg-white ">
      <div className="mb-10">
        <Sidebar />
      </div>

      <div className="flex flex-col justify-between flex-grow p-6 text-white ">
        {/* Header */}
        <div className="text-3xl font-extrabold mb-6 tracking-tight">Virtual Teacher Chat</div>

        {/* Chat window */}
        <div className="flex flex-col space-y-4 overflow-y-auto flex-grow bg-white bg-opacity-10 p-6 rounded-lg shadow-lg max-h-[75vh] backdrop-blur-md">
          {chat.map((item, index) => (
            <div key={index} className="flex flex-col">
              <div className="flex items-center mb-2">
                <Image
                  src={StudentIcon}
                  alt="Student Icon"
                  className="w-8 h-8 rounded-full mr-2"
                />
                <div className="bg-secondary p-3 rounded-xl text-white animate-fade-in-up">
                  {item.prompt}
                </div>
              </div>
              {item.answer && (
                <div className="flex items-center justify-end mt-2">
                  <div className="bg-primary p-3 rounded-xl text-white animate-fade-in-up">
                    {item.answer}
                  </div>
                  <Image
                    src={StudentIcon}
                    alt="Teacher Icon"
                    className="w-8 h-8 rounded-full ml-2 "
                  />
                </div>
              )}
            </div>
          ))}
          {loading && <div className="self-end italic text-primary animate-pulse">Teacher is typing...</div>}
          <div ref={messagesEndRef} />
        </div>

        {/* Input field */}
        <form onSubmit={handleSubmit} className="flex items-center space-x-4 pt-6">
          <input
            type="text"
            className="flex-grow p-3 rounded-full border-2 border-primary focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition duration-200 ease-in-out text-gray-900 bg-white"
            placeholder="Ask something..."
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
          />
          <button
            type="submit"
            className="px-5 py-3 bg-pink-600 text-white rounded-full font-bold hover:bg-pink-700 transition duration-300 ease-in-out transform hover:scale-105"
          >
            إرسال
          </button>
        </form>
      </div>
    </div>
  );
}

export default Page;
