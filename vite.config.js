import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// Demo 03 runs as its own isolated app on port 5175 (Demo 01: 5173, Demo 02: 5174).
export default defineConfig({ plugins: [tailwindcss(), react()] })
