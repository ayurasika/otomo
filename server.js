import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'
import chatHandler from './api/chat.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

dotenv.config({ path: join(__dirname, '.env') })

console.log('ENV CHECK:', process.env.GEMINI_API_KEY ? '✓ API Key loaded' : '✗ API Key missing')

const app = express()
const PORT = process.env.PORT || 3000

// CORS設定
app.use(cors())
app.use(express.json())

// APIルート
app.post('/api/chat', chatHandler)

// 開発環境ではViteのビルド成果物を配信
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(join(__dirname, 'dist')))
  app.get('*', (req, res) => {
    res.sendFile(join(__dirname, 'dist', 'index.html'))
  })
}

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`)
  console.log(`Vite dev server should be on http://localhost:5173`)
})