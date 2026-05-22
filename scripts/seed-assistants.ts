import { prisma } from "../lib/prisma";

async function main() {
  const assistantsCount = await prisma.assistant.count();

  if (assistantsCount > 0) {
    console.log("Assistants already exist. Skip seeding.");
    return;
  }

  const assistants = await prisma.assistant.createMany({
    data: [
      {
        name: "StudyBot",
        instruction: "Помогает учиться, объясняет сложные темы простыми словами и задаёт вопросы для проверки знаний.",
      },
      {
        name: "Code Helper",
        instruction: "Помогает писать код, объясняет ошибки и подсказывает решения шаг за шагом.",
      },
      {
        name: "Life Planner",
        instruction: "Помогает планировать задачи, день, цели и разбивать большие дела на маленькие шаги.",
      },
    ],
  });

  console.log("Assistants created:", assistants);
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