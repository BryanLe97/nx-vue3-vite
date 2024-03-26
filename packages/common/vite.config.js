import {resolve} from "path";
import { defineConfig } from "vite";
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, "src/index.js"),
      name: "kraftheinz-common",
      fileName: `kraftheinz-common`,
    },
    rollupOptions: {
      output:{ 
        exports: 'named',
        esModule: true,
        globals: {
          '@casl/ability': 'ability',
          'lodash': '_',
          'query-string': 'queryString',
          'numeral': 'numeral',
          'ant-design-vue': 'antDesignVue'
        }
      },
      external: [
        "@casl/ability",
        "ant-design-vue",
        "axios",
        "lodash",
        "moment",
        "query-string",
        "vue-quill-editor",
        "vuex",
        "numeral"
      ],
    }
  },
  plugins: [
    vue({
      template: {
        compilerOptions: {
          compatConfig: {
            MODE: 2,
            COMPILER_NATIVE_TEMPLATE: false,
            COMPILER_V_BIND_OBJECT_ORDER: false,
            COMPILER_FILTERS: false,
            GLOBAL_EXTEND: false,
            GLOBAL_MOUNT: false,
            INSTANCE_SCOPED_SLOTS: false,
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
});

