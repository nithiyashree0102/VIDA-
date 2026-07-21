import cors from 'cors'
import express, { type ErrorRequestHandler } from 'express'

import { memoriesRouter } from './routes/memories'
import { statsRouter } from './routes/stats'
import { graphRouter } from './routes/graph'
import { insightsRouter } from './routes/insights'

export const app = express()

app.use(cors())

app.use(express.json({ limit: '16kb' }))

app.get('/api/health', (_request, response) => {
  response.json({ status: 'ok' })
})

app.use('/api/memories', memoriesRouter)
app.use('/api/stats', statsRouter)
app.use('/api/graph', graphRouter)
app.use('/api/insights', insightsRouter)

app.use((_request, response) => {
  response.status(404).json({
    success: false,
    error: 'Route not found.',
  })
})

const errorHandler: ErrorRequestHandler = (
  error,
  _request,
  response,
  _next,
) => {
  if (error instanceof SyntaxError && 'body' in error) {
    return response.status(400).json({
      success: false,
      error: 'Request body must be valid JSON.',
    })
  }

  console.error(error)

  return response.status(500).json({
    success: false,
    error: 'Something went wrong on the server.',
  })
}

app.use(errorHandler)