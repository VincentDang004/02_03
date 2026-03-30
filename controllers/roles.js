const roleModel = require('../schemas/roles');

const getAllRoles = async (req, res, next) => {
    try {
        const roles = await roleModel.find({ isDeleted: false });
        res.send(roles);
    } catch (err) {
        res.status(500).send({ message: err.message });
    }
};

const getRoleById = async (req, res, next) => {
    try {
        const role = await roleModel.findOne({ _id: req.params.id, isDeleted: false });
        if (!role) {
            return res.status(404).send({ message: "Role not found" });
        }
        res.send(role);
    } catch (error) {
        res.status(404).send({ message: "ID not found" });
    }
};

const createRole = async (req, res, next) => {
    try {
        const { name, description } = req.body;
        const newRole = new roleModel({
            name,
            description
        });
        const savedRole = await newRole.save();
        res.status(201).send(savedRole);
    } catch (err) {
        res.status(400).send({ message: err.message });
    }
};

const updateRole = async (req, res, next) => {
    try {
        const { id } = req.params;
        const updateData = req.body;

        const updatedRole = await roleModel.findByIdAndUpdate(id, updateData, { new: true, runValidators: true });

        if (!updatedRole) {
            return res.status(404).send({ message: "Role not found" });
        }
        res.send(updatedRole);
    } catch (err) {
        res.status(400).send({ message: err.message });
    }
};

const deleteRole = async (req, res, next) => {
    try {
        const { id } = req.params;
        const deletedRole = await roleModel.findByIdAndUpdate(id, { isDeleted: true }, { new: true });
        if (!deletedRole) {
            return res.status(404).send({ message: "Role not found" });
        }
        res.send({ message: "Role deleted successfully", role: deletedRole });
    } catch (err) {
        res.status(400).send({ message: err.message });
    }
};

module.exports = {
    getAllRoles,
    getRoleById,
    createRole,
    updateRole,
    deleteRole
};
