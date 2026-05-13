"use client";
import { useState, useEffect, useCallback } from "react";
import { GlassButton } from "@/componens/GlassButton";
import Image from "next/image";

type TimerMode = "idle" | "work" | "rest";

const MODE_DISPLAY_TEXT: Record<TimerMode, string> = {
  idle: "Ready?",
  work: "Focus!",
  rest: "Rest",
};

const WORK_TIME: number = 2 * 10;
const REST_TIME: number = 1 * 10;

// 時刻を受け取り、表示する
function GetFormattedTime(time_minutes: number) {
  const minutes: number = Math.floor(time_minutes / 60);
  const seconds: number = time_minutes % 60;
  const formattedTime = `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
  return formattedTime;
}

export default function Home() {
  const [timeText, setTimeText] = useState(() => GetFormattedTime(WORK_TIME));
  const [timerMode, setTimerMode] = useState<TimerMode>("idle");
  const [isCount, setIsCount] = useState(false);
  const [startTime, setStartTime] = useState(0);
  const [accumulatedTime, setAccumulatedTime] = useState(0);

  const ResetTimer = useCallback(() => {
    setTimeText(GetFormattedTime(WORK_TIME));
    setAccumulatedTime(0);
    setStartTime(Date.now());
    setIsCount(false);
  }, []);

  const EnterWork = useCallback(() => {
    if (timerMode === "work") return;

    // カウント開始時刻記録
    ResetTimer();
    if (!isCount) setIsCount(true);
    setStartTime(Date.now());

    // 状態遷移
    setTimerMode("work");
  }, [isCount, timerMode, ResetTimer]);

  const EnterRest = useCallback(() => {
    if (timerMode === "rest") return;

    // カウント開始時刻記録
    ResetTimer();
    if (!isCount) setIsCount(true);
    setStartTime(Date.now());

    // 状態遷移
    setTimerMode("rest");
  }, [isCount, timerMode, ResetTimer]);

  const EnterIdle = useCallback(() => {
    if (timerMode === "idle") return;

    // タイマーリセット
    ResetTimer();

    // 状態遷移
    setTimerMode("idle");
  }, [timerMode, ResetTimer]);

  // カウント可能な状態の時にタイマーを開始
  function StartTimer() {
    if (timerMode === "idle") return;
    if (isCount) return;

    setStartTime(Date.now());
    setIsCount(true);
  }

  // カウント可能な状態の時にタイマーを一時停止
  function StopTimer() {
    if (timerMode === "idle") return;
    if (!isCount) return;

    setIsCount(false);
    setAccumulatedTime((prev) => prev + Date.now() - startTime);
  }

  function HandleMainButtonAction() {
    switch (timerMode) {
      case "idle":
        EnterWork();
        break;
      case "work":
        if (isCount) {
          StopTimer();
        } else {
          StartTimer();
        }
        break;
      case "rest":
        if (isCount) {
          StopTimer();
        } else {
          StartTimer();
        }
        break;
    }
  }

  function GetMainButtonText() {
    let button_text: string = "";

    switch (timerMode) {
      case "idle":
        button_text = "Start";
        break;
      case "work":
        if (isCount) {
          button_text = "Stop";
          break;
        } else {
          button_text = "Resume";
          break;
        }
      case "rest":
        if (isCount) {
          button_text = "Stop";
          break;
        } else {
          button_text = "Resume";
          break;
        }
    }
    return button_text;
  }

  useEffect(() => {
    // タイマー画面の状態変更を司る
    function CalculateTimer() {
      let time_criterion: number = WORK_TIME;

      if (timerMode === "work") {
        time_criterion = WORK_TIME;
      } else if (timerMode === "rest") {
        time_criterion = REST_TIME;
      }

      // 経過時間経過処理
      const now = Date.now();
      const totalMs = accumulatedTime + (now - startTime);
      const remainingTime: number = Math.max(
        0,
        time_criterion - Math.floor(totalMs / 1000),
      );

      // 残り時間判定
      if (remainingTime <= 0) {
        if (timerMode === "work") {
          EnterRest();
        } else if (timerMode === "rest") {
          EnterWork();
        }
      }

      // タイマー表示処理
      setTimeText(GetFormattedTime(remainingTime));
    }

    if (!isCount) return;

    const intervalID = setInterval(() => CalculateTimer(), 100);

    return () => {
      clearInterval(intervalID);
    };
  }, [isCount, accumulatedTime, startTime, timerMode, EnterWork, EnterRest]);

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
          {MODE_DISPLAY_TEXT[timerMode]}
        </h1>

        <h1 className="font-mono text-6xl tracking-widest">{timeText}</h1>

        <div className="flex flex-col justify-center items-center gap-6">
          <GlassButton color="white" onClick={HandleMainButtonAction}>
            {GetMainButtonText()}
          </GlassButton>
          <GlassButton color="white" onClick={EnterIdle}>
            Reset
          </GlassButton>
        </div>
      </div>
    </main>
  );
}
