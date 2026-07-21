import { Router } from 'express'
import { generateInsights } from '../services/aiService'
import { getMemories } from '../services/memoryService'

export const insightsRouter = Router()

insightsRouter.get('/', async (_request, response, next) => {
  try {
    response.json({ insights: await generateInsights(await getMemories()) })
  } catch (error) {
    next(error)
  }
})
