import { Router } from 'express'
import { getMemories, getMemoryStats } from '../services/memoryService'

export const statsRouter = Router()

statsRouter.get('/', async (_request, response, next) => {
  try {
    const memories = await getMemories()
    return response.json(getMemoryStats(memories))
  } catch (error) {
    return next(error)
  }
})
