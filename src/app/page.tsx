"use client";
import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { PomodoroTimer } from "@/componens/PomodoroTimer";
import { HumburgerMenu } from "@/componens/HamburgerMenu";
import { toast } from "react-hot-toast";
import { Target } from "lucide-react";

// todo 何セット目かを表示する機能と大休憩の実装
// ハンバーガーメニューで各種設定変更を可能に
// 科目の追加
// 科目を消去する機能を追加
// グラフ機能の追加
// データの保存機能の追加
// AI、カレンダー連携で、todoを元にポモドーロに落とし込んでくれる機能
// タスクを分類して、どれくらいの時間で終わらせられるか推定していく（RLを実装してもいいかも）

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

export default function Home() {
    const [workTimeMin, setWorkTimeMin] = useState(25);
    const [restTimeMin, setRestTimeMin] = useState(5);
    const [subjects, setSubjects] = useState<Subject[]>([]);
    const [activeSubjectId, setActiveSubjectId] = useState<string>("1");
    const [records, setRecords] = useState<WorkRecord[]>([]);

    // 指定したIDの科目の作業時間を追加する
    const addRecord = (subjectId: string, duration: number) => {
        const newRecord: WorkRecord = {
            id: crypto.randomUUID(),
            subjectId,
            duration,
            createdAt: Date.now(),
        };
        setRecords((prev) => [...prev, newRecord]);
    };

    // 科目を追加する
    const addSubject = (name: string, color: string) => {
        // すでに同じSubjectが存在すれば、メッセージを出してreturn
        const isAlreadyExist = subjects.some(
            (subject) => subject.name === name,
        );
        if (isAlreadyExist) {
            toast.error("Already exists subject name.");
            return;
        }

        const newSubject: Subject = {
            id: crypto.randomUUID(),
            name,
            color,
        };
        setSubjects((prev) => [...prev, newSubject]);
        toast.success("Added the subject!");
    };

    // 科目を削除する
    const removeSubject = (id: string) => {
        setSubjects((prevSubjects) => {
            return prevSubjects.filter((subject) => subject.id !== id);
        });
    };

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
                activeSubjectId={activeSubjectId}
                setActiveSubjectId={setActiveSubjectId}
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
