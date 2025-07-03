let isAnimating = true;

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 0, 50);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Background Stars
const starGeometry = new THREE.BufferGeometry();
const starVertices = [];
for (let i = 0; i < 10000; i++) {
  starVertices.push((Math.random() - 0.5) * 2000);
  starVertices.push((Math.random() - 0.5) * 2000);
  starVertices.push((Math.random() - 0.5) * 2000);
}
starGeometry.setAttribute('position', new THREE.Float32BufferAttribute(starVertices, 3));
const starMaterial = new THREE.PointsMaterial({ color: 0xffffff });
const stars = new THREE.Points(starGeometry, starMaterial);
scene.add(stars);

// Light and Sun
const light = new THREE.PointLight(0xffffff, 2, 1000);
light.position.set(0, 0, 0);
scene.add(light);

const sunGeometry = new THREE.SphereGeometry(4, 32, 32);
const sunMaterial = new THREE.MeshBasicMaterial({ color: 0xffff00 });
const sun = new THREE.Mesh(sunGeometry, sunMaterial);
scene.add(sun);

// Planets
const planetsData = [
  { name: "Mercury", color: 0xa9a9a9, size: 0.4, distance: 7, speed: 0.05 },
  { name: "Venus",   color: 0xffd700, size: 0.9, distance: 10, speed: 0.03 },
  { name: "Earth",   color: 0x0033ff, size: 1.0, distance: 13, speed: 0.02 },
  { name: "Mars",    color: 0xff4500, size: 0.6, distance: 16, speed: 0.015 },
  { name: "Jupiter", color: 0xd2b48c, size: 2.0, distance: 20, speed: 0.01 },
  { name: "Saturn",  color: 0xf5deb3, size: 1.8, distance: 24, speed: 0.008 },
  { name: "Uranus",  color: 0xadd8e6, size: 1.5, distance: 28, speed: 0.006 },
  { name: "Neptune", color: 0x0000ff, size: 1.4, distance: 32, speed: 0.005 }
];

const planetOrbits = [];
const planetSpeeds = {};
const controlsDiv = document.getElementById("controls");

planetsData.forEach((planetData) => {
  const orbit = new THREE.Object3D();
  scene.add(orbit);

  const geometry = new THREE.SphereGeometry(planetData.size, 32, 32);
  const material = new THREE.MeshStandardMaterial({ color: planetData.color });
  const planet = new THREE.Mesh(geometry, material);
  planet.position.x = planetData.distance;
  orbit.add(planet);

  orbit.userData = {
    name: planetData.name,
    planet: planet
  };

  planetOrbits.push(orbit);
  planetSpeeds[planetData.name] = planetData.speed;

  const label = document.createElement("label");
  label.style.display = "block";
  label.style.marginBottom = "8px";
  label.innerHTML = `${planetData.name} Speed:
    <input type="range" min="0.001" max="0.1" step="0.001"
           value="${planetData.speed}" data-planet="${planetData.name}" style="width:100%;" />`;
  controlsDiv.appendChild(label);
});

// Update Speed Control
controlsDiv.addEventListener("input", (e) => {
  const planetName = e.target.getAttribute("data-planet");
  if (planetName) {
    planetSpeeds[planetName] = parseFloat(e.target.value);
  }
});

// Toggle Animation
document.getElementById("toggleAnimation").addEventListener("click", () => {
  isAnimating = !isAnimating;
  document.getElementById("toggleAnimation").innerText = isAnimating ? "Pause" : "Resume";
});

// Change Camera Angle
document.getElementById("cameraAngle").addEventListener("change", (e) => {
  const angle = e.target.value;
  if (angle === "default") camera.position.set(0, 0, 50);
  else if (angle === "top") camera.position.set(0, 50, 0), camera.lookAt(0, 0, 0);
  else if (angle === "side") camera.position.set(50, 0, 0), camera.lookAt(0, 0, 0);
  else if (angle === "tilted") camera.position.set(30, 30, 30), camera.lookAt(0, 0, 0);
});

// Animation Loop
function animate() {
  requestAnimationFrame(animate);

  if (isAnimating) {
    planetOrbits.forEach((orbit) => {
      const name = orbit.userData.name;
      orbit.rotation.y += planetSpeeds[name];
      orbit.children[0].rotation.y += 0.01;
    });
  }

  renderer.render(scene, camera);
}
animate();
