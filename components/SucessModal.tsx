// components/Modal.tsx
'use client';
import { useEffect } from 'react';
import toast from 'react-hot-toast';
import { BiCopy } from 'react-icons/bi';

interface ModalProps {
  link: string;
  onClose: () => void;
}

const Modal: React.FC<ModalProps> = ({ link, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => onClose(), 10000); // auto-close after 10s
    return () => clearTimeout(timer);
  }, [onClose]);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(link);
    toast.success('Link copied to clipboard!');
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center px-4">
      <div className="bg-white text-center max-w-md w-full p-6 rounded-2xl shadow-xl relative">
        <h2 className="text-xl font-semibold text-gray-800 mb-2">Message Created!</h2>
        <p className="text-sm text-gray-600 mb-4">Share this secure link:</p>
        <div className="bg-gray-100 rounded-lg px-3 py-2 text-sm text-gray-800 mb-4 overflow-auto">
          {link}
        </div>
        <button
          onClick={copyToClipboard}
          className="bg-indigo-600 text-white px-4 py-2 rounded-xl flex items-center gap-2 hover:bg-indigo-700 transition"
        >
          <BiCopy size={18} /> Copy Link
        </button>

        <button
          onClick={onClose}
          className="absolute top-3 right-4 text-gray-400 hover:text-gray-700 text-xl font-bold"
        >
          ×
        </button>
      </div>
    </div>
  );
};

export default Modal;