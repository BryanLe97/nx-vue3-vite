import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'
export default defineConfig({
  plugins: [vue()],
  build: {
    lib: {
      entry: 'src/index.js',
      name: 'Common'
    },
    rollupOptions: {
      // Make sure this path matches the actual location of your index.js file
      input: 'src/index.js',
      external: [
        "@casl/ability",
        "ant-design-vue",
        "axios",
        "lodash",
        "moment",
        "query-string",
        "vue-quill-editor",
        "vuex"
      ],
    },
    resolve: {
      extensions: ['.js', '.json', '.vue'],
       alias: {
        '@': path.resolve(__dirname, './src')
      }
    },
  }
})
