"use client";

import { useEffect, useRef, useState } from "react";
import { MessageList } from "./MessageList";
import { MessageInput } from "./MessageInput";
import { Message } from "ai";
//import { ScrollArea } from "@/components/ui/scroll-area";
//import { useChat } from "@/lib/contexts/chat-context";

export function ChatInterface() {
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  //const { messages, input, handleInputChange, handleSubmit, status } = useChat();
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (scrollAreaRef.current) {
      const scrollContainer = scrollAreaRef.current.querySelector(
        "[data-radix-scroll-area-viewport]"
      );
      if (scrollContainer) {
        scrollContainer.scrollTop = scrollContainer.scrollHeight;
      }
    }
  }, [messages]);

  const handleSubmit = (e) => {
    setMessages([
      ...messages,
      {
        id: ''+messages.length,
        role: 'user',
        content: e.target.value
      } as Message
    ] as Message[])
    setInput('')
  }

  const handleInputChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value)
  }

  return (
    <div className="flex flex-col h-full p-4 overflow-hidden">
      {/*<ScrollArea ref={scrollAreaRef} className="flex-1 overflow-hidden">*/}
        <div className="pr-4">
          <MessageList messages={messages} isLoading={status === "streaming"} />
        </div>
      {/*</ScrollArea>*/}
      <div className="mt-4 flex-shrink-0">
        <MessageInput
          input={input}
          handleInputChange={handleInputChange}
          handleSubmit={handleSubmit}
          isLoading={status === "submitted" || status === "streaming"}
        />
      </div>
    </div>
  );
}
