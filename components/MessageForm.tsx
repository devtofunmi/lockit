'use client';

import { useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import Modal from './SucessModal';

const MessageForm: React.FC = () => {
  const [messageContent, setMessageContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [expirationMinutes, setExpirationMinutes] = useState<number | ''>('');
  const [enablePassword, setEnablePassword] = useState(false);
  const [password, setPassword] = useState('');
  const [selfDestruct, setSelfDestruct] = useState(false);

  // Modal state
  const [showModal, setShowModal] = useState(false);
  const [generatedLink, setGeneratedLink] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!messageContent.trim()) {
      toast.error('Message cannot be empty');
      return;
    }

    setLoading(true);

    try {
      const payload: any = {
        content: messageContent,
        selfDestruct,
      };

      if (enablePassword && password) payload.password = password;
      if (expirationMinutes) {
        const expireAt = new Date(Date.now() + Number(expirationMinutes) * 60000).toISOString();
        payload.expireAt = expireAt;
      }

      const res = await fetch('https://your-backend-url/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.message || 'Something went wrong');
        return;
      }

      // Use short ID in the frontend link
      const link = `${window.location.origin}/msg/${data.id}`;
      setGeneratedLink(link);
      setShowModal(true);

      // Reset form
      setMessageContent('');
      setPassword('');
      setEnablePassword(false);
      setExpirationMinutes('');
      setSelfDestruct(false);
    } catch (err) {
      toast.error('Failed to send message');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Toaster position="top-right" />
      <form onSubmit={handleSubmit} className="space-y-6">
        <textarea
          className="w-full p-4 border border-gray-300 text-white rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 placeholder-gray-400 transition bg-transparent"
          placeholder="Enter your secure message..."
          value={messageContent}
          onChange={(e) => setMessageContent(e.target.value)}
          rows={5}
        />

        <div>
          <label htmlFor="expiration" className="block text-gray-300 mb-1">
            Expiration (in minutes, optional)
          </label>
          <input
            type="number"
            id="expiration"
            value={expirationMinutes}
            min={1}
            onChange={(e) => setExpirationMinutes(e.target.value ? parseInt(e.target.value) : '')}
            placeholder="e.g. 10"
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
          <span className="text-gray-300">Self-destruct after viewing</span>
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

      {showModal && (
        <Modal link={generatedLink} onClose={() => setShowModal(false)} />
      )}
    </>
  );
};

export default MessageForm;