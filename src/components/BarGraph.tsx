"use client";
import { ResponsiveBar } from "@nivo/bar";
import { Subject, WorkRecord } from "@/app/page";

type Props = {
  records: WorkRecord[];
  subjects: Subject[];
};

export function SubjectBarChart({ records, subjects }: Props) {
  const data = subjects.map((subject) => {
    const totalSecs = records
      .filter((r) => r.subjectId === subject.id)
      .reduce((acc, r) => acc + r.duration, 0);

    return {
      subject: subject.name,
      minutes: Math.floor(totalSecs / 60),
      color: subject.color,
    };
  });

  return (
    <div style={{ height: 300 }}>
      <ResponsiveBar
        data={data}
        keys={["minutes"]}
        indexBy="subject"
        colors={({ data }) => data.color}
        margin={{ top: 20, right: 20, bottom: 50, left: 60 }}
        padding={0.3}
        axisBottom={{
          legend: "科目",
          legendOffset: 40,
          legendPosition: "middle",
        }}
        axisLeft={{
          legend: "Time(min)",
          legendOffset: -50,
          legendPosition: "middle",
        }}
        theme={{
          background: "transparent",
          text: { fill: "#ffffff" },
          axis: {
            ticks: { text: { fill: "rgba(255,255,255,0.7)" } },
            legend: { text: { fill: "#ffffff" } },
          },
          grid: { line: { stroke: "rgba(255,255,255,0.1)" } },
        }}
        tooltip={({ indexValue, value, color }) => (
          <div
            style={{
              background: "rgba(255,255,255,0.1)",
              backdropFilter: "blur(12px)",
              border: "1px solid rgba(255,255,255,0.3)",
              borderRadius: "8px",
              padding: "8px 12px",
              color: "white",
              fontFamily: "monospace",
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            <div
              style={{
                width: 12,
                height: 12,
                borderRadius: "50%",
                background: color,
              }}
            />
            {indexValue}:{value}min
          </div>
        )}
        enableLabel={false}
        animate
      />
    </div>
  );
}
