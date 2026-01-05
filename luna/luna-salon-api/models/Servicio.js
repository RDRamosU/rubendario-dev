const mongoose = require('mongoose');

const ServicioSchema = new mongoose.Schema({
    nombre: {
        type: String,
        required: [true, 'El nombre del servicio es obligatorio'],
        trim: true
    },
    precio: {
        type: Number,
        required: ['El precio del servicio es obligatorio'],
    },
    fecha: {
        type: Date,
        default: Date.now
    }
});
module.exports = mongoose.model('Servicio', ServicioSchema);