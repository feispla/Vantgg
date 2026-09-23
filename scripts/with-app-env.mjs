#!/usr/bin/env node
/**
 * Run a command with `.grok/app-env.json` merged into its environment.
 */

import { spawn } from "node:child_process";
import { readFileSync, realpathSync } from "node:fs";
import { constants as osConstants } from "node:os";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

export const APP_ENV_REL_PATH = ".grok/app-env.json";

const VITE_PREFIX = "VITE_";

/**
 * Parse an app-env document, keeping only VITE_-prefixed string entries.
 */
export function parseAppEnv(text) {
  let parsed;

  try {
    parsed = JSON.parse(text);
  } catch {
    return {};
  }

  if (
    parsed === null ||
    typeof parsed !== "object" ||
    Array.isArray(parsed)
  ) {
    return {};
  }

  const env = {};

  for (const [key, value] of Object.entries(parsed)) {
    if (!key.startsWith(VITE_PREFIX)) continue;
    if (typeof value !== "string") continue;

    env[key] = value;
  }

  return env;
}

/**
 * Read the app environment file.
 */
export function readAppEnv(root) {
  try {
    return parseAppEnv(
      readFileSync(join(root, APP_ENV_REL_PATH), "utf8")
    );
  } catch {
    return {};
  }
}

/**
 * Process environment variables take precedence.
 */
export function mergeAppEnv(appEnv, processEnv) {
  return {
    ...appEnv,
    ...processEnv,
  };
}

/**
 * Convert child process exit status.
 */
export function exitStatusFromChild(code, signal) {
  if (signal) {
    const signo = osConstants.signals[signal];

    return 128 + (typeof signo === "number" ? signo : 1);
  }

  return code ?? 1;
}

/**
 * Get the project root.
 */
export function projectRoot() {
  return dirname(dirname(fileURLToPath(import.meta.url)));
}

/**
 * Check whether this file is the main module.
 */
export function isMainModule(moduleUrl) {
  const entry = process.argv[1];

  if (!entry) return false;

  try {
    return realpathSync(entry) === fileURLToPath(moduleUrl);
  } catch {
    return false;
  }
}

function main(argv) {
  const [command, ...args] = argv;

  if (!command) {
    console.error(
      "usage: node scripts/with-app-env.mjs <command> [args…]"
    );

    process.exit(2);
  }

  const env = mergeAppEnv(
    readAppEnv(projectRoot()),
    process.env
  );

  const child = spawn(command, args, {
    stdio: "inherit",
    env,

    // Windows resolves executables such as Vite as `vite.cmd`.
    shell: process.platform === "win32",
  });

  for (const signal of ["SIGINT", "SIGTERM", "SIGHUP"]) {
    process.on(signal, () => child.kill(signal));
  }

  child.on("error", (err) => {
    console.error(
      `[with-app-env] failed to run ${command}:`,
      err?.message || err
    );

    process.exit(127);
  });

  child.on("exit", (code, signal) => {
    process.exit(exitStatusFromChild(code, signal));
  });
}

if (isMainModule(import.meta.url)) {
  main(process.argv.slice(2));
}