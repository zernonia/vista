export default defineEventHandler((event) => {
  if (process.env.NODE_ENV === "development") {
    event.node.res.setHeader("Cross-Origin-Embedder-Policy", "require-corp");
    event.node.res.setHeader("Cross-Origin-Opener-Policy", "same-origin");
  }
});
