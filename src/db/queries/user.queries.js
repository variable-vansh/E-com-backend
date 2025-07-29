const prisma = require("../../utils/prisma");

// ================================
// USER CRUD OPERATIONS
// ================================

const userQueries = {
  // CREATE - Create a new user
  async createUser(data) {
    return await prisma.user.create({
      data,
    });
  },

  // READ - Get all users
  async getAllUsers() {
    return await prisma.user.findMany({
      include: {
        orders: true,
      },
    });
  },

  // READ - Get user by ID
  async getUserById(id) {
    return await prisma.user.findUnique({
      where: { id },
      include: {
        orders: {
          include: {
            orderItems: {
              include: {
                product: true,
              },
            },
          },
        },
      },
    });
  },

  // READ - Get user by email
  async getUserByEmail(email) {
    return await prisma.user.findUnique({
      where: { email },
      include: {
        orders: true,
      },
    });
  },

  // READ - Get user by username
  async getUserByUsername(username) {
    return await prisma.user.findUnique({
      where: { username },
    });
  },

  // UPDATE - Update user
  async updateUser(id, data) {
    return await prisma.user.update({
      where: { id },
      data,
    });
  },

  // DELETE - Delete user
  async deleteUser(id) {
    return await prisma.user.delete({
      where: { id },
    });
  },
};

module.exports = userQueries;
