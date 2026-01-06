document.addEventListener('DOMContentLoaded', () => {
  
  // 1. Obtener referencias de los elementos del DOM
  const form = document.getElementById('reservaForm');
  const messageDiv = document.getElementById('formMessage');
  const submitButton = document.getElementById('enviarBtn');

  // Referencias de los campos input
  const nombreInput = document.getElementById('nombre');
  const telefonoInput = document.getElementById('telefono');
  const fechaInput = document.getElementById('fecha');
  const servicioInput = document.getElementById('servicio');
  const notasInput = document.getElementById('notas');

  // Funcion de configuracion inicial
  function configurarFechaMinima() {
    if (!fechaInput) return;

    const hoy = new Date();
    const manana = new Date(hoy);
    manana.setDate(hoy.getDate() + 1);

    // Establecer formato 'yyyy-mm-dd'
    const fechaMinima = manana.toISOString().split('T')[0];

    // Establecer la fecha minima
    fechaInput.min = fechaMinima;
  }

  configurarFechaMinima();

  // Funciones de Validacion

  function validarNombre(nombre) {
    // Expresión Regular (RegEx): Solo letras, acentos, ñ, y espacios.
    const regex = /^[A-Za-zñÑáéíóúÁÉÍÓÚ\s]+$/;
    const nombreLimpio = nombre.trim();

    // a. Verificar si el campo esta vacio o solo tiene espacios
    if (nombreLimpio === '') {
      return false;
    }

    // b. Verificar si el campo contiene letras y espacios validos
    return regex.test(nombreLimpio);
  }

  function validarTelefono(telefono) {

    // Quitar todos los espacios, guiones, parentesis para la verificacion
    const telefonoLimpio = telefono.replace(/[\s\-\(\)]/g, '').replace(/[^0-9+]/g, '');
    const soloDigitos = /^[0-9+]+$/;

    // Si el texto final contiene solo caracteres que no son digitos o '+'
    if (!soloDigitos.test(telefonoLimpio)) {
      return false;
    }

    // Verificar longitud minima (8 digitos)
    if (telefonoLimpio.length < 8) {
      return false;
    }
    return true;
  }

  // 2. Evento de envío
  form.addEventListener('submit', function (e) {
    e.preventDefault();

    // Validaciones visuales
    if (!validarNombre(nombreInput.value)) {
      messageDiv.innerHTML = '<span style="color: #dc3545; font-weight: bold;">⚠️ Error: Por favor, ingrese un nombre válido (solo letras).</span>';
      nombreInput.style.border = '2px solid #dc3545';
      telefonoInput.style.border = '1px solid #ddd';
      return;
    } else {
      // Limpiar borde si la validacion es exitosa
      nombreInput.style.border = '1px solid #ddd';
    }

    if (!validarTelefono(telefonoInput.value)) {
      messageDiv.innerHTML = '<span style="color: #dc3545; font-weight: bold;">⚠️ Error: Por favor, ingrese un número de teléfono válido (mínimo 8 dígitos y solo números).</span>';
      telefonoInput.style.border = '2px solid #dc3545';
      return;
    } else {
      telefonoInput.style.border = '1px solid #ddd';
    }

    messageDiv.innerHTML = '<span style="color: #007bff">Enviando reserva a Luna Salon...</span>';
    submitButton.disabled = true;

    // Preparar el objeto para la API
    const reservaPrivada = {
      nombre: nombreInput.value,
      telefono: telefonoInput.value,
      servicio: servicioInput.value,
      fecha: fechaInput.value,
      notas: notasInput.value
    };

    // Enviar el objeto a la API
    fetch('https://rubendario-dev.onrender.com/api/citas', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(reservaPrivada)
    })
      .then(response => {
        if (response.ok) {
          messageDiv.innerHTML = '<span style = "color: #28a745; font-weight: bold;">¡Reserva guardada en sistema! Nos vemos pronto.</span>';
          form.reset();
        }
      })
      .catch(error => {
        // Si algo sale mal (ej. problema de red)
        console.error('Error de envío:', error);
        messageDiv.innerHTML = '<span style="color: #dc3545;">Hubo un error al enviar la reserva. Por favor, inténtalo de nuevo.</span>';
      })
      .finally(() => {
        // Habilitar el botón nuevamente
        submitButton.disabled = false;
      });

  });

});