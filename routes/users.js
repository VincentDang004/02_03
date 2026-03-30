const express = require("express");
const router = express.Router();
const { postUserValidator, validateResult } = require('../utils/validatorHandler');
const userController = require('../controllers/users');

// GET all users
router.get("/", userController.getAllUsers);

// GET user by ID
router.get("/:id", userController.getUserById);

// POST create a new user
router.post("/", postUserValidator, validateResult, userController.createUser);

// PUT update a user
router.put("/:id", userController.updateUser);

// DELETE (soft) a user
router.delete("/:id", userController.deleteUser);

// POST enable a user
router.post("/enable", userController.enableUser);

// POST disable a user
router.post("/disable", userController.disableUser);

module.exports = router;