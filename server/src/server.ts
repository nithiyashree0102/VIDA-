import 'dotenv/config'
import { app } from './app'

const configuredPort = Number(process.env.PORT ?? 3001)
const port = Number.isInteger(configuredPort) && configuredPort > 0 ? configuredPort : 3001

app.listen(port, () => {
  console.log(`VIDA API is running at http://localhost:${port}`)
})
