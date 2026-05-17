"use client";
import React from "react";

interface CircleProgressProps {
  ratio: number; // 0.0 - 1.0まで正規化された値
  size?: number;
  strokeWidth: number;
  children?: React.ReactNode;
  color?: string;
  isActive?: boolean;
}

export function CirclarProgress({
  ratio,
  size = 300,
  strokeWidth = 12,
  children,
  color = "#ffffff",
  isActive = false,
}: CircleProgressProps) {
  const center = size / 2;
  const radius = center - strokeWidth / 2;
  const circumference = 2 * Math.PI * radius;

  const safeRatio = Math.min(Math.max(ratio, 0), 1);
  const strokeDashoffset = circumference * (1 - safeRatio);

  return (
    <div className="relative" style={{ width: size, height: size }}>
      {/* 波動アニメーション用のCSS */}
      <style>
        {`
          @keyframes aura-ripple{
            0% {transform: scale(1); opacity: 0.5; stroke-width: 4px;}
            100% {transform: scale(1.4); opacity: 0; stroke-width: 0px;}
          }
          .animate-aura-1 {
            animation: aura-ripple 3s cubic-bezier(0.1, 0.5, 0.3, 1) infinite;
            transform-origin: center;
          }
          .animate-aura-2 {
            animation: aura-ripple 3s cubic-bezier(0.1, 0.5, 0.3, 1) infinite 1.5s;
            transform-origin: center;
          }
        `}
      </style>

      <svg
        className="absolute inset-0 -rotate-90"
        width={size}
        height={size}
        overflow="visible"
      >
        <defs>
          <filter id="arc-glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* 波動レイヤー */}
        {isActive && (
          <>
            <circle
              cx={center}
              cy={center}
              r={radius}
              fill="transparent"
              stroke={color}
              vectorEffect="non-scaling-stroke"
              className="animate-aura-1"
            />
            <circle
              cx={center}
              cy={center}
              r={radius}
              fill="transparent"
              stroke={color}
              vectorEffect="non-scaling-stroke"
              className="animate-aura-2"
            />
          </>
        )}

        {/* 外側のぼんやりとした輪 */}
        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="transparent"
          stroke="rgba(255,255,255,0.04)"
          strokeWidth={strokeWidth + 10}
        />

        {/* 進行アーク glow レイヤー */}
        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="transparent"
          stroke={color}
          strokeOpacity={0.4}
          strokeWidth={strokeWidth + 4}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          filter="url(#arc-glow)"
          className="transition-all duration-300 ease-in-out"
        />

        {/* 進行アーク メイン */}
        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="transparent"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          className="transition-all duration-300 ease-in-out"
        />

        {/* トラック内縁のハイライトライン */}
        <circle
          cx={center}
          cy={center}
          r={radius - strokeWidth / 2}
          fill="transparent"
          stroke="rgba(255,255,255,0.08)"
          strokeWidth={1}
        />
      </svg>

      {/* 円状の板ガラス */}
      <div
        className="absolute rounded-full border border-white/30"
        style={{
          width: size - strokeWidth * 2,
          height: size - strokeWidth * 2,
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          backdropFilter: "blur(12px)",
          background: "rgba(255,255,255,0.1)",
        }}
      />

      <div className="absolute inset-0 flex flex-col items-center justify-center">
        {children}
      </div>
    </div>
  );
}
