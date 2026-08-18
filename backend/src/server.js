const server = require("./app");

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
  console.log(`servidor rodando na porta http://localhost:${PORT}`);
});
