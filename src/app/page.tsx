"use client";
import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import { PomodoroTimer } from "@/components/PomodoroTimer";
import { HumburgerMenu } from "@/components/HamburgerMenu";
import { toast } from "react-hot-toast";
import { createClient } from "@/lib/supabase/client";
import { User } from "@supabase/supabase-js";

// todo 何セット目かを表示する機能と大休憩の実装
// データの保存機能の追加
// AI、カレンダー連携で、todoを元にポモドーロに落とし込んでくれる機能
// タスクを分類して、どれくらいの時間で終わらせられるか推定していく（RLを実装してもいいかも）

// ---- ログインハンドリング ----
const supabase = createClient();

const handleLogout = async () => {
  await supabase.auth.signOut();
  location.href = "/login";
};

// ---- アプリケーションで使用するデータ定義 ----
export type Subject = {
  id: string;
  name: string;
  color: string;
};

export type WorkRecord = {
  id: string;
  subjectId: string;
  duration: number;
  createdAt: number;
};

// ---- メインページ ----
export default function Home() {
  const [workTimeMin, setWorkTimeMin] = useState(25);
  const [restTimeMin, setRestTimeMin] = useState(5);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [activeSubjectId, setActiveSubjectId] = useState<string>("1");
  const [records, setRecords] = useState<WorkRecord[]>([]);
  const [user, setUser] = useState<User | null>(null);

  // 指定したIDの科目の作業時間を追加する
  const addRecord = useCallback(
    async (subjectId: string, duration: number) => {
      if (!user || duration <= 0) return;

      // DBに接続してRecordを追加
      const { data, error } = await supabase
        .from("work_records")
        .insert({ subject_id: subjectId, duration, user_id: user.id })
        .select()
        .single();

      // エラーの場合はログに表示
      if (error) {
        console.error(error);
        return;
      }

      // エラーがない場合はstateを更新
      if (data)
        setRecords((prev) => [
          ...prev,
          {
            id: data.id,
            subjectId,
            duration,
            createdAt: Date.now(),
          },
        ]);
    },
    [user],
  );

  // 科目を追加する
  const addSubject = async (name: string, color: string) => {
    // すでに科目が存在する場合はエラーを表示
    const isAlreaadyExist = subjects.some((s) => s.name === name);
    if (isAlreaadyExist) {
      toast.error("Already exists subject name.");
      return;
    }

    // DBに接続し、科目データを保存する
    const { data, error } = await supabase
      .from("subjects")
      .insert({ name, color, user_id: user!.id })
      .select()
      .single();

    // エラーの場合はToastでメッセージを表示
    if (error) {
      toast.error("Failed to add subject.");
      return;
    }

    // エラーのない場合はstateを更新してToastで成功メッセージを表示
    if (data) setSubjects((prev) => [...prev, { id: data.id, name, color }]);
    toast.success("Added the subject!");
  };

  // 科目を削除する
  const removeSubject = async (id: string) => {
    const { error } = await supabase.from("subjects").delete().eq("id", id);

    if (error) {
      toast.error("Failed to remove subjects.");
      return;
    }

    setSubjects((prev) => prev.filter((s) => s.id !== id));
  };

  // 認証状態の変化を監視してuserを更新する
  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });
    return () => subscription.unsubscribe();
  }, []);

  // ユーザが更新されるたびにDBから情報を取得する
  useEffect(() => {
    if (!user) return;

    // subjectsの読み込み
    supabase
      .from("subjects")
      .select("*")
      .then(({ data }) => {
        if (data)
          setSubjects(
            data.map((s) => ({
              id: s.id,
              name: s.name,
              color: s.color,
            })),
          );
      });

    // work_recordsの読み込み
    supabase
      .from("work_records")
      .select("*")
      .then(({ data }) => {
        if (data)
          setRecords(
            data.map((r) => ({
              id: r.id,
              subjectId: r.subject_id,
              duration: r.duration,
              createdAt: new Date(r.created_at).getTime(),
            })),
          );
      });
  }, [user]);

  if (!user) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <p className="font-mono text-white/70 text-xl animate-pulse">
          Loading...
        </p>
      </main>
    );
  }

  return (
    <main className="relative min-h-screen flex flex-col items-center justify-center">
      <Image
        src="/background_base.jpeg"
        alt="背景"
        fill
        className="object-cover -z-10 pointer-events-none"
      />

      <HumburgerMenu
        workTime={workTimeMin}
        setWorkTime={setWorkTimeMin}
        restTime={restTimeMin}
        setRestTime={setRestTimeMin}
        subjects={subjects}
        addSubject={addSubject}
        removeSubject={removeSubject}
        records={records}
        handleLogout={handleLogout}
      ></HumburgerMenu>
      <PomodoroTimer
        workTime={workTimeMin * 60}
        restTime={restTimeMin * 60}
        activeSubjectId={activeSubjectId}
        setActiveSubjectId={setActiveSubjectId}
        subjects={subjects}
        addRecord={addRecord}
      ></PomodoroTimer>
    </main>
  );
}
