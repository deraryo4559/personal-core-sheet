import { createServer } from 'vite'
import react from '@vitejs/plugin-react'

const server = await createServer({
  plugins: [react()],
  base: '/personal-core-sheet/',
  server: {
    port: 5173,
    open: true
  }
})

await server.listen()

server.printUrls()
