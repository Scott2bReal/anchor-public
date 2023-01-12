// import { climberSeed } from "./climberSeed";
// import { climbingClassSeed } from "./climbingClassSeed"
import { PrismaClient } from "@prisma/client";
// import { gymSeed } from "./gymSeed";
// import { realClimberSeed } from "./realClimberSeed";

const prisma = new PrismaClient();

async function main() {
  // for(const gym of gymSeed) {
  //   await prisma.gym.create({
  //     data: gym,
  //   })
  // }
  // for (const climber of realClimberSeed) {
  //   await prisma.climber.create({
  //     data: climber,
  //   })
  // }
  // for (const climbingClass of climbingClassSeed) {
  //   await prisma.climbingClass.create({
  //     data: climbingClass,
  //   })
  // }
}

main().catch(e => {
  console.log(e);
  process.exit(1);
}).finally(() => {
    prisma.$disconnect()
  })
