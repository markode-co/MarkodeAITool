import fs from "fs";
import path from "path";
import cpy from "cpy";

async function main() {
  // إنشاء مجلد dist/server/public إذا لم يكن موجود
  const publicDir = path.join("dist", "server", "public");
  if (!fs.existsSync(publicDir)) fs.mkdirSync(publicDir, { recursive: true });

  // 1️⃣ نسخ ملفات client/dist → dist/server/public
  await cpy("client/dist/*", publicDir, { parents: false });

  // 2️⃣ نسخ ملفات shared → dist/shared
  const sharedDir = path.join("dist", "shared");
  if (!fs.existsSync(sharedDir)) fs.mkdirSync(sharedDir, { recursive: true });
  await cpy("shared/**/*", sharedDir, { parents: true });

  // 3️⃣ نسخ ملفات js المهمة من server → dist/server
  const serverDir = path.join("dist", "server");
  if (!fs.existsSync(serverDir)) fs.mkdirSync(serverDir, { recursive: true });
  await cpy("server/*.js", serverDir, { parents: false });

  console.log("✅ Build copy finished successfully");
}

main().catch(err => {
  console.error("❌ Build copy failed:", err);
  process.exit(1);
});
