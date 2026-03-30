const express = require("express");
const router = express.Router();
const roleController = require('../controllers/roles');
const { postRoleValidator, validateResult } = require('../utils/validatorHandler');

// GET all roles
router.get("/", roleController.getAllRoles);

// GET role by ID
router.get("/:id", roleController.getRoleById);

// POST create a new role
router.post("/", postRoleValidator, validateResult, roleController.createRole);

// PUT update a role
router.put("/:id", roleController.updateRole);

// DELETE (soft) a role
router.delete("/:id", roleController.deleteRole);

module.exports = router;