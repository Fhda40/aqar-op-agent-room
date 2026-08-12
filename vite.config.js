import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { buildLiveState } from './scripts/live-state.mjs'

function companyOsLiveState() {
  return {
    name: 'company-os-live-state',
    configureServer(server) {
      server.middlewares.use('/api/live-state', async (_request, response) => {
        try {
          const state = await buildLiveState()
          response.setHeader('Content-Type', 'application/json; charset=utf-8')
          response.setHeader('Cache-Control', 'no-store')
          response.end(JSON.stringify({ ...state, servedAt: new Date().toISOString(), transport: 'workspace-live' }))
        } catch (error) {
          response.statusCode = 500
          response.end(JSON.stringify({ error: error.message }))
        }
      })
    }
  }
}

export default defineConfig({ plugins: [react(), companyOsLiveState()] })
