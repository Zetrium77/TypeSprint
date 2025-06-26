import React from "react";

interface CardProps {
  id: string;
  title: string;
  text: string;
  onClick?: () => void;
}

const Card: React.FC<CardProps> = ({ id, title, text, onClick }) => {
  // Show only the first 3 lines of text (or as many as fit)
  const previewLines = text.split(/(?<=[.!?])\s+/).slice(0, 3).join(" ");

  return (
    <div
      className="relative flex flex-col justify-between bg-[var(--color-block)] border border-[var(--color-border)] rounded-xl shadow-md p-4 w-64 h-56 cursor-pointer hover:shadow-lg transition-shadow duration-200"
      onClick={onClick}
      tabIndex={0}
      role="button"
      aria-label={`Select text ${title}`}
    >
      {/* ID in the top left corner */}
      <span className="absolute top-2 left-3 text-xs text-[var(--color-accent)] font-bold opacity-80 select-none">
        {id.replace(/^[a-zA-Z_]+/, "")}
      </span>
      {/* Text preview */}
      <div className="flex-1 flex items-center justify-center text-center px-2">
        <span className="text-[var(--color-text-secondary)] text-base line-clamp-4 leading-snug">
          {previewLines}
        </span>
      </div>
      {/* Title under the line */}
      <div className="mt-2">
        <hr className="border-t border-[var(--color-border)] mb-1" />
        <div className="text-sm text-[var(--color-text)] font-semibold truncate text-center px-1">
          {title}
        </div>
      </div>
    </div>
  );
};

export default Card;
