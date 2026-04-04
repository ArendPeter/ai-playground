"use client";

import ayakaImg from "./assets/Ayaka.png";
import janeImg from "./assets/Jane.png";

const faces = [
  { name: "Ayaka", src: ayakaImg, index: 0 },
  { name: "Jane", src: janeImg, index: 1 },
];

interface FaceSidebarProps {
  selected?: string;
  onSelect?: (index: number) => void;
}

export function FaceSidebar({ selected, onSelect }: FaceSidebarProps) {
  return (
    <div className="h-full w-16 flex flex-col items-center gap-3 py-4 bg-white border-r border-neutral-200">
      {faces.map(({ name, src, index }) => (
        <button
          key={name}
          onClick={() => onSelect?.(index)}
          title={name}
          className={`w-10 h-10 rounded-full overflow-hidden ring-2 transition-all focus:outline-none focus-visible:ring-offset-2 focus-visible:ring-blue-500 ${
            selected === name
              ? "ring-blue-500"
              : "ring-transparent hover:ring-neutral-300"
          }`}
        >
          <img
            src={src}
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
