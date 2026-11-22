import js from "@eslint/js";
import tseslint from "typescript-eslint";
import playwright from "eslint-plugin-playwright";

export default tseslint.config(
  {
    // Don't lint generated output or deps.
    ignores: [
      "node_modules/",
      "playwright-report/",
      "blob-report/",
      "test-results/",
      "playwright/.cache/",
    ],
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    // Playwright-specific rules, scoped to the test/support code.
    ...playwright.configs["flat/recommended"],
    files: ["tests/**", "fixtures/**", "pages/**", "api/**"],
      languageOptions: {
        parserOptions: {
          projectService: true,                  // use the project's tsconfig.json for type information
          tsconfigRootDir: import.meta.dirname,  // look for tsconfig.json next to this config file
      },
    },
    rules: {
      ...playwright.configs["flat/recommended"].rules,
      "@typescript-eslint/no-floating-promises": "error",
      "@typescript-eslint/await-thenable": "error",
      "no-empty-pattern": ["error", { allowObjectPatternsAsParameters: true }],
    },
  },
);