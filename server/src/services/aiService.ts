import OpenAI from 'openai'
import type { Entity, Memory, MemoryAnalysis, Relationship } from '../types/memory'

const model = process.env.OPENAI_MODEL ?? 'gpt-4.1-mini'

const extractionSchema = {
  type: 'object',
  additionalProperties: false,
  required: ['summary', 'entities', 'goals', 'relationships'],
  properties: {
    summary: { type: 'string' },
    entities: {
      type: 'array',
      items: {
        type: 'object',
        additionalProperties: false,
        required: ['name', 'type'],
        properties: { name: { type: 'string' }, type: { type: 'string' } },
      },
    },
    goals: { type: 'array', items: { type: 'string' } },
    relationships: {
      type: 'array',
      items: {
        type: 'object',
        additionalProperties: false,
        required: ['source', 'target', 'reason'],
        properties: {
          source: { type: 'string' },
          target: { type: 'string' },
          reason: { type: 'string' },
        },
      },
    },
  },
} as const

const insightsSchema = {
  type: 'object',
  additionalProperties: false,
  required: ['insights'],
  properties: {
    insights: { type: 'array', items: { type: 'string' }, minItems: 3, maxItems: 3 },
  },
} as const

function createClient() {
  return process.env.OPENAI_API_KEY ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY }) : null
}

function stringList(value: unknown, maximum: number): string[] {
  if (!Array.isArray(value)) return []

  return value
    .filter((item): item is string => typeof item === 'string')
    .map((item) => item.trim())
    .filter(Boolean)
    .slice(0, maximum)
}

function entityList(value: unknown): Entity[] {
  if (!Array.isArray(value)) return []

  return value
    .filter((item): item is Record<string, unknown> => typeof item === 'object' && item !== null)
    .map((item) => ({ name: String(item.name ?? '').trim(), type: String(item.type ?? '').trim() }))
    .filter((entity) => entity.name && entity.type)
    .slice(0, 20)
}

function relationshipList(value: unknown): Relationship[] {
  if (!Array.isArray(value)) return []

  return value
    .filter((item): item is Record<string, unknown> => typeof item === 'object' && item !== null)
    .map((item) => ({
      source: String(item.source ?? '').trim(),
      target: String(item.target ?? '').trim(),
      reason: String(item.reason ?? '').trim(),
    }))
    .filter((relationship) => relationship.source && relationship.target && relationship.reason)
    .slice(0, 20)
}

function normalizeAnalysis(value: unknown): MemoryAnalysis {
  const analysis = typeof value === 'object' && value !== null ? (value as Record<string, unknown>) : {}

  return {
    summary: typeof analysis.summary === 'string' && analysis.summary.trim() ? analysis.summary.trim() : 'A saved thought',
    entities: entityList(analysis.entities),
    goals: stringList(analysis.goals, 12),
    relationships: relationshipList(analysis.relationships),
  }
}

function fallbackAnalysis(text: string): MemoryAnalysis {
  const knownPlaces = ['usa', 'united states', 'finland', 'india', 'canada', 'uk', 'germany', 'japan', 'australia']
  const entities: Entity[] = []
  const lowerText = text.toLocaleLowerCase()

  for (const place of knownPlaces) {
    if (lowerText.includes(place)) {
      entities.push({ name: place === 'usa' ? 'USA' : place.replace(/\b\w/g, (letter) => letter.toUpperCase()), type: 'Place' })
    }
  }

  for (const acronym of text.match(/\b[A-Z]{2,}\b/g) ?? []) {
    if (!entities.some((entity) => entity.name.toLocaleLowerCase() === acronym.toLocaleLowerCase())) {
      entities.push({ name: acronym, type: 'Topic' })
    }
  }

  const goals = text
    .split(/[.!?]/)
    .map((sentence) => sentence.trim())
    .filter((sentence) => /\b(planning|plan|preparing|prepare|learning|learn|saving|save|want|goal|move|build)\b/i.test(sentence))
    .slice(0, 3)

  return {
    summary: text.length > 90 ? `${text.slice(0, 87).trim()}…` : text,
    entities,
    goals,
    relationships:
      entities.length > 1
        ? [{ source: entities[0].name, target: entities[1].name, reason: 'Mentioned together in this thought' }]
        : [],
  }
}

export async function extractMemoryAnalysis(text: string): Promise<MemoryAnalysis> {
  const client = createClient()
  if (!client) return fallbackAnalysis(text)

  const response = await client.responses.create({
    model,
    input: [
      {
        role: 'system',
        content:
          'Extract a concise personal knowledge graph from the user memory. Identify only meaningful entities, goals, and direct relationships. Do not invent facts. Keep labels short and human-readable.',
      },
      { role: 'user', content: text },
    ],
    text: {
      format: {
        type: 'json_schema',
        name: 'memory_analysis',
        strict: true,
        schema: extractionSchema,
      },
    },
  })

  return normalizeAnalysis(JSON.parse(response.output_text))
}

function fallbackInsights(memories: Memory[]): string[] {
  if (!memories.length) {
    return [
      'Capture a thought to begin seeing your journey take shape.',
      'VIDA looks for themes that return across your memories.',
      'Your reflections stay local to this demo workspace.',
    ]
  }

  const counts = new Map<string, number>()
  const goals = new Map<string, number>()
  for (const memory of memories) {
    for (const entity of memory.analysis?.entities ?? []) {
      counts.set(entity.name, (counts.get(entity.name) ?? 0) + 1)
    }
    for (const goal of memory.analysis?.goals ?? []) {
      goals.set(goal, (goals.get(goal) ?? 0) + 1)
    }
  }

  const topEntity = [...counts.entries()].sort((a, b) => b[1] - a[1])[0]
  const topGoal = [...goals.entries()].sort((a, b) => b[1] - a[1])[0]
  const observations = [
    topEntity
      ? `You have mentioned ${topEntity[0]} in ${topEntity[1]} ${topEntity[1] === 1 ? 'memory' : 'memories'}.`
      : `You have captured ${memories.length} ${memories.length === 1 ? 'thought' : 'thoughts'} so far.`,
    topGoal ? `A recurring direction is: ${topGoal[0]}.` : 'Your next thought may reveal a new connection.',
    'As you add memories, VIDA will make the relationships between them clearer.',
  ]

  return observations
}

export async function generateInsights(memories: Memory[]): Promise<string[]> {
  const client = createClient()
  if (!client) return fallbackInsights(memories)

  const context = memories.map((memory) => ({ text: memory.text, analysis: memory.analysis ?? null }))
  const response = await client.responses.create({
    model,
    input: [
      {
        role: 'system',
        content:
          'Write exactly three concise, kind observations about the user\'s memories. Ground every observation in the supplied memories. Do not diagnose, judge, or invent facts. Use a calm reflective tone.',
      },
      { role: 'user', content: JSON.stringify(context) },
    ],
    text: {
      format: { type: 'json_schema', name: 'memory_insights', strict: true, schema: insightsSchema },
    },
  })

  const parsed = JSON.parse(response.output_text) as { insights?: unknown }
  const insights = stringList(parsed.insights, 3)
  return insights.length === 3 ? insights : fallbackInsights(memories)
}
