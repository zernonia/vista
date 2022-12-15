import transformerDirective from "@unocss/transformer-directives";

// https://v3.nuxtjs.org/api/configuration/nuxt.config
export default defineNuxtConfig({
  modules: ["@unocss/nuxt", "@vueuse/nuxt", "@nuxt/image-edge"],
  css: ["@unocss/reset/tailwind.css", "~~/assets/main.css"],
  runtimeConfig: {
    public: {
      UMAMI_WEBSITE_ID: process.env.UMAMI_WEBSITE_ID,
    },
  },
  unocss: {
    // presets
    uno: true, // enabled `@unocss/preset-uno`
    icons: true, // enabled `@unocss/preset-icons`,
    transformers: [transformerDirective({ enforce: "pre" })], // enabled `@unocss/transformer-directives`,
    // core options
    shortcuts: [
      {
        btn: " text-sm md:text-base font-medium rounded-2xl py-2 px-4 transition ring-3 ring-transparent disabled:opacity-50 relative inline-flex justify-center items-center shadow-none",
        "btn-plain": "btn font-semibold text-gray-400 focus:text-dark-50 hover:text-dark-50",
        "btn-primary": "btn bg-dark-300 text-white focus:ring-gray-400 focus:shadow-xl",
        "btn-secondary": "btn bg-white hover:bg-gray-100 focus:ring-gray-100",
        "btn-danger": "btn bg-red-500 text-white hover:bg-red-600 focus:ring-red-300",
      },
    ],
    rules: [],
  },
  image: {
    domains: ["avatars0.githubusercontent.com", "avatars.githubusercontent.com/", "images.unsplash.com/"],
  },
});
