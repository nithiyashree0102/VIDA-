import { Router } from 'express'
import { buildGraph } from '../services/graphService'
import { getMemories } from '../services/memoryService'

export const graphRouter = Router()

graphRouter.get('/', async (_request, response, next) => {
  try {
    response.json(buildGraph(await getMemories()))
  } catch (error) {
    next(error)
  }
})
