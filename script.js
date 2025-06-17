let scene, camera, renderer, blob;

// Step 1: Grab token from URL hash
function getAccessTokenFromUrl() {
  const hash = window.location.hash;
  if (!hash) return null;

  const params = new URLSearchParams(hash.substring(1));
  return params.get("access_token");
}

const accessToken = getAccessTokenFromUrl();
console.log("Access Token:", accessToken);

// Step 2: Set up Three.js blob scene
function init() {
  const canvas = document.getElementById("blobCanvas");

  scene = new THREE.Scene();

  camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );
  camera.position.z = 3;

  renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setClearColor(0x000000);

  const geometry = new THREE.SphereGeometry(1, 64, 64);
  const material = new THREE.MeshBasicMaterial({
    color: 0x1DB954,
    wireframe: true
  });

  blob = new THREE.Mesh(geometry, material);
  scene.add(blob);

  window.addEventListener("resize", () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });

  animate();
}

// Step 3: Animate the blob
function animate() {
  requestAnimationFrame(animate);

  const t = Date.now() * 0.001;
  const scale = Math.sin(t * 2) * 0.2 + 1.2;
  blob.rotation.y += 0.01;
  blob.rotation.x += 0.005;
  blob.scale.set(scale, scale, scale);

  renderer.render(scene, camera);
}

// Step 4: Login button click
document.getElementById("login").addEventListener("click", () => {
  window.location.href = "https://audiovisualizer-62xe.onrender.com/login";
});

init();
