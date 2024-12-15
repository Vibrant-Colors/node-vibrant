import { defineWorkspace } from "vitest/config";

export default defineWorkspace([
  {
    test: {
      include: ["__tests__/**/*.node.{test,spec}.ts"],
      name: "node",
      environment: "node",
    },
  },
  {
    test: {
      include: ["__tests__/**/*.browser.{test,spec}.ts"],
      name: "browser",
      browser: {
        provider: "playwright",
        enabled: true,
        name: "chromium",
      },
    },
  },
]);
