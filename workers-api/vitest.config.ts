import { defineConfig } from "vitest/config";
import path from "path";

export default defineConfig({
  test: {
    environment: "miniflare",
    environmentOptions: {
      kvNamespaces: ["__STATIC_CONTENT"],
      d1Databases: ["__D1_BETA__DB"], // Must be prefixed by "__D1_BETA__"
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"), // Maps @ symbol in imports to correct path
      __STATIC_CONTENT_MANIFEST: path.resolve(__dirname, "testManifest.ts"),
    },
  },
});
