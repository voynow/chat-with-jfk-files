import { FormEvent, useEffect, useRef, useState } from "react";
import ReactMarkdown from 'react-markdown';

export type Message = {
    content: string;
    isBot: boolean;
    responseTime?: string;
    documents?: Array<{
        path: string;
        text: string;
    }>;
};

type ChatInterfaceProps = {
    messages: Message[];
    input: string;
    onInputChange: (value: string) => void;
    onSubmit: (e: FormEvent) => void;
    onBack: () => void;
};

// Add custom styling for markdown elements
const markdownStyles = {
    h3: "text-green-400 font-bold mt-6 mb-3",
    ul: "space-y-2 ml-4 list-disc my-3",
    ol: "space-y-2 ml-4 list-decimal my-3",
    li: "text-gray-300 pl-2",
    p: "mb-4 leading-relaxed",
    strong: "text-green-400 font-semibold inline-block my-1",
    em: "text-gray-400 italic",
    code: "bg-black/30 px-1 py-0.5 rounded text-green-400",
    blockquote: "border-l-2 border-green-500/30 pl-4 my-4 text-gray-400 italic",
};

export function ChatInterface({
    messages,
    input,
    onInputChange,
    onSubmit,
    onBack
}: ChatInterfaceProps) {
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const [sidePanel, setSidePanel] = useState<{
        isOpen: boolean;
        document?: { path: string; text: string; };
    }>({ isOpen: false });

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    return (
        <div className="flex flex-col min-h-screen h-screen bg-gray-950">
            <div className="fixed inset-0 bg-gray-950 -z-10" />
            <div className="fixed inset-0 pointer-events-none noise-overlay opacity-[0.15] -z-10" />

            <main className="flex-1 flex w-full relative">
                {/* Side Panel */}
                <div className={`fixed inset-y-0 left-0 w-96 bg-gray-900/95 border-r border-green-900/30 transform transition-transform duration-300 ${sidePanel.isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                    {sidePanel.document && (
                        <div className="h-full flex flex-col">
                            <div className="flex items-center justify-between p-4 border-b border-green-900/30 bg-black/40">
                                <div className="text-green-500/70 truncate text-sm font-mono">
                                    {sidePanel.document.path}
                                </div>
                                <button
                                    onClick={() => setSidePanel({ isOpen: false })}
                                    className="text-gray-500 hover:text-green-400 transition-colors text-sm font-mono"
                                >
                                    [close]
                                </button>
                            </div>
                            <div className="flex-1 overflow-y-auto p-4 font-mono text-gray-300 text-sm leading-relaxed scrollbar-thin scrollbar-thumb-gray-800/40 hover:scrollbar-thumb-gray-700/40 scrollbar-track-transparent">
                                {sidePanel.document.text}
                            </div>
                        </div>
                    )}
                </div>

                {/* Main Chat Area */}
                <div className={`flex-1 flex flex-col min-h-screen transition-all duration-300 ${sidePanel.isOpen ? 'ml-96' : 'ml-0'}`}>
                    <div className="sticky top-0 z-10 bg-gray-950/80 backdrop-blur-sm mb-6 -mx-2 sm:-mx-6 px-2 sm:px-6 py-2">
                        <div className="flex items-center justify-between max-w-4xl mx-auto w-full">
                            <div className="flex items-center gap-2 sm:gap-4">
                                <button
                                    onClick={onBack}
                                    className="text-xl font-mono text-gray-500 hover:text-green-400 transition-colors px-2 sm:px-4 py-2"
                                >
                                    ←
                                </button>
                                <h1 className="text-lg sm:text-xl font-mono text-gray-400 truncate">
                                    JFK Files <span className="text-green-500/50">●</span>
                                </h1>
                            </div>
                            <a
                                href="https://www.buymeacoffee.com/voynow"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-sm font-mono text-amber-400 hover:text-amber-300 transition-colors border border-amber-400/30 hover:border-amber-300/50 px-3 py-1.5 rounded-sm hover:bg-amber-400/10"
                            >
                                SUPPORT_THIS_PROJECT
                            </a>
                        </div>
                    </div>

                    <div className="flex-1 overflow-y-auto mb-2 pr-2 sm:pr-4 scrollbar-thin scrollbar-thumb-gray-800/40 hover:scrollbar-thumb-gray-700/40 scrollbar-track-transparent min-h-0">
                        <div className="flex flex-col space-y-6 max-w-4xl mx-auto w-full p-2 sm:p-6">
                            {messages.map((message, index) => (
                                <div key={index} className={`group flex flex-col space-y-2 animate-fade-in ${message.isBot ? "" : "items-end"}`}>
                                    <div className={`flex items-center space-x-2 text-xs font-mono ${message.isBot ? "text-gray-500" : "text-gray-500 flex-row-reverse space-x-reverse"}`}>
                                        <span>{message.isBot ? "Archive" : "You"}</span>
                                    </div>
                                    <div className="inline-block max-w-[85%]">
                                        <div className={`inline-block p-3 font-mono text-sm backdrop-blur-sm ${message.isBot ? "bg-gray-900/50 text-green-100 border-l-2 border-l-green-800" : "bg-gray-800/50 text-gray-100 border-l-2 border-l-gray-700"}`}>
                                            {message.isBot && !message.content ? (
                                                <div className="flex items-center space-x-2">
                                                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                                                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse [animation-delay:200ms]" />
                                                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse [animation-delay:400ms]" />
                                                </div>
                                            ) : (
                                                <div className="space-y-2">
                                                    <ReactMarkdown
                                                        className="leading-relaxed whitespace-pre-wrap"
                                                        components={{
                                                            h3: ({ children }) => <h3 className={markdownStyles.h3}>{children}</h3>,
                                                            ul: ({ children }) => <ul className={markdownStyles.ul}>{children}</ul>,
                                                            ol: ({ children }) => <ol className={markdownStyles.ol}>{children}</ol>,
                                                            li: ({ children }) => <li className={markdownStyles.li}>{children}</li>,
                                                            p: ({ children }) => <p className={markdownStyles.p}>{children}</p>,
                                                            strong: ({ children }) => <strong className={markdownStyles.strong}>{children}</strong>,
                                                            em: ({ children }) => <em className={markdownStyles.em}>{children}</em>,
                                                            code: ({ children }) => <code className={markdownStyles.code}>{children}</code>,
                                                            blockquote: ({ children }) => <blockquote className={markdownStyles.blockquote}>{children}</blockquote>,
                                                        }}
                                                    >
                                                        {message.content}
                                                    </ReactMarkdown>

                                                    {message.documents && message.documents.length > 0 && (
                                                        <div className="text-xs font-mono mt-3 space-y-2">
                                                            <div className="text-green-500/50 flex items-center gap-2">
                                                                <span className="inline-block w-1.5 h-1.5 bg-green-500/50 rounded-full animate-pulse"></span>
                                                                <span>Source documents:</span>
                                                            </div>
                                                            <div className="flex flex-wrap gap-2">
                                                                {message.documents.map((doc, idx) => (
                                                                    <button
                                                                        key={idx}
                                                                        onClick={() => setSidePanel({
                                                                            isOpen: true,
                                                                            document: doc
                                                                        })}
                                                                        className="px-2 py-1 bg-black/20 hover:bg-black/30 text-green-400/70 hover:text-green-400 transition-colors truncate max-w-[200px]"
                                                                    >
                                                                        {doc.path}
                                                                    </button>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                            <div ref={messagesEndRef} />
                        </div>
                    </div>

                    <div className="w-full max-w-4xl mx-auto sticky bottom-0">
                        <form
                            onSubmit={onSubmit}
                            className="flex gap-2 items-center bg-gray-900/50 border border-gray-800/50 backdrop-blur-sm relative"
                        >
                            <input
                                type="text"
                                value={input}
                                onChange={(e) => onInputChange(e.target.value)}
                                placeholder="Type your message..."
                                className="flex-1 p-2 sm:p-3 bg-transparent font-mono text-base focus:outline-none text-gray-100 placeholder-gray-600 min-w-0"
                            />
                            <button
                                type="submit"
                                className="absolute right-0 top-0 bottom-0 px-3 sm:px-5 py-2 sm:py-3 font-mono text-sm text-gray-400 hover:text-green-400 transition-colors"
                            >
                                Send
                            </button>
                        </form>
                    </div>
                </div>
            </main>
        </div>
    );
} 