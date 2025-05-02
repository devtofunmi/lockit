import { useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import MessageCreated from './MessageCreated';

interface EncryptedResult {
  encryptedContent: string;
  key: string;
}

async function encryptMessage(plainText: string): Promise<EncryptedResult> {
  const key = crypto.getRandomValues(new Uint8Array(16));
  const iv = crypto.getRandomValues(new Uint8Array(12));

  const cryptoKey = await crypto.subtle.importKey(
    'raw',
    key,
    { name: 'AES-GCM' },
    false,
    ['encrypt']
  );

  const encoded = new TextEncoder().encode(plainText);
  const encrypted = await crypto.subtle.encrypt(
    { name: 'AES-GCM', iv },
    cryptoKey,
    encoded
  );

  const base64Key = btoa(String.fromCharCode(...key));
  const base64Iv = btoa(String.fromCharCode(...iv));
  const base64Cipher = btoa(String.fromCharCode(...new Uint8Array(encrypted)));

  return {
    encryptedContent: `${base64Iv}:${base64Cipher}`,
    key: base64Key,
  };
}

interface NewMessage {
  id: string;
  key: string;
}

interface MessageFormProps {
  onNewMessage?: (newMessage: NewMessage) => void;
}

const MessageForm: React.FC<MessageFormProps> = ({ onNewMessage }) => {
  const [messageContent, setMessageContent] = useState('');
  const [createdId, setCreatedId] = useState<string | null>(null);
  const [encryptionKey, setEncryptionKey] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageContent.trim()) {
      toast.error('Message cannot be empty.');
      return;
    }

    setLoading(true);

    try {
      const { encryptedContent, key } = await encryptMessage(messageContent.trim());

      const res = await fetch('https://lockit.up.railway.app/message', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: encryptedContent }),
      });

      const data = await res.json();
      if (res.ok) {
        setCreatedId(data.id);
        setEncryptionKey(key);

        if (onNewMessage) onNewMessage({ id: data.id, key });

        toast.success('Message created successfully!');
        setMessageContent('');
      } else {
        toast.error(data.error || 'Failed to create message.');
      }
    } catch (error) {
      console.error(error);
      toast.error('Encryption or network error.');
    } finally {
      setLoading(false);
    }
  };

  if (createdId && encryptionKey) {
    return (
      <>
        <Toaster position="top-right" />
        <MessageCreated
          messageId={createdId}
          encryptionKey={encryptionKey}
          onCopied={() => {
            setCreatedId(null);
            setEncryptionKey(null);
          }}
        />
      </>
    );
  }
  
  

  return (
    <>
      <Toaster position="top-right" />
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
          disabled={loading}
          className="w-full cursor-pointer bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-xl transition"
        >
          {loading ? 'Creating...' : 'Create Message'}
        </button>
      </form>
    </>
  );
};

export default MessageForm;