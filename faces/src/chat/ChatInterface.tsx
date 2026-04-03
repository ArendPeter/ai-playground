"use client";

import { useEffect, useRef, useState } from "react";
import { MessageList } from "./MessageList";
import { MessageInput } from "./MessageInput";
import { Message } from "ai";

import { anthropic, createAnthropic } from "@ai-sdk/anthropic";
import { generateText } from "ai";

export function ChatInterface() {
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  //const { messages, input, handleInputChange, handleSubmit, status } = useChat();
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);

  const anthropic = createAnthropic({
    headers: { 'anthropic-dangerous-direct-browser-access': 'true' }
  });
  const model = anthropic("claude-sonnet-4-6");

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

  const handleSubmit = async (e) => {
    let newMessages = [
      ...messages,
      {
        id: ''+messages.length,
        role: 'user',
        content: e.target.value
      } as Message
    ] as Message[]
    setMessages(newMessages)

    setInput('')

    const {text} = await generateText({
      model,
      messages: newMessages,
    });

    setMessages([
      ...newMessages,
      {
        id: ''+messages.length,
        role: 'assistant',
        content: text
      } as Message
    ] as Message[])
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
