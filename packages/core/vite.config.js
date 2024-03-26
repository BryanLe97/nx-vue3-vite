import {resolve} from "path";
import { defineConfig } from "vite";
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  build:{
    target: 'esnext',
    minify: false,
    emptyOutDir: true,
    manifest: true,
    commonjsOptions: {
      transformMixedEsModules: true,
    },
    rollupOptions: {
      output: {
        minifyInternalExports: false,
      }
    }
  },
  plugins: [
    vue({
      template: {
        compilerOptions: {
          compatConfig: {
            MODE: 2,
            COMPONENT_ASYNC: false,  
            COMPILER_V_BIND_SYNC: false,
            COMPILER_FILTERS: false,
            COMPILER_NATIVE_TEMPLATE: false,
            GLOBAL_MOUNT: false,
            INSTANCE_SCOPED_SLOTS: false,
            COMPOSITION_API: false,
          }
        }
      }
    })
  ],
  resolve: {
    alias: {
      'vue': '@vue/compat',
      '@': resolve(__dirname, './src')
    },
    extensions: ['.js', '.json', '.vue']
  },
  css: {
    preprocessorOptions: {
      less: {
        modifyVars: {},
        javascriptEnabled: true,
      },
    },
  },
  server: {
    host: true,
    port: 8080,
    open: true,
  },
});

