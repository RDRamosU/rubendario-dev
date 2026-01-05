const express = require('express');
const router = express.Router();
const Cita = require('../models/Cita');
const Servicio = require('../models/Servicio');

// @route POST /api/citas
// @desc Crear una nueva cita
router.post('/', async (req, res) => {
    const { cliente, fecha, hora, servicioId } = req.body;
    try {
        const servicioDb = await Servicio.findById(servicioId);
        if(!servicioDb) return res.status(404).json({ error: "Servicio no encontrado" });

        const nuevaCita = new Cita({
            cliente,
            fecha,
            hora,
            servicio: servicioDb.nombre,
            precio: servicioDb.precio
        });

        const citaGuardada = await nuevaCita.save();
        res.status(201).json(citaGuardada);
    } catch (error) {
        res.status(500).json({ error: "Error al procesar la cita" });
    }
});

module.exports = router;