"use client";

interface CircleProgressProps {
  ratio: number; // 0.0 - 1.0まで正規化された値
  size?: number;
  strokeWidth: number;
  children?: React.ReactNode;
}

export function CirclarProgress({
  ratio,
  size = 300,
  strokeWidth = 12,
  children,
}: CircleProgressProps) {
  const center = size / 2;
  const radius = center - strokeWidth / 2;
  const circumference = 2 * Math.PI * radius;

  // オフセットの計算
  const safeRatio = Math.min(Math.max(ratio, 0), 1);
  const strokeDashoffset = circumference * (1 - safeRatio);

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg
        className="absolute inset-0 -rotate-90 transform"
        width={size}
        height={size}
      >
        {/*背景のサークル */}
        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="transparent"
          stroke="rgba(255,255,255,0.1)"
          strokeWidth={strokeWidth}
        />
        {/*動くサークル*/}
        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="transparent"
          stroke="rgba(255,255,255,0.9)"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          className="transition-all duration-300 ease-in-out"
        />
      </svg>

      {/*ゲージの中央に配置される要素 */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        {children}
      </div>
    </div>
  );
}
