export function Badge({
  height,
  name,
  color,
}: {
  height: number;
  name: string;
  color: string;
}) {
  return (
    <span
      style={{
        height: height,
        backgroundColor: color,
      }}
      className="inline-flex items-center text-white text-base font-mono rounded-full px-3 py-1"
    >
      {name}
    </span>
  );
}
