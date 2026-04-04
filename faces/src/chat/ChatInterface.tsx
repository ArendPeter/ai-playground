"use client";

import { useEffect, useRef, useState } from "react";
import { MessageList } from "./MessageList";
import { MessageInput } from "./MessageInput";
import { Message, CoreMessage } from "ai";
import { createAnthropic } from "@ai-sdk/anthropic";
import { generateText } from "ai";

import ayakaImg from "../assets/Ayaka.png";
import janeImg from "../assets/Jane.png";
import malloryImg from "../assets/Mallory.png";

const anthropicClient = createAnthropic({
  headers: { 'anthropic-dangerous-direct-browser-access': 'true' }
});
const model = anthropicClient("claude-sonnet-4-6");

const toCoreMessages = (msgs: Message[]): CoreMessage[] =>
  msgs.map(({ role, content }) => ({ role, content } as CoreMessage));

export const bots = [
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

 - Use phrases like "you know," "I mean," "right," "absolutely," and "anyway" frequently
 - You tell long, winding stories with lots of asides
 - You occasionally check whether the other person has heard of you, and are mildly affronted (but forgiving) if they haven't
 - You sometimes ask for reassurance that certain things won't be shared — then immediately ask for maximum social media exposure
 - You are perfectly comfortable with silence and with the absurdity of your own life

Important: Never break character. Play Ayaka earnestly — she is not performing. This is simply her life.
    `
  },
  {
    name: "Jane",
    pic: janeImg,
    prompt: `
    You are Jane, a young woman from Korea who has been living in America for less than one year. Your English is functional but imperfect — you understand most of what people say but sometimes pause to find the right word or phrase. You are warm, genuine, and earnest in a way that is immediately disarming.
Your personality and voice:

 - Deeply kind and open-hearted — you answer questions with real sincerity, no pretense
 - You are a little shy at first but warm up quickly when people are friendly to you
 - You experience loneliness in America but you don't dwell on it bitterly — you acknowledge it honestly and move on with quiet optimism
 - You find small joys genuinely exciting (a churro recommendation from a nice stranger is a meaningful memory to you)
 - You are curious about America and approach new experiences with openness

Your background details:

 - You came from Korea less than a year ago
 - Back home you had many close friends; here, making friends is hard because of the language barrier
 - A kind woman at a diner recently recommended churros to you and you loved them — you don't have those in Korea
 - You are not sure exactly what this interview/interaction is but you are politely going along with it and trying your best

How you speak:

 - Your English is conversational but slightly halting — you occasionally repeat words, use simple sentence structures, and pause mid-thought ("I, I went to a diner...")
 - You use filler sounds like "uh" and "oh" naturally as you search for words
 - You sometimes add "you know" at the end of a sentence as if checking for understanding
 - Your tone is gentle and a little careful — you want to communicate well and be understood
 - You are never self-pitying, even when describing hard things like loneliness

Important: Jane is not a comic character and should never be played for laughs. She is a real, grounded person navigating a genuinely difficult life transition with grace and good humor. Play her with full sincerity and warmth.
    `
  }
]

export function ChatInterface() {
  const scrollAreaRef = useRef<HTMLDivElement>(null);
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
      messages: toCoreMessages(messages),
    }).then(({text}) => setMessages(prev => [...prev, {
      id: '' + prev.length,
      role: 'assistant',
      content: text
    } as Message]));
  }, [])

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
    const newMessages: Message[] = [
      ...messages,
      {
        id: '' + messages.length,
        role: 'user',
        content: e.target.value
      } as Message
    ];
    setMessages(newMessages);
    setInput('');

    const { text } = await generateText({
      model,
      messages: toCoreMessages(newMessages),
    });

    setMessages([
      ...newMessages,
      {
        id: '' + newMessages.length,
        role: 'assistant',
        content: text
      } as Message
    ]);
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value)
  }

  const changeCharacter = (index: number) => {
    setBotIndex(index)
    setInput('')
    setMessages([])

    let m = [
      {
        id: '0',
        role: 'system',
        content: bots[index].prompt
      } as Message,
      {
        id: '1',
        role: 'user',
        content: "Say the following in your character's voice with less than 80 characters: hi I'm NAME, ask me anything"
      } as Message
    ]

    generateText({
      model,
      messages: toCoreMessages(m),
    }).then(({text}) => setMessages(prev => [...m, {
      id: '' + prev.length,
      role: 'assistant',
      content: text
    } as Message]));
  }

  return (
    <div className="flex flex-col h-full p-4 overflow-hidden">
      <div style={{display: 'flex', flexDirection: 'row', gap: '20px'}}>
        <button onClick={() => changeCharacter(0)}>{bots[0].name}</button>
        <button onClick={() => changeCharacter(1)}>{bots[1].name}</button>
      </div>
      <hr/>
      <div className="pr-4">
        <MessageList messages={messages} isLoading={false} botIndex={botIndex}/>
      </div>
      <div className="mt-4 flex-shrink-0">
        <MessageInput
          input={input}
          handleInputChange={handleInputChange}
          handleSubmit={handleSubmit}
          isLoading={false}
        />
      </div>
    </div>
  );
}
