'use client';

import { useState } from 'react';
import toast from 'react-hot-toast';
import Modal from './SucessModal';

export default function MessageForm() {
  const [message, setMessage] = useState('');
  const [password, setPassword] = useState('');
  const [expiration, setExpiration] = useState<number | null>(null);
  const [burnAfterReading, setBurnAfterReading] = useState(!true);
  const [loading, setLoading] = useState(false);
  const [link, setLink] = useState('');

  const shortenLink = async (longUrl: string): Promise<string> => {
    try {
      const res = await fetch(
        `https://tinyurl.com/api-create.php?url=${encodeURIComponent(longUrl)}`
      );
      if (!res.ok) throw new Error('Failed to shorten URL');
      return await res.text();
    } catch (error) {
      console.error('TinyURL Error:', error);
      return longUrl; // Fallback to original link if shortening fails
    }
  };

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
        const generatedLink = `${window.location.origin}/m/${parsedData.id}`;
        const shortLink = await shortenLink(generatedLink);
        setLink(shortLink);
        toast.success('Message created!');
      } else {
        const parsedData = JSON.parse(data);
        if (parsedData.error?.toLowerCase().includes('password')) {
          console.log('Password error:', parsedData.error);
        }
        throw new Error(parsedData.error || 'Something went wrong');
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

        <div className="flex flex-row justify-between">
          <div className="flex items-center gap-2">
            <p className="md:text-md text-sm text-gray-300">Expire in</p>
            <input
              type="number"
              value={expiration ?? ''}
              onChange={(e) =>
                setExpiration(e.target.value ? Number(e.target.value) : null)
              }
              placeholder=""
              className="p-1 w-12 rounded-lg bg-gray-900 text-white border border-gray-700"
            />
            <p className="md:text-md text-sm text-gray-300">minutes</p>
          </div>

          <label className="flex sm:flex-col items-center gap-2 cursor-pointer select-none">
            <div className="relative">
              <input
                type="checkbox"
                checked={burnAfterReading}
                onChange={(e) => setBurnAfterReading(e.target.checked)}
                className="sr-only"
              />
              <div
                className={`w-10 h-5 rounded-full transition-colors ${
                  burnAfterReading ? 'bg-blue-700' : 'bg-gray-300'
                }`}
              />
              <div
                className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${
                  burnAfterReading ? 'translate-x-5' : ''
                }`}
              />
            </div>
            <p className="md:text-md text-sm text-gray-300">Self-destruct</p>
          </label>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full cursor-pointer bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-3 rounded-lg"
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

