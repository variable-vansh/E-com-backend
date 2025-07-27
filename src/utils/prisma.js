const { PrismaClient } = require("../db/generated/prisma");
const prisma = new PrismaClient();
module.exports = prisma;
