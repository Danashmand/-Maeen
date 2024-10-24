import React from "react";

interface SidebarProps {
  chatHistory: { id: string; firstMessage: string; date: string }[];
  onChatClick: (id: string) => void; // Add onChatClick prop
}

const RightSidebar: React.FC<SidebarProps> = ({ chatHistory, onChatClick }) => {
  return (
    <div className="bg-white/40 flex flex-col justify-start shadow-lg p-4 rounded-md h-full max-w-xs">
      <h2 className="text-xl font-bold mb-4 text-blue-600">Chat History</h2>
      <ul className="flex-1 overflow-y-auto">
        {chatHistory.map((chat) => (
          <li
            key={chat.id}
            className="mb-2 p-3 border-b border-gray-300 hover:bg-blue-100 cursor-pointer transition-colors"
            onClick={() => onChatClick(chat.id)}
          >
            <p className="text-gray-800">
              <strong>Q:</strong> {chat.firstMessage}
            </p>
            <p className="text-gray-600">
              <strong>Date:</strong> {chat.date}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default RightSidebar;
