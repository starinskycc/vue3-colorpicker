import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import path from "path";
import vueJsx from "@vitejs/plugin-vue-jsx";
import dts from "vite-plugin-dts";

import pkg from "./package.json";

const deps = Object.keys(pkg.dependencies);

const external = function (id: string) {
  return /^vue/.test(id) || deps.some((k) => new RegExp("^" + k).test(id));
};

// https://vitejs.dev/config/
export default defineConfig({
  css: {
    preprocessorOptions: {
      less: {
        javascriptEnabled: true,
      },
      scss: {
        charset: false,
        outputStyle: 'compressed',
        api: 'modern-compiler',
        silenceDeprecations: ['legacy-js-api']
      },
    },
  },
  build: {
    lib: {
      entry: path.resolve(__dirname, "./packages/index.ts"),
      name: "BeeComponents",
      fileName: (format) => {
        return `index.${format}.js`;
      },
    },
    rollupOptions: {
      // 请确保外部化那些你的库中不需要的依赖
      external: external,
      output: {
        exports: "named",
        // 在 UMD 构建模式下为这些外部化的依赖提供一个全局变量
        globals: {
          vue: "Vue",
          "@vueuse/core": "VueUse",
          "tinycolor2": "tinycolor",
          "gradient-parser": "gradientParser",
          "@popperjs/core": "Popper",
          "vue-types": "VueTypes",
          "@aesoper/normal-utils": "NormalUtils",
          "lodash-es": "lodash"
        },
      },
      plugins: [],
    },
  },
  plugins: [
    vue(),
    vueJsx(),
    dts({
      root: ".",
      tsConfigFilePath: "./tsconfig.lib.json",
      insertTypesEntry: false,
      copyDtsFiles: false,
      outputDir: "dist/types",
      exclude: ["./node_modules"],
      beforeWriteFile: (filePath, content) => {
        const origin = path.resolve(__dirname, "dist/types/packages");
        const replaceVal = path.resolve(__dirname, "dist/types");
        const newFilepath = filePath.replace(origin, replaceVal);
        return { filePath: newFilepath, content };
      },
    }),
  ],
});
