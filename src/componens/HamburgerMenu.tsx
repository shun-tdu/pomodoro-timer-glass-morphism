import { useState, Dispatch, SetStateAction } from "react";
import { Subject, WorkRecord } from "@/app/page";
import { Menu, X } from "lucide-react";
import { ConfigPlane } from "./ConfigPlane";

type HumburgerMenuProps = {
  workTime: number;
  setWorkTime: Dispatch<SetStateAction<number>>;
  restTime: number;
  setRestTime: Dispatch<SetStateAction<number>>;
  subjects: Subject[];
  addSubject: (name: string, color: string) => void;
  records: WorkRecord[];
  activeSubjectId: string;
  setActiveSubjectId: Dispatch<SetStateAction<string>>;
};

export function HumburgerMenu({
  workTime,
  setWorkTime,
  restTime,
  setRestTime,
  subjects,
  addSubject,
  records,
  activeSubjectId,
  setActiveSubjectId,
}: HumburgerMenuProps) {
  const [isOpenMenu, setIsOpenMenu] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsOpenMenu(true)}
        className="fixed z-50 top-4 left-4 p-3 md:top-8 md:left-8 md:p-3 bg-white/10 rounded-md backdrop-blur-md border-t border-l border-white/30 shadow-lg hover:bg-white/20 transform"
      >
        <Menu className="w-8 h-8 text-white" />
      </button>

      <div
        className={`fixed inset-0 z-50 p-4 md:p-10 transition-all duration-300 ${
          isOpenMenu ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
      >
        <div
          className="absolute inset-0 bg-black/40 backdrop-blur-sm"
          onClick={() => setIsOpenMenu(false)}
        />

        <div
          className={`relative w-full h-full bg-white/20 backdrop-blur-xl border border-white/30 rounded-3xl shadow-2xl p-6 flex flex-col transition-transform duration-300 delay-75${isOpenMenu ? "translate-y-0 scale-100" : "translate-y-8 scale-95"}`}
        >
          {/*ヘッダー部分 */}
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-mono text-white">Settings</h2>
            <button
              onClick={() => setIsOpenMenu(false)}
              className="p-2 bg-white/10 rounded-full hover:bg-white/20 transition-colors"
            >
              <X className="w-8 h-8 text-white" />
            </button>
          </div>

          {/*メニューのコンテンツ */}
          <div className="flex flex-1 flex-col gap-2 overflow-y-auto">
            <ConfigPlane
              name="Work Time"
              value={workTime}
              setValue={setWorkTime}
            ></ConfigPlane>
            <ConfigPlane
              name="Rest Time"
              value={restTime}
              setValue={setRestTime}
            ></ConfigPlane>
          </div>
        </div>
      </div>
    </>
  );
}
