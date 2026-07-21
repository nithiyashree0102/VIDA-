import { useEffect, useState } from "react";
import ReactFlow, {
  Background,
  MiniMap,
} from "reactflow";
import "reactflow/dist/style.css";

import { Header } from "./components/Header";
import { MemoryComposer } from "./components/MemoryComposer";
import { StatsOverview } from "./components/StatsOverview";
import GraphNode from "./components/GraphNode";

import {
  fetchStats,
  fetchGraph,
  fetchInsights,
  saveMemory,
} from "./lib/api";

const nodeTypes = {
  memory: GraphNode,
  entity: GraphNode,
};

function App() {
  const [thoughts, setThoughts] = useState(0);
  const [connections, setConnections] = useState(0);
  const [insightCount, setInsightCount] = useState(0);

  const [graph, setGraph] = useState({
    nodes: [],
    edges: [],
  });

  const [insightList, setInsightList] = useState<string[]>([]);
  const [announcement, setAnnouncement] = useState("");

  async function refreshData() {
    try {
      const stats = await fetchStats();

      setThoughts(stats.thoughts);
      setConnections(stats.connections);
      setInsightCount(stats.insights);

      const graphData = await fetchGraph();
      setGraph(graphData);

      const insightData = await fetchInsights();

      if (Array.isArray(insightData.insights)) {
        setInsightList(insightData.insights);
      } else {
        setInsightList([]);
      }
    } catch (err) {
      console.error(err);
    }
  }

  useEffect(() => {
    refreshData();
  }, []);

  async function captureThought(memory: string) {
    await saveMemory(memory);
    await refreshData();

    setAnnouncement("Thought captured. Your journey has been updated.");
  }

  return (
    <div className="min-h-screen bg-[var(--color-background)] text-[var(--color-text)]">
      <Header />

      <main className="mx-auto max-w-6xl px-6 py-16">

        <section className="mb-16 text-center">

          <p className="font-display tracking-[0.2em] text-[var(--color-primary)]">
            VIDA
          </p>

          <h1 className="mt-5 font-display text-6xl leading-tight">
            Connect your thoughts.
            <br />
            Understand your journey.
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-lg text-[var(--color-muted)]">
            A calm digital journal that discovers meaningful relationships
            between your memories, dreams and ideas.
          </p>

        </section>

        <MemoryComposer onCapture={captureThought} />

        <div className="mt-14">
          <StatsOverview
            thoughts={thoughts}
            connections={connections}
            insights={insightCount}
          />
        </div>

        <section className="mt-20">

          <h2 className="font-display text-3xl">
            Your Memory Connections
          </h2>

          <p className="mt-2 text-[var(--color-muted)]">
            VIDA automatically connects recurring people, places and goals.
          </p>

          <div className="mt-6 h-[550px] rounded-3xl border border-[var(--color-border)] bg-[var(--color-surface)] shadow-sm overflow-hidden">

            {graph.nodes.length === 0 ? (

              <div className="flex h-full items-center justify-center text-center">
                <div>
                  <h3 className="text-xl font-semibold">
                    Capture your first memory
                  </h3>

                  <p className="mt-2 text-[var(--color-muted)]">
                    VIDA will begin discovering meaningful connections.
                  </p>
                </div>
              </div>

            ) : (

              <ReactFlow
                nodes={graph.nodes}
                edges={graph.edges}
                nodeTypes={nodeTypes}
                fitView
                defaultEdgeOptions={{
                  animated: true,
                  style: {
                    stroke: "#5E8C61",
                    strokeWidth: 2.5,
                  },
                }}
              >
                <MiniMap
                  pannable
                  zoomable
                  nodeStrokeColor="#4E7A52"
                  nodeColor="#C7D9B7"
                />

                <Background gap={22} size={1} />

              </ReactFlow>

            )}

          </div>

        </section>

        <section className="mt-20">

          <h2 className="font-display text-3xl">
            AI Insights
          </h2>

          <p className="mt-2 text-[var(--color-muted)]">
            Patterns VIDA has discovered from your memories.
          </p>

          <div className="mt-6 space-y-4">

            {insightList.length === 0 ? (

              <div className="rounded-3xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6">
                No insights available yet.
              </div>

            ) : (

              insightList.map((insight, index) => (

                <div
                  key={index}
                  className="rounded-3xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6 shadow-sm transition hover:shadow-md"
                >
                  <p className="text-lg leading-7">
                    ✨ {insight}
                  </p>
                </div>

              ))

            )}

          </div>

        </section>

        <footer className="mt-20 text-center text-sm text-[var(--color-muted)]">
          Your thoughts are securely stored by VIDA and used to build your personal knowledge graph.
        </footer>

        <p className="sr-only" role="status" aria-live="polite">
          {announcement}
        </p>

      </main>
    </div>
  );
}

export default App;