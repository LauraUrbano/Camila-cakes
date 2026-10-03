import { defineConfig } from "@neon/config/v1";

export default defineConfig({
  auth: true,
  // `functions` e `buckets` saíram de preview — o próprio CLI avisa que já
  // não precisam de lá estar.
  buckets: {
    uploads: { access: "private" },
  },
  functions: {
    api: { name: "api", source: "./hello.ts" },
  },
});
