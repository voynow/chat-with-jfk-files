"use client";
import { FormEvent, useState } from "react";

type Message = {
  content: string;
  isBot: boolean;
};

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [started, setStarted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [chatHistory, setChatHistory] = useState<string[]>([]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage: Message = { content: input, isBot: false };
    setMessages([...messages, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const url = 'https://sea-turtle-app-k2vwt.ondigitalocean.app/chat'
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: input,
          chat_history: chatHistory
        })
      });

      const data = await response.text();
      const cleanedData = data.replace(/^"|"$/g, '').replace(/\\n/g, '\n');

      const botMessage: Message = { content: cleanedData, isBot: true };
      setMessages(prev => [...prev, botMessage]);

      const userHistoryMessage = `USER: ${input}`;
      const botHistoryMessage = `ASSISTANT: ${cleanedData}`;
      const newHistory = [...chatHistory.slice(-4), userHistoryMessage, botHistoryMessage];
      setChatHistory(newHistory);

    } catch {
      const errorMessage: Message = {
        content: "Sorry, I'm having trouble connecting to the archives right now.",
        isBot: true
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  if (!started) {
    return (
      <div className="flex min-h-screen bg-gray-950 text-gray-100 relative">
        <div className="absolute inset-0 pointer-events-none noise-overlay opacity-[0.15]" />

        <div className="flex-1 flex flex-col items-center justify-center p-6 relative">
          <div className="relative z-10 max-w-4xl mx-auto text-center space-y-8">

            <div className="flex items-center justify-center gap-2 text-sm font-mono text-gray-500 mb-12">
              <span className="w-2 h-2 bg-green-500/50 rounded-full" />
              <span>System Online</span>
            </div>

            <div>
              <h1 className="text-4xl md:text-6xl font-mono font-bold mb-6 tracking-tight">
                JFK Assassination Files
              </h1>
              <p className="text-lg md:text-xl text-gray-400 font-mono max-w-2xl mx-auto leading-relaxed">
                Declassified and ready for querying...
              </p>
            </div>

            <div className="animate-fade-in-up animation-delay-200">
              <button
                onClick={() => setStarted(true)}
                className="px-8 py-4 text-sm font-mono bg-gray-900/50 text-gray-300 hover:text-green-400 border border-gray-800 transition-colors duration-200"
              >
                Begin Investigation
              </button>
            </div>

            <div className="pt-16 grid grid-cols-3 gap-6 font-mono text-sm">
              <div className="text-center p-4 border border-gray-800/50 bg-gray-900/20">
                <div className="text-green-400 mb-1">14,000+</div>
                <div className="text-gray-500">Documents</div>
              </div>
              <div className="text-center p-4 border border-gray-800/50 bg-gray-900/20">
                <div className="text-green-400 mb-1">1963-1964</div>
                <div className="text-gray-500">Time Period</div>
              </div>
              <div className="text-center p-4 border border-gray-800/50 bg-gray-900/20">
                <div className="text-green-400 mb-1">Archives Unlocked</div>
                <div className="text-gray-500">Jan 23rd 2025</div>
              </div>
            </div>

            <div className="pt-16 text-xs text-gray-600 font-mono">
              National Archives and Records Administration
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen h-[100dvh] bg-gray-950 text-gray-100">
      <div className="absolute inset-0 pointer-events-none noise-overlay opacity-[0.15]" />

      <main className="flex-1 flex flex-col w-full p-2 sm:p-6 relative">
        <div className="flex items-center justify-between mb-6 max-w-4xl mx-auto w-full">
          <div className="flex items-center gap-2 sm:gap-4">
            <button
              onClick={() => setStarted(false)}
              className="text-sm font-mono text-gray-500 hover:text-green-400 transition-colors px-2 sm:px-4 py-2"
            >
              ←
            </button>
            <h1 className="text-lg sm:text-xl font-mono text-gray-400 truncate">
              JFK Files <span className="text-green-500/50">●</span>
            </h1>
          </div>
          <div className="text-[10px] sm:text-xs font-mono text-gray-500">
            Jan 23rd 2025
          </div>
        </div>

        <div className="flex-1 overflow-y-auto mb-2 pr-2 sm:pr-4  max-w-4xl scrollbar-thin scrollbar-thumb-gray-800 scrollbar-track-transparent min-h-0">
          <div className="flex flex-col space-y-6">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`group flex flex-col space-y-2 animate-fade-in ${message.isBot ? "" : "items-end"
                  }`}
              >
                <div className={`flex items-center space-x-2 text-xs font-mono ${message.isBot ? "text-gray-500" : "text-gray-500 flex-row-reverse space-x-reverse"
                  }`}>
                  <span>{message.isBot ? "Archive" : "You"}</span>
                </div>
                <div className="inline-block max-w-[85%]">
                  <div className={`inline-block p-3 font-mono text-sm backdrop-blur-sm ${message.isBot
                    ? "bg-gray-900/50 text-green-100 border-l-2 border-l-green-800"
                    : "bg-gray-800/50 text-gray-100 border-l-2 border-l-gray-700"
                    }`}>
                    <p className="leading-relaxed whitespace-pre-wrap">{message.content}</p>
                  </div>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="group flex flex-col space-y-2 animate-fade-in">
                <div className="flex items-center space-x-2 text-xs font-mono text-gray-500">
                  <span>Archive</span>
                </div>
                <div className="inline-block max-w-[85%]">
                  <div className="inline-block p-3 font-mono text-sm backdrop-blur-sm bg-gray-900/50 text-green-100 border-l-2 border-l-green-800">
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                      <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse [animation-delay:200ms]" />
                      <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse [animation-delay:400ms]" />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="w-full max-w-4xl mx-auto sticky bottom-0">
          <form
            onSubmit={handleSubmit}
            className="flex gap-2 items-center bg-gray-900/50 border border-gray-800/50 backdrop-blur-sm"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your message..."
              className="flex-1 p-2 sm:p-3 bg-transparent font-mono text-sm focus:outline-none text-gray-100 placeholder-gray-600"
            />
            <button
              type="submit"
              className="px-3 sm:px-5 py-2 sm:py-3 font-mono text-sm text-gray-400 hover:text-green-400 transition-colors"
            >
              Send
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}
