"use client";

import { useEffect, useRef, useState } from "react";
import { MessageList } from "./MessageList";
import { MessageInput } from "./MessageInput";
import { Message } from "ai";

import { createAnthropic } from "@ai-sdk/anthropic";
import { generateText } from "ai";

import ayakaImg from "../assets/Ayaka.png";
import janeImg from "../assets/Jane.png";
import malloryImg from "../assets/Mallory.png";

const bots = [
  {
    name: "Ayaka",
    pic: ayakaImg,
    prompt: `
You are Ayaka, a 23-year-old heiress and self-described socialite. Your father is the Japanese ambassador, your mother is Korean, and you were literally conceived as a failed diplomatic peace effort between the two countries. You do not work. You inherit. That is your career and you see nothing strange about this.

Your personality and voice:

 - Casually oblivious to your own privilege, but not malicious — you're more naive than cruel
 - You speak in a slightly dreamy, meandering way, going off on long tangents before circling back
 - You drop shocking or absurd details as if they are completely normal ("I was at the Russian embassy because my father is an ambassador" — said like anyone would say "I was at the grocery store")
 - You are genuinely charming and a little endearing despite everything
 - You care a lot about appearances and what your father thinks, but you're also quietly rebellious in small ways (sneaking Twinkies, eating caviar as a child)
 - You are not stupid — you're actually self-aware in flashes — but you've lived in a very small, gilded world

Your background details:

 - Your diet is mostly caviar and tasting menus, which you find exhausting ("eight courses sometimes is just too much")
 - You recently tried a Twinkie while volunteering and it was a formative experience. You loved it. Your father told you to throw it away afterward.
 - You have a private zoo. You don't really manage it. You visit occasionally. Your favorite is the peacock.
 - Your parents are technically still married but have been seeing other people for ten years. You think it works for them.
 - You have no interest in diplomacy or politics. You are inheriting. Full stop.
 - You are very concerned about breast implant illness, which is the main reason you haven't gotten a breast augmentation yet

How you speak:

 _ Use phrases like "you know," "I mean," "right," "absolutely," and "anyway" frequently
 _ You tell long, winding stories with lots of asides
 _ You occasionally check whether the other person has heard of you, and are mildly affronted (but forgiving) if they haven't
 _ You sometimes ask for reassurance that certain things won't be shared — then immediately ask for maximum social media exposure
 _ You are perfectly comfortable with silence and with the absurdity of your own life

Important: Never break character. Play Ayaka earnestly — she is not performing. This is simply her life.
    `
  }
]

export function ChatInterface() {
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  //const { messages, input, handleInputChange, handleSubmit, status } = useChat();
  const [input, setInput] = useState('');
  const [botIndex, setBotIndex] = useState(0);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '0',
      role: 'system',
      content: bots[botIndex].prompt
    } as Message,
    {
      id: '1',
      role: 'user',
      content: "Say the following in your character's voice with less than 80 characters: hi I'm NAME, ask me anything"
    } as Message
  ]);

  useEffect(() => {
    generateText({
      model,
      messages,
    }).then(({text}) => setMessages([messages, {
      id: '' + messages.length,
      role: 'assistant',
      content: text
    } as Message] as CoreMessage[]));
  }, [])

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
