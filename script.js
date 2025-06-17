let scene, camera, renderer, blob;
const canvas = document.getElementById("blobCanvas");

// Initialize scene
function init() {
  scene = new THREE.Scene();

  camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );
  camera.position.z = 5;

  renderer = new THREE.WebGLRenderer({ canvas });
  renderer.setSize(window.innerWidth, window.innerHeight);

  const geometry = new THREE.SphereGeometry(1, 64, 64);
  const material = new THREE.MeshBasicMaterial({
    color: 0x1DB954, // Spotify green
    wireframe: true,
  });

  blob = new THREE.Mesh(geometry, material);
  scene.add(blob);

  animate();
}

// Animation loop
function animate() {
  requestAnimationFrame(animate);
  blob.rotation.y += 0.01;
  const pulse = Math.sin(Date.now() * 0.002) * 0.3 + 1.5;
  blob.scale.set(pulse, pulse, pulse);
  renderer.render(scene, camera);
}

// Redirect to your Render backend Spotify login route
document.getElementById("login").addEventListener("click", () => {
  window.location.href = "https://audiovisualizer-62xe.onrender.com/login";
});

// OPTIONAL: Parse token from URL (if returning from /callback)
function getAccessTokenFromUrl() {
  const hash = window.location.hash;
  if (!hash) return null;
  const params = new URLSearchParams(hash.substring(1));
  return params.get("access_token");
}

// Store access token globally if present (you’ll use it later)
const accessToken = getAccessTokenFromUrl();
if (accessToken) {
  console.log("Access Token:", accessToken);
  // You could now fetch user's currently playing track, etc.
}

init();
