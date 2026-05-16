import { Dispatch, SetStateAction, useRef } from "react";

export type PickerItem = {
    id: string;
    label: string; // 画面に表示する文字
};

/**
 * ドラムピッカーコンポーネント
 * @param PickerIterとしてidとlabelを取得
 * @returns
 */
export function DrumPicker({
    items,
    activeId,
    setActiveId,
    height = "h-48",
}: {
    items: PickerItem[];
    activeId: string;
    setActiveId: Dispatch<SetStateAction<string>>;
    height?: string;
}) {
    const scrollRef = useRef<HTMLDivElement>(null);

    const handleScroll = () => {
        if (!scrollRef.current) return;
        const container = scrollRef.current;

        const containerCenterY =
            container.getBoundingClientRect().top + container.clientHeight / 2;

        let closestId = activeId;
        let minDistance = Infinity;

        Array.from(container.children).forEach((child) => {
            const id = child.getAttribute("data-id");
            if (!id) return;

            const rect = child.getBoundingClientRect();
            const childCenterY = rect.top + rect.height / 2;
            const distance = Math.abs(containerCenterY - childCenterY);

            if (distance < minDistance) {
                minDistance = distance;
                closestId = id;
            }
        });

        if (closestId !== activeId) {
            setActiveId(closestId);
        }
    };

    return (
        <div
            ref={scrollRef}
            onScroll={handleScroll}
            className={`flex flex-col items-center gap-2 w-full overflow-y-auto snap-y snap-mandatory [&::-webkit-scrollbar]:hidden relative ${height}`}
            style={{
                maskImage:
                    "linear-gradient(to bottom, transparent, black 30%, black 70%, transparent)",
                WebkitMaskImage:
                    "linear-gradient(to bottom, transparent, black 30%, black 70%, transparent)",
            }}
        >
            <div className="h-[calc(50%-20px)] w-full shrink-0 pointer-events-none" />

            {items.length === 0 && (
                <p className="text-white/40 font-mono text-sm absolute top-1/2 -translate-y-1/2">
                    No items available.
                </p>
            )}

            {items.map((item) => {
                const isSelected = activeId === item.id;

                return (
                    <div
                        key={item.id}
                        data-id={item.id}
                        className="snap-center shrink-0 w-full flex justify-center cursor-pointer"
                        onClick={(e) => {
                            e.currentTarget.scrollIntoView({
                                behavior: "smooth",
                                block: "center",
                            });
                        }}
                    >
                        <span
                            className={`font-mono transition-all duration-300 ${
                                isSelected
                                    ? "text-2xl text-white font-bold opacity-100 scale-110"
                                    : "text-lg text-white/40 opacity-50 hover:opacity-80"
                            }`}
                        >
                            {/* ▼ subject.name ではなく item.label を表示！ */}
                            {item.label}
                        </span>
                    </div>
                );
            })}

            <div className="h-[calc(50%-20px)] w-full shrink-0 pointer-events-none" />
        </div>
    );
}
