const UserRepository = require("../repository/user.repository");

class UserService {
  constructor() {
    this.UserRepository = new UserRepository();
  }
  // 1 criar usuario
  async createUser(data) {
    if (!data.name || !data.email || !data.password) {
      throw new Error(" nome, email e senha obrigatorio");
    }
    const user = await this.UserRepository.createUser(data);
    const { password, ...userWhitouthPassword } = user;
    return userWhitouthPassword;
  }
  // 2 listar usuario
  async findById(id) {
    if (!id) {
      throw new Error("ID obrigatorio");
    }
    try {
      const user = await this.UserRepository.findById(id);
      const { password, ...userWhitouthPassword } = user;
      return userWhitouthPassword;
    } catch (Error) {
      throw new Error("usuario nao encontrado");
    }
  }
  // 3 atualizar usuario
  async updateUser(id, data) {
    if (!id) {
      throw new Error("ID Obrigatorio");
    }
    if (!data || Object.keys(data).length === 0) {
      throw new Error("dados sao obrigatorios para atualizar");
    }
    const user = await this.UserRepository.updateUser(id, data);
    const { password, ...userWhitouthPassword } = user;
    return userWhitouthPassword;
  }
  // 4 deletar usuario
  async deleteUser(id) {
    if (!id) {
      throw new Error("ID obrigatorio");
    }
    const user = await this.UserRepository.deleteUser(id);
    return { sucess: true, message: "usuario eliminado com sucesso" };
  }
  // 5 verificar se email existe
  async findByEmail(email) {
    const user = await this.UserRepository.findByEmail(email);
  }
}

module.exports = UserService;
