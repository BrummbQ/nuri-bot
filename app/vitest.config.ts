import { defineVitestConfig } from "@nuxt/test-utils/config";

export default defineVitestConfig({
  test: { testTimeout: 30000, globals: true },
});
