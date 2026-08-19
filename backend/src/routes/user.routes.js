const { Router } = require("express");
const UserController = require("../controller/user.controller");

const router = Router();
const userController = new UserController();

router.post("/users", (req, res) => userController.createUser(req, res));
router.get("/users", (req, res) => userController.findAll(req, res));
router.get("/users/email/:email", (req, res) =>
  userController.findByEmail(req, res),
);
router.put("/users/:id", (req, res) => userController.updateUser(req, res));
router.get("/users/:id", (req, res) => userController.findById(req, res));
router.delete("/users/:id", (req, res) => userController.deleteUser(req, res));

module.exports = router;
