const express = require('express');
const router = express.Router();
const Servicio = require('../models/Servicio');

// Obtener los servicios (GET)
router.get('/', async (req, res) => {
    try {
        const servicios = await Servicio.find();
        res.json(servicios);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener los servicios.' });
    }
});

// Crear un nuevo servicio (POST)
router.post('/', async (req, res) => {
    const { nombre, precio } = req.body;

    try {
        const nuevoServicio = new Servicio({ nombre, precio });
        const servicioGuardado = await nuevoServicio.save();
        res.status(201).json(servicioGuardado);
    } catch (error) {
        res.status(400).json({ error: 'Error al crear el servicio' });
    }
});

// Actualizar un servicio (PUT)
router.put('/:id', async (req, res) => {
    try {
        const servicioActualizado = await Servicio.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true } // esto devuelve el objeto actualizado
        );
        if (!servicioActualizado) return res.status(404).json({ error: 'Servicio no encontrado' });
        res.json(servicioActualizado);
    } catch (error) {
        res.status(400).json({ error: 'Error al actualizar el servicio' });
    }
});
// Eliminar un servicio
router.delete('/.id', async (req, res) => {
    try {
        const servicioEliminado = await Servicio.findByIdAndDelete(req.params.id);
        if (!servicioEliminado) return res.status(404).json({ error: "Servicio no encontrado" });
        res.json({ mensaje: 'Servicio eliminado correctamente' });
    } catch (error) {
        res.status(500).json({ error: 'Error al eliminar el servicio' });
    }
});

module.exports = router;
