'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';

import toast from 'react-hot-toast';
import { BiCopyAlt, BiLoader } from 'react-icons/bi';
import { FiAlertTriangle } from 'react-icons/fi';

const MessagePage = () => {
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const params = useSearchParams();
  const id = params.get('id');

  useEffect(() => {
    if (!id) {
      setError('Invalid link');
      setLoading(false);
      return;
    }

    const fetchMessage = async () => {
      try {
        const res = await fetch(`https://your-backend.com/api/messages/${id}`);
        const data = await res.json();

        if (!res.ok) throw new Error(data.message || 'Message not found');

        setMessage(data.message);
      } catch (err: any) {
        setError(err.message || 'Something went wrong');
      } finally {
        setLoading(false);
      }
    };

    fetchMessage();
  }, [id]);

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
          <div className="text-red-200">
            <FiAlertTriangle className="mx-auto mb-2" />
            <p>{error}</p>
          </div>
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


