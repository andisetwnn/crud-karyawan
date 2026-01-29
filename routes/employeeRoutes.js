const express = require('express');
const router = express.Router();
const { Employee, Department } = require('../models');

router.get('/', async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const offset = (page - 1) * limit;

        const { count, rows } = await Employee.findAndCountAll({
            include: {
                model: Department,
                through: { attributes: ['assignedAt'] }
            },
            limit: limit,
            offset: offset,
            order: [['createdAt', 'DESC']]
        });

        res.json({
            totalData: count,
            totalPages: Math.ceil(count / limit),
            currentPage: page,
            data: rows
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.post('/', async (req, res) => {
    try {
        const { name, email, position, salary, departmentIds } = req.body;
        
        if (!name || !email) {
            return res.status(400).json({ message: "Name dan Email wajib diisi" });
        }

        const newEmployee = await Employee.create({ name, email, position, salary });

        if (departmentIds && departmentIds.length > 0) {
            await newEmployee.setDepartments(departmentIds);
        }

        res.status(201).json(newEmployee);
    } catch (err) {
        if (err.name === 'SequelizeUniqueConstraintError') {
            return res.status(400).json({ message: "Email sudah terdaftar!" });
        }
        if (err.name === 'SequelizeValidationError') {
            return res.status(400).json({ message: err.errors[0].message });
        }
        res.status(500).json({ message: err.message });
    }
});

router.put('/:id', async (req, res) => {
    try {
        const { name, email, position, salary, departmentIds } = req.body;
        const employee = await Employee.findByPk(req.params.id);

        if (!employee) {
            return res.status(404).json({ message: "Karyawan tidak ditemukan" });
        }

        await employee.update({ name, email, position, salary });

        if (departmentIds) {
            await employee.setDepartments(departmentIds);
        }
        
        res.json({ message: "Data berhasil diperbarui", data: employee });
    } catch (err) {
        if (err.name === 'SequelizeUniqueConstraintError') {
            return res.status(400).json({ message: "Email sudah digunakan oleh karyawan lain!" });
        }
        if (err.name === 'SequelizeValidationError') {
            return res.status(400).json({ message: err.errors[0].message });
        }
        res.status(500).json({ message: err.message });
    }
});

router.delete('/:id', async (req, res) => {
    try {
        const employee = await Employee.findByPk(req.params.id);
        
        if (!employee) {
            return res.status(404).json({ message: "Karyawan tidak ditemukan" });
        }

        await employee.destroy();
        res.json({ message: "Karyawan berhasil dihapus" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;