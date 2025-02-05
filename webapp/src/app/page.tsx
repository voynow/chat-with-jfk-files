"use client";
import { FormEvent, useState } from "react";
import { ChatInterface } from "./components/ChatInterface";
import { Landing } from "./components/Landing";

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
    setMessages(prev => [...prev, userMessage, { content: "", isBot: true }]);
    const currentInput = input;  // Capture current input value
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch(process.env.NEXT_PUBLIC_API_URL_LOCAL!, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: currentInput,
          chat_history: chatHistory
        })
      });

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      let fullContent = "";

      if (!reader) throw new Error("No reader available");

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        const lines = chunk.split('\n');

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const content = line.replace('data: ', '');
            if (content.startsWith('[ERROR]')) continue;

            fullContent += content;
            setMessages(prev => {
              const newMessages = [...prev];
              const lastMessage = newMessages[newMessages.length - 1];
              lastMessage.content = fullContent;
              return newMessages;
            });
          }
        }
      }

      const userHistoryMessage = `USER: ${currentInput}`;
      const botHistoryMessage = `ASSISTANT: ${fullContent}`;
      setChatHistory(prev => [...prev.slice(-4), userHistoryMessage, botHistoryMessage]);

    } catch (error) {
      setMessages(prev => {
        const newMessages = [...prev];
        const lastMessage = newMessages[newMessages.length - 1];
        lastMessage.content += "\n\nConnection Error: Message may be incomplete.";
        return newMessages;
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!started) {
    return <Landing onStart={() => setStarted(true)} />;
  }

  return (
    <ChatInterface
      messages={messages}
      input={input}
      onInputChange={setInput}
      onSubmit={handleSubmit}
      onBack={() => setStarted(false)}
    />
  );
}
