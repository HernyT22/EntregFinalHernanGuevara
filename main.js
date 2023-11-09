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

window.addEventListener('DOMContentLoaded', async (event) => {
    const estaLogueado = localStorage.getItem('logueado');

    if (estaLogueado === 'true') {
        try {
            const nombreUsuario = localStorage.getItem('nombreUsuario');
            const correoElectronico = localStorage.getItem('correoElectronico');
            const edad = localStorage.getItem('edad');
            const domicilio = localStorage.getItem('domicilio');

            mostrarPerfil({
                nombre: nombreUsuario,
                gmail: correoElectronico,
                edad: edad,
                domicilio: domicilio
            });

            document.getElementById('calculator').style.display = 'block';
            document.getElementById('cerrarSesion').style.display = 'block';

        } catch (error) {
            console.error('Error al obtener datos del perfil desde el localStorage:', error);
        }
    }
});

const botonIniciarSesión = document.getElementById('iniciar');

botonIniciarSesión.addEventListener('click', async function () {
    try {
        const correoElectrónico = document.getElementById('gmail').value;
        const contraseña = document.getElementById('contraseña').value;

        const perfiles = await cargarPerfiles();

        const perfilEncontrado = perfiles.find(profile => profile.gmail === correoElectrónico && profile.contraseña === contraseña);

        if (perfilEncontrado) {
            mostrarPerfil(perfilEncontrado);
            Swal.fire({
                title: '¡Bien hecho!',
                text: 'Se ha Iniciado sesión correctamente',
                icon: 'success',
                confirmButtonText: 'continuar'
            });

            document.getElementById('loginForm').style.display = 'none';
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

const botonCerrarSesión = document.getElementById('cerrarSesion');

botonCerrarSesión.addEventListener('click', function () {
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
            localStorage.clear();
            location.reload();
        }
    });
});

function mostrarPerfil(perfil) {
    try {
        localStorage.setItem('logueado', 'true');
        localStorage.setItem('nombreUsuario', perfil.nombre);
        localStorage.setItem('correoElectronico', perfil.gmail);
        localStorage.setItem('edad', perfil.edad);
        localStorage.setItem('domicilio', perfil.domicilio);

        const contenedorPerfil = document.getElementById('perfilContainer');

        const perfilInfo = document.createElement('div');
        perfilInfo.innerHTML = `
            <h2>Bienvenido/a ${perfil.nombre}</h2>
            <p>Correo Electrónico: ${perfil.gmail}, Edad: ${perfil.edad}, Domicilio: ${perfil.domicilio}</p>
        `;

        contenedorPerfil.appendChild(perfilInfo);
    } catch (error) {
        console.error('Error al mostrar perfil:', error);
    }
}

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

updateDisplay();
