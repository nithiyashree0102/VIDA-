export type Entity = {
  name: string
  type: string
}

export type Relationship = {
  source: string
  target: string
  reason: string
}

export type MemoryAnalysis = {
  summary: string
  entities: Entity[]
  goals: string[]
  relationships: Relationship[]
}

export type Memory = {
  id: string
  text: string
  timestamp: string
  analysis?: MemoryAnalysis
}

export type MemoryStats = {
  thoughts: number
  connections: number
  insights: number
}
