import React from "react";
import Logo from "../public/Group 367.png"; 
import Image from "next/image";
interface SidebarProps {
  chatHistory: { id: string; firstMessage: string; date: string }[];
  onChatClick: (id: string) => void;
}

const RightSidebar: React.FC<SidebarProps> = ({ chatHistory, onChatClick }) => {
  return (
    
    <div className="flex flex-col justify-start shadow-lg p-4 m-10 w-80 bg-gradient-to-b from-primary to-secondary2 rounded-3xl transition-transform duration-300 ease-out-in">
  <div className="flex  justify-end  items-center mb-1 mr-5">

      <h2 className="text-2xl font-bold text-white text-center">محادثاتك السابقة</h2>
      <Image src={Logo} alt="Logo" className="mx-2" />
      <br />
  
  </div>
      <hr className="my-3 border-2" />
      <ul className="flex-1 overflow-y-auto scrollbar-thin ">
        {chatHistory.map((chat) => (
          <li
            key={chat.id}
            className="mb-2 p-3 border-gray-500 hover:bg-secondary2 cursor-pointer transition-colors"
            onClick={() => onChatClick(chat.id)}
          >
            <p className="text-gray-100 text-lg text-right">
              {chat.firstMessage}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default RightSidebar;
