import { useRouter } from 'next/router';
import { getMockMessage } from '../../lib/mockMessages';
import MessageView from '../../components/MessageView';
import { useEffect, useState } from 'react';

export default function MessagePage() {
  const router = useRouter();
  const { id } = router.query;
  const [content, setContent] = useState<string | null>(null);
  const [expired, setExpired] = useState(false);

  useEffect(() => {
    if (typeof id === 'string') {
      const msg = getMockMessage(id);
      if (msg) setContent(msg.content);
      else setExpired(true);
    }
  }, [id]);

  if (expired) {
    return (
      <main className="p-8 max-w-xl mx-auto">
        <h1 className="text-2xl font-bold text-red-600">Message not found or expired</h1>
      </main>
    );
  }

  return (
    <main className="p-8 max-w-xl mx-auto">
      {content ? <MessageView content={content} /> : <p>Loading...</p>}
    </main>
  );
}
