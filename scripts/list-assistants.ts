import { prisma } from "../lib/prisma";

async function main() {
  const assistants = await prisma.assistant.findMany({
    orderBy: {
      id: "asc",
    },
  });

  console.dir(assistants, { depth: null });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
