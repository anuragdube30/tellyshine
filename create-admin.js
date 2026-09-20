const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

const email = (process.env.ADMIN_EMAIL || "admin@tellyshine.com").trim().toLowerCase();
const password = process.env.ADMIN_PASSWORD;

if (!password || password.length < 12) {
  console.error("Set ADMIN_PASSWORD to a strong password with at least 12 characters.");
  process.exit(1);
}
const name = process.env.ADMIN_NAME || "Telly Shine Desk";

async function main() {
  const passwordHash = await bcrypt.hash(password, 12);

  const user = await prisma.user.upsert({
    where: { email },
    update: {
      name,
      passwordHash,
      role: "SUPER_ADMIN",
    },
    create: {
      name,
      email,
      passwordHash,
      role: "SUPER_ADMIN",
    },
  });

  console.log("\nAdmin account is ready.");
  console.log(`Email: ${user.email}`);
  console.log("Admin password securely updated.");
  console.log(`Role: ${user.role}\n`);
}

main()
  .catch((error) => {
    console.error("Could not create/reset the admin account.");
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
