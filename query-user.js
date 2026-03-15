require("dotenv").config();
const { PrismaClient } = require("@prisma/client");
(async () => {
  const prisma = new PrismaClient();
  try {
    const u = await prisma.user.findUnique({
      where: { email: "test@example.com" },
    });
    if (!u) {
      console.log("user not found");
    } else {
      console.log("user:", u);
    }
  } catch (e) {
    console.error("error", e);
  } finally {
    await prisma.$disconnect();
  }
})();
