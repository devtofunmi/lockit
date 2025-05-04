// pages/message/[messageId].tsx

import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

const MessagePage = () => {
  const router = useRouter();
  const { messageId } = router.query;

  const [decrypted, setDecrypted] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!router.isReady || !messageId) return;

    const key = window.location.hash.slice(1); // Get key from #hash
    if (!key) {
      setError('Decryption key is missing in the URL.');
      return;
    }

    const fetchAndDecrypt = async () => {
      try {
        const res = await fetch(
          `https://lockit.up.railway.app/message/${messageId}/${key}`
        );
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Message not found');

        const [ivBase64, cipherBase64] = data.content.split(':');
        const iv = Uint8Array.from(atob(ivBase64), c => c.charCodeAt(0));
        const cipherBytes = Uint8Array.from(atob(cipherBase64), c => c.charCodeAt(0));
        const keyBytes = Uint8Array.from(atob(key), c => c.charCodeAt(0));

        const cryptoKey = await crypto.subtle.importKey(
          'raw',
          keyBytes,
          { name: 'AES-GCM' },
          false,
          ['decrypt']
        );

        const decryptedBuffer = await crypto.subtle.decrypt(
          { name: 'AES-GCM', iv },
          cryptoKey,
          cipherBytes
        );

        const decoded = new TextDecoder().decode(decryptedBuffer);
        setDecrypted(decoded);
      } catch (err: any) {
        setError(err.message || 'Failed to decrypt the message.');
      }
    };

    fetchAndDecrypt();
  }, [router.isReady, messageId]);

  return (
    <div className="min-h-screen bg-gray-800 text-gray-900 px-4 py-6 flex flex-col items-center justify-center">
      <div className="w-full md:w-[600px] mx-auto p-6 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl shadow-lg text-center space-y-6">
        <div className="text-2xl font-bold text-white">Secure Message</div>

        {error ? (
          <div className="bg-red-100 p-4 rounded-xl shadow-md">
            <p className="text-red-600 text-lg font-semibold">{error}</p>
          </div>
        ) : decrypted ? (
          <div className="bg-white p-6 rounded-xl shadow-md text-left text-gray-900 break-words">
            <p className="whitespace-pre-wrap">{decrypted}</p>
          </div>
        ) : (
          <div className="flex justify-center items-center">
            <svg
              className="h-12 w-12 animate-spin text-white"
              viewBox="0 0 50 50"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle
                className="opacity-25"
                cx="25"
                cy="25"
                r="20"
                stroke="currentColor"
                strokeWidth="5"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M25 5a20 20 0 0 1 20 20h-5a15 15 0 0 0-15-15V5z"
              />
            </svg>
          </div>
        )}
      </div>
    </div>
  );
};

export default MessagePage;


