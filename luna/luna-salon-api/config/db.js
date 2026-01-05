const mongoose = require('mongoose');

const connectarDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Mongo DB Conectado con exito');
    } catch (error) {
        console.error('Error al connectar a MongoDB', error.message);
        process.exit(1); // Detiene la app si falla la conexion
    }
};

module.exports = connectarDB;