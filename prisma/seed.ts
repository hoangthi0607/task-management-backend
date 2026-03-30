import bcrypt from "bcrypt";
import { PrismaClient } from "../src/generated/prisma/client.js";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";

const adapter = new PrismaMariaDb({
  host: process.env.DATABASE_HOST || "localhost",
  port: Number(process.env.DATABASE_PORT || 3306),
  user: process.env.DATABASE_USER || "root",
  password: process.env.DATABASE_PASSWORD || "123456",
  database: process.env.DATABASE_NAME || "task-management",
});

const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("Seeding database...");

  const roleAdmin = await prisma.role.upsert({
    where: { role_name: "admin" },
    update: {},
    create: { role_name: "admin" },
  });

  const roleUser = await prisma.role.upsert({
    where: { role_name: "user" },
    update: {},
    create: { role_name: "user" },
  });

  const department = await prisma.department.upsert({
    where: { department_name: "Development" },
    update: {},
    create: { department_name: "Development" },
  });

  const passwordHash = await bcrypt.hash("Password123!", 10);

  const admin = await prisma.user.upsert({
    where: { email: "admin@task.local" },
    update: {},
    create: {
      name: "Admin",
      email: "admin@task.local",
      password: passwordHash,
      role_id: roleAdmin.role_id,
      department_id: department.department_id,
    },
  });

  const user = await prisma.user.upsert({
    where: { email: "user@task.local" },
    update: {},
    create: {
      email: "user@task.local",
      name: "Regular User",
      password: passwordHash,
      role_id: roleUser.role_id,
      department_id: department.department_id,
    },
  });

  const project = await prisma.project.upsert({
    where: { project_id: 1 },
    update: {
      name: "Demo Project",
      description: "Project seeded for development",
      manager_id: admin.user_id,
    },
    create: {
      name: "Demo Project",
      description: "Project seeded for development",
      manager_id: admin.user_id,
    },
  });

  const task = await prisma.task.upsert({
    where: { task_id: 1 },
    update: {
      name: "Demo Task",
      description: "Task seeded for demo",
      status: "todo",
      Project: { connect: { project_id: project.project_id } },
      User: { connect: { user_id: user.user_id } },
    },
    create: {
      name: "Demo Task",
      description: "Task seeded for demo",
      status: "todo",
      Project: { connect: { project_id: project.project_id } },
      User: { connect: { user_id: user.user_id } },
    },
  });

  await prisma.notification.create({
    data: {
      message: "Welcome to Task Management System",
      User: { connect: { user_id: user.user_id } },
      Task: { connect: { task_id: task.task_id } },
    },
  });

  await prisma.report.create({
    data: {
      content: "Summary seeded report content",
      Project: { connect: { project_id: project.project_id } },
    },
  });

  console.log("Seed completed.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
