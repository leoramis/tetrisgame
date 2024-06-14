window.addEventListener('load', () => {
    const tetrisContainer = document.getElementById('tetris-container');

    // Crear escena Three.js
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });

    renderer.setSize(window.innerWidth, window.innerHeight);
    tetrisContainer.appendChild(renderer.domElement);

    // Configurar iluminación
    const light = new THREE.AmbientLight(0x404040); // luz ambiental
    scene.add(light);
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
    scene.add(directionalLight);

    // Variables del juego
    const blockSize = 1;
    let currentBlock = null;
    let isDragging = false;
    let lastTouchX = 0;
    let lastTouchY = 0;

    // Función para crear bloques de Tetris
    function createTetrisBlock() {
        const shapes = [
            [[1, 1, 1, 1]], // I
            [[1, 1], [1, 1]], // O
            [[0, 1, 0], [1, 1, 1]], // T
            [[0, 1, 1], [1, 1, 0]], // S
            [[1, 1, 0], [0, 1, 1]], // Z
            [[1, 1, 1], [1, 0, 0]], // L
            [[1, 1, 1], [0, 0, 1]]  // J
        ];
        const shape = shapes[Math.floor(Math.random() * shapes.length)];
        const geometry = new THREE.BoxGeometry(blockSize, blockSize, blockSize);
        const material = new THREE.MeshBasicMaterial({ color: Math.random() * 0xffffff });
        const group = new THREE.Group();
        shape.forEach((row, y) => {
            row.forEach((cell, x) => {
                if (cell) {
                    const cube = new THREE.Mesh(geometry, material);
                    cube.position.set(x, -y, 0);
                    group.add(cube);
                }
            });
        });
        group.position.set(5, 10, 0);
        return group;
    }

    // Crear un bloque inicial
    function spawnBlock() {
        currentBlock = createTetrisBlock();
        scene.add(currentBlock);
    }

    spawnBlock();

    // Funciones de control
    function moveBlock(dx, dy) {
        currentBlock.position.x += dx * blockSize;
        currentBlock.position.y += dy * blockSize;
    }

    function rotateBlock() {
        currentBlock.rotation.z += Math.PI / 2;
    }

    // Manejo de eventos táctiles
    function onTouchStart(event) {
        if (event.touches.length === 1) {
            isDragging = true;
            lastTouchX = event.touches[0].clientX;
            lastTouchY = event.touches[0].clientY;
        } else if (event.touches.length === 2) {
            rotateBlock();
        }
    }

    function onTouchMove(event) {
        if (isDragging && event.touches.length === 1) {
            const touchX = event.touches[0].clientX;
            const touchY = event.touches[0].clientY;
            const dx = (touchX - lastTouchX) / window.innerWidth * 10;
            const dy = (touchY - lastTouchY) / window.innerHeight * 10;
            moveBlock(dx, -dy);
            lastTouchX = touchX;
            lastTouchY = touchY;
        }
    }

    function onTouchEnd(event) {
        if (event.touches.length === 0) {
            isDragging = false;
        }
    }

    window.addEventListener('touchstart', onTouchStart);
    window.addEventListener('touchmove', onTouchMove);
    window.addEventListener('touchend', onTouchEnd);

    // Ajustar la cámara para dispositivos móviles
    camera.position.z = 20;
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    // Manejar el cambio de tamaño de la ventana
    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });

    // Animación del renderizado
    function animate() {
        requestAnimationFrame(animate);
        renderer.render(scene, camera);
    }

    animate();
});
