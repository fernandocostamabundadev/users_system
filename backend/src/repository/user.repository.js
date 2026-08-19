const prisma = require("../config/prisma.config");

class UserRepository {
  // 1. Criar usuário
  async createUser(userData) {
    if (!userData || !userData.name || !userData.email || !userData.password) {
      throw new Error("Dados do usuário são obrigatórios");
    }

    return await prisma.user.create({
      data: {
        name: userData.name,
        email: userData.email,
        password: userData.password,
      },
    });
  }

  // 2. Buscar usuário por ID
  async findById(id) {
    if (!id) {
      throw new Error("ID obrigatório");
    }

    const user = await prisma.user.findUnique({
      where: {
        id,
        deleted_at: null,
      },
    });

    if (!user) {
      throw new Error("Usuário não encontrado");
    }

    return user;
  }

  // 3. Buscar usuário por email
  async findByEmail(email) {
    if (!email) {
      throw new Error("Email obrigatório");
    }

    const user = await prisma.user.findUnique({
      where: {
        email,
        deleted_at: null,
      },
    });

    if (!user) {
      throw new Error("Usuário não encontrado");
    }

    return user;
  }

  // 4. Atualizar usuário
  async updateUser(id, userData) {
    if (!id) {
      throw new Error("ID obrigatório");
    }

    if (!userData || Object.keys(userData).length === 0) {
      throw new Error("Dados para atualização são obrigatórios");
    }

    try {
      return await prisma.user.update({
        where: { id },
        data: userData,
      });
    } catch (error) {
      if (error.code === "P2025") {
        throw new Error("Usuário não encontrado");
      }
      throw error;
    }
  }

  // 5. Deletar usuário (soft delete)
  async deleteUser(id) {
    if (!id) {
      throw new Error("ID obrigatório");
    }

    try {
      return await prisma.user.update({
        where: { id },
        data: { deleted_at: new Date() },
      });
    } catch (error) {
      if (error.code === "P2025") {
        throw new Error("Usuário não encontrado");
      }
      throw error;
    }
  }

  // 6. Listar todos usuários
  async findAll() {
    return await prisma.user.findMany({
      where: {
        deleted_at: null,
      },
      orderBy: {
        created_at: "desc",
      },
    });
  }
}

module.exports = UserRepository;
