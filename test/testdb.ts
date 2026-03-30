// test/testdb.ts
import {prisma} from '../src/shared/prisma/prisma.service.js';

async function main() {
  const users = await prisma.user.findMany();
  console.log(users);
}

main();