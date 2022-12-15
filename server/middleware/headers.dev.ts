export default defineEventHandler((event) => {
  event.node.res.setHeader("Cross-Origin-Embedder-Policy", "require-corp");
  event.node.res.setHeader("Cross-Origin-Opener-Policy", "same-origin");
});
