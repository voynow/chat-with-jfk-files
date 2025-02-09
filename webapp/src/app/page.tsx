"use client";
import { FormEvent, useState } from "react";
import { ChatInterface, Message } from "./components/ChatInterface";
import { Landing } from "./components/Landing";


export default function Home() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [started, setStarted] = useState(false);
  const [chatHistory, setChatHistory] = useState<string[]>([]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage: Message = { content: input, isBot: false };
    setMessages(prev => [...prev, userMessage, { content: "", isBot: true }]);
    const currentInput = input;
    setInput("");

    try {
      const response = await fetch(process.env.NEXT_PUBLIC_API_URL!, {
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
          if (!line.trim()) continue;  // Skip empty lines
          if (line.startsWith('data: ')) {
            const content = line.replace('data: ', '');
            if (content.startsWith('[ERROR]')) continue;

            if (content.startsWith('[STATS]')) {
              try {
                const time = content.replace('[STATS]', '').trim();
                setMessages(prev => {
                  const newMessages = [...prev];
                  const lastMessage = newMessages[newMessages.length - 1];
                  lastMessage.responseTime = time;
                  return newMessages;
                });
              } catch (e) {
                console.error('Failed to parse stats:', e);
              }
              continue;
            }

            if (content.startsWith('[DOCS]')) {
              try {
                const docs = JSON.parse(content.replace('[DOCS]', '').trim());
                setMessages(prev => {
                  const newMessages = [...prev];
                  const lastMessage = newMessages[newMessages.length - 1];
                  lastMessage.documents = docs;
                  return newMessages;
                });
              } catch (e) {
                console.error('Failed to parse documents:', e);
              }
              continue;
            }

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

    } catch (err: unknown) {
      console.error('Chat error:', err);
      setMessages(prev => {
        const newMessages = [...prev];
        const lastMessage = newMessages[newMessages.length - 1];
        lastMessage.content += "\n\nConnection Error: Message may be incomplete.";
        return newMessages;
      });
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
