import ReactFlow, {
  Background,
  Controls,
  MiniMap,
} from "reactflow";
import "reactflow/dist/style.css";

type Props = {
  graph: {
    nodes: any[];
    edges: any[];
  };
};

export function KnowledgeGraph({ graph }: Props) {
  return (
    <div className="mt-12">
      <h2 className="font-display text-3xl mb-6">
        Knowledge Graph
      </h2>

      <div
        className="rounded-2xl border border-[var(--color-border)] overflow-hidden"
        style={{ height: 500 }}
      >
        <ReactFlow
          nodes={graph.nodes}
          edges={graph.edges}
          fitView
        >
          <MiniMap />
          <Controls />
          <Background />
        </ReactFlow>
      </div>
    </div>
  );
}