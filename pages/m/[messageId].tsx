import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

export default function ViewMessagePage() {
  const router = useRouter();
  const { messageId } = router.query;

  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showPasswordField, setShowPasswordField] = useState(false);
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (!router.isReady || typeof messageId !== 'string') return;

    const fetchMessage = async () => {
      setLoading(true);
      setError('');
      setMessage('');

      try {
        const url = `https://lockit.up.railway.app/message/${messageId}`;
        const res = await fetch(url);
        const data = await res.json();

        if (!res.ok) {
          if (data.error?.toLowerCase().includes('password')) {
            setShowPasswordField(true);
            return;
          }
          throw new Error(data.error || 'Message not found');
        }

        setMessage(data.message);
        setShowPasswordField(false);
      } catch (err: any) {
        // console.error(err);
        setError(err.message || 'Something went wrong');
      } finally {
        setLoading(false);
      }
    };

    fetchMessage();
  }, [router.isReady, messageId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!password) {
      setError('Please enter a password.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const url = `https://lockit.up.railway.app/message/${messageId}?password=${encodeURIComponent(password)}`;
      const res = await fetch(url);
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Incorrect password');
      }

      setMessage(data.message);
      setShowPasswordField(false);
      setPassword('');
    } catch (err: any) {
      // console.error(err);
      setError(err.message || 'Incorrect password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0a0f1c] to-[#040711] text-white flex items-center justify-center px-4">
      <div className="bg-white/5 backdrop-blur-md shadow-md rounded-lg p-6 max-w-md w-full space-y-4">
        {loading ? (
          <div className="flex justify-center items-center h-20">
            <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : (
          message && (
            <p className=" whitespace-pre-wrap">{message}</p>
          )
        )}

        {showPasswordField && (
          <form onSubmit={handleSubmit} className="space-y-3 text-white">
            <label className="block text-sm font-medium">
              Enter password to unlock:
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-2 border rounded"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute cursor-pointer inset-y-0 right-2 text-sm text-blue-500"
              >
                {showPassword ? 'Hide' : 'Show'}
              </button>
            </div>
            <button
              type="submit"
              className="bg-blue-500 cursor-pointer text-white px-4 py-2 rounded hover:bg-blue-600 w-full"
            >
              Unlock Message
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

