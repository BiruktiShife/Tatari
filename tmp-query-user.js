const { PrismaClient } = require("@prisma/client");
(async () => {
  const prisma = new PrismaClient();
  const u = await prisma.user.findUnique({
    where: { email: "test@example.com" },
  });
  console.log(u);
  process.exit(0);
})();
