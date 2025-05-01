type Props = {
    link: string;
  };
  
  export default function MessageSuccess({ link }: Props) {
    const fullUrl = typeof window !== "undefined" ? window.location.origin + link : link;
  
    const handleCopy = async () => {
      try {
        await navigator.clipboard.writeText(fullUrl);
        alert("Link copied to clipboard!");
      } catch (err) {
        alert("Failed to copy link.");
      }
    };
  
    return (
      <div className="text-center space-y-4">
        <h2 className="text-2xl font-bold text-green-400">Message Created!</h2>
        <p className="text-slate-500">Share this secure one-time link:</p>
        <div className="bg-slate-700 rounded-lg px-4 py-3 flex items-center justify-between gap-2 overflow-auto text-sm font-mono text-green-300">
          <span className="whitespace-nowrap">{fullUrl}</span>
          <button
            onClick={handleCopy}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-1 rounded-md text-sm transition"
          >
            Copy
          </button>
        </div>
      </div>
    );
  }
  
  