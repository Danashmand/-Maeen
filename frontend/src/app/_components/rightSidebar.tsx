import React from "react";

interface SidebarProps {
  chatHistory: { id: string; firstMessage: string; date: string }[];
  onChatClick: (id: string) => void;
}

const RightSidebar: React.FC<SidebarProps> = ({ chatHistory, onChatClick }) => {
  return (
    <div className="flex flex-col justify-start shadow-lg p-4 m-10 w-80 bg-gradient-to-b from-primary to-secondary2 rounded-3xl transition-transform duration-300 ease-out-in">
      <h2 className="text-3xl font-bold mb-4 text-white text-center">المحادثات السابقة</h2>
      <ul className="flex-1 overflow-y-auto scrollbar-thin">
        {chatHistory.map((chat) => (
          <li
            key={chat.id}
            className="mb-2 p-3 border-gray-500 hover:bg-secondary2 cursor-pointer transition-colors"
            onClick={() => onChatClick(chat.id)}
          >
            <p className="text-gray-100 text-xl text-right">
              {chat.firstMessage}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default RightSidebar;
