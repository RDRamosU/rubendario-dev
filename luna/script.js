
// 1. Obtener referencias de los elementos del DOM
const form = document.getElementById('reservaForm');
const messageDiv = document.getElementById('formMessage');
const submitButton = document.getElementById('enviarBtn');

// Referencias de los campos input
const nombreInput = document.querySelector('input[name="entry.1457553108"]');
const telefonoInput = document.querySelector('input[name="entry.66915142"]');
const fechaInput = document.querySelector('input[name="entry.535377173"]');

// Funcion de configuracion inicial
function configurarFechaMinimia() {
  if (!fechaInput) return;

  const hoy = new Date();
  // Calcular la fecha de manana (se anade +1)
  const manana = new Date(hoy);
  manana.setDate(hoy.getDate() + 1);

  // Establecer formato 'yyyy-mm-dd'
  const fechaMinima = manana.toISOString().split('T')[0];

  // Establecer la fecha minima
  fechaInput.min =fechaMinima;
}

// Llamar la funcion al cargar la pagina
configurarFechaMinimia();

// Funciones de Validacion

// Validacion del nombre
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

//Validacion del telefono
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

// 2. Escuchar el evento de envío del formulario
form.addEventListener('submit', function (e) {
  e.preventDefault();

  // Validacion de nombre
  if (!validarNombre(nombreInput.value)) {
    messageDiv.innerHTML = '<span style="color: #dc3545; font-weight: bold;">⚠️ Error: Por favor, ingrese un nombre válido (solo letras).</span>';
    nombreInput.style.border = '2px solid #dc3545';
    telefonoInput.style.border = '1px solid #ddd';
    return;
  } else {
    // Limpiar borde si la validacion es exitosa
    nombreInput.style.border = '1px solid #ddd';
  }

  // Validacion de telefono
  if (!validarTelefono(telefonoInput.value)) {
    messageDiv.innerHTML = '<span style="color: #dc3545; font-weight: bold;">⚠️ Error: Por favor, ingrese un número de teléfono válido (mínimo 8 dígitos y solo números).</span>';
    telefonoInput.style.border = '2px solid #dc3545';
    return;
  } else {
    telefonoInput.style.border = '1px solid #ddd';
  }

  // Si TODAS las validaciones son exitosas, se procede con el envio (AJAX)
  messageDiv.innerHTML = '<span style="color: #007bff;">Enviando reserva...</span>';
  submitButton.disabled = true;

  // 3. Obtener la URL de Google Forms y los datos del formulario
  const formUrl = form.action;
  const formData = new FormData(form);

  // 4. Construir la cadena de consulta (query string) con los datos
  const queryString = new URLSearchParams(formData).toString();

  // 5. Usar Fetch (AJAX) para enviar los datos de forma asíncrona
  fetch(formUrl, {
    method: 'POST',
    mode: 'no-cors', // Importante para enviar a Google Forms sin errores CORS
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: queryString // Envía los datos como una cadena de consulta
  })
    .then(() => {
      // El envío fue exitoso (aunque no podamos leer la respuesta de Google Forms)
      messageDiv.innerHTML = '<span style="color: #28a745; font-weight: bold;">¡Reserva enviada con éxito! Nos pondremos en contacto pronto.</span>';
      form.reset(); // Limpia los campos del formulario
    })
    .catch(error => {
      // Algo salió mal (ej. problema de red)
      console.error('Error de envío:', error);
      messageDiv.innerHTML = '<span style="color: #dc3545;">Hubo un error al enviar la reserva. Por favor, inténtalo de nuevo o usa WhatsApp.</span>';
    })
    .finally(() => {
      // Habilita el botón nuevamente
      submitButton.disabled = false;
    });
});