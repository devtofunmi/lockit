import { useState } from 'react';
import MessageForm from '@/components/MessageForm';
import MessageSuccess from '@/components/MessageSuccess';

export default function HomePage() {
  const [link, setLink] = useState<string | null>(null);

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 to-white text-gray-800 px-4 py-5 flex flex-col justify-between">
      {/* logo */}
      <h1 className="text-2xl font-bold mb-8 text-indigo-700">
        Lock<span className="text-black">it.</span>
      </h1>

      {/* Hero Section */}
      <div className="flex flex-col lg:flex-row justify-between items-center gap-10 px-4 md:px-20 py-10">
        <section className="max-w-2xl w-full">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-indigo-600 leading-[50px]">
            Your privacy is<br /> absolute
          </h1>
          <p className="text-lg text-gray-600 mb-6">
            Every message is encrypted on your device using military-grade algorithms before it ever leaves your browser. Not even we can decrypt it.
          </p>
        </section>

        {/* Message Form */}
        <section className="bg-white rounded-2xl shadow-xl p-8 w-full md:w-[500px] border border-gray-100">
          {link ? (
            <MessageSuccess link={link} />
          ) : (
            <>
              <h2 className="text-xl font-semibold text-gray-700 mb-4">
                Create a secure message
              </h2>
              <MessageForm
                onNewMessage={(newMessage) => {
                  setLink(`/message/${newMessage.id}`);
                }}
              />
            </>
          )}
        </section>
      </div>

      {/* How It Works */}
      <section className="mt-24 max-w-5xl mx-auto px-4">
        <h3 className="text-2xl font-bold text-center text-gray-800 mb-8">
          How Lockit Works
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center text-gray-600">
          <div className="bg-indigo-100 p-6 rounded-lg shadow-md">
            <h4 className="font-semibold mb-1">Write a Message</h4>
            <p className="text-sm">
              Type your private message using the secure form.
            </p>
          </div>
          <div className="bg-indigo-100 p-6 rounded-lg shadow-md">
            <h4 className="font-semibold mb-1">Get a Shareable Link</h4>
            <p className="text-sm">You’ll receive a unique link to share.</p>
          </div>
          <div className="bg-indigo-100 p-6 rounded-lg shadow-md">
            <h4 className="font-semibold mb-1">Self-Destruct</h4>
            <p className="text-sm">
              Once opened, the message is permanently deleted.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-24 border-t border-gray-200 pt-6 text-center text-sm text-gray-500">
        <p>&copy; {new Date().getFullYear()} Lockit — Built for privacy-first sharing.</p>
        <p className="mt-1">Built with 🖤 by{' '}
           <a
             href="https://devtofunmi.vercel.app"
             target="_blank"
             rel="noopener noreferrer"
             className="font-bold hover:underline"
           >
             Tofunmi
           </a></p>
        </footer>

     
    </main>
  );
}