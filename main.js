// Definición de la clase Perfil
class Perfil {
    constructor(nombre, gmail, contraseña, edad, domicilio) {
        this.nombre = nombre;
        this.gmail = gmail;
        this.contraseña = contraseña;
        this.edad = edad;
        this.domicilio = domicilio;
    }

    obtenerInformacion() {
        return `Nombre: ${this.nombre}, Gmail: ${this.gmail}, Edad: ${this.edad}, Domicilio: ${this.domicilio}`;
    }
}

// Función para cargar perfiles desde un archivo JSON
function cargarPerfiles() {
    return new Promise(async (resolve, reject) => {
        try {
            const response = await fetch('perfiles.json');
            const perfiles = await response.json();
            resolve(perfiles);
        } catch (error) {
            reject(error);
        }
    });
}

// Comprobación de si el usuario está logueado al cargar la página
window.addEventListener('DOMContentLoaded', async (event) => {
    const estaLogueado = localStorage.getItem('logueado');

    if (estaLogueado === 'true') {
        try {
            // El usuario está logueado, obtener los datos del perfil desde el localStorage
            const nombreUsuario = localStorage.getItem('nombreUsuario');
            const correoElectronico = localStorage.getItem('correoElectronico');
            const edad = localStorage.getItem('edad');
            const domicilio = localStorage.getItem('domicilio');

            // Mostrar los datos del perfil
            mostrarPerfil({
                nombre: nombreUsuario,
                gmail: correoElectronico,
                edad: edad,
                domicilio: domicilio
            });

            // Mostrar la calculadora y el botón de cerrar sesión
            document.getElementById('calculator').style.display = 'block';
            document.getElementById('cerrarSesion').style.display = 'block';

        } catch (error) {
            console.error('Error al obtener datos del perfil desde el localStorage:', error);
        }
    }
});

// Agregar un controlador de eventos al botón de inicio de sesión
const botonIniciarSesión = document.getElementById('iniciar');

botonIniciarSesión.addEventListener('click', async function () {
    try {
        // Obtener los valores ingresados por el usuario
        const correoElectrónico = document.getElementById('gmail').value;
        const contraseña = document.getElementById('contraseña').value;

        // Cargar perfiles desde el archivo JSON
        const perfiles = await cargarPerfiles();

        // Utilizar find para buscar el perfil correspondiente
        const perfilEncontrado = perfiles.find(profile => profile.gmail === correoElectrónico && profile.contraseña === contraseña);

        if (perfilEncontrado) {
            // Mostrar los datos del perfil y almacenarlos en el localStorage
            mostrarPerfil(perfilEncontrado);
            Swal.fire({
                title: '¡Bien hecho!',
                text: 'Se ha Iniciado sesión correctamente',
                icon: 'success',
                confirmButtonText: 'continuar'
            });

            // Ocultar el formulario de inicio de sesión
            document.getElementById('loginForm').style.display = 'none';
            // Mostrar la calculadora y el botón de cerrar sesión
            document.getElementById('calculator').style.display = 'block';
            document.getElementById('cerrarSesion').style.display = 'block';
        } else {
            Swal.fire({
                title: '¡Lo siento!',
                text: 'Algunos datos son incorrectos',
                icon: 'error',
                confirmButtonText: 'Volver'
            });
        }
    } catch (error) {
        console.error('Error al iniciar sesión:', error);
    }
});

// Agregar un controlador de eventos al botón de cerrar sesión
const botonCerrarSesión = document.getElementById('cerrarSesion');

botonCerrarSesión.addEventListener('click', function () {
    // Utilizar SweetAlert para confirmar el cierre de sesión
    Swal.fire({
        title: '¿Estás seguro?',
        text: 'Estás a punto de cerrar sesión. ¿Quieres continuar?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Sí, cerrar sesión'
    }).then((result) => {
        if (result.isConfirmed) {
            // Eliminar los datos de sesión del localStorage
            localStorage.clear();

            // Recargar la página actual para simular el cierre de sesión
            location.reload();
        }
    });
});

// Función para mostrar el perfil en la página y almacenar datos en el localStorage
function mostrarPerfil(perfil) {
    try {
        // Almacenar los datos de perfil en el localStorage
        localStorage.setItem('logueado', 'true');
        localStorage.setItem('nombreUsuario', perfil.nombre);
        localStorage.setItem('correoElectronico', perfil.gmail);
        localStorage.setItem('edad', perfil.edad);
        localStorage.setItem('domicilio', perfil.domicilio);

        // Mostrar los datos del perfil en la página
        const contenedorPerfil = document.getElementById('perfilContainer');

        const perfilInfo = document.createElement('div');
        perfilInfo.innerHTML = `
            <h2>Bienvenido ${perfil.nombre}</h2>
            <p>Correo Electrónico: ${perfil.gmail}, Edad: ${perfil.edad}, Domicilio: ${perfil.domicilio}</p>
        `;

        contenedorPerfil.appendChild(perfilInfo);
    } catch (error) {
        console.error('Error al mostrar perfil:', error);
    }
}

//calculadora
let currentInput = '0';
let operator = '';
let previousInput = '0';

function updateDisplay() {
    document.getElementById('display').value = currentInput;
}

function appendNumber(number) {
    if (currentInput === '0') {
        currentInput = number;
    } else {
        currentInput += number;
    }
    updateDisplay();
}

function appendDecimal() {
    if (!currentInput.includes('.')) {
        currentInput += '.';
        updateDisplay();
    }
}

function clearDisplay() {
    currentInput = '0';
    operator = '';
    previousInput = '0';
    updateDisplay();
}

function setOperator(op) {
    if (operator !== '') {
        calculate();
    }
    operator = op;
    previousInput = currentInput;
    currentInput = '0';
}

function calculate() {
    let result;
    const prev = parseFloat(previousInput);
    const current = parseFloat(currentInput);

    if (isNaN(prev) || isNaN(current)) return;

    switch (operator) {
        case '+':
            result = prev + current;
            break;
        case '-':
            result = prev - current;
            break;
        case '*':
            result = prev * current;
            break;
        case '/':
            if (current !== 0) {
                result = prev / current;
            } else {
                result = 'Error';
            }
            break;
        default:
            return;
    }

    currentInput = result.toString();
    operator = '';
    previousInput = '0';
    updateDisplay();
}

// Initial display update
updateDisplay();
