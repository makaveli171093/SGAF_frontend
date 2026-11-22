import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "./tests",
  use: {
    baseURL: "http://127.0.0.1:4176",
    browserName: "chromium",
    trace: "retain-on-failure",
  },
  webServer: {
    command: "node node_modules/vite/bin/vite.js --host 127.0.0.1 --port 4176 --strictPort",
    url: "http://127.0.0.1:4176",
    env: { VITE_API_URL: "http://127.0.0.1:4176/test-api" },
  },
});
