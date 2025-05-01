type Props = {
    content: string;
  };
  
  export default function MessageView({ content }: Props) {
    return (
      <div className="bg-slate-800 rounded-xl p-6 text-slate-200 shadow-lg max-w-xl mx-auto text-center space-y-4">
        <h2 className="text-2xl font-bold text-green-400">Secret Message</h2>
        <p className="bg-slate-900 p-4 rounded-lg border border-slate-700 text-lg break-words">
          {content}
        </p>
        <p className="text-sm text-slate-400 italic">
          This message will self-destruct after being read.
        </p>
      </div>
    );
  }
  
  