import { useState } from 'react';
import MessageForm from '@/components/MessageForm';
import MessageCreated from '@/components/MessageCreated';


export default function HomePage() {
  const [link, setLink] = useState<{ id: string; key: string } | null>(null);

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-100 to-white text-gray-900 px-4 py-6 flex flex-col justify-between">
      {/* Logo */}
      <h1 className="text-2xl px-4 font-bold mb-10 text-blue-600">
        Lock<span className="text-gray-900">it.</span>
      </h1>

      {/* Hero Section */}
      <div className="flex flex-col lg:flex-row justify-between items-center gap-10 px-4 md:px-20 py-8 md:py-12">
        <section className="max-w-2xl w-full">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight text-gray-900">
            Secure messaging<br /> built for trust
          </h1>
          <p className="text-lg text-gray-700">
            Your messages are end-to-end encrypted directly in your browser using industry-leading standards. Only the recipient can access them—no one else.
          </p>
        </section>

        {/* Message Form */}
        <section className="bg-white rounded-xl shadow-md p-5 w-full md:w-[500px] border border-gray-200">
        {link ? (
           <MessageCreated
             messageId={link.id}
             encryptionKey={link.key}
             onCopied={() => setLink(null)}
           />
         ) : (
           <>
             <h2 className="text-lg font-medium text-gray-800 mb-4">
              Create a secure message
             </h2>
             <MessageForm
               onNewMessage={(newMessage) => {
                 setLink({ id: newMessage.id, key: newMessage.key });
               }}
             />
           </>
         )}


        </section>
      </div>

      {/* How It Works */}
      <section className="mt-24 max-w-5xl mx-auto px-4">
        <h3 className="text-2xl font-semibold text-center text-gray-900 mb-10">
          How Lockit Works
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center text-gray-700">
          <div className="bg-gray-50 p-6 rounded-lg border border-gray-200 shadow-sm">
            <h4 className="font-semibold text-blue-600 mb-2">Write a Message</h4>
            <p className="text-sm">Type your confidential message using the secure form.</p>
          </div>
          <div className="bg-gray-50 p-6 rounded-lg border border-gray-200 shadow-sm">
            <h4 className="font-semibold text-blue-600 mb-2">Get a Shareable Link</h4>
            <p className="text-sm">Receive a unique, private link to share securely.</p>
          </div>
          <div className="bg-gray-50 p-6 rounded-lg border border-gray-200 shadow-sm">
            <h4 className="font-semibold text-blue-600 mb-2">Self-Destruct</h4>
            <p className="text-sm">Once opened, the message is deleted permanently.</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-24 border-t border-gray-200 pt-6 text-center text-sm text-gray-600">
        <p>&copy; {new Date().getFullYear()} Lockit — Privacy-first messaging for professionals.</p>
        <p className="mt-1">
          Built with care by{' '}
          <a
            href="www.tofunmi.xyz"
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold hover:underline"
          >
            Tofunmi
          </a>
        </p>
      </footer>
    </main>
  );
}
