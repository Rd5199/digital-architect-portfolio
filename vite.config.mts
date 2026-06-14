import { fileURLToPath, URL } from 'node:url'
import { defineConfig, type Plugin } from 'vite'
import vue from '@vitejs/plugin-vue'
import tailwindcss from '@tailwindcss/vite'
import { runAudit } from './api/lib/runAudit'

// Dev-only middleware so `vite dev` serves POST /api/audit using the same core
// logic the Vercel function uses in production. Lets the audit flow be tested
// locally end-to-end (requires ANTHROPIC_API_KEY in the environment).
function auditDevApi(): Plugin {
  return {
    name: 'audit-dev-api',
    apply: 'serve',
    configureServer(server) {
      server.middlewares.use('/api/audit', (req, res) => {
        if (req.method !== 'POST') {
          res.statusCode = 405
          res.end('Method not allowed')
          return
        }
        let raw = ''
        req.on('data', (chunk) => {
          raw += chunk
        })
        req.on('end', async () => {
          res.setHeader('Content-Type', 'application/json')
          try {
            const body = raw ? JSON.parse(raw) : {}
            const url = String(body.url || '').trim()
            if (!url) {
              res.statusCode = 400
              res.end(JSON.stringify({ error: 'Please provide your website URL.' }))
              return
            }
            const report = await runAudit({
              url,
              businessName: body.businessName ? String(body.businessName).trim() : undefined
            })
            res.statusCode = 200
            res.end(JSON.stringify(report))
          } catch (err) {
            const message = err instanceof Error ? err.message : 'Unexpected error.'
            res.statusCode = /ANTHROPIC_API_KEY/.test(message) ? 500 : 502
            res.end(JSON.stringify({ error: message }))
          }
        })
      })
    }
  }
}

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue({
      template: {
        compilerOptions: {
          isCustomElement: (tag) => tag === 'ion-icon',
        },
      },
    }),
    tailwindcss(),
    auditDevApi(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  server: {
    port: process.env.PORT ? Number(process.env.PORT) : 5173
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    emptyOutDir: true,
    rollupOptions: {
      input: {
        main: fileURLToPath(new URL('./index.html', import.meta.url))
      }
    }
  }
})
