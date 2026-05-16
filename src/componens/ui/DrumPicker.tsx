import { ReactNode } from "react";

type ScrollableListProps = {
  children: ReactNode; // 中に入れる要素（バッジやテキストなど）
  className?: string; // 外側から flex などを追加できるようにする
  maxHeight?: string; // 高さを外から変えられるようにする（デフォルトは max-h-40）
};

// Subjectのリストのスクロール表示
export function ScrollableList({
  children,
  className = "",
  maxHeight = "max-h-40",
}: ScrollableListProps) {
  return (
    <div
      className={`overflow-y-auto pr-2 [&::-webkit-scrollbar]:hidden ${maxHeight} ${className}`}
    >
      {children}
    </div>
  );
}
