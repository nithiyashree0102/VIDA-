import type { Memory } from '../types/memory'

export type GraphNode = {
  id: string
  type: 'memory' | 'entity'
  position: { x: number; y: number }
  data: {
    label: string
    subtitle: string
    kind: 'memory' | 'entity'
  }
}

export type GraphEdge = {
  id: string
  source: string
  target: string
  label?: string
}

const normalize = (value: string) => value.trim().toLowerCase()

const entityId = (name: string) =>
  `entity-${encodeURIComponent(normalize(name))}`

function shorten(text: string, length = 45) {
  if (text.length <= length) return text
  return text.slice(0, length) + '...'
}

export function buildGraph(memories: Memory[]) {
  const nodes: GraphNode[] = []
  const edges: GraphEdge[] = []

  const entities = new Map<string, { name: string; type: string }>()
  const edgeIds = new Set<string>()

  // Collect unique entities
  for (const memory of memories) {
    for (const entity of memory.analysis?.entities ?? []) {
      const key = normalize(entity.name)

      if (!entities.has(key)) {
        entities.set(key, entity)
      }
    }
  }

  // Memory nodes (left side)
  memories.forEach((memory, index) => {
    const memoryNodeId = `memory-${memory.id}`

    nodes.push({
      id: memoryNodeId,
      type: 'memory',
      position: {
        x: 50,
        y: index * 220,
      },
      data: {
        label: shorten(memory.analysis?.summary ?? memory.text),
        subtitle: 'Memory',
        kind: 'memory',
      },
    })

    for (const entity of memory.analysis?.entities ?? []) {
      edges.push({
        id: `${memoryNodeId}-${entityId(entity.name)}`,
        source: memoryNodeId,
        target: entityId(entity.name),
      })
    }
  })

  // Entity nodes (right side)
  ;[...entities.values()].forEach((entity, index) => {
    nodes.push({
      id: entityId(entity.name),
      type: 'entity',
      position: {
        x: 520,
        y: index * 140,
      },
      data: {
        label: entity.name,
        subtitle: entity.type,
        kind: 'entity',
      },
    })
  })

  // Entity ↔ Entity relationships
  for (const memory of memories) {
    for (const relation of memory.analysis?.relationships ?? []) {
      const source = entityId(relation.source)
      const target = entityId(relation.target)

      if (
        !entities.has(normalize(relation.source)) ||
        !entities.has(normalize(relation.target))
      ) {
        continue
      }

      const id = `rel-${source}-${target}-${relation.reason}`

      if (edgeIds.has(id)) continue

      edgeIds.add(id)

      edges.push({
        id,
        source,
        target,
        label: relation.reason,
      })
    }
  }

  return {
    nodes,
    edges,
  }
}