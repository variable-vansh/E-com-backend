const prisma = require("../../utils/prisma");

// ================================
// GRAIN CRUD OPERATIONS
// ================================

const grainQueries = {
  // CREATE - Create a new grain
  async createGrain(data) {
    return await prisma.grain.create({
      data: {
        ...data,
        price: data.price.toString(), // Convert to Decimal
      },
    });
  },

  // READ - Get all grains
  async getAllGrains() {
    return await prisma.grain.findMany({
      orderBy: {
        name: "asc",
      },
    });
  },

  // READ - Get active grains only
  async getActiveGrains() {
    return await prisma.grain.findMany({
      where: {
        isActive: true,
      },
      orderBy: {
        name: "asc",
      },
    });
  },

  // READ - Get grain by ID
  async getGrainById(id) {
    return await prisma.grain.findUnique({
      where: { id },
    });
  },

  // READ - Get grain by name
  async getGrainByName(name) {
    return await prisma.grain.findUnique({
      where: { name },
    });
  },

  // UPDATE - Update grain by ID
  async updateGrain(id, data) {
    return await prisma.grain.update({
      where: { id },
      data: {
        ...data,
        price: data.price ? data.price.toString() : undefined,
      },
    });
  },

  // DELETE - Delete grain by ID
  async deleteGrain(id) {
    return await prisma.grain.delete({
      where: { id },
    });
  },

  // DELETE - Soft delete (set isActive to false)
  async softDeleteGrain(id) {
    return await prisma.grain.update({
      where: { id },
      data: { isActive: false },
    });
  },

  // UTILITY - Search grains by name
  async searchGrains(searchTerm) {
    return await prisma.grain.findMany({
      where: {
        name: {
          contains: searchTerm,
          mode: "insensitive",
        },
        isActive: true,
      },
      orderBy: {
        name: "asc",
      },
    });
  },

  // UTILITY - Get grains count
  async getGrainsCount() {
    return await prisma.grain.count();
  },

  // UTILITY - Get active grains count
  async getActiveGrainsCount() {
    return await prisma.grain.count({
      where: { isActive: true },
    });
  },
};

module.exports = { grainQueries };
