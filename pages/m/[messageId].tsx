'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import toast from 'react-hot-toast';
import { BiCopyAlt, BiLoader } from 'react-icons/bi';
import { FiAlertTriangle } from 'react-icons/fi';

const MessagePage = () => {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [password, setPassword] = useState('');
  const [showPasswordField, setShowPasswordField] = useState(false);
  const [hasTriedPassword, setHasTriedPassword] = useState(false);

  const router = useRouter();
  const { messageid } = router.query;

  const fetchMessage = async () => {
    if (!messageid || typeof messageid !== 'string') {
      setError('Invalid link');
      setLoading(false);
      return;
    }

    setLoading(true);
    setError('');
    setMessage('');

    try {
      const url = `https://lockit.up.railway.app/message/${messageid}${password ? `?password=${encodeURIComponent(password)}` : ''}`;
      const res = await fetch(url);
      const data = await res.json();

      if (!res.ok) {
        if (data.error?.toLowerCase().includes('password')) {
          setShowPasswordField(true);
        }
        throw new Error(data.error || 'Message not found');
      }

      setMessage(data.message);
      setShowPasswordField(false);
    } catch (err: any) {
      setError(err.message || 'Something went wrong');
    } finally {
      setLoading(false);
      setHasTriedPassword(true);
    }
  };

  useEffect(() => {
    if (!router.isReady) return;
    if (typeof messageid === 'string') {
      fetchMessage();
    }
  }, [router.isReady, messageid]);
  

  const copyToClipboard = () => {
    navigator.clipboard.writeText(message);
    toast.success('Message copied to clipboard!');
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white px-4 py-6 flex flex-col items-center justify-center">
      <div className="w-full md:w-[600px] p-6 bg-gradient-to-r from-indigo-600 to-purple-700 rounded-xl shadow-lg space-y-6 text-center">
        <div className="text-2xl font-bold">Secure Message</div>

        {loading ? (
          <div className="flex items-center justify-center gap-2 text-white">
            <BiLoader className="animate-spin" />
            <span>Loading...</span>
          </div>
        ) : error ? (
          <>
            <div className="text-red-200">
              <FiAlertTriangle className="mx-auto mb-2" />
              <p>{error}</p>
            </div>

            {showPasswordField && (
              <div className="space-y-4">
                <input
                  type="password"
                  placeholder="Enter password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-2 rounded-lg text-black"
                />
                <button
                  onClick={fetchMessage}
                  className="bg-white text-indigo-600 font-semibold px-4 py-2 rounded-xl hover:bg-gray-100 transition"
                >
                  Try Again
                </button>
              </div>
            )}
          </>
        ) : (
          <>
            <div className="bg-white text-gray-900 rounded-lg p-4 break-words">
              {message}
            </div>
            <button
              onClick={copyToClipboard}
              className="bg-white text-indigo-600 font-semibold px-4 py-2 rounded-xl flex items-center gap-2 mx-auto hover:bg-gray-100 transition"
            >
              <BiCopyAlt size={18} /> Copy Message
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default MessagePage;
