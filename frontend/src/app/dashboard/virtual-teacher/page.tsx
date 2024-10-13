"use client"

import React, { useState, useEffect, useRef } from 'react';
import Sidebar from '@/app/_components/sidebar';

function Page() {
  const [chat, setChat] = useState<{ prompt: string; answer: string }[]>([]);
  const [loading, setLoading] = useState(false);
  const [userInput, setUserInput] = useState('');
  const messagesEndRef = useRef<null | HTMLDivElement>(null);
  const [userData, setUserData] = useState<{ _id: string; name: string; email: string } | null>(null);

  // Scroll to bottom of the chat when new messages are added
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Fetch user data from local storage
  useEffect(() => {
    const fetchUserData = async () => {
      const user = localStorage.getItem('user'); // Retrieve the user data
      if (user) {
        setUserData(JSON.parse(user));
        console.log('User data:', JSON.parse(user));
      }
    };

    fetchUserData();
  }, []);

  // Handle user input submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
 

    // Append the user's prompt to the chat
    const userPrompt = { prompt: userInput, answer: '' };
    setChat(prev => [...prev, userPrompt]);
    setUserInput(''); // Clear input

    // Call the API to get the answer
    setLoading(true);
    try {
      const response = await fetch('http://localhost:3000/virtual-teacher/ask', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: userInput,
          userId: userData?._id,  // Pass userId from userData
         
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch teacher response');
      }

      const data = await response.json();
      console.log('Teacher response:', data);
      const teacherResponse = { prompt: userInput, answer: data.answer };

      // Update the chat with the response
      setChat(prev => {
        const updatedChat = [...prev];
        updatedChat[updatedChat.length - 1].answer = teacherResponse.answer;
        return updatedChat;
      });
    } catch (error) {
      console.error('Error fetching the API', error);
    } finally {
      setLoading(false);
      scrollToBottom(); // Ensure the latest message is visible
    }
  };

  return (
    <div className="h-screen flex flex-row bg-gray-50">
      <div className='mb-10'>
        <Sidebar />
      </div>

      <div className="flex flex-col justify-between flex-grow p-4 text-black">
        {/* Header */}
        <div className="text-2xl font-bold mb-4">Virtual Teacher Chat</div>

        {/* Chat window */}
        <div className="flex flex-col space-y-4 overflow-y-auto flex-grow bg-white p-4 rounded-lg shadow-md max-h-[75vh]">
          {chat.map((item, index) => (
            <div key={index} className="flex flex-col">
              <div className="bg-blue-100 p-2 rounded-md self-start mb-2">
                <span className="font-semibold">You:</span> {item.prompt}
              </div>
              {item.answer && (
                <div className="bg-green-100 p-2 rounded-md self-end">
                  <span className="font-semibold">Teacher:</span> {item.answer}
                </div>
              )}
            </div>
          ))}
          {loading && <div className="self-end italic text-gray-500">Teacher is typing...</div>}
          <div ref={messagesEndRef} />
        </div>

        {/* Input field */}
        <form onSubmit={handleSubmit} className="flex items-center space-x-4 pt-4">
          <input
            type="text"
            className="flex-grow p-2 border border-gray-300 rounded-md"
            placeholder="Ask something..."
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
          />
          <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600">
            Send
          </button>
        </form>
      </div>
    </div>
  );
}

export default Page;
