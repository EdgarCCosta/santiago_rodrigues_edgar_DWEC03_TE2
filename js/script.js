// Cargar datos de usuarios y guardarlos en localStorage
fetch('./assets/data/users.json')
    .then(response => {
        if (!response.ok) {
            throw new Error(`Error HTTP: ${response.status} - ${response.statusText}`);
        }
        return response.json();
    })
    .then(users => {
        localStorage.setItem('users', JSON.stringify(users));
        console.log('Datos de usuarios guardados en localStorage');
    });


// Manejo del envio del formulario de inicio de sesion
$('#loginForm').on('submit', function (event) {
    event.preventDefault();

    var username = $('#username').val();
    var password = $('#password').val();
    var usersGuardados = JSON.parse(localStorage.getItem('users'));

    // Verificacion de la contrasenia con el modelo regex para asegurar que no tiene caracteres especiales
    const patternPassword = /^[A-Za-z0-9]+$/;
    if (!patternPassword.test(password)) {
        alert('La contraseña solo debe contener caracteres alfanuméricos (letras y números).');
        return;
    }

    // Verificacion de contrasenia y usuario 
    const user = usersGuardados.find(u => u.usuario === username && u.contraseña === password);
    if (!user) {
        alert('Error: Usuario o contraseña incorrectos.');
        return;
    }

    window.location.href = './menu.html';
});


// Declarar elementos DOM
var butonEasy = document.querySelector("#butonEasy");
var butonMedium = document.querySelector("#butonMedium");
var butonHard = document.querySelector("#butonHard");
var butonStart = document.querySelector("#butonStart");
var butonReiniciar = document.querySelector("#butonReiniciar");
var butonLogOut = document.querySelector("#butonLogOut");

let dificultadSeleccionada = "";

// Funcion para seleccionar la dificultad y aplicar estilos
function selecionarDificultad(dificultad, buton) {

    // Resetear los colores de los botones
    butonEasy.style.backgroundColor = "rgba(74, 184, 112)";
    butonMedium.style.backgroundColor = "rgba(74, 142, 184)";
    butonHard.style.backgroundColor = "rgba(184, 74, 76)";

    // Aplicar color especifico al boton seleccionado
    if (buton === butonEasy) {
        buton.style.backgroundColor = "rgba(0, 255, 0)";
    } else if (buton === butonMedium) {
        buton.style.backgroundColor = "rgba(0, 190, 255)";
    } else if (buton === butonHard) {
        buton.style.backgroundColor = "rgba(255, 0, 0)";
    }

    // Guardar la dificultad seleccionada
    dificultadSeleccionada = dificultad;
    console.log(`Dificultad seleccionada: ${dificultadSeleccionada}`);
    localStorage.setItem('dificultad', dificultadSeleccionada);
}

// Asignar eventos a los botones de dificultad
if (butonEasy) {
    butonEasy.addEventListener("click", () => selecionarDificultad("facil", butonEasy));
}

if (butonMedium) {
    butonMedium.addEventListener("click", () => selecionarDificultad("medio", butonMedium));
}

if (butonHard) {
    butonHard.addEventListener("click", () => selecionarDificultad("dificil", butonHard));
}

// Asignar evento al boton de inicio
if (butonStart) {
    butonStart.addEventListener("click", () => {
        if (dificultadSeleccionada) {
            window.location.href = './juego.html';
        } else {
            alert("Por favor selecione un dificultad");
        }
    });
}

// Verificar si estamos en la pagina de resultados
if (window.location.pathname.includes('resultados.html')) {
    const estado = localStorage.getItem('estado');
    const puntosTotales = parseInt(localStorage.getItem('puntosTotales'), 10) || 0;

    const body = document.body;
    const mensaje = document.querySelector('.mensage');
    const puntosFinales = document.querySelector('.puntosFinales');

    if (puntosFinales) {
        puntosFinales.textContent = `FINAL SCORE: ${puntosTotales}`;
    }

 // Asignar mensaje y background dependiendo del resultado final del juego 
if (mensaje) {
        if (estado === 'ganaste') {
            mensaje.textContent = 'You Win!';
            body.classList.add('winBackground');
            body.classList.remove('lostBackground');
        } else if (estado === 'perdiste') {
            mensaje.textContent = 'Game Over!';
            body.classList.add('lostBackground');
            body.classList.remove('winBackground');
        }
    }
}

// Asignar eventos a los botone de reinicio
if (butonReiniciar) {
    butonReiniciar.addEventListener("click", () => {
        window.location.href = './menu.html';
    });
}

// Asignar eventos a los botone de cierre de sesion
if (butonLogOut) {
    butonLogOut.addEventListener("click", () => {
        window.location.href = './index.html';
    });
}
