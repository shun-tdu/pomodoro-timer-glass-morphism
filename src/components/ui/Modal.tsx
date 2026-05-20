import { ReactNode } from "react";
import { X } from "lucide-react";

type ModalProps = {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
};

export function Modal({ isOpen, onClose, title, children }: ModalProps) {
  return (
    <div
      className={`fixed inset-0 z-100 p-4 md:p-10 flex items-center justify-center transition-opacity duration-300 will-change-auto ${isOpen ? "opacity-100 visible" : "opacity-0 invisible"}`}
    >
      {/* 背景 */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* モーダルパネル本体 */}
      <div
        className={`relative w-full max-w-md max-h-full bg-white/20 backdrop-blur-xl border border-white/30 rounded-3xl shadow-2xl p-6 flex flex-col transition-transform duration-300 delay-75 ${
          isOpen ? "translate-y-0 scale-100" : "translate-y-8 scale-95"
        }`}
      >
        {/* ヘッダー部分 */}
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-mono text-white">{title}</h2>
          <button
            onClick={onClose}
            className="p-2 bg-white/10 rounded-full hover:bg-white/20 transition-colors"
          >
            <X className="w-8 h-8 text-white" />
          </button>
        </div>

        {/* メニューのコンテンツ */}
        <div className="flex flex-1 flex-col gap-2 overflow-y-auto">
          {children}
        </div>
      </div>
    </div>
  );
}
