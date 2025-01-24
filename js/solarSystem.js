//Import
import * as THREE from "https://unpkg.com/three@0.127.0/build/three.module.js";
import { OrbitControls } from "https://unpkg.com/three@0.127.0/examples/jsm/controls/OrbitControls.js";
//////////////////////////////////////
//NOTE Creating renderer
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);
//////////////////////////////////////

//////////////////////////////////////
//NOTE texture loader
const textureLoader = new THREE.TextureLoader();
//////////////////////////////////////

//////////////////////////////////////
//NOTE import all texture
const starTexture = textureLoader.load("./image/stars.jpg");
const sunTexture = textureLoader.load("./image/sun.jpg");
const mercuryTexture = textureLoader.load("./image/mercury.jpg");
const venusTexture = textureLoader.load("./image/venus.jpg");
const earthTexture = textureLoader.load("./image/earth.jpg");
const marsTexture = textureLoader.load("./image/mars.jpg");
const jupiterTexture = textureLoader.load("./image/jupiter.jpg");
const saturnTexture = textureLoader.load("./image/saturn.jpg");
const uranusTexture = textureLoader.load("./image/uranus.jpg");
const neptuneTexture = textureLoader.load("./image/neptune.jpg");
const plutoTexture = textureLoader.load("./image/pluto.jpg");
const saturnRingTexture = textureLoader.load("./image/saturn_ring.png");
const uranusRingTexture = textureLoader.load("./image/uranus_ring.png");
//////////////////////////////////////

const planetInfo = {
  Mercury: { name: "Mercur", description: "Mercur a fost cunoscut încă din antichitate datorită faptului că este vizibil cu ochiul liber. Romanii i-au dat numele zeului lor mesager datorită mișcării sale rapide pe cer.  Primele observații detaliate ale suprafeței lui Mercur au fost făcute de sonda spațială Mariner 10 în anii 1970, care a cartografiat aproximativ 45% din planetă." },
  Venus: { name: "Venus", description: "Venus, numită după zeița romană a iubirii și frumuseții, era venerată de multe civilizații antice, inclusiv de babilonieni, care o numeau Ishtar.În anii 1960, misiunea sovietică Venera 7 a devenit prima sondă care a transmis date de pe suprafața altei planete, deși a rezistat doar 23 de minute în condițiile extreme de pe Venus." },
  Earth: { name: "Pamant", description: "Pământul a fost văzut inițial ca centrul universului în modelul geocentric al lui Ptolemeu din antichitate.În 1543, Nicolaus Copernic a revoluționat astronomia propunând modelul heliocentric, care plasează Pământul ca una dintre planetele care orbitează în jurul Soarelui." },
  Mars: { name: "Marte", description: "Marte, zeul roman al războiului, a fost asociat cu culoarea sa roșiatică. Babilonienii o numeau Nergal, simbolizând moartea și distrugerea.În 1976, Viking 1 a fost prima misiune care a aterizat cu succes pe Marte și a transmis imagini de pe suprafață." },
  Jupiter: { name: "Jupiter", description: "Jupiter a fost numit după regele zeilor romani datorită dimensiunii sale imense.Galileo Galilei a descoperit în 1610 cele patru mari luni ale lui Jupiter (Io, Europa, Ganymede și Callisto), numite astăzi sateliți galileeni." },
  Saturn: { name: "Saturn", description: "Romanii au numit Saturn după zeul agriculturii și al recoltelor. Inelele sale au fost descoperite de Galileo în 1610, deși le-a descris inițial ca urechi ale planetei.Sonda Cassini (2004-2017) a oferit cele mai detaliate imagini și informații despre Saturn și inelele sale." },
  Uranus: { name: "Uranus", description: "Uranus este singura planetă numită după o zeitate greacă, zeul cerului, în loc de una romană. A fost descoperită de William Herschel în 1781, fiind prima planetă descoperită cu ajutorul unui telescop.Planeta a fost inițial denumită Georgium Sidus (Steaua lui George) în onoarea regelui George al III-lea al Angliei." },
  Neptune: { name: "Neptun", description: "Neptun, zeul roman al mărilor, a fost descoperit în 1846 pe baza calculelor matematice care au prezis existența sa înainte de a fi observat.Este prima planetă descoperită prin predicții teoretice, iar descoperirea sa a fost un triumf pentru mecanica cerească." },
  Pluto: { name: "Pluto", description: "Descoperire și statut: Pluto, descoperit în 1930, a fost considerat a noua planetă până în 2006, când a fost reclasificat ca planetă pitică. Caracteristici: Are o suprafață înghețată, 5 luni (cea mai mare fiind Charon) și a fost explorat de sonda New Horizons în 2015." },
};


//////////////////////////////////////
//NOTE Creating scene
const scene = new THREE.Scene();
//////////////////////////////////////

const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

window.addEventListener("click", (event) => {
  // Convert mouse position to normalized device coordinates
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

  // Update raycaster with camera and mouse position
  raycaster.setFromCamera(mouse, camera);

  // Check intersections with planets
  const intersects = raycaster.intersectObjects(
    planets.map((p) => p.planet),
    true
  );

  if (intersects.length > 0) {
    const selectedPlanet = intersects[0].object;

    // Get planet name from its texture (or another identifier)
    const planetName = Object.keys(planetInfo).find((name) =>
      selectedPlanet.material.map.image.src.includes(name.toLowerCase())
    );

    if (planetName) {
      focusOnPlanet(selectedPlanet, planetInfo[planetName]);
    }
  }
});

function focusOnPlanet(planet, info) {
  // Smoothly move the camera to the planet's position
  const targetPosition = new THREE.Vector3();
  planet.getWorldPosition(targetPosition);

  const duration = 1000; // 1 second
  const startTime = performance.now();
  const initialPosition = camera.position.clone();

  function animateFocus() {
    const elapsed = performance.now() - startTime;
    const progress = Math.min(elapsed / duration, 1);

    // Interpolate camera position
    camera.position.lerpVectors(
      initialPosition,
      targetPosition.clone().add(new THREE.Vector3(0, 20, 50)),
      progress
    );

    // Make the camera look at the planet
    camera.lookAt(targetPosition);

    if (progress < 1) {
      requestAnimationFrame(animateFocus);
    }
  }


  animateFocus();

  // Delay showing the text box slightly to avoid conflicts
  setTimeout(() => {
    const infoDiv = document.getElementById("planet-info");
    document.getElementById("planet-name").innerText = info.name;
    document.getElementById("planet-description").innerText =
      info.description;
    infoDiv.style.display = "block";
  }, 500); // Delay to ensure smoothness



  animateFocus();

  // Update HTML with planet info
  const infoDiv = document.getElementById("planet-info");
  document.getElementById("planet-name").innerText = info.name;
  document.getElementById("planet-description").innerText = info.description;
  infoDiv.style.display = "block";
}

window.addEventListener("click", (event) => {
  const infoDiv = document.getElementById("planet-info");
  if (!event.target.closest("#planet-info") && !event.target.closest("canvas")) {
    infoDiv.style.display = "none";
  }
});



//////////////////////////////////////
//NOTE screen bg
const cubeTextureLoader = new THREE.CubeTextureLoader();
const cubeTexture = cubeTextureLoader.load([
  starTexture,
  starTexture,
  starTexture,
  starTexture,
  starTexture,
  starTexture,
]);
scene.background = cubeTexture;
//////////////////////////////////////

//////////////////////////////////////
//NOTE Perspective Camera
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.set(-50, 90, 150);
////////////////////////////////////

//////////////////////////////////////
//NOTE Percpective controll
const orbit = new OrbitControls(camera, renderer.domElement);
//////////////////////////////////////

//////////////////////////////////////
//NOTE - sun
const sungeo = new THREE.SphereGeometry(15, 50, 50);
const sunMaterial = new THREE.MeshBasicMaterial({
  map: sunTexture,
});
const sun = new THREE.Mesh(sungeo, sunMaterial);
scene.add(sun);
//////////////////////////////////////

//////////////////////////////////////
//NOTE - sun light (point light)
const sunLight = new THREE.PointLight(0xffffff, 4, 300);
scene.add(sunLight);
//////////////////////////////////////

//////////////////////////////////////
//NOTE - ambient light
const ambientLight = new THREE.AmbientLight(0xffffff, 0);
scene.add(ambientLight);
//////////////////////////////////////

//////////////////////////////////////
//NOTE - path for planet
const path_of_planets = [];
function createLineLoopWithMesh(radius, color, width) {
  const material = new THREE.LineBasicMaterial({
    color: color,
    linewidth: width,
  });
  const geometry = new THREE.BufferGeometry();
  const lineLoopPoints = [];

  // Calculate points for the circular path
  const numSegments = 100; // Number of segments to create the circular path
  for (let i = 0; i <= numSegments; i++) {
    const angle = (i / numSegments) * Math.PI * 2;
    const x = radius * Math.cos(angle);
    const z = radius * Math.sin(angle);
    lineLoopPoints.push(x, 0, z);
  }

  geometry.setAttribute(
    "position",
    new THREE.Float32BufferAttribute(lineLoopPoints, 3)
  );
  const lineLoop = new THREE.LineLoop(geometry, material);
  scene.add(lineLoop);
  path_of_planets.push(lineLoop);
}
//////////////////////////////////////

/////////////////////////////////////
//NOTE: create planet
const genratePlanet = (size, planetTexture, x, ring) => {
  const planetGeometry = new THREE.SphereGeometry(size, 50, 50);
  const planetMaterial = new THREE.MeshStandardMaterial({
    map: planetTexture,
  });
  const planet = new THREE.Mesh(planetGeometry, planetMaterial);
  const planetObj = new THREE.Object3D();
  planet.position.set(x, 0, 0);
  if (ring) {
    const ringGeo = new THREE.RingGeometry(
      ring.innerRadius,
      ring.outerRadius,
      32
    );
    const ringMat = new THREE.MeshBasicMaterial({
      map: ring.ringmat,
      side: THREE.DoubleSide,
    });
    const ringMesh = new THREE.Mesh(ringGeo, ringMat);
    planetObj.add(ringMesh);
    ringMesh.position.set(x, 0, 0);
    ringMesh.rotation.x = -0.5 * Math.PI;
  }
  scene.add(planetObj);

  planetObj.add(planet);
  createLineLoopWithMesh(x, 0xffffff, 3);
  return {
    planetObj: planetObj,
    planet: planet,
  };
};

const planets = [
  {
    ...genratePlanet(3.2, mercuryTexture, 28),
    rotaing_speed_around_sun: 0.004,
    self_rotation_speed: 0.004,
  },
  {
    ...genratePlanet(5.8, venusTexture, 44),
    rotaing_speed_around_sun: 0.015,
    self_rotation_speed: 0.002,
  },
  {
    ...genratePlanet(6, earthTexture, 62),
    rotaing_speed_around_sun: 0.01,
    self_rotation_speed: 0.02,
  },
  {
    ...genratePlanet(4, marsTexture, 78),
    rotaing_speed_around_sun: 0.008,
    self_rotation_speed: 0.018,
  },
  {
    ...genratePlanet(12, jupiterTexture, 100),
    rotaing_speed_around_sun: 0.002,
    self_rotation_speed: 0.04,
  },
  {
    ...genratePlanet(10, saturnTexture, 138, {
      innerRadius: 10,
      outerRadius: 20,
      ringmat: saturnRingTexture,
    }),
    rotaing_speed_around_sun: 0.0009,
    self_rotation_speed: 0.038,
  },
  {
    ...genratePlanet(7, uranusTexture, 176, {
      innerRadius: 7,
      outerRadius: 12,
      ringmat: uranusRingTexture,
    }),
    rotaing_speed_around_sun: 0.0004,
    self_rotation_speed: 0.03,
  },
  {
    ...genratePlanet(7, neptuneTexture, 200),
    rotaing_speed_around_sun: 0.0001,
    self_rotation_speed: 0.032,
  },
  {
    ...genratePlanet(2.8, plutoTexture, 216),
    rotaing_speed_around_sun: 0.0007,
    self_rotation_speed: 0.008,
  },
];

//////////////////////////////////////

//////////////////////////////////////
//NOTE - GUI options
var GUI = dat.gui.GUI;
const gui = new GUI();
const options = {
  "Real view": true,
  "Show path": true,
  speed: 1,
};
gui.add(options, "Real view").onChange((e) => {
  ambientLight.intensity = e ? 0 : 0.5;
});
gui.add(options, "Show path").onChange((e) => {
  path_of_planets.forEach((dpath) => {
    dpath.visible = e;
  });
});
const maxSpeed = new URL(window.location.href).searchParams.get("ms")*1
gui.add(options, "speed", 0, maxSpeed?maxSpeed:20);

//////////////////////////////////////

//////////////////////////////////////
//NOTE - animate function
function animate(time) {
  sun.rotateY(options.speed * 0.004);
  planets.forEach(
    ({ planetObj, planet, rotaing_speed_around_sun, self_rotation_speed }) => {
      planetObj.rotateY(options.speed * rotaing_speed_around_sun);
      planet.rotateY(options.speed * self_rotation_speed);
    }
  );
  renderer.render(scene, camera);
}
renderer.setAnimationLoop(animate);
//////////////////////////////////////

//////////////////////////////////////
//NOTE - resize camera view
window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
//////////////////////////////////////