// Variables para controlar el estado del video
let soundEnabled = false; // Inicialmente silenciado
let isPlaying = true; // El video comienza reproduciéndose

// Función para alternar entre reproducir y pausar
function togglePlayPause() {
    const video = document.getElementById('main-video');
    const playPauseIcon = document.getElementById('play-pause-icon');
    
    if (isPlaying) {
        video.pause();
        isPlaying = false;
        playPauseIcon.className = 'fas fa-play';
    } else {
        video.play();
        isPlaying = true;
        playPauseIcon.className = 'fas fa-pause';
    }
}

// Función para alternar el sonido
function toggleSound() {
    const video = document.getElementById('main-video');
    const soundIcon = document.getElementById('sound-icon');
    
    if (video) {
        if (soundEnabled) {
            video.muted = true;
            soundEnabled = false;
            soundIcon.className = 'fas fa-volume-mute';
        } else {
            video.muted = false;
            soundEnabled = true;
            soundIcon.className = 'fas fa-volume-up';
        }
    }
}

// Función para formatear el tiempo en formato mm:ss
function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    seconds = Math.floor(seconds % 60);
    return `${minutes}:${seconds < 10 ? '0' + seconds : seconds}`;
}

// Función para actualizar la barra de progreso
function updateProgressBar() {
    const video = document.getElementById('main-video');
    const progressBar = document.getElementById('progress-bar');
    const timeDisplay = document.getElementById('time-display');
    
    if (video && progressBar && timeDisplay) {
        // Actualizar la barra de progreso
        const progress = (video.currentTime / video.duration) * 100;
        progressBar.style.width = `${progress}%`;
        
        // Actualizar el tiempo mostrado
        timeDisplay.textContent = `${formatTime(video.currentTime)} / ${formatTime(video.duration)}`;
    }
    
    // Actualizar cada 100ms
    setTimeout(updateProgressBar, 100);
}

// Función para saltar a un punto específico del video
function skipToPosition(event) {
    const video = document.getElementById('main-video');
    const progressContainer = document.getElementById('progress-container');
    const rect = progressContainer.getBoundingClientRect();
    const pos = (event.clientX - rect.left) / rect.width;
    
    if (video) {
        video.currentTime = pos * video.duration;
    }
}

// Función para mostrar la posición del hover en la barra de progreso
function showHoverPosition(event) {
    const progressContainer = document.getElementById('progress-container');
    const progressBarHover = document.getElementById('progress-bar-hover');
    const rect = progressContainer.getBoundingClientRect();
    const pos = (event.clientX - rect.left) / rect.width;
    
    if (progressBarHover) {
        progressBarHover.style.width = `${pos * 100}%`;
    }
}

function addRippleEffect(event) {
    const button = event.currentTarget;
    
    const ripple = document.createElement("span");
    ripple.classList.add("ripple");
    
    const rect = button.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    
    const posX = event.clientX - rect.left - size / 2;
    const posY = event.clientY - rect.top - size / 2;
    
    ripple.style.width = ripple.style.height = `${size}px`;
    ripple.style.left = `${posX}px`;
    ripple.style.top = `${posY}px`;
    
    button.appendChild(ripple);
    
    setTimeout(() => {
        ripple.remove();
    }, 800);
}

// Función para cargar el logo en modo seguro
function loadLogoVideo() {
    const container = document.getElementById('logo-video-container');
    
    // Crear el elemento de video para el logo
    const video = document.createElement('video');
    video.className = 'logo-video';
    video.autoplay = true;
    video.muted = true;
    video.loop = true;
    video.playsinline = true;
    
    // Intentar cargar el video desde diferentes fuentes
    const sources = ['logo-animado.mp4', 'logo.mp4', 'logo-video.mp4'];
    
    let sourceLoaded = false;
    
    // Probar cada fuente
    for (let i = 0; i < sources.length; i++) {
        const testVideo = document.createElement('video');
        testVideo.src = sources[i];
        
        testVideo.addEventListener('canplay', function() {
            if (!sourceLoaded) {
                sourceLoaded = true;
                video.src = sources[i];
                
                // Remover el fallback y añadir el video
                const fallback = container.querySelector('.logo-fallback');
                if (fallback) {
                    container.removeChild(fallback);
                }
                
                container.insertBefore(video, container.firstChild);
            }
        });
        
        testVideo.addEventListener('error', function() {
            // Si es la última fuente y ninguna ha funcionado, usar fallback
            if (i === sources.length - 1 && !sourceLoaded) {
                console.log("No se pudo cargar ningún video para el logo");
            }
        });
        
        // Intentar cargar
        testVideo.load();
    }
    
    // Si después de 3 segundos no se ha cargado ninguna fuente, usar un logo estático
    setTimeout(function() {
        if (!sourceLoaded) {
            // Ya tenemos el fallback en HTML, no necesitamos hacer nada más
        }
    }, 3000);
}

// Función para verificar el video principal
function checkMainVideo() {
    const video = document.getElementById('main-video');
    const videoMessage = document.getElementById('video-message');
    
    // Verificar si el video está cargando correctamente
    video.addEventListener('loadeddata', function() {
        videoMessage.style.display = 'none';
        // Iniciar la actualización de la barra de progreso una vez que el video esté cargado
        updateProgressBar();
    });
    
    video.addEventListener('error', function() {
        videoMessage.style.display = 'block';
        console.log("Error al cargar el video principal");
    });
    
    // Si después de 5 segundos el video no está reproduciendo, mostrar mensaje
    setTimeout(function() {
        if (video.readyState < 3) {
            videoMessage.style.display = 'block';
        }
    }, 5000);
}

// Configurar eventos para la barra de progreso
function setupProgressEvents() {
    const progressContainer = document.getElementById('progress-container');
    
    if (progressContainer) {
        // Evento para saltar a una posición al hacer clic
        progressContainer.addEventListener('click', function(event) {
            skipToPosition(event);
        });
        
        // Eventos para mostrar la posición del hover
        progressContainer.addEventListener('mousemove', function(event) {
            showHoverPosition(event);
        });
        
        progressContainer.addEventListener('mouseleave', function() {
            const progressBarHover = document.getElementById('progress-bar-hover');
            if (progressBarHover) {
                progressBarHover.style.width = '0%';
            }
        });
    }
}

// Función para manejar el dropdown de servicios
function toggleServiciosDropdown(event) {
    event.preventDefault();
    const menu = document.getElementById('servicios-menu');
    const arrow = document.getElementById('dropdown-arrow');
    
    menu.classList.toggle('active');
    
    if (menu.classList.contains('active')) {
        arrow.textContent = '▲';
    } else {
        arrow.textContent = '▼';
    }
    
    addRippleEffect(event);
    
    // Cerrar el dropdown cuando se hace clic fuera de él
    document.addEventListener('click', function closeDropdown(e) {
        const dropdownContainer = document.getElementById('servicios-dropdown');
        if (!dropdownContainer.contains(e.target)) {
            menu.classList.remove('active');
            arrow.textContent = '▼';
            
            // Cerrar todos los submenús
            const allSubmenus = document.querySelectorAll('.submenu');
            allSubmenus.forEach(submenu => {
                submenu.classList.remove('active');
                const menuArrow = submenu.previousElementSibling.querySelector('.submenu-arrow');
                if (menuArrow) menuArrow.textContent = '▼';
            });
            
            document.removeEventListener('click', closeDropdown);
        }
    });
}

// Función para manejar los submenús
function toggleSubmenu(event, submenuId) {
    event.preventDefault();
    const submenu = document.getElementById(submenuId);
    const arrow = event.currentTarget.querySelector('.submenu-arrow');
    
    // Cerrar todos los otros submenús primero
    const allSubmenus = document.querySelectorAll('.submenu');
    allSubmenus.forEach(menu => {
        if (menu.id !== submenuId) {
            menu.classList.remove('active');
            const menuArrow = menu.previousElementSibling.querySelector('.submenu-arrow');
            if (menuArrow) menuArrow.textContent = '▼';
        }
    });
    
    // Alternar el submenú actual
    submenu.classList.toggle('active');
    
    if (submenu.classList.contains('active')) {
        if (arrow) arrow.textContent = '▲';
    } else {
        if (arrow) arrow.textContent = '▼';
    }
    
    // Evitar que el clic se propague al documento
    event.stopPropagation();
}

// Información de los servicios para los tooltips
const serviciosInfo = {
    escoltas: {
        title: "CURSO DE ESCOLTAS",
        items: [
            "Curso internacional con especialización en conducción de manejo defensivo y evasivo de vehículos",
            "Curso avanzado con especialización en protección a dignatarios y jefes de seguridad",
            "Curso internacional de instructores en esquemas de protección"
        ]
    },
    vigilancia: {
        title: "CURSO DE VIGILANCIA",
        items: [
            "Curso de fundamentacion en vigilancia",
            "Cursos para quienes son vigilantes",
            "Re entrenamientos"
        ]
    },
    conduccion: {
        title: "CURSO DE CONDUCCION",
        items: [
            "Precios y categorías"
        ]
    }
};

// Configuración del número de WhatsApp
const WHATSAPP_NUMBER = '573223347805'; // Formato internacional sin '+'
const INITIAL_MESSAGE = encodeURIComponent('Hola, estoy interesado en los servicios de S.W.A.T BODYGUARDS. ¿Podrían proporcionarme más información?');

// Función para abrir WhatsApp directamente
function openWhatsApp() {
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${INITIAL_MESSAGE}`, '_blank');
}

// Cargar todo cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', function() {
    // Cargar el logo
    loadLogoVideo();
    
    // Verificar el video principal
    checkMainVideo();
    
    // Configurar eventos para la barra de progreso
    setupProgressEvents();
    
    // Agregar evento al botón de WhatsApp
    document.getElementById('whatsapp-button').addEventListener('click', openWhatsApp);
});