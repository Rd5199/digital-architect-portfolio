// Script to generate placeholder 3D models for development
const fs = require('fs');
const path = require('path');
const THREE = require('three');
const { GLTFExporter } = require('three/examples/jsm/exporters/GLTFExporter.js');

// Create the models directory if it doesn't exist
const modelsDir = path.join(__dirname, '../public/models');
if (!fs.existsSync(modelsDir)) {
  fs.mkdirSync(modelsDir, { recursive: true });
}

// Function to create a simple spaceship model
function createSpaceship() {
  const group = new THREE.Group();
  
  // Main body
  const bodyGeometry = new THREE.CapsuleGeometry(1, 2, 8, 16);
  const bodyMaterial = new THREE.MeshStandardMaterial({ 
    color: 0x3498db,
    metalness: 0.7,
    roughness: 0.2
  });
  const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
  body.rotation.z = Math.PI / 2;
  group.add(body);
  
  // Wings
  const wingGeometry = new THREE.BoxGeometry(0.5, 2, 3);
  const wingMaterial = new THREE.MeshStandardMaterial({ 
    color: 0x2c3e50,
    metalness: 0.5,
    roughness: 0.5
  });
  
  const leftWing = new THREE.Mesh(wingGeometry, wingMaterial);
  leftWing.position.set(0, 0, -1);
  group.add(leftWing);
  
  const rightWing = new THREE.Mesh(wingGeometry, wingMaterial);
  rightWing.position.set(0, 0, 1);
  group.add(rightWing);
  
  // Engines
  const engineGeometry = new THREE.CylinderGeometry(0.3, 0.5, 0.7, 16);
  const engineMaterial = new THREE.MeshStandardMaterial({ 
    color: 0xc0392b,
    emissive: 0xc0392b,
    emissiveIntensity: 0.5
  });
  
  const leftEngine = new THREE.Mesh(engineGeometry, engineMaterial);
  leftEngine.position.set(-1.2, 0, -1);
  leftEngine.rotation.x = Math.PI / 2;
  group.add(leftEngine);
  
  const rightEngine = new THREE.Mesh(engineGeometry, engineMaterial);
  rightEngine.position.set(-1.2, 0, 1);
  rightEngine.rotation.x = Math.PI / 2;
  group.add(rightEngine);
  
  // Cockpit
  const cockpitGeometry = new THREE.SphereGeometry(0.5, 16, 16);
  const cockpitMaterial = new THREE.MeshStandardMaterial({ 
    color: 0xecf0f1,
    metalness: 0.2,
    roughness: 0.3,
    transparent: true,
    opacity: 0.8
  });
  const cockpit = new THREE.Mesh(cockpitGeometry, cockpitMaterial);
  cockpit.position.set(1, 0, 0);
  group.add(cockpit);
  
  return group;
}

// Function to create a simple Mars rover model
function createMarsRover() {
  const group = new THREE.Group();
  
  // Body
  const bodyGeometry = new THREE.BoxGeometry(2, 0.5, 1.5);
  const bodyMaterial = new THREE.MeshStandardMaterial({ 
    color: 0xf39c12,
    metalness: 0.5,
    roughness: 0.5
  });
  const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
  group.add(body);
  
  // Wheels
  const wheelGeometry = new THREE.CylinderGeometry(0.4, 0.4, 0.3, 16);
  const wheelMaterial = new THREE.MeshStandardMaterial({ 
    color: 0x34495e,
    metalness: 0.7,
    roughness: 0.3
  });
  
  // Front left wheel
  const wheelFL = new THREE.Mesh(wheelGeometry, wheelMaterial);
  wheelFL.position.set(0.8, -0.4, 0.7);
  wheelFL.rotation.x = Math.PI / 2;
  group.add(wheelFL);
  
  // Front right wheel
  const wheelFR = new THREE.Mesh(wheelGeometry, wheelMaterial);
  wheelFR.position.set(0.8, -0.4, -0.7);
  wheelFR.rotation.x = Math.PI / 2;
  group.add(wheelFR);
  
  // Back left wheel
  const wheelBL = new THREE.Mesh(wheelGeometry, wheelMaterial);
  wheelBL.position.set(-0.8, -0.4, 0.7);
  wheelBL.rotation.x = Math.PI / 2;
  group.add(wheelBL);
  
  // Back right wheel
  const wheelBR = new THREE.Mesh(wheelGeometry, wheelMaterial);
  wheelBR.position.set(-0.8, -0.4, -0.7);
  wheelBR.rotation.x = Math.PI / 2;
  group.add(wheelBR);
  
  // Solar panels
  const panelGeometry = new THREE.BoxGeometry(1.5, 0.1, 1);
  const panelMaterial = new THREE.MeshStandardMaterial({ 
    color: 0x3498db,
    metalness: 0.8,
    roughness: 0.2
  });
  const panel = new THREE.Mesh(panelGeometry, panelMaterial);
  panel.position.set(0, 0.3, 0);
  group.add(panel);
  
  // Antenna
  const antennaGeometry = new THREE.CylinderGeometry(0.02, 0.02, 1, 8);
  const antennaMaterial = new THREE.MeshStandardMaterial({ 
    color: 0xecf0f1,
    metalness: 0.8,
    roughness: 0.2
  });
  const antenna = new THREE.Mesh(antennaGeometry, antennaMaterial);
  antenna.position.set(0.5, 0.8, 0);
  group.add(antenna);
  
  const antennaTopGeometry = new THREE.SphereGeometry(0.1, 8, 8);
  const antennaTop = new THREE.Mesh(antennaTopGeometry, antennaMaterial);
  antennaTop.position.set(0.5, 1.3, 0);
  group.add(antennaTop);
  
  return group;
}

// Function to create a simple space station model
function createSpaceStation() {
  const group = new THREE.Group();
  
  // Central hub
  const hubGeometry = new THREE.SphereGeometry(1, 16, 16);
  const hubMaterial = new THREE.MeshStandardMaterial({ 
    color: 0xecf0f1,
    metalness: 0.5,
    roughness: 0.5
  });
  const hub = new THREE.Mesh(hubGeometry, hubMaterial);
  group.add(hub);
  
  // Ring
  const ringGeometry = new THREE.TorusGeometry(2, 0.2, 16, 100);
  const ringMaterial = new THREE.MeshStandardMaterial({ 
    color: 0x3498db,
    metalness: 0.7,
    roughness: 0.3
  });
  const ring = new THREE.Mesh(ringGeometry, ringMaterial);
  ring.rotation.x = Math.PI / 2;
  group.add(ring);
  
  // Solar panel arrays
  const panelGeometry = new THREE.BoxGeometry(3, 0.1, 1);
  const panelMaterial = new THREE.MeshStandardMaterial({ 
    color: 0x2980b9,
    metalness: 0.8,
    roughness: 0.2
  });
  
  // Left solar array
  const leftPanel = new THREE.Mesh(panelGeometry, panelMaterial);
  leftPanel.position.set(0, 0, -2);
  group.add(leftPanel);
  
  // Right solar array
  const rightPanel = new THREE.Mesh(panelGeometry, panelMaterial);
  rightPanel.position.set(0, 0, 2);
  group.add(rightPanel);
  
  // Docking module
  const dockGeometry = new THREE.CylinderGeometry(0.3, 0.3, 1.5, 16);
  const dockMaterial = new THREE.MeshStandardMaterial({ 
    color: 0x7f8c8d,
    metalness: 0.6,
    roughness: 0.4
  });
  const dock = new THREE.Mesh(dockGeometry, dockMaterial);
  dock.position.set(1.5, 0, 0);
  dock.rotation.z = Math.PI / 2;
  group.add(dock);
  
  return group;
}

// Function to create a simple satellite model
function createSatellite() {
  const group = new THREE.Group();
  
  // Main body
  const bodyGeometry = new THREE.BoxGeometry(1, 0.5, 0.5);
  const bodyMaterial = new THREE.MeshStandardMaterial({ 
    color: 0x7f8c8d,
    metalness: 0.7,
    roughness: 0.3
  });
  const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
  group.add(body);
  
  // Solar panels
  const panelGeometry = new THREE.BoxGeometry(2, 0.05, 0.8);
  const panelMaterial = new THREE.MeshStandardMaterial({ 
    color: 0x3498db,
    metalness: 0.8,
    roughness: 0.2
  });
  
  const leftPanel = new THREE.Mesh(panelGeometry, panelMaterial);
  leftPanel.position.set(0, 0, -0.8);
  group.add(leftPanel);
  
  const rightPanel = new THREE.Mesh(panelGeometry, panelMaterial);
  rightPanel.position.set(0, 0, 0.8);
  group.add(rightPanel);
  
  // Antenna
  const antennaGeometry = new THREE.CylinderGeometry(0.02, 0.02, 1.5, 8);
  const antennaMaterial = new THREE.MeshStandardMaterial({ 
    color: 0xecf0f1,
    metalness: 0.8,
    roughness: 0.2
  });
  const antenna = new THREE.Mesh(antennaGeometry, antennaMaterial);
  antenna.position.set(0, 0.75, 0);
  group.add(antenna);
  
  const dishGeometry = new THREE.SphereGeometry(0.3, 16, 16, 0, Math.PI);
  const dish = new THREE.Mesh(dishGeometry, antennaMaterial);
  dish.position.set(0, 1.5, 0);
  dish.rotation.x = Math.PI;
  group.add(dish);
  
  return group;
}

// Function to create a simple planet model
function createPlanet() {
  const group = new THREE.Group();
  
  // Planet
  const planetGeometry = new THREE.SphereGeometry(1.5, 32, 32);
  const planetMaterial = new THREE.MeshStandardMaterial({ 
    color: 0x16a085,
    metalness: 0.1,
    roughness: 0.8
  });
  const planet = new THREE.Mesh(planetGeometry, planetMaterial);
  group.add(planet);
  
  // Moon
  const moonGeometry = new THREE.SphereGeometry(0.3, 16, 16);
  const moonMaterial = new THREE.MeshStandardMaterial({ 
    color: 0xbdc3c7,
    metalness: 0.1,
    roughness: 0.8
  });
  const moon = new THREE.Mesh(moonGeometry, moonMaterial);
  moon.position.set(2.5, 0.8, 0);
  group.add(moon);
  
  return group;
}

// Function to create a simple telescope model
function createTelescope() {
  const group = new THREE.Group();
  
  // Main tube
  const tubeGeometry = new THREE.CylinderGeometry(0.4, 0.5, 3, 16);
  const tubeMaterial = new THREE.MeshStandardMaterial({ 
    color: 0x34495e,
    metalness: 0.7,
    roughness: 0.3
  });
  const tube = new THREE.Mesh(tubeGeometry, tubeMaterial);
  tube.rotation.x = Math.PI / 2;
  group.add(tube);
  
  // Lens
  const lensGeometry = new THREE.CylinderGeometry(0.4, 0.4, 0.1, 16);
  const lensMaterial = new THREE.MeshStandardMaterial({ 
    color: 0x3498db,
    metalness: 0.8,
    roughness: 0.1,
    transparent: true,
    opacity: 0.8
  });
  const lens = new THREE.Mesh(lensGeometry, lensMaterial);
  lens.position.set(1.55, 0, 0);
  lens.rotation.x = Math.PI / 2;
  group.add(lens);
  
  // Stand
  const standBaseGeometry = new THREE.CylinderGeometry(0.8, 0.9, 0.2, 16);
  const standBaseMaterial = new THREE.MeshStandardMaterial({ 
    color: 0x7f8c8d,
    metalness: 0.6,
    roughness: 0.4
  });
  const standBase = new THREE.Mesh(standBaseGeometry, standBaseMaterial);
  standBase.position.set(0, -1.5, 0);
  group.add(standBase);
  
  const standPoleGeometry = new THREE.CylinderGeometry(0.1, 0.1, 1, 8);
  const standPole = new THREE.Mesh(standPoleGeometry, standBaseMaterial);
  standPole.position.set(0, -1, 0);
  group.add(standPole);
  
  const jointGeometry = new THREE.SphereGeometry(0.15, 16, 16);
  const joint = new THREE.Mesh(jointGeometry, standBaseMaterial);
  joint.position.set(0, -0.5, 0);
  group.add(joint);
  
  return group;
}

// Function to export a model to GLB format
function exportToGLB(model, filename) {
  return new Promise((resolve, reject) => {
    const exporter = new GLTFExporter();
    
    const options = {
      binary: true,  // Export as GLB
      animations: [],
      includeCustomExtensions: false
    };
    
    exporter.parse(
      model,
      (buffer) => {
        const filePath = path.join(modelsDir, filename);
        fs.writeFileSync(filePath, Buffer.from(buffer));
        console.log(`Model saved to ${filePath}`);
        resolve();
      },
      (error) => {
        console.error('Error exporting model:', error);
        reject(error);
      },
      options
    );
  });
}

// Generate and save all models
async function generateAllModels() {
  try {
    await exportToGLB(createSpaceship(), 'spaceship.glb');
    await exportToGLB(createMarsRover(), 'mars-rover.glb');
    await exportToGLB(createSpaceStation(), 'space-station.glb');
    await exportToGLB(createSatellite(), 'satellite.glb');
    await exportToGLB(createPlanet(), 'planet.glb');
    await exportToGLB(createTelescope(), 'telescope.glb');
    
    console.log('All models generated successfully!');
  } catch (error) {
    console.error('Error generating models:', error);
  }
}

// Run the model generation
generateAllModels(); 