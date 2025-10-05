import fs from "fs";
import path from "path";
import cpy from "cpy"; // ✅

async function main() {
  // 1️⃣ نسخ ملفات client/dist → dist/server/public
  await cpy("client/dist/**", "dist/server/public", { parents: true });

  // 2️⃣ نسخ ملفات shared → dist/shared
  await cpy("shared/**/*", "dist/shared", { parents: true });

  // 3️⃣ نسخ ملفات js المهمة من server مثل passport.js → dist/server
  await cpy("server/*.js", "dist/server", { parents: true });

  console.log("✅ Build copy finished successfully");
}

main().catch(err => {
  console.error("❌ Build copy failed:", err);
  process.exit(1);
});
