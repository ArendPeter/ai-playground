"use client";

const faces = [
  { name: "Jane", src: "assets/Jane.png" },
  { name: "Mallory", src: "assets/Mallory.png" },
  { name: "Ayaka", src: "assets/Ayaka.png" },
];

interface FaceSidebarProps {
  selected?: string;
  onSelect?: (name: string) => void;
}

export function FaceSidebar({ selected, onSelect }: FaceSidebarProps) {
  return (
    <div className="h-full w-16 flex flex-col items-center gap-3 py-4 bg-white border-r border-neutral-200">
      {faces.map(({ name, src }) => (
        <button
          key={name}
          onClick={() => onSelect?.(name)}
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
