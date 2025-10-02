// build-copy.js
import fs from "fs";
import path from "path";

const src = path.join("dist", "public");

const dest = path.join("dist", "server", "public");

fs.mkdirSync(dest, { recursive: true });

function copyRecursive(srcDir, destDir) {
  const entries = fs.readdirSync(srcDir, { withFileTypes: true });
  for (const entry of entries) {
    const srcPath = path.join(srcDir, entry.name);
    const destPath = path.join(destDir, entry.name);

    if (entry.isDirectory()) {
      fs.mkdirSync(destPath, { recursive: true });
      copyRecursive(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

copyRecursive(src, dest);

console.log(`✅ Copied client/dist → ${dest}`);
