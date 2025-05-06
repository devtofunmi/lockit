'use client';

import { useState } from 'react';
import toast from 'react-hot-toast';
import Modal from './SucessModal';

export default function MessageForm() {
  const [message, setMessage] = useState('');
  const [password, setPassword] = useState('');
  const [expiration, setExpiration] = useState<number | null>(null);
  const [burnAfterReading, setBurnAfterReading] = useState(true);
  const [loading, setLoading] = useState(false);
  const [link, setLink] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  
    if (!message.trim()) {
      toast.error('Message cannot be empty');
      return;
    }
  
    setLoading(true);
    try {
      const requestBody: {
        message: string;
        expirationMinutes: number | null;
        burnAfterReading: boolean;
        password?: string;
      } = {
        message,
        expirationMinutes: expiration,
        burnAfterReading,
      };
  
      if (password.trim()) {
        requestBody.password = password.trim();
      }
  
      const res = await fetch('https://lockit.up.railway.app/message', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody),
      });
  
      const data = await res.text();
  
      if (res.ok) {
        const parsedData = JSON.parse(data);
        const generatedLink = `${window.location.origin}/m/${parsedData.id}`; // ✅ updated here
        setLink(generatedLink);
        toast.success('Message created!');
      } else {
        throw new Error(data || 'Something went wrong');
      }
    } catch (err: any) {
      console.error('Error:', err);
      toast.error(err.message || 'Error sending message');
    } finally {
      setLoading(false);
    }
  };
  
  
  


  return (
    <div>
    <form onSubmit={handleSubmit} className="space-y-4">
      <textarea
        rows={5}
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Type your secret message here..."
        className="w-full p-4 rounded-lg bg-gray-900 text-white border border-gray-700"
        required
      />

      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Optional password (recipient must know)"
        className="w-full p-3 rounded-lg bg-gray-900 text-white border border-gray-700"
      />

      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
        <input
          type="number"
          value={expiration ?? ''}
          onChange={(e) => setExpiration(e.target.value ? Number(e.target.value) : null)}
          placeholder="Expire after (minutes)"
          className="flex-1 p-3 rounded-lg bg-gray-900 text-white border border-gray-700"
        />

        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={burnAfterReading}
            onChange={(e) => setBurnAfterReading(e.target.checked)}
          />
          Burn after reading
        </label>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-3 rounded-lg"
      >
        {loading ? 'Encrypting...' : 'Create Secure Message'}
      </button>

      

    </form>
    {link && (
  <Modal
    link={link}
    onClose={() => setLink('')}
  />
)}
    </div>
  );
}
