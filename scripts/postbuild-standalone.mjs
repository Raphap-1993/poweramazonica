import { cpSync, existsSync, mkdirSync } from "node:fs";
import path from "node:path";

const projectRoot = process.cwd();

const nextStaticDir = path.join(projectRoot, ".next", "static");
const standaloneNextDir = path.join(projectRoot, ".next", "standalone", ".next");
const standaloneStaticDir = path.join(standaloneNextDir, "static");

const publicDir = path.join(projectRoot, "public");
const standalonePublicDir = path.join(projectRoot, ".next", "standalone", "public");

function copyDirectory(sourceDir, targetDir) {
  if (!existsSync(sourceDir)) {
    console.warn(`[postbuild] Skipping missing directory: ${sourceDir}`);
    return;
  }

  mkdirSync(path.dirname(targetDir), { recursive: true });
  cpSync(sourceDir, targetDir, { recursive: true, force: true });
  console.log(`[postbuild] Copied ${sourceDir} -> ${targetDir}`);
}

copyDirectory(nextStaticDir, standaloneStaticDir);
copyDirectory(publicDir, standalonePublicDir);
