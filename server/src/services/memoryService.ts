import { randomUUID } from 'node:crypto'
import { mkdir, readFile, rename, writeFile } from 'node:fs/promises'
import path from 'node:path'
import type { Memory, MemoryStats } from '../types/memory'
import { extractMemoryAnalysis } from './aiService'

const dataDirectory = path.resolve(process.cwd(), 'data')
const memoriesFile = path.join(dataDirectory, 'memories.json')

const stopWords = new Set([
  'about',
  'after',
  'again',
  'because',
  'been',
  'being',
  'could',
  'from',
  'have',
  'into',
  'just',
  'like',
  'more',
  'must',
  'next',
  'really',
  'should',
  'some',
  'something',
  'that',
  'their',
  'them',
  'then',
  'there',
  'these',
  'they',
  'this',
  'thought',
  'those',
  'through',
  'want',
  'what',
  'when',
  'with',
  'would',
  'your',
])

async function ensureMemoriesFile() {
  await mkdir(dataDirectory, { recursive: true })

  try {
    await readFile(memoriesFile, 'utf8')
  } catch (error: unknown) {
    if (isFileNotFoundError(error)) {
      await writeFile(memoriesFile, '[]\n', 'utf8')
      return
    }

    throw error
  }
}

function isFileNotFoundError(error: unknown): error is NodeJS.ErrnoException {
  return typeof error === 'object' && error !== null && 'code' in error && error.code === 'ENOENT'
}

function isMemory(value: unknown): value is Memory {
  if (typeof value !== 'object' || value === null) return false

  const memory = value as Record<string, unknown>
  return (
    typeof memory.id === 'string' &&
    typeof memory.text === 'string' &&
    typeof memory.timestamp === 'string'
  )
}

async function saveMemories(memories: Memory[]) {
  await ensureMemoriesFile()
  const temporaryFile = `${memoriesFile}.tmp`
  const serializedMemories = `${JSON.stringify(memories, null, 2)}\n`

  await writeFile(temporaryFile, serializedMemories, 'utf8')
  await rename(temporaryFile, memoriesFile)
}

export async function getMemories(): Promise<Memory[]> {
  await ensureMemoriesFile()
  const contents = await readFile(memoriesFile, 'utf8')

  let parsed: unknown
  try {
    parsed = JSON.parse(contents)
  } catch {
    throw new Error('The local memories file contains invalid JSON.')
  }

  if (!Array.isArray(parsed) || !parsed.every(isMemory)) {
    throw new Error('The local memories file has an invalid format.')
  }

  return parsed
}

export async function createMemory(text: string): Promise<Memory> {
  const analysis = await extractMemoryAnalysis(text)

  const memory: Memory = {
    id: randomUUID(),
    text,
    timestamp: new Date().toISOString(),
    analysis,
  }

  const memories = await getMemories()

  memories.push(memory)

  await saveMemories(memories)

  return memory
}

function getKeywords(text: string): string[] {
  return (text.toLocaleLowerCase().match(/[\p{L}\p{N}]+/gu) ?? []).filter(
    (keyword) => keyword.length > 2 && !stopWords.has(keyword),
  )
}

export function getMemoryStats(memories: Memory[]): MemoryStats {
  const keywordCounts = new Map<string, number>()

  for (const memory of memories) {
    for (const keyword of getKeywords(memory.text)) {
      keywordCounts.set(keyword, (keywordCounts.get(keyword) ?? 0) + 1)
    }
  }

 return {
  thoughts: memories.length,
  connections: [...keywordCounts.values()].filter((count) => count > 1).length,
  insights: Math.min(memories.length, 3),
}
}
