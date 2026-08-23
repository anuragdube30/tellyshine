const fs = require("fs");
const path = require("path");
const crypto = require("crypto");
const { execFileSync } = require("child_process");

const root = path.resolve(__dirname, "..");
process.chdir(root);

const envPath = path.join(root, ".env");
if (!fs.existsSync(envPath)) {
  const secret = crypto.randomBytes(32).toString("base64");
  fs.writeFileSync(envPath, [
    'DATABASE_URL="file:./dev.db"',
    `AUTH_SECRET="${secret}"`,
    'NEXT_PUBLIC_SITE_URL="http://localhost:3000"',
    'CLOUDINARY_CLOUD_NAME=',
    'CLOUDINARY_API_KEY=',
    'CLOUDINARY_API_SECRET=',
    '',
  ].join("\n"));
  console.log("Created .env with a secure local AUTH_SECRET.");
}

function run(command, args) {
  console.log(`\n> ${command} ${args.join(" ")}`);
  execFileSync(command, args, { cwd: root, stdio: "inherit", shell: process.platform === "win32" });
}

run(process.platform === "win32" ? "npx.cmd" : "npx", ["prisma", "generate"]);
run(process.platform === "win32" ? "npx.cmd" : "npx", ["prisma", "db", "push"]);
run(process.platform === "win32" ? "npm.cmd" : "npm", ["run", "db:seed"]);
run(process.platform === "win32" ? "npm.cmd" : "npm", ["run", "db:reset-admin"]);

console.log("\nSetup complete!");
console.log("Admin: http://localhost:3000/admin/login");
console.log("Email: admin@tellyshine.com");
console.log("Password: TellyShine@123");
