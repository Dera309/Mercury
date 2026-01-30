
const globals = require("globals");
const js = require("@eslint/js");
const tseslint = require("typescript-eslint");
const reactPlugin = require("eslint-plugin-react");
const reactHooks = require("eslint-plugin-react-hooks");
const nextPlugin = require("@next/eslint-plugin-next");

module.exports = [
  {
    files: ["**/*.{js,mjs,cjs,ts,jsx,tsx}"],
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
        ecmaVersion: 12,
        sourceType: "module",
      },
      globals: {
        ...globals.browser,
        ...globals.es2021,
        ...globals.node,
      },
    },
    plugins: {
      react: reactPlugin,
      "@typescript-eslint": tseslint.plugin,
      "react-hooks": reactHooks,
      "@next/next": nextPlugin,
    },
    rules: {
      ...js.configs.recommended.rules,
      ...tseslint.configs.recommended.rules,
      ...reactPlugin.configs.recommended.rules,
      ...reactHooks.configs.recommended.rules,
      ...nextPlugin.configs.recommended.rules,
      ...nextPlugin.configs["core-web-vitals"].rules,
      "react/react-in-jsx-scope": "off",
      "@typescript-eslint/no-explicit-any": "warn",
      "no-console": "warn",
      "no-unused-vars": "off",
    },
    settings: {
      react: {
        version: "detect",
      },
    },
  },
  {
    files: ["**/*.d.ts"],
    rules: {
      "no-unused-vars": "off"
    }
  },
  {
    ignores: ["**/.next/**", "**/dist/**"],
  }
];
