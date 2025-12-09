import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import './App.css';
import TaskForm from './TaskForm';

// Definición de la interfaz de la Tarea para TypeScript
interface Task {
  _id: string;
  title: string;
  status: 'new' | 'in-progress' | 'done';
}

type TaskStatus = Task['status'];

function App() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  // Función para obtener las tareas del backend
  const fetchTasks = useCallback(async () => {
    setLoading(true);
    try {
      const response = await axios.get('http://localhost:3000/api/tasks');
      setTasks(response.data);
    } catch (error) {
      console.error("Hubo un error al obtener las tareas:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  // Función que se ejecutará al hacer click en una tarea
  const handleStatusUpdate = async (taskId: string, currentStatus: string) => {
    // Se define el ciclo: new -> in-progress -> done -> new
    const statusCycle: Task["status"][] = ['new', 'in-progress', 'done'];

    // currentIndex debe ser un numero
    const currentIndex = statusCycle.indexOf(currentStatus);

    // Calcula el siguiente indice siguiendo el operador % para el ciclo
    const nextIndex = (currentIndex + 1) % statusCycle.length;
    const nextStatus = statusCycle[nextIndex];

    try {
      // 1. Envía la solicitud PATCH al backend
      await axios.patch(`http://localhost:3000/api/tasks/${taskId}`, {
        status: nextStatus,
      });
      // 2. Después del éxito, se recarga la lista para mostrar el cambio
      fetchTasks();
    } catch (error) {
      // Usar console.error para ver el error completo
      console.error('Error al actualizar el estado:', error);
    }
  };

  // Funcion para eliminar tareas
  const handleDeleteTask = async (taskId: string) => {
    // Solicitar la confirmacion del usuario
    if (!window.confirm('¿Está seguro que desa eliminar la tarea?')) {
      return;
    }
    try {
      // 1. Enviar la solicitud delete al backend
      await axios.delete(`http://localhost:3000/api/tasks/${taskId}`);

      // 2. Despues, se recarga la pagina
      fetchTasks();
    } catch (error) {
      console.error("Error al eliminar la tarea:", error);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);// Dependencias necesarias para useCallback

  return (
    <div className="App" style={{ padding: '20px' }}>
      <h1>📋 Mi Tablero Kanban</h1>

      {/*Renderiza el formulario y pasa la funcion fetchTasks para recargar*/}
      <TaskForm onTaskCreated={fetchTasks} />

      {loading ? (
        <p>Cargando tareas...</p>
      ) : tasks.length === 0 ? (
        <p>¡No hay tareas. Crea una arriba!</p>
      ) : (
        <ul style={{ listStyleType: 'none', padding: 0 }}>
          {tasks.map(task => (
            <li
              key={task._id}
              // Añadir el evento onClick aquí
              onClick={() => handleStatusUpdate(task._id, task.status as TaskStatus)}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                padding: '10px',
                border: '1px solid #ddd',
                marginBottom: '5px',
                borderRadius: '5px',
                cursor: 'pointer',
                backgroundColor: task.status === 'done' ? '#e6ffe6' : 'white'
              }}
            >
              <div>
                <strong>{task.title}</strong> - Estado: **{task.status.toUpperCase()}**
              </div>

              {/*Boton para eliminar*/}
              <button
                onClick={(e) => {
                  e.stopPropagation(); // evita que el click en el boton active el onclick del <li>
                  handleDeleteTask(task._id);
                }}
                style={{
                  marginLeft: '10px',
                  backgroundColor: 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: '1.2em',
                }}
              >
                ❌
              </button>
            </li>
          ))}
        </ul>
      )}

    </div>
  );
}

export default App;