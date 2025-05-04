'use client';

import { useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import MessageCreated from './MessageCreated';

async function encryptMessage(
  plainText: string
): Promise<{ encryptedContent: string; encryptionKey: string }> {
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
  const encrypted = await crypto.subtle.encrypt({ name: 'AES-GCM', iv }, cryptoKey, encoded);

  const base64Iv = btoa(String.fromCharCode(...iv));
  const base64Cipher = btoa(String.fromCharCode(...new Uint8Array(encrypted)));
  const base64Key = btoa(String.fromCharCode(...key));

  return {
    encryptedContent: `${base64Iv}:${base64Cipher}`,
    encryptionKey: base64Key,
  };
}

interface NewMessage {
  id: string;
}

interface MessageFormProps {
  onNewMessage?: (newMessage: NewMessage) => void;
}

const MessageForm: React.FC<MessageFormProps> = ({ onNewMessage }) => {
  const [messageContent, setMessageContent] = useState('');
  const [createdId, setCreatedId] = useState<string | null>(null);
  const [encryptionKey, setEncryptionKey] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const [expiration, setExpiration] = useState<string | null>(null);
  const [enablePassword, setEnablePassword] = useState(false);
  const [password, setPassword] = useState('');
  const [selfDestruct, setSelfDestruct] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageContent.trim()) {
      toast.error('Message cannot be empty.');
      return;
    }

    setLoading(true);

    try {
      const { encryptedContent, encryptionKey } = await encryptMessage(messageContent.trim());

      const messageData = {
        content: encryptedContent,
        expiration,
        password: enablePassword ? password : null,
        selfDestruct,
      };

      const res = await fetch('https://lockit.up.railway.app/message', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(messageData),
      });

      const data = await res.json();
      if (res.ok) {
        setCreatedId(data.id);
        setEncryptionKey(encryptionKey);
        if (onNewMessage) onNewMessage({ id: data.id });

        toast.success('Message created successfully!');
        setMessageContent('');
        setPassword('');
        setExpiration(null);
        setEnablePassword(false);
        setSelfDestruct(false);
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
      <form onSubmit={handleSubmit} className="space-y-6">
        <textarea
          className="w-full p-4 border border-gray-300 text-white rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 placeholder-gray-400 transition"
          placeholder="Enter your secure message..."
          value={messageContent}
          onChange={(e) => setMessageContent(e.target.value)}
          rows={5}
        />

        <div>
          <label htmlFor="expiration" className="block text-gray-300 mb-1">
            Expiration Time (optional)
          </label>
          <input
            type="time"
            id="expiration"
            value={expiration || ''}
            onChange={(e) => setExpiration(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-xl shadow-sm"
          />
        </div>

        <div className="flex items-center justify-between">
          <span className="text-gray-300">Password Protection</span>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={enablePassword}
              onChange={() => setEnablePassword(!enablePassword)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none rounded-full peer-checked:bg-indigo-600 transition-all"></div>
            <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform peer-checked:translate-x-full"></div>
          </label>
        </div>

        {enablePassword && (
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-xl shadow-sm"
            placeholder="Enter password"
          />
        )}

        <div className="flex items-center justify-between">
          <span className="text-gray-300">Enable Self-Destruct after viewing</span>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={selfDestruct}
              onChange={() => setSelfDestruct(!selfDestruct)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none rounded-full peer-checked:bg-indigo-600 transition-all"></div>
            <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform peer-checked:translate-x-full"></div>
          </label>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-indigo-600 cursor-pointer hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-xl transition"
        >
          {loading ? 'Creating...' : 'Create Message'}
        </button>
      </form>
    </>
  );
};

export default MessageForm;

