import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'node:path'

/**
 * Con `ANTEPRIMA=1` la build produce un solo file JavaScript, così
 * `npm run anteprima` può incorporare tutto in un'unica pagina HTML.
 * La build normale resta divisa per rotta, per non far scaricare ai
 * visitatori codice che non useranno.
 */
const anteprima = process.env.ANTEPRIMA === '1'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': path.resolve(import.meta.dirname, './src'),
    },
  },
  build: {
    ...(anteprima
      ? { rollupOptions: { output: { inlineDynamicImports: true } }, cssCodeSplit: false }
      : {}),
  },
})
