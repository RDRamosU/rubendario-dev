const mongoose = require('mongoose');

// Definir el Esquema (estructura) de una tarea
const TaskSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true, // Elimina espacion en blanco al inicio/final
    },
    status: {
        type: String,
        enum: ['new', 'in-progress', 'done'], // solo acepta estos valores
        default: 'todo',
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

// Crear y exportar el modelo
// Mongoose creara una coleccion llamada 'tasks'
module.exports = mongoose.model('Task', TaskSchema);