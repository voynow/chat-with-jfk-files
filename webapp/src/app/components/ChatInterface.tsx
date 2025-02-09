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
    const [activeDoc, setActiveDoc] = useState<{ path: string, text: string } | null>(null);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    return (
        <div className="flex flex-col min-h-screen h-screen bg-gray-950">
            <div className="fixed inset-0 bg-gray-950 -z-10" />
            <div className="fixed inset-0 pointer-events-none noise-overlay opacity-[0.15] -z-10" />

            <main className="flex-1 flex flex-col w-full p-2 sm:p-6 relative">
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
                        <div className="text-[10px] sm:text-xs font-mono text-gray-500">
                            Jan 23rd 2025
                        </div>
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
                                                    <div className="text-xs font-mono mt-3">
                                                        <div className="text-green-500/50 mt-4 mb-2 flex items-center gap-2">
                                                            <span className="inline-block w-1.5 h-1.5 bg-green-500/50 rounded-full animate-pulse"></span>
                                                            <span>{message.documents.length} source{message.documents.length > 1 ? 's' : ''} available</span>
                                                        </div>
                                                        <div className="space-y-1 inline-block">
                                                            {message.documents.map((doc, idx) => (
                                                                <details key={idx} className="group/doc">
                                                                    <summary
                                                                        className="cursor-pointer bg-black/20 px-2 py-1.5 hover:bg-black/30 transition-colors flex items-center gap-4 list-none"
                                                                    >
                                                                        <span className="font-mono text-green-500/50 group-hover/doc:text-green-400 transition-colors">▸</span>
                                                                        <div className="flex-1 min-w-0">
                                                                            <div className="font-mono tracking-tight truncate text-gray-400 group-hover/doc:text-green-400 transition-colors">
                                                                                {doc.path}
                                                                            </div>
                                                                        </div>
                                                                    </summary>
                                                                    <div className="mt-0.5 border-l border-green-900/30">
                                                                        <div className="pl-4 py-2 bg-black/20">
                                                                            <div className="text-gray-300 font-mono text-[11px] leading-relaxed">
                                                                                {doc.text.split('\n')
                                                                                    .map(line => line.trim())
                                                                                    .filter(line => line.length > 0)
                                                                                    .join(' ')}
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </details>
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
            </main>

            {/* Document Modal */}
            {activeDoc && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
                    <div className="bg-gray-900/90 border border-green-900/30 w-full max-w-4xl max-h-[80vh] overflow-hidden flex flex-col">
                        <div className="flex items-center justify-between p-3 border-b border-green-900/30 bg-black/40">
                            <div className="text-green-500/70 truncate">{activeDoc.path}</div>
                            <button
                                onClick={() => setActiveDoc(null)}
                                className="text-gray-500 hover:text-green-400 transition-colors"
                            >
                                [close]
                            </button>
                        </div>
                        <div className="p-4 overflow-y-auto font-mono text-gray-300 text-sm leading-relaxed">
                            {activeDoc.text}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
} 