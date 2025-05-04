'use client';

import { useState } from 'react';
import MessageForm from '@/components/MessageForm';
import MessageCreated from '@/components/MessageCreated';

export default function HomePage() {
  const [linkId, setLinkId] = useState<string | null>(null);

  return (
    <main className="min-h-screen bg-gradient-to-b from-[#0a0f1c] to-[#040711] text-white flex flex-col items-center px-4">
      <div className="w-full max-w-3xl mx-auto text-center space-y-6 mt-10">
        {/* Logo */}
        <h1 className="text-3xl sm:text-4xl font-bold text-blue-200 mt-12">
          Lock<span className="text-gray-200">it.</span>
        </h1>

        {/* Hero Section */}
        <section className="space-y-4">
          <h2 className="text-3xl sm:text-5xl font-bold text-blue-200">
            Lockit: Secure messaging<br /> built for trust
          </h2>
          <p className="text-gray-300 max-w-xl mx-auto text-sm sm:text-base">
            "Encrypted in your browser. Recipient-only access."
          </p>
        </section>

        {/* Message Form */}
        <section className="mt-10 bg-white/5 backdrop-blur-md p-6 rounded-xl w-full mx-auto shadow-lg border border-white/10">
          {linkId ? (
            <MessageCreated
              messageId={linkId}
              onCopied={() => setLinkId(null)}
            />
          ) : (
            <>
              <h2 className="text-lg font-medium text-gray-100 mb-4">
                Create a secure message
              </h2>
              <MessageForm
                onNewMessage={(newMessage) => setLinkId(newMessage.id)}
              />
            </>
          )}
        </section>

        {/* How It Works */}
        <section className="mt-24 max-w-2xl mx-auto px-2 sm:px-4">
          <h3 className="text-2xl font-semibold text-gray-100 mb-10">
            How Lockit Works
          </h3>
          <div className="space-y-4 text-left">
            {[
              ["Write a Message", "Type your confidential message using the secure form."],
              ["Get a Shareable Link", "Receive a unique, private link to share securely."],
              ["Self-Destruct", "Once opened, the message is deleted permanently."],
              ["End-to-End Encrypted", "Messages are encrypted in your browser, so only the recipient can read them."],
              ["Set Expiration Time", "Optionally set a time for your message to expire, even if unopened."],
              ["Add Password Protection", "Lock messages with a password only the recipient knows."]
            ].map(([title, desc], idx) => (
              <p key={idx} className="text-sm text-gray-400">
                <span className="font-bold text-white">{title}</span> — {desc}
              </p>
            ))}
          </div>
        </section>

        {/* Footer */}
        <footer className="mt-24 border-t border-gray-700 pt-6 py-5 text-center text-sm text-gray-500">
          <p>&copy; {new Date().getFullYear()} Lockit — Privacy-first messaging for professionals.</p>
          <p className="mt-1">
            Built with care by{' '}
            <a
              href="https://www.tofunmi.xyz"
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold hover:underline"
            >
              Tofunmi
            </a>
          </p>
        </footer>
      </div>
    </main>
  );
}
