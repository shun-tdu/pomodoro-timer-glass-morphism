"use client";
import {
  useState,
  useEffect,
  useCallback,
  Dispatch,
  SetStateAction,
} from "react";
import { GlassButton } from "@/componens/GlassButton";
import { CirclarProgress } from "@/componens/CirclarProgress";
import { Subject } from "@/app/page";

type TimerMode = "idle" | "work" | "rest";

const MODE_DISPLAY_TEXT: Record<TimerMode, string> = {
  idle: "Ready",
  work: "Focus",
  rest: "Rest",
};

type PomodoroTimerProps = {
  workTime: number;
  restTime: number;
  activeSubjectId: string;
  setActiveSubjectId: Dispatch<SetStateAction<string>>;
  subjects: Subject[];
  addRecord: (subjectId: string, duration: number) => void;
};

// 時刻を受け取り、表示する
function GetFormattedTime(time_minutes: number) {
  const minutes: number = Math.floor(time_minutes / 60);
  const seconds: number = time_minutes % 60;
  const formattedTime = `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
  return formattedTime;
}

function SubjectScroll() {}

export function PomodoroTimer({
  workTime,
  restTime,
  activeSubjectId,
  setActiveSubjectId,
  addRecord,
}: PomodoroTimerProps) {
  const [timeText, setTimeText] = useState(() => GetFormattedTime(workTime));
  const [timerMode, setTimerMode] = useState<TimerMode>("idle");
  const [isCount, setIsCount] = useState(false);
  const [startTime, setStartTime] = useState(0);
  const [accumulatedTime, setAccumulatedTime] = useState(0);
  const [remainingTime, setRemainingTime] = useState(workTime);
  const [prevWorkTime, setPrevWorkTime] = useState(workTime);

  // プログレスバー表示処理
  const currentCriterion = timerMode === "rest" ? restTime : workTime;
  const ratio =
    isCount || accumulatedTime > 0 ? remainingTime / currentCriterion : 1.0;

  // ハンバーガーメニュでのWorkTimeの更新検知
  if (workTime !== prevWorkTime) {
    setPrevWorkTime(workTime);

    if (timerMode === "idle") {
      setRemainingTime(workTime);
      setTimeText(GetFormattedTime(workTime));
    }
  }

  const ResetTimer = useCallback(
    (nextMode?: TimerMode) => {
      const mode = nextMode || timerMode;
      const criterion = mode == "rest" ? restTime : workTime;

      setTimeText(GetFormattedTime(criterion));
      setRemainingTime(criterion);
      setAccumulatedTime(0);
      setStartTime(Date.now());
      setIsCount(false);
    },
    [timerMode, workTime, restTime],
  );

  const EnterWork = useCallback(() => {
    if (timerMode === "work") return;

    // カウント開始時刻記録
    ResetTimer("work");
    if (!isCount) setIsCount(true);
    setStartTime(Date.now());

    // 状態遷移
    setTimerMode("work");
  }, [isCount, timerMode, ResetTimer]);

  const EnterRest = useCallback(() => {
    if (timerMode === "rest") return;

    // カウント開始時刻記録
    ResetTimer("rest");
    if (!isCount) setIsCount(true);
    setStartTime(Date.now());

    // 状態遷移
    setTimerMode("rest");
  }, [isCount, timerMode, ResetTimer]);

  const EnterIdle = useCallback(() => {
    if (timerMode === "idle") return;

    // タイマーリセット
    ResetTimer("idle");

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
      let time_criterion: number = workTime;

      if (timerMode === "work") {
        time_criterion = workTime;
      } else if (timerMode === "rest") {
        time_criterion = restTime;
      }

      // 経過時間経過処理
      const now = Date.now();
      const totalMs = accumulatedTime + (now - startTime);
      const newRemainingTime = Math.max(
        0,
        time_criterion - Math.floor(totalMs / 1000),
      );

      setRemainingTime(newRemainingTime);

      // 残り時間判定
      if (newRemainingTime <= 0) {
        if (timerMode === "work") {
          EnterRest();
        } else if (timerMode === "rest") {
          EnterWork();
        }
      }

      // タイマー表示処理
      setTimeText(GetFormattedTime(newRemainingTime));
    }

    if (!isCount) return;

    const intervalID = setInterval(() => CalculateTimer(), 100);

    return () => {
      clearInterval(intervalID);
    };
  }, [
    isCount,
    accumulatedTime,
    startTime,
    timerMode,
    EnterWork,
    EnterRest,
    restTime,
    workTime,
  ]);

  return (
    <div className="flex flex-col justify-center items-center gap-6 md:gap-8">
      <h1 className="font-mono text-[44px] md:text-6xl">Pomodoro Timer</h1>

      <CirclarProgress ratio={ratio} size={300} strokeWidth={8}>
        <div className="relative flex flex-col items-center justify-center">
          <h1 className="font-mono text-6xl tracking-widest">{timeText}</h1>
          <h1 className="font-mono text-3xl md:text-4xl absolute mt-4 top-full whitespace-nowrap">
            {MODE_DISPLAY_TEXT[timerMode]}
          </h1>
        </div>
      </CirclarProgress>

      <div className="flex flex-col justify-center items-center gap-6">
        <GlassButton color="white" onClick={HandleMainButtonAction}>
          {GetMainButtonText()}
        </GlassButton>
        <GlassButton color="white" onClick={EnterIdle}>
          Reset
        </GlassButton>
      </div>
    </div>
  );
}
