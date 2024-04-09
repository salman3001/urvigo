import { fileURLToPath } from "node:url";
import svgLoader from "vite-svg-loader";
import vuetify from "vite-plugin-vuetify";
import { dirname, join } from "path";
const currentDir = dirname(fileURLToPath(import.meta.url));

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  app: {
    head: {
      titleTemplate: "%s - Where Services meets expectations",
      title: "Urvigo",

      link: [
        {
          rel: "icon",
          type: "image/x-icon",
          href: "/favicon.ico",
        },
      ],
    },
  },

  devtools: {
    enabled: true,
  },
  runtimeConfig: {
    public: {
      baseApi: "http://127.0.0.1:3333", // this must be http://127.0.0.1:3333 not localhost
      webBaseUrl: "http://localhost:3000",
      vendorBaseUrl: "http://localhost:3001",
      adminBaseUrl: "http://localhost:3002",
      NITRO_PORT: 3000,
      NITRO_HOST: "http://localhost:3000",
    },
  },

  css: [
    join(currentDir, "./@core/scss/template/index.scss"),
    join(currentDir, "./assets/styles/styles.scss"),
    join(currentDir, "./plugins/iconify/icons.css"),
  ],

  components: {
    dirs: [
      {
        path: join(currentDir, "./@core/components"),
      },
      {
        path: join(currentDir, "./components/global"),
      },
      {
        path: join(currentDir, "./components"),
      },
    ],
  },

  plugins: [
    join(currentDir, "./plugins/vuetify/index.ts"),
    join(currentDir, "./plugins/iconify/index.ts"),
  ],

  imports: {
    dirs: [
      join(currentDir, "./@core/utils"),
      join(currentDir, "./@core/composable/"),
      join(currentDir, "./plugins/*/composables/*"),
      join(currentDir, "./stores"),
    ],
    presets: [],
  },

  hooks: {},

  experimental: {
    typedPages: true,
  },

  typescript: {
    tsConfig: {
      compilerOptions: {
        paths: {
          "@/*": ["../../core/*"],
          "@themeConfig": ["../../core/themeConfig.ts"],
          "@layouts/*": ["../../core/@layouts/*"],
          "@layouts": ["../../core/@layouts"],
          "@core/*": ["../../core/@core/*"],
          "@core": ["../../core/@core"],
          "@images/*": ["../../core/assets/images/*"],
          "@styles/*": ["../../core/assets/styles/*"],
          "@validators": ["../../core/@core/utils/validators"],
          "@db/*": ["../../core/server/fake-db/*"],
          "@api-utils/*": ["../../core/server/utils/*"],
        },
      },
    },
  },

  // ℹ️ Disable source maps until this is resolved: https://github.com/vuetifyjs/vuetify-loader/issues/290
  sourcemap: {
    server: false,
    client: false,
  },

  vue: {
    compilerOptions: {
      isCustomElement: (tag) =>
        tag === "swiper-container" || tag === "swiper-slide",
    },
  },

  vite: {
    define: { "process.env": {} },
    resolve: {
      alias: {
        "@": join(currentDir, "."),
        "@themeConfig": join(currentDir, "./themeConfig.ts"),
        "@core": join(currentDir, "./@core"),
        "@layouts": join(currentDir, "./@layouts"),
        "@images": join(currentDir, "./assets/images/"),
        "@styles": join(currentDir, "./assets/styles/"),
        "@configured-variables": join(
          currentDir,
          "./assets/styles/variables/_template.scss",
        ),
        "@db": join(currentDir, "./server/fake-db/"),
        "@api-utils": join(currentDir, "./server/utils/"),
      },
    },

    build: {
      chunkSizeWarningLimit: 5000,
    },

    optimizeDeps: {
      exclude: ["vuetify"],
      entries: ["./**/*.vue"],
    },

    plugins: [
      svgLoader(),
      vuetify({
        // styles: {
        //   configFile: "../core/assets/styles/variables/_vuetify.scss",
        // },
      }),
      null,
    ],
    assetsInclude: ["../core/assets/styles/variables/_vuetify.scss"],
  },

  build: {
    transpile: ["vuetify", "vue-sonner"],
  },

  modules: ["@vueuse/nuxt", "@nuxtjs/device", "@pinia/nuxt"],
});
