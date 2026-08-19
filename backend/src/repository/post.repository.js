const prisma = require("../config/prisma.config");

class PostRepository {
  // 1. Criar postagem
  async createPost(data) {
    if (!data || !data.title || !data.content || !data.authorId) {
      throw new Error("Título, conteúdo e autor são obrigatórios");
    }

    return await prisma.post.create({
      data: {
        title: data.title,
        content: data.content,
        authorId: data.authorId,
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });
  }

  // 2. Buscar postagem por ID
  async findById(id) {
    if (!id) {
      throw new Error("ID é obrigatório");
    }

    const post = await prisma.post.findUnique({
      where: {
        id,
        deleted_at: null,
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        _count: {
          select: {
            comments: true,
          },
        },
      },
    });

    if (!post) {
      throw new Error("Postagem não encontrada");
    }

    return post;
  }

  // 3. Atualizar postagem
  async updatePost(id, data) {
    if (!id) {
      throw new Error("ID é obrigatório");
    }

    if (!data || Object.keys(data).length === 0) {
      throw new Error("Dados para atualização são obrigatórios");
    }

    // Atualiza apenas campos enviados
    const updateData = {};
    if (data.title) updateData.title = data.title;
    if (data.content) updateData.content = data.content;
    if (data.authorId) updateData.authorId = data.authorId;

    try {
      return await prisma.post.update({
        where: { id },
        data: updateData,
        include: {
          author: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      });
    } catch (error) {
      if (error.code === "P2026") {
        throw new Error("Postagem não encontrada");
      }
      throw error;
    }
  }

  // 4. Deletar postagem (soft delete)
  async deletePost(id) {
    if (!id) {
      throw new Error("ID é obrigatório");
    }

    try {
      return await prisma.post.update({
        where: { id },
        data: { deleted_at: new Date() },
      });
    } catch (error) {
      if (error.code === "P2026") {
        throw new Error("Postagem não encontrada");
      }
      throw error;
    }
  }

  // 5. Listar todas postagens com paginação
  async findAll(options = {}) {
    const { page = 1, limit = 10, authorId } = options;
    const skip = (page - 1) * limit;

    const where = { deleted_at: null };
    if (authorId) {
      where.authorId = authorId;
    }

    return await prisma.post.findMany({
      where,
      skip,
      take: limit,
      orderBy: { created_at: "desc" },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        _count: {
          select: {
            comments: true,
          },
        },
      },
    });
  }

  // 6. Buscar posts por autor
  async findByAuthor(authorId) {
    if (!authorId) {
      throw new Error("ID do autor é obrigatório");
    }

    return await prisma.post.findMany({
      where: {
        authorId,
        deleted_at: null,
      },
      orderBy: {
        created_at: "desc",
      },
      include: {
        _count: {
          select: {
            comments: true,
          },
        },
      },
    });
  }

  // 7. Buscar posts com comentários (extra)
  async findWithComments(id) {
    if (!id) {
      throw new Error("ID é obrigatório");
    }

    const post = await prisma.post.findUnique({
      where: {
        id,
        deleted_at: null,
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        comments: {
          where: { deleted_at: null },
          orderBy: { created_at: "desc" },
          take: 5,
          include: {
            user: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
        _count: {
          select: {
            comments: true,
          },
        },
      },
    });

    if (!post) {
      throw new Error("Postagem não encontrada");
    }

    return post;
  }
}

module.exports = new PostRepository();
