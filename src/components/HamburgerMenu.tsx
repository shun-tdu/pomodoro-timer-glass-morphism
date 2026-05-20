import { useState, Dispatch, SetStateAction } from "react";
import { Subject, WorkRecord } from "@/app/page";
import { Badge } from "./ui/Badge";
import { SimpleIcon } from "./ui/SimpleIcon";
import { Menu, X, Plus } from "lucide-react";
import { ConfigPlane } from "./ConfigPlane";
import { Modal } from "./ui/Modal";
import { HexColorPicker } from "react-colorful";
import { SubjectBarChart } from "./BarGraph";

type HumburgerMenuProps = {
  workTime: number;
  setWorkTime: Dispatch<SetStateAction<number>>;
  restTime: number;
  setRestTime: Dispatch<SetStateAction<number>>;
  subjects: Subject[];
  addSubject: (name: string, color: string) => void;
  removeSubject: (id: string) => void;
  records: WorkRecord[];
  handleLogout: () => void;
};

function AddSubjectForm({
  addSubject,
}: {
  addSubject: (name: string, color: string) => void;
}) {
  const [subjectName, setSubjectName] = useState("");
  const [color, setColor] = useState("#3b82f6");

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        {/* 名前入力 */}
        <label className="text-white font-mono text-xl">Subject Name :</label>
        <input
          type="text"
          value={subjectName}
          onChange={(e) => setSubjectName(e.target.value)}
          placeholder="Programming, Math..."
          className="w-full px-4 py-2 bg-white/20 text-white font-mono rounded-lg outline-none focus:ring-inset focus:ring-2 focus:ring-white/50 placeholder-white/40"
        />
      </div>

      {/* カラーピッカー */}
      <div className="flex flex-col gap-4 items-center">
        <label className="text-white font-mono text-xl w-full">Color :</label>
        <HexColorPicker color={color} onChange={setColor} />
        <div className="flex items-center gap-3 bg-white/10 px-4 py-2 rounded-full">
          <div
            className="w-6 h-6 rounded-full border border-white/50"
            style={{ backgroundColor: color }}
          />
          <span className="text-white font-mono uppercase">{color}</span>
        </div>
      </div>

      {/* 追加ボタン */}
      <button
        className="mt-4 px-4 py-3 bg-white/20 text-white font-mono rounded-lg hover:bg-white/30 transition-colors"
        onClick={() => {
          console.log("追加するデータ:", {
            name: subjectName,
            color: color,
          });
          // ここに親コンポーネントへデータを渡す処理を書く
          addSubject(subjectName, color);
        }}
      >
        Add Subject
      </button>
    </div>
  );
}

export function HumburgerMenu({
  workTime,
  setWorkTime,
  restTime,
  setRestTime,
  subjects,
  addSubject,
  removeSubject,
  records,
  handleLogout,
}: HumburgerMenuProps) {
  const [isOpenMenu, setIsOpenMenu] = useState(false);
  const [isOpenAddSubjectModalOpen, setIsOpenAddSubjectModal] = useState(false);
  const baseSize: number = 32;

  return (
    <>
      {/* ハンバーガーアイコン */}
      <button
        onClick={() => setIsOpenMenu(true)}
        className="fixed z-50 top-4 left-4 p-3 md:top-8 md:left-8 md:p-3 bg-white/10 rounded-md backdrop-blur-md border-t border-l border-white/30 shadow-lg hover:bg-white/20 transform"
      >
        <Menu className="w-8 h-8 text-white" />
      </button>

      {/* ハンバーガーメニュー本体 */}
      <Modal
        isOpen={isOpenMenu}
        onClose={() => setIsOpenMenu(false)}
        title="Settings"
      >
        {/* 作業時間、休憩時間 */}
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

        {/* 科目追加セクション */}
        {/* 科目がカラー背景の横長角丸でNameが要素にあるコンポーネントが並んで、最後にプラスボタンがある。プラスボタンを押すと、科目追加のポップアップが出てきて、名前と色を選択 */}
        <div className="flex flex-wrap items-center gap-2 mb-8">
          {/* Subject一覧を表示 */}
          {subjects.length === 0 ? (
            <p className="text-white/50 font-mono">No Subjects added yet.</p>
          ) : (
            subjects.map((subject) => (
              <Badge
                key={subject.id}
                height={baseSize}
                name={subject.name}
                color={subject.color}
                onDelete={() => removeSubject(subject.id)}
              />
            ))
          )}

          {/* Subject追加アイコン */}
          <SimpleIcon
            size={baseSize}
            backgroundColor="#3b82f6"
            onClick={() => setIsOpenAddSubjectModal(true)}
          >
            <Plus size={baseSize} color="white" />
          </SimpleIcon>
        </div>

        {/* 科目毎の勉強時間のチャート */}
        {records.length === 0 ? (
          // 勉強時間の記録が0の場合
          <p className="text-white/50 font-mono"> No Recods added yet.</p>
        ) : (
          // 勉強時間の記録がある場合はグラフを表示する
          <SubjectBarChart records={records} subjects={subjects} />
        )}
        {/* ログアウトボタン */}
        <button
          className="text-white font-mono bg-red-400 px-4 py-2 rounded-lg"
          onClick={handleLogout}
        >
          Logout
        </button>
      </Modal>

      {/* 科目追加モーダル */}
      <Modal
        isOpen={isOpenAddSubjectModalOpen}
        onClose={() => setIsOpenAddSubjectModal(false)}
        title="Add Subject"
      >
        <AddSubjectForm addSubject={addSubject} />
      </Modal>
    </>
  );
}
