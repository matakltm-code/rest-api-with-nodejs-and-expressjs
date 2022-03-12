const express = require("express");
const router = express.Router();

const {
  getUserById,
  getAllUsers,
  getUser,
  updateUser,
  deleteUser,
} = require("../controllers/User");
const PermissionMiddleware = require("../middlewares/auth.permission");
const ValidationMiddleware = require("../middlewares/auth.validation");
const config = require("../config/env");

const ADMIN = config.permissionLevels.ADMIN;

//params
// it will fetch the value from the url
router.param("userId", getUserById);

// Get all the users - Done
router.get("/users", [
  ValidationMiddleware.validJWTNeeded,
  PermissionMiddleware.minimumPermissionLevelRequired(ADMIN),
  getAllUsers,
]);

// Get a single user
router.get("/users/:userId/", [
  ValidationMiddleware.validJWTNeeded,
  PermissionMiddleware.minimumPermissionLevelRequired(ADMIN),
  getUser,
]);

// to update the user
router.put("/users/:userId/update", [
  ValidationMiddleware.validJWTNeeded,
  PermissionMiddleware.minimumPermissionLevelRequired(ADMIN),
  updateUser,
]);

// to delete the user
router.delete("/users/:userId/delete", [
  ValidationMiddleware.validJWTNeeded,
  PermissionMiddleware.minimumPermissionLevelRequired(ADMIN),
  deleteUser,
]);

module.exports = router;
