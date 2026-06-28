import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // Split Three.js into its own chunk — lazy-loaded already, this keeps the main bundle lean
          'three-vendor': ['three', '@react-three/fiber', '@react-three/drei'],
          // Framer Motion in its own chunk
          'motion-vendor': ['framer-motion'],
          // React core
          'react-vendor': ['react', 'react-dom'],
        },
      },
    },
    // Raise the chunk size warning threshold — Three.js is intentionally large
    chunkSizeWarningLimit: 1000,
  },
})
