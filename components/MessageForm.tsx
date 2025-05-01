import { useState } from "react";

interface MessageFormProps {
  onNewMessage: (newMessage: any) => void;
}

const MessageForm: React.FC<MessageFormProps> = ({ onNewMessage }) => {
  const [messageContent, setMessageContent] = useState<string>("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!messageContent.trim()) return;

    const newMessage = {
      content: messageContent.trim(),
      expiresAt: new Date(Date.now() + 3600000), // 1 hour expiration
      viewCount: 0,
    };

    onNewMessage(newMessage);
    setMessageContent("");
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <textarea
        className="w-full p-4 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-800 placeholder-gray-400 transition"
        placeholder="Enter your secure message..."
        value={messageContent}
        onChange={(e) => setMessageContent(e.target.value)}
        rows={5}
      />
      <button
        type="submit"
        className="w-full cursor-pointer bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-xl transition"
      >
        Create Message
      </button>
    </form>
  );
};

export default MessageForm;
