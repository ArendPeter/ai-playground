"use client";

import { bots } from "./chat/ChatInterface";

interface FaceSidebarProps {
  selected?: string;
  onSelect?: (index: number) => void;
}

export function FaceSidebar({ selected, onSelect }: FaceSidebarProps) {
  return (
    <div className="w-full flex flex-row items-center gap-3 px-4 py-2 bg-white border-b border-neutral-200">
      {bots.map(({ name, pic }, i) => (
        <button
          key={name}
          onClick={() => onSelect?.(i)}
          title={name}
          className={`w-10 h-10 rounded-full overflow-hidden ring-2 transition-all focus:outline-none focus-visible:ring-offset-2 focus-visible:ring-blue-500 ${
            selected === name
              ? "ring-blue-500"
              : "ring-transparent hover:ring-neutral-300"
          }`}
        >
          <img
            src={pic}
            alt={name}
            width={40}
            height={40}
            className="object-cover w-full h-full"
          />
        </button>
      ))}
    </div>
  );
}
