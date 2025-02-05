import { FormEvent } from "react";

type Message = {
    content: string;
    isBot: boolean;
};

type ChatInterfaceProps = {
    messages: Message[];
    input: string;
    isLoading: boolean;
    onInputChange: (value: string) => void;
    onSubmit: (e: FormEvent) => void;
    onBack: () => void;
};

export function ChatInterface({
    messages,
    input,
    isLoading,
    onInputChange,
    onSubmit,
    onBack
}: ChatInterfaceProps) {
    return (
        <div className="flex flex-col min-h-screen h-[100dvh] bg-gray-950 text-gray-100">
            <div className="absolute inset-0 pointer-events-none noise-overlay opacity-[0.15]" />

            <main className="flex-1 flex flex-col w-full p-2 sm:p-6 relative">
                <div className="flex items-center justify-between mb-6 max-w-4xl mx-auto w-full">
                    <div className="flex items-center gap-2 sm:gap-4">
                        <button
                            onClick={onBack}
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

                <div className="flex-1 overflow-y-auto mb-2 pr-2 sm:pr-4 scrollbar-thin scrollbar-thumb-gray-800 scrollbar-track-transparent min-h-0">
                    <div className="flex flex-col space-y-6">
                        {messages.map((message, index) => (
                            <div
                                key={index}
                                className={`group flex flex-col space-y-2 animate-fade-in ${message.isBot ? "" : "items-end"}`}
                            >
                                <div className={`flex items-center space-x-2 text-xs font-mono ${message.isBot ? "text-gray-500" : "text-gray-500 flex-row-reverse space-x-reverse"}`}>
                                    <span>{message.isBot ? "Archive" : "You"}</span>
                                </div>
                                <div className="inline-block max-w-[85%]">
                                    <div className={`inline-block p-3 font-mono text-sm backdrop-blur-sm ${message.isBot
                                        ? "bg-gray-900/50 text-green-100 border-l-2 border-l-green-800"
                                        : "bg-gray-800/50 text-gray-100 border-l-2 border-l-gray-700"}`}>
                                        {message.isBot && !message.content ? (
                                            <div className="flex items-center space-x-2">
                                                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                                                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse [animation-delay:200ms]" />
                                                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse [animation-delay:400ms]" />
                                            </div>
                                        ) : (
                                            <p className="leading-relaxed whitespace-pre-wrap">{message.content}</p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="w-full max-w-4xl mx-auto sticky bottom-0">
                    <form
                        onSubmit={onSubmit}
                        className="flex gap-2 items-center bg-gray-900/50 border border-gray-800/50 backdrop-blur-sm"
                    >
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => onInputChange(e.target.value)}
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