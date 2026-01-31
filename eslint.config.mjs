import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";
import { defineConfig } from "eslint/config";
import perfectionist from "eslint-plugin-perfectionist";

export default defineConfig([
  {
    ignores: ["/*.js", "node_modules", "dist"],
  },
  { files: ["**/*.{js,mjs,cjs,ts}"], plugins: { js }, extends: ["js/recommended"] },
  { files: ["**/*.{js,mjs,cjs,ts}"], languageOptions: { globals: globals.browser } },
  tseslint.configs.recommended,
  {
    files: ["**/*.{ts,js}"],
    plugins: { perfectionist },
    rules: {
      "@typescript-eslint/no-unused-vars": [
        "error",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
        },
      ],
      "@typescript-eslint/no-explicit-any": "off",
      "perfectionist/sort-interfaces": [
        "warn",
        {
          order: "asc",
          groups: ["property", "optional-property", "method", "optional-method"],
        },
      ],
      "perfectionist/sort-named-imports": [
        "warn",
        {
          type: "alphabetical",
          order: "asc",
          ignoreCase: true,
        },
      ],
      "perfectionist/sort-imports": ["warn", { order: "asc" }],
    },
  },
]);
