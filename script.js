let scene, camera, renderer, blob;
const canvas = document.getElementById("blobCanvas");

function init() {
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 5;

    renderer = new THREE.WebGLRenderer({ canvas });
    renderer.setSize(window.innerWidth, window.innerHeight);

    const geometry = new THREE.SphereGeometry(1, 32, 32);
    const material = new THREE.MeshBasicMaterial({ color: 0x00ff00, wireframe: true });
    blob = new THREE.Mesh(geometry, material);
    scene.add(blob);

    animate();
}

function animate() {
    requestAnimationFrame(animate);
    blob.rotation.y += 0.01;
    blob.scale.x = Math.sin(Date.now() * 0.001) + 1.5;
    blob.scale.y = Math.sin(Date.now() * 0.001) + 1.5;
    blob.scale.z = Math.sin(Date.now() * 0.001) + 1.5;
    renderer.render(scene, camera);
}

document.getElementById("login").addEventListener("click", () => {
    window.location.href = "http://localhost:3000/login";
});

init();
