// Configuracion de elementos globales y variables
const character = document.querySelector('#character');
const puntos = document.querySelector('#puntos');
const temporizador = document.querySelector('#timerSesion');
const header = document.querySelector('header');
let estaSaltando = false;
let puntosTotales = 0;
let tiempoRestante = 100; 



// Temporizador de sesion
function updateTemporizador() {
    if (tiempoRestante <= 0) {
        window.location.href = './index.html'; // Redirigir al login
    } else {
        temporizador.textContent = `Tiempo restante de Sesión: ${tiempoRestante}s`;
        tiempoRestante--;
    }
}
setInterval(updateTemporizador, 1000);


const areaJuego = document.querySelector('.backgroundScreenJuego');
let backgroundPositionX = 0; 

// Funcion para mover el fondo
function moverFondo() {
    backgroundPositionX -= 2;
    areaJuego.style.backgroundPosition = `${backgroundPositionX}px 0`; 
    requestAnimationFrame(moverFondo);
}

moverFondo();

// Configuracion de la dificultad y puntos
const dificultadSeleccionada = localStorage.getItem('dificultad');
const dificultadElegida = document.createElement('p');
header.appendChild(dificultadElegida);
dificultadElegida.textContent = `Modo: ${dificultadSeleccionada}`;

let incrementoPuntos;
let limitePuntos = 0;
let intervaloCreacion = 0; 

if (dificultadSeleccionada === 'facil') {
    incrementoPuntos = 5;
    limitePuntos = 500;
    intervaloCreacion = 1000;
} else if (dificultadSeleccionada === 'medio') {
    incrementoPuntos = 10;
    limitePuntos = 1000;
    intervaloCreacion = 750;
} else if (dificultadSeleccionada === 'dificil') {
    incrementoPuntos = 50;
    limitePuntos = 5000;
    intervaloCreacion = 500;
}

puntos.textContent = `Puntos: ${puntosTotales}`;

// Funcion para actualizar los puntos
function actualizarPuntos() {
    puntosTotales += incrementoPuntos;
    puntos.textContent = `Puntos: ${puntosTotales}`;

    if (puntosTotales >= limitePuntos) {
        finalizarJuego('ganaste'); 
    }
}
setInterval(actualizarPuntos, 500);

// Funcion para guardar los valores del juego y redirigir a la pagina de resultados
function finalizarJuego(resultado) {
    if (resultado === 'ganaste') {
        localStorage.setItem('estado', 'ganaste');
    } else if (resultado === 'perdiste') {
        localStorage.setItem('estado', 'perdiste');
    }
    localStorage.setItem('puntosTotales', puntosTotales);
    window.location.href = './resultados.html';
}

// Funcion para crear obstaculos
function crearObstaculo() {
    const obstaculo = document.createElement('div');
    obstaculo.classList.add('obstaculo');

    // Definicion de dos valores para que el programa elija por random uno de ellos
    const valor1 = 430;
    const valor2 = 520;
    const posicionVertical = Math.random() > 0.5 ? valor1 : valor2;

    obstaculo.style.top = `${posicionVertical}px`;
    obstaculo.style.left = '100%';

    document.getElementById('areaJuego').appendChild(obstaculo);

    // Movimento del obstaculo de derecha a izquierda
    let position = 1000;
    setInterval(() => {
        if (position > 0) {
            position -= 10;
            obstaculo.style.left = position + 'px';
        } else {
            obstaculo.remove();
        }
    }, 15);
}
setInterval(crearObstaculo, intervaloCreacion);

// Evento para manejar el salto del personaje
// Define la altura del salto, su duracion y los pasos en los que dividira el salto para animarlo
document.addEventListener('keydown', function(event) {
    const alturaSalto = 125;
    const duracionSalto = 100;
    const pasos = 50;
    const alturaPaso = alturaSalto / pasos;

    // Define SPACEBAR como tecla de salto y verifica si el personaje esta saltando
    if (event.key === ' ' && !estaSaltando ) {
        estaSaltando = true;
        let topo = 505;
        let movArriba  = 0;

        // Inicia el movimiento hasta que complete el numero de pasos  
        let intervalUp = setInterval(() => {
            movArriba++;
            topo -= alturaPaso;
            character.style.top = `${topo}px`;

            if (movArriba >= pasos) {
                clearInterval(intervalUp);
                let movAbajo = 0;

                // Inicia el movimiento hasta llegar a la posicion inicial
                let  intervaloAbajo = setInterval(() => {
                    movAbajo++;
                    topo += alturaPaso;
                    character.style.top = `${topo}px`;

                    if (movAbajo >= pasos) {
                        clearInterval(intervaloAbajo);
                        estaSaltando = false;
                    }
                }, duracionSalto / pasos);
            }
        }, duracionSalto / pasos);
    }
});

// Funcion para detectar colision entre los elementos character y obstaculo
// verificando si la persenaje no esta completamente a la derecha, izquierda, 
// por debajo o por encima del obstaculo
function detectarColision(character, obstaculo) {
    const rect1 = character.getBoundingClientRect(); 
    const rect2 = obstaculo.getBoundingClientRect(); 

    return (
        rect1.left < rect2.right && 
        rect1.right > rect2.left && 
        rect1.top < rect2.bottom && 
        rect1.bottom > rect2.top 
    );
}

// Verificar colisiones en intervalos regulares y guardar los datos en caso de colision
function verificarColisiones() {
    const obstaculos = document.querySelectorAll('.obstaculo');

    obstaculos.forEach((obstaculo) => {
        if (detectarColision(character, obstaculo)) {
            localStorage.setItem('estado', 'perdiste');
            localStorage.setItem('puntosTotales', puntosTotales);
            finalizarJuego('perdiste');
        }
    });
}

setInterval(verificarColisiones, 15);

