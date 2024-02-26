import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  build: {
    lib: {
      entry: 'src/index.js',
      name: 'Common'
    },
    rollupOptions: {
      // Make sure this path matches the actual location of your index.js file
      input: 'src/index.js'
    }
  }
})