import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import vueJsx from "@vitejs/plugin-vue-jsx";

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    port: 3000,
    https: false,
    hmr: {
      host: "localhost",
      port: 3001,
      protocol: "ws",
    },
  },
  css: {
    preprocessorOptions: {
      less: {
        javascriptEnabled: true,
      },
      scss: {
        charset: false,
        outputStyle: 'compressed',
        api: 'modern-complier',
        silenceDeprecations: ['legacy-js-api']
      },
    },
  },
  plugins: [vue(), vueJsx()],
});
