import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";
import { VitePluginNode } from "vite-plugin-node";

export default defineConfig(() => {
  return {
    plugins: [
      tsconfigPaths(),
      ...VitePluginNode({
        adapter: "koa",
        appPath: "./src/main.ts",
      }),
    ],
  };
});
