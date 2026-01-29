const express = require('express');
const router = express.Router();
const { Department } = require('../models');

router.get('/', async (req, res) => {
    try {
        const departments = await Department.findAll();
        res.json(departments);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.post('/', async (req, res) => {
    try {
        if (!req.body.name) {
            return res.status(400).json({ message: "Nama departemen wajib diisi" });
        }
        const newDept = await Department.create({ name: req.body.name });
        res.status(201).json(newDept);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.put('/:id', async (req, res) => {
    try {
        const dept = await Department.findByPk(req.params.id);
        if (!dept) return res.status(404).json({ message: "Departemen tidak ditemukan" });
        
        await dept.update({ name: req.body.name });
        res.json(dept);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.delete('/:id', async (req, res) => {
    try {
        const dept = await Department.findByPk(req.params.id);
        if (!dept) return res.status(404).json({ message: "Departemen tidak ditemukan" });
        
        await dept.destroy();
        res.json({ message: "Departemen berhasil dihapus" });
    } catch (err) {
        res.status(500).json({ message: "Tidak bisa menghapus: Departemen mungkin masih digunakan oleh karyawan" });
    }
});

module.exports = router;