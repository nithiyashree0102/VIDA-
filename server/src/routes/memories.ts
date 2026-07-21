import { Router } from 'express'
import { createMemory, getMemories } from '../services/memoryService'

const MAX_MEMORY_LENGTH = 1000

function getMemoryText(body: unknown): { text: string } | { error: string } {
  if (typeof body !== 'object' || body === null || !('text' in body)) {
    return { error: 'Request body must be a JSON object with a text field.' }
  }

  const { text } = body as { text: unknown }

  if (typeof text !== 'string') {
    return { error: 'The text field must be a string.' }
  }

  const trimmedText = text.trim()
  if (!trimmedText) {
    return { error: 'The text field cannot be empty.' }
  }

  if (trimmedText.length > MAX_MEMORY_LENGTH) {
    return { error: `The text field cannot exceed ${MAX_MEMORY_LENGTH} characters.` }
  }

  return { text: trimmedText }
}

export const memoriesRouter = Router()

memoriesRouter.post('/', async (request, response, next) => {
  const result = getMemoryText(request.body)

  if ('error' in result) {
    return response.status(400).json({ success: false, error: result.error })
  }

  try {
    const memory = await createMemory(result.text)
    return response.status(201).json({ success: true, memory })
  } catch (error) {
    return next(error)
  }
})

memoriesRouter.get('/', async (_request, response, next) => {
  try {
    const memories = await getMemories()
    return response.json(memories)
  } catch (error) {
    return next(error)
  }
})
