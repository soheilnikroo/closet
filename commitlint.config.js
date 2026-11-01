import { RuleConfigSeverity } from "@commitlint/types";

/** @type {import('@commitlint/types').UserConfig} */
export default {
  extends: ["@commitlint/config-conventional"],
  rules: {
    "type-enum": [
      RuleConfigSeverity.Error,
      "always",
      [
        "build",
        "chore",
        "ci",
        "docs",
        "feat",
        "fix",
        "perf",
        "refactor",
        "revert",
        "style",
        "test",
      ],
    ],
    "subject-case": [RuleConfigSeverity.Error, "never", ["pascal-case", "upper-case"]],
    "header-max-length": [RuleConfigSeverity.Error, "always", 100],
    "body-max-line-length": [RuleConfigSeverity.Error, "always", 200],
  },
};
