import React from "react";

type GlassButtonProps = {
  children: React.ReactNode;
  color?: "blue" | "white";
  onClick: () => void;
};

export function GlassButton({
  children,
  color = "white",
  onClick,
}: GlassButtonProps) {
  const baseStyle =
    "font-mono text-4xl w-40 h-20 flex items-center justify-center bg-white/10 backdrop-blur-md border-t border-l border-white/30 shadow-lg rounded-md transition-all hover:scale-105 active:scale-95";

  const colorStyles = {
    blue: "bg-blue-500/20 border-white/40",
    white: "bg-white-500/20 border-white/40",
  };

  return (
    <button className={`${baseStyle} ${colorStyles[color]}`} onClick={onClick}>
      {children}
    </button>
  );
}
