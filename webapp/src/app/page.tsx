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
    setMessages([...messages, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const url = process.env.NEXT_PUBLIC_API_URL;
      const response = await fetch(url!, {
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
    return <Landing onStart={() => setStarted(true)} />;
  }

  return (
    <ChatInterface
      messages={messages}
      input={input}
      isLoading={isLoading}
      onInputChange={setInput}
      onSubmit={handleSubmit}
      onBack={() => setStarted(false)}
    />
  );
}
