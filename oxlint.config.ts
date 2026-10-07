import { defineConfig } from "oxlint";

export default defineConfig({
  plugins: ["typescript", "unicorn", "oxc", "import"],
  categories: {
    correctness: "warn",
  },
  rules: {
    "import/no-cycle": "error",
    "import/no-self-import": "error",
    "import/no-duplicates": "error",
  },
  options: {
    typeAware: true,
  },
});
