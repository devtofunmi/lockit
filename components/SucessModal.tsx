'use client';
import toast, { Toaster } from 'react-hot-toast';
import { BiCopy } from 'react-icons/bi';

interface ModalProps {
  link: string;
  onClose: () => void;
}

const Modal: React.FC<ModalProps> = ({ link, onClose }) => {

  const copyToClipboard = (e: React.MouseEvent) => {
    e.stopPropagation(); 
    navigator.clipboard.writeText(link);
    toast.success('Link copied to clipboard!');
  };
  

  return (
    <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center px-0 md:px-4">
      <Toaster />
      <div className="bg-white/5 backdrop-blur-md text-white text-center max-w-md w-full p-2 md:p-6 rounded-2xl shadow-xl relative">
        <h2 className="text-xl font-semibold  mb-2">Message Created!</h2>
        <p className="text-sm  mb-4">Share this secure link:</p>
        <div className="bg-gray-100 w-fit mx-auto rounded-lg px-1 py-2 text-sm text-gray-800 mb-4 overflow-x-auto whitespace-nowrap">
          {link}
        </div>


        <div className="flex justify-center mb-4">
       <button
         onClick={copyToClipboard}
         className="bg-indigo-600 cursor-pointer text-white px-4 py-2 rounded-xl flex items-center gap-2 hover:bg-indigo-700 transition"
       >
         <BiCopy size={15} /> <p className='text-sm'>Copy Link</p>
       </button>
     </div>


        <button
          onClick={onClose}
          className="absolute cursor-pointer top-3 right-4 text-gray-400 hover:text-gray-700 text-xl font-bold"
        >
          ×
        </button>
      </div>
    </div>
  );
};

export default Modal;