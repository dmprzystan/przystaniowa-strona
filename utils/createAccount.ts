import { PrismaClient } from "@prisma/client";
import * as readline from "readline";

const prisma = new PrismaClient();

export const createAccount = async (login: string, password: string) => {
  const user = await prisma.user.create({
    data: {
      login,
      password,
    },
  });

  return user;
};

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const prompt = (question: string) =>
  new Promise<string>((resolve) => rl.question(question, resolve));

const main = async () => {
  const login = await prompt("Login: ");
  const password = await prompt("Password: ");
  const passwordHash = Bun.password.hashSync(password, {
    algorithm: "bcrypt",
    cost: 12,
  });

  try {
    await createAccount(login, passwordHash);
    console.log("Account created successfully.");
  } catch (error) {
    console.error("Failed to create account.");
    console.error(error);
  } finally {
    await prisma.$disconnect();
  }
};

main().finally(() => rl.close());

rl.on("close", () => process.exit(0));
