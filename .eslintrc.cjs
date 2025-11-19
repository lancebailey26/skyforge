/** @type {import("eslint").Linter.Config} */
module.exports = {
    root: true,
    env: {
      browser: true,
      node: true,
      es2022: true
    },
    parser: "@typescript-eslint/parser",
    parserOptions: {
      ecmaVersion: "latest",
      sourceType: "module"
    },
    plugins: ["@typescript-eslint"],
    extends: [
      "eslint:recommended",
      "plugin:@typescript-eslint/recommended"
    ],
    ignorePatterns: [
      "node_modules/",
      "dist/",
      ".next/",
      "out/"
    ],
    rules: {
      // we can tighten/relax later as the codebase grows
    }
  }
  