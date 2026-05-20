export function SimpleIcon({
  size,
  backgroundColor,
  children,
  onClick,
}: {
  size: number;
  backgroundColor: string;
  children: React.ReactNode;
  onClick?: () => void;
}) {
  return (
    <div
      style={{
        height: size,
        backgroundColor: backgroundColor,
      }}
      className="rounded-full flex items-center justify-center"
      onClick={() => onClick?.()}
    >
      {children}
    </div>
  );
}
