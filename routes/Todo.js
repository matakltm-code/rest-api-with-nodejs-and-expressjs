const express = require("express");
const router = express.Router();

// these are the controllers
// we will create all of them in the future
const {
  getTodoById,
  getTodoByUserId,
  createTodo,
  getTodo,
  deleteTodo,
  getAllUserTodos,
  getAllTodos,
  updateTodo,
} = require("../controllers/Todo");
const PermissionMiddleware = require("../middlewares/auth.permission");
const ValidationMiddleware = require("../middlewares/auth.validation");
const config = require("../config/env");

const ADMIN = config.permissionLevels.ADMIN;
const NORMAL_USER = config.permissionLevels.NORMAL_USER;

//params
// it will fetch the value from the url
router.param("todoId", getTodoById);
router.param("userId", getTodoByUserId);

// Get all the todos per user - Done
router.get("/todos/:userId", [
  ValidationMiddleware.validJWTNeeded,
  // creator or admin,
  PermissionMiddleware.onlySameUserOrAdminCanDoThisAction(),
  getAllUserTodos,
]);

// Get all the todos - Done
router.get("/todos/", [
  ValidationMiddleware.validJWTNeeded,
  PermissionMiddleware.minimumPermissionLevelRequired(ADMIN),
  getAllTodos,
]);

// Get a single todo
router.get("/todo/:todoId/", [
  ValidationMiddleware.validJWTNeeded,
  PermissionMiddleware.minimumPermissionLevelRequired(NORMAL_USER),
  getTodo,
]);

// to create a todo - Done
router.post("/todo/create/", [
  ValidationMiddleware.validJWTNeeded,
  PermissionMiddleware.minimumPermissionLevelRequired(NORMAL_USER),
  createTodo,
]);

// to update the todo
router.put("/todo/:todoId/update", [
  ValidationMiddleware.validJWTNeeded,
  PermissionMiddleware.minimumPermissionLevelRequired(NORMAL_USER),
  updateTodo,
]);

// to delete the todo
router.delete("/todo/:todoId/delete", [
  ValidationMiddleware.validJWTNeeded,
  PermissionMiddleware.minimumPermissionLevelRequired(NORMAL_USER),
  deleteTodo,
]);

module.exports = router;
