document.addEventListener('DOMContentLoaded', function() {
    const canvas = document.getElementById('matrix-bg');
    const ctx = canvas.getContext('2d');

    // Hacer el canvas del tamaño de la ventana
    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Caracteres para el efecto Matrix
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%^&*()';
    const fontSize = 14;
    const columns = canvas.width / fontSize;
    const drops = [];

    // Inicializar las posiciones de las gotas
    for(let i = 0; i < columns; i++) {
        drops[i] = 1;
    }

    function draw() {
        // Fondo semi-transparente para crear el efecto de desvanecimiento
        ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Color y estilo del texto
        ctx.fillStyle = '#ff0000';
        ctx.font = fontSize + 'px monospace';

        // Dibujar los caracteres
        for(let i = 0; i < drops.length; i++) {
            const text = chars[Math.floor(Math.random() * chars.length)];
            ctx.fillText(text, i * fontSize, drops[i] * fontSize);

            // Reiniciar la gota cuando llegue al final o aleatoriamente
            if(drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
                drops[i] = 0;
            }

            drops[i]++;
        }
    }

    // Ejecutar la animación
    setInterval(draw, 33);
});
