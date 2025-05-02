import { useEffect, useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';

interface MessageCreatedProps {
  messageId: string;
  encryptionKey: string;
  onCopied: () => void; // ✅ New prop
}

const MessageCreated: React.FC<MessageCreatedProps> = ({ messageId, encryptionKey, onCopied }) => {
  const [shareLink, setShareLink] = useState('');

  useEffect(() => {
    const origin = typeof window !== 'undefined' ? window.location.origin : '';
    const link = `${origin}/m/${messageId}#${encryptionKey}`;
    setShareLink(link);
  }, [messageId, encryptionKey]);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(shareLink);
      toast.success('Link copied to clipboard!');
      onCopied(); // ✅ Close after copy
    } catch {
      toast.error('Failed to copy link');
    }
  };

  return (
    <div className="max-w-xl p-6 bg-white rounded-xl shadow-lg text-center space-y-4">
      <Toaster position="top-right" />
      <h1 className="text-2xl font-semibold text-green-700">Message Created Successfully</h1>
      <p className="text-gray-700">
        Share this link. The recipient must visit it before it expires. It contains the decryption key.
      </p>
      <div className="bg-gray-100 p-3 rounded break-all text-sm text-gray-800">{shareLink}</div>
      <button
        onClick={copyToClipboard}
        className="bg-indigo-600 cursor-pointer hover:bg-indigo-700 text-white px-4 py-2 rounded-xl transition"
      >
        Copy Link
      </button>
    </div>
  );
};

export default MessageCreated;