import React, { useState } from 'react';
import axios from 'axios';

// Definición de las props que recibira el componente
interface TaskFormProps {
    onTaskCreated: () => void; // Función para recargar las tareas en el componente padre
}

const TaskForm: React.FC<TaskFormProps> = ({ onTaskCreated }) => {
    // Estado para guardar el texto del título de la tarea
    const [title, setTitle] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault(); // Previene que la pagina se recargue
        if (!title.trim()) return; // Si el título está vacío, no hace nada

        setLoading(true);

        const newTask = {
            title: title,
            // Usamos el estado inicial 'new' 
            status: 'new',
        };

        try {
            // 1. Envía la solicitud POST a tu backend
            await axios.post('http://localhost:3000/api/tasks', newTask);

            // 2. Limpia el campo después del éxito
            setTitle('');

            // 3. Notifica al componente app que recargue la lista
            onTaskCreated();
        } catch (error) {
            console.error("Error al crear la tarea:", error);
            alert("No se pudo crear la tarea. Revisa la consola.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} style={{ marginBottom: '20px' }}>
            <input
                type="text"
                placeholder="Escribe una nueva tarea..."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                disabled={loading}
                style={{ padding: '8px', width: '300px', marginRight: '10px' }}
            />
            <button type="submit" disabled={loading}>
                {loading ? 'Guardando...' : 'Añadir Tarea'}
            </button>
        </form>
    );
};

export default TaskForm;