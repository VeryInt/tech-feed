import { Hono } from 'hono'
import { huggingFaceRoutes } from './huggingface/routes'

const app = new Hono<{ Bindings: Env }>()

app.get('/api/', c => c.json({ name: 'Cloudflare' }))

app.route('/huggingface', huggingFaceRoutes)
export default app
