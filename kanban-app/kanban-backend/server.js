// Importar dotenv, el modulo express y Mongoose
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

// Crear una instancia de la app Express
const app = express();

const allowedOrigins = ['https://rubendario.dev'];
const corsOptions = {
    origin: allowedOrigins
};

// Middleware para habilitar CORS y leer JSON
app.use(cors(corsOptions));
app.use(express.json());

// Definir el puerto y la URI
const PORT = process.env.PORT || 3000;
const MONGODB_URI = process.env.MONGODB_URI;

// Funcion para conectar la base de datos
const connectDB = async () => {
    try {
        await mongoose.connect(MONGODB_URI);
        console.log('MongoDB connectado exitosamente.');
    } catch (error) {
        console.error('Error de conexion a MongoDB:', error.message);
        // salir del proceso
        process.exit(1);
    }
}

// Llamar a la funcion
connectDB();

// Importar el modelo de Tarea
const Task = require('./models/Task');

// Denifir la ruta basica
app.get('/api/tasks', async (req, res) => {
    try {
        // Encontrar toas las tareas en la coleccion 'tasks' de MongoDB
        const tasks = await Task.find();
        res.json(tasks);
    } catch (error) {
        // Manejo de errores de la base de datos
        console.error('Error al obtener tareas:', error);
        res.status(500).json({ message: 'Error al obtener las tareas de la base de datos' });
    }
});

// 2. Ruta POST para crear una nueva tarea 
app.post('/api/tasks', async (req, res) => {
    try {
        // 1. Obtener la info enviada por el cliente (React)s
        const { title, status } = req.body;

        // 2. Crear una nueva instancia del modelo de tarea (Mongoose)
        const newTask = new Task({
            title: title,
            status: status
        });

        // 3. Guardar la nueva tarea en la base de datos
        const savedTask = await newTask.save();

        // 4. Responder al cliente con la tarea recien creada y un codigo de exito
        res.status(201).json(savedTask);

    } catch (error) {
        // Manejo de errores de validacion de Mongoose
        console.error('Error al crear la tarea:', error);

        // Si hay un error de validacion p.ej.: el campo 'title' es requerido
        if (error.name === 'validationError') {
            return res.status(400).json({ message: error.message });
        }

        // Error generico del servidor
        res.status(500).json({ message: 'Error interno del servidor al crear la tarea' });
    }
});

// 3. Ruta PATCH para actalizar una tarea
app.patch('/api/tasks/:id', async (req, res) => {
    try {
        // 1. Obtener el ID de la tarea desde los parametros de la URl
        const { id } = req.params;

        // 2. Obtener la info a actualizar desde el body
        const updatedData = req.body;

        // 3. Buscar y actualizar la tarea en MongoDB
        /*
            Opciones:
            { new: true } -> Le dice a Mongoose que devuelva el documento actualizado
            { runValidators: true} -> Ejecuta las validaciones de Schema
        */
        const updatedTask = await Task.findByIdAndUpdate(
            id,
            updatedData,
            { new: true, runValidators: true }
        );

        // 4. Manejar el caso si el ID no existe
        if (!updatedTask) {
            return res.status(404).json({ message: 'Tarea no encontrada' });
        }

        // 5. Responder con el documento actualizado | codigo 200 (OK)
        res.status(200).json(updatedTask);
    } catch (error) {
        // Manejo de errores de validacion
        console.error('Error al actualizar la tarea:', error);

        if (error.name === 'ValidationError') {
            return res.status(400).json({ message: error.message });
        }
        // Error generico
        res.status(500).json({ message: 'Error interno del servidor al actualizar la tarea' });
    }
});

// 4. Ruta Delete para Eliminar una tarea
app.delete('/api/tasks/:id', async (req, res) => {
    try {
        // 1. Obtener el ID de la tarea desde los parametros de la URL
        const { id } = req.params;

        // 2. Buscar y eliminar la tarea en mongoDB
        const deletedTask = await Task.findByIdAndDelete(id);

        // 3. Manejar el caso si el ID no exite
        if (!deletedTask) {
            return res.status(404).json({ message: 'Tarea no encontrada' });
        }

        // 4. Responder con el codigo de exito sin contenido
        // El codigo 204 No Content indica que la accion fue exitosa pero no hay datos que devolver
        res.status(204).send();
    } catch (error) {
        console.log('Error al eliminar la tarea:', error);
        // Error generico del servidor
        res.status(500).json({ message: 'Error interno del servidor al eliminar la tarea' });
    }
});

// Iniciar el servidor
app.listen(process.env.PORT || PORT, () => {
    const actualPort = process.env.PORT || PORT;
    console.log(`Servidor Express escuchando escuchando en el puerto:${actualPort}`);
});
