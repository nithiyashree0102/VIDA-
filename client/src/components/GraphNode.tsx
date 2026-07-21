import { Handle, Position } from "reactflow";

type Props = {
  data: {
    label: string;
    subtitle: string;
    kind: "memory" | "entity";
  };
};

export default function GraphNode({ data }: Props) {
  const memory = data.kind === "memory";

  return (
    <>
      <Handle type="target" position={Position.Left} />

      <div
        className={`rounded-2xl px-4 py-3 min-w-[180px] shadow-md border
        ${
          memory
            ? "bg-[#4E7A52] text-white border-[#4E7A52]"
            : "bg-[#E7F0E4] text-[#234128] border-[#A7C5A2]"
        }`}
      >
        <div className="font-semibold">
          {data.label}
        </div>

        <div
          className={`text-xs mt-2 ${
            memory ? "text-green-100" : "text-green-700"
          }`}
        >
          {data.subtitle}
        </div>
      </div>

      <Handle type="source" position={Position.Right} />
    </>
  );
}