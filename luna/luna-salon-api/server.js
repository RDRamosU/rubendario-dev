// server.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const conectarDB = require('./config/db');

// Importar rutas
const servicioRoutes = require('./routes/servicioRoutes');
const citas = require('./routes/citaRoutes');

const app = express();

// Conectar a la base de datos
conectarDB();

// Middlewares
app.use(cors());
app.use(express.json());

app.use(cors({
    origin:['https://lunasalonbymargarita.salon', 'https:rubendario.dev']
}));

// Importar rutas
app.use('/api/servicios', servicioRoutes);
app.use('/api/citas', citaRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor en puerto ${PORT}`));

// =======================================================
// Rutas para gestionar servicios (CRUD)
// =======================================================

// 1. obtener todos los servicios (GET)
app.get('/api/servicios', (req, res) => {
    res.json(servicios);
});

// 2. agregar un servicio nuevo (POST)
app.post('/api/servicios', (req, res) => {
    const { nombre, precio } = req.body;
    if (!nombre || !precio) {
        return res.status(400).json({ error: "Nombre y precio son obligatorios." });
    }
    const nuevoServicio = {
        id: idContadorServicios++,
        nombre,
        precio: parseFloat(precio)
    };
    servicios.push(nuevoServicio);
    res.status(201).json({ mensaje: "Servicio agregado", servicio: nuevoServicio });

});

// 3. Actualizar un servicio (PUT)
// se usa :id como parametro en la URL
app.put('/api/servicios/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const { nombre, precio } = req.body;

    const indice = servicios.findIndex(s => s.id === id);

    if (indice === -1) {
        return res.status(404).json({ error: "Servicio no encontrado." });
    }
    // Actualizar solo los campos que vengan en la peticion
    if (nombre) servicios[indice].nombre = nombre;
    if (precio) servicios[indice].precio = parseFloat(precio);

    res.json({ mensaje: "Servicio actualizado", servicio: servicios[indice] });
});

// 4. Eliminar un servicio (DELETE)
app.delete('/api/servicios/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const indice = servicios.findIndex(s => s.id === id);

    if (indice === -1) {
        return res.status(404).json({ mensaje: "Servicio no encontrado." });
    }
    // Eliminamos  el elemento del arreglo
    const servicioEliminado = servicios.splice(indice, 1);
    res.json({ mensaje: "Servicio eliminado", servicio: servicioEliminado[0] });
});

// =======================================================
// Ruta para citas
// =======================================================

app.post('/api/citas', (req, res) => {
    const { cliente, fecha, hora, servicioId } = req.body;
    const servicioEncontrado = servicios.find(s => s.id === servicioId);

    if (!servicioEncontrado) {
        return res.status(404).json({ error: "El servicio no existe" });
    }

    const nuevaCita = { id: citas.length + 1, cliente, fecha, hora, servicio: servicioEncontrado.nombre, precio: servicioEncontrado.precio };
    citas.push(nuevaCita);
    res.status(201).json(nuevaCita);
});

// Inicio del Servidor
app.listen(PORT, () => {
    console.log(`Servidor Express escuchando en http://localhost:${PORT}`);
});