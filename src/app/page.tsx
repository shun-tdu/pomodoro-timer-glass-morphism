"use client";
import { useState, useEffect } from "react";
import { GlassButton } from "@/componens/GlassButton";
import Image from "next/image";

export default function Home() {
  const WORK_TIME: number = 2 * 60;
  const REST_TIME: number = 1 * 60;

  const [timeText, setTimeText] = useState(() => GetFormattedTime(WORK_TIME));
  const [isCount, setIsCount] = useState(false);
  const [isRest, setIsRest] = useState(false);
  const [startTime, setStartTime] = useState(0);
  const [accumulatedTime, setAccumulatedTime] = useState(0);

  function StartTimer() {
    if (isCount) return;
    setStartTime(Date.now());
    setIsCount(true);
  }

  function StopTimer() {
    if (!isCount) return;
    setIsCount(false);
    setAccumulatedTime((prev) => prev + Date.now() - startTime);
  }

  function ResetTimer() {
    setTimeText(GetFormattedTime(WORK_TIME));
    setAccumulatedTime(0);
    setStartTime(Date.now());
    setIsCount(false);
  }

  // 時刻を受け取り、表示する
  function GetFormattedTime(time_minutes: number) {
    const minutes: number = Math.floor(time_minutes / 60);
    const seconds: number = time_minutes % 60;
    const formattedTime = `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
    return formattedTime;
  }

  function CalculateTimer() {
    // 経過時間経過処理
    const now = Date.now();
    const totalMs = accumulatedTime + (now - startTime);
    const remainingTime: number = WORK_TIME - Math.floor(totalMs / 1000);

    // 残り時間判定
    if (remainingTime <= 0) {
      // 休憩開始処理
    }

    // タイマー表示処理
    setTimeText(GetFormattedTime(remainingTime));
  }

  useEffect(() => {
    if (!isCount) return;

    const intervalID = setInterval(() => CalculateTimer(), 100);

    return () => {
      clearInterval(intervalID);
    };
  }, [isCount, accumulatedTime, startTime]);

  return (
    <main className="relative min-h-screen flex flex-col items-center justify-center">
      <Image
        src="/background_base.jpeg"
        alt="背景"
        fill
        className="object-cover -z-10 pointer-events-none"
      />
      <div className="flex flex-col justify-center items-center gap-6">
        <h1 className="font-mono text-[42px] md:text-7xl">Pomodoro Timer</h1>
        <h1 className="font-mono text-6xl md:text-7xl">
          {isRest ? "Rest" : "Focus!"}
        </h1>

        <h1 className="font-mono text-6xl tracking-widest">{timeText}</h1>

        <div className="flex flex-col justify-center items-center gap-6">
          <GlassButton color="white" onClick={isCount ? StopTimer : StartTimer}>
            {isCount ? "Stop" : "Start"}
          </GlassButton>
          <GlassButton color="white" onClick={ResetTimer}>
            Reset
          </GlassButton>
        </div>
      </div>
    </main>
  );
}
