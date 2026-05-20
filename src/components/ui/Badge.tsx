import { X } from "lucide-react";

export function Badge({
  height,
  name,
  color,
  onDelete,
}: {
  height: number;
  name: string;
  color: string;
  onDelete: () => void;
}) {
  const iconSize = Math.round(height * 0.6);

  return (
    <div className="flex justify-center">
      <span
        style={{
          height: height,
          backgroundColor: color,
        }}
        className="inline-flex items-center text-white text-base font-mono rounded-full px-3 py-1"
      >
        {name}
        <X
          style={{ height: iconSize, width: iconSize }}
          className=" text-white cursor-pointer hover:opacity-80 transition-opacity"
          onClick={onDelete}
        />
      </span>
    </div>
  );
}
