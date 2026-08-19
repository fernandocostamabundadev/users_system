const prisma = require("../config/prisma.config");

class CommentRepository {
  // 1. Criar comentário
  async createComment(data) {
    if (!data || !data.content || !data.user_id || !data.post_id) {
      throw new Error("Conteúdo, usuário e post são obrigatórios");
    }

    return await prisma.comment.create({
      data: {
        content: data.content,
        user_id: data.user_id,
        post_id: data.post_id,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });
  }

  // 2. Buscar comentário por ID
  async findById(id) {
    if (!id) {
      throw new Error("ID é obrigatório");
    }

    const comment = await prisma.comment.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        post: {
          select: {
            id: true,
            title: true,
          },
        },
      },
    });

    if (!comment) {
      throw new Error("Comentário não encontrado");
    }

    return comment;
  }

  // 3. Atualizar comentário
  async updateComment(id, data) {
    if (!id) {
      throw new Error("ID é obrigatório");
    }

    if (!data || !data.content) {
      throw new Error("Conteúdo do comentário é obrigatório");
    }

    try {
      return await prisma.comment.update({
        where: { id },
        data: {
          content: data.content,
          updated_at: new Date(),
        },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      });
    } catch (error) {
      if (error.code === "P2025") {
        throw new Error("Comentário não encontrado");
      }
      throw error;
    }
  }

  // 4. Deletar comentário (soft delete)
  async deleteComment(id) {
    if (!id) {
      throw new Error("ID é obrigatório");
    }

    try {
      return await prisma.comment.update({
        where: { id },
        data: {
          deleted_at: new Date(),
        },
      });
    } catch (error) {
      if (error.code === "P2025") {
        throw new Error("Comentário não encontrado");
      }
      throw error;
    }
  }

  // 5. Listar todos comentários não deletados
  async findAll(options = {}) {
    const { post_id, user_id, limit = 10, page = 1 } = options;
    const skip = (page - 1) * limit;

    const where = {
      deleted_at: null,
    };

    if (post_id) {
      where.post_id = post_id;
    }

    if (user_id) {
      where.user_id = user_id;
    }

    return await prisma.comment.findMany({
      where,
      skip,
      take: limit,
      orderBy: {
        created_at: "desc",
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        post: {
          select: {
            id: true,
            title: true,
          },
        },
      },
    });
  }

  // 6. Buscar comentários por post
  async findByPostId(postId) {
    if (!postId) {
      throw new Error("ID do post é obrigatório");
    }

    return await prisma.comment.findMany({
      where: {
        post_id: postId,
        deleted_at: null,
      },
      orderBy: {
        created_at: "desc",
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });
  }

  // 7. Contar comentários de um post
  async countByPostId(postId) {
    if (!postId) {
      throw new Error("ID do post é obrigatório");
    }

    return await prisma.comment.count({
      where: {
        post_id: postId,
        deleted_at: null,
      },
    });
  }
}

module.exports = CommentRepository;
