import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    // Vendored design reference template (gitignored, never built or shipped).
    // Its legacy React is not ours to fix and its lint errors were masking the
    // real app's clean result.
    "St. Joseph's Academy Homepage/**",
  ]),
]);

export default eslintConfig;
