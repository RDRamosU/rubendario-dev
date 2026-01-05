const mongoose = require('mongoose');

const CitaSchema = new mongoose.Schema({
    cliente: { type: String, required: true },
    fecha: { type: String, required: true },
    hora: { type: String, required: true },
    servicio: { type: String, required: true },
    precio: { type: Number, required: true },
    fechaCreation: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Cita', CitaSchema);