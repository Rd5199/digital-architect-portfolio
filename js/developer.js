// Developer.js - JavaScript for the Digital Architect landing page
// Leveraging and enhancing the existing 3D functionality

// Global variables
let devScene, devCamera, devRenderer, devControls;
let devModel, devClock;
let devModelLoaded = false;
let devModelPaths = [
    'assets/models/space_satellite.glb',  // Digital creation core
    'assets/models/hubble.glb',           // Alternative model
    'assets/models/space_station.glb'     // Another alternative
];

// Initialize the developer page 3D scene
function initDevScene() {
    console.log('Initializing Developer Scene');
    
    // Make sure Three.js is loaded
    if (typeof THREE === 'undefined') {
        console.error('THREE is not defined! Make sure Three.js is loaded.');
        setTimeout(initDevScene, 500); // Retry after a delay
        return;
    }
    
    // Setup
    devClock = new THREE.Clock();
    
    // Create scene
    devScene = new THREE.Scene();
    devScene.background = null; // Transparent background
    
    // Add subtle fog for depth
    devScene.fog = new THREE.FogExp2(0x0a0a0f, 0.025);
    
    // Setup camera
    devCamera = new THREE.PerspectiveCamera(75, 1, 0.1, 100); // Square aspect ratio for container
    devCamera.position.set(0, 0, 4);
    
    // Setup renderer
    const container = document.getElementById('model-container');
    if (!container) {
        console.error('Model container not found!');
        return;
    }
    
    // Get container dimensions and set camera aspect ratio
    const containerWidth = container.clientWidth;
    const containerHeight = container.clientHeight;
    devCamera.aspect = containerWidth / containerHeight;
    devCamera.updateProjectionMatrix();
    
    // Create renderer
    devRenderer = new THREE.WebGLRenderer({ 
        alpha: true, 
        antialias: true 
    });
    devRenderer.setSize(containerWidth, containerHeight);
    devRenderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(devRenderer.domElement);
    
    // Setup controls
    devControls = new THREE.OrbitControls(devCamera, devRenderer.domElement);
    devControls.enableDamping = true;
    devControls.dampingFactor = 0.05;
    devControls.enableZoom = false;
    devControls.autoRotate = true;
    devControls.autoRotateSpeed = 1.5;
    
    // Add lights
    setupDevLights();
    
    // Load the "Creation Core" model
    loadDevModel();
    
    // Start animation loop
    animateDev();
    
    // Handle window resize
    window.addEventListener('resize', onDevWindowResize);
}

// Set up lights for the developer scene
function setupDevLights() {
    // Ambient light - soft light from all directions
    const ambientLight = new THREE.AmbientLight(0x333344, 1.0);
    devScene.add(ambientLight);
    
    // Main directional light - like sunlight
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1.5);
    directionalLight.position.set(1, 1, 1);
    devScene.add(directionalLight);
    
    // Accent lights for the dramatic effect
    const blueLight = new THREE.PointLight(0x00BFFF, 2, 10); // Electric blue accent color
    blueLight.position.set(-2, 1, 1);
    devScene.add(blueLight);
    
    const goldLight = new THREE.PointLight(0xFFBF00, 1, 10); // Amber/Gold accent color
    goldLight.position.set(2, -1, -1);
    devScene.add(goldLight);
}

// Load the developer model
function loadDevModel() {
    // Choose one of the model paths
    const modelPath = devModelPaths[0]; // Start with primary model
    let modelIndex = 0;
    
    // Create loader
    const loader = new THREE.GLTFLoader();
    
    // Function to try loading the model
    function tryLoadModel(index) {
        if (index >= devModelPaths.length) {
            console.error('Failed to load any models, creating fallback');
            createFallbackDevModel();
            return;
        }
        
        console.log(`Attempting to load model: ${devModelPaths[index]}`);
        loader.load(
            devModelPaths[index],
            // On success
            function(gltf) {
                devModel = gltf.scene;
                
                // Scale and position the model
                devModel.scale.set(0.8, 0.8, 0.8);
                devModel.position.set(0, 0, 0);
                
                // Rotate model for best presentation angle
                devModel.rotation.x = 0.5;
                
                // Add to scene
                devScene.add(devModel);
                devModelLoaded = true;
                
                // Emit an event that the model is loaded
                const event = new CustomEvent('dev-model-loaded');
                document.dispatchEvent(event);
                
                console.log('Developer model loaded successfully');
                
                // Add animation effects
                addDevModelEffects();
            },
            // On progress
            function(xhr) {
                console.log(`Model ${Math.round(xhr.loaded / xhr.total * 100)}% loaded`);
            },
            // On error - try next model
            function(error) {
                console.warn(`Error loading model ${devModelPaths[index]}: ${error.message}`);
                tryLoadModel(index + 1);
            }
        );
    }
    
    // Start the loading attempt
    tryLoadModel(modelIndex);
}

// Create a fallback model if GLTF loading fails
function createFallbackDevModel() {
    console.log('Creating fallback developer model');
    
    // Create a group to hold all the objects
    const modelGroup = new THREE.Group();
    
    // Create a geometric representation of "Creation Core"
    // Central polyhedron - icosahedron for complexity
    const coreGeometry = new THREE.IcosahedronGeometry(1, 0);
    const coreMaterial = new THREE.MeshPhongMaterial({
        color: 0x0D0F13,           // Dark base color
        emissive: 0x00BFFF,        // Electric blue emission
        emissiveIntensity: 0.2,
        shininess: 90,
        specular: 0x00BFFF
    });
    const core = new THREE.Mesh(coreGeometry, coreMaterial);
    modelGroup.add(core);
    
    // Add a wireframe overlay for tech effect
    const wireGeometry = new THREE.IcosahedronGeometry(1.02, 0);
    const wireMaterial = new THREE.MeshBasicMaterial({
        color: 0x00BFFF,
        wireframe: true,
        transparent: true,
        opacity: 0.3
    });
    const wireframe = new THREE.Mesh(wireGeometry, wireMaterial);
    modelGroup.add(wireframe);
    
    // Add some floating elements around the core
    for (let i = 0; i < 6; i++) {
        // Create small cube
        const cubeSize = 0.15 + Math.random() * 0.1;
        const cubeGeometry = new THREE.BoxGeometry(cubeSize, cubeSize, cubeSize);
        const cubeMaterial = new THREE.MeshPhongMaterial({
            color: 0x00BFFF,
            emissive: 0x00BFFF,
            emissiveIntensity: 0.5,
            specular: 0xffffff
        });
        const cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
        
        // Position in orbit around the core
        const angle = (i / 6) * Math.PI * 2;
        const radius = 1.5;
        cube.position.x = Math.cos(angle) * radius;
        cube.position.y = Math.sin(angle) * radius * 0.8; // Elliptical orbit
        cube.position.z = Math.sin(angle * 2) * 0.5; // Add some depth variation
        
        // Store original position for animation
        cube.userData.orbit = {
            angle: angle,
            radius: radius,
            speed: 0.3 + Math.random() * 0.5,
            phase: Math.random() * Math.PI * 2
        };
        
        modelGroup.add(cube);
    }
    
    // Add some connection lines
    const linesMaterial = new THREE.LineBasicMaterial({
        color: 0x00BFFF,
        transparent: true,
        opacity: 0.3
    });
    
    // Connect some vertices of the core to the floating elements
    const coreVertices = coreGeometry.getAttribute('position');
    const children = modelGroup.children;
    
    for (let i = 3; i < children.length; i++) {
        const floatingElement = children[i];
        const vertIndex = Math.floor(Math.random() * coreVertices.count) * 3;
        
        const points = [
            new THREE.Vector3(
                coreVertices.array[vertIndex],
                coreVertices.array[vertIndex + 1],
                coreVertices.array[vertIndex + 2]
            ),
            floatingElement.position.clone()
        ];
        
        const lineGeometry = new THREE.BufferGeometry().setFromPoints(points);
        const line = new THREE.Line(lineGeometry, linesMaterial);
        
        // Store connection data for animation
        line.userData.connects = {
            from: new THREE.Vector3(
                coreVertices.array[vertIndex],
                coreVertices.array[vertIndex + 1],
                coreVertices.array[vertIndex + 2]
            ),
            to: i // Index of the child to follow
        };
        
        modelGroup.add(line);
    }
    
    // Add model to scene
    devModel = modelGroup;
    devScene.add(devModel);
    devModelLoaded = true;
    
    // Emit an event that the model is loaded
    const event = new CustomEvent('dev-model-loaded');
    document.dispatchEvent(event);
    
    // Add animation effects
    addDevModelEffects();
}

// Add effects and animations to the model
function addDevModelEffects() {
    // If we have a real GLTF model
    if (devModel && devModel.isGroup && !devModel.userData.isFallback) {
        // Add subtle rotation animation
        gsap.to(devModel.rotation, {
            y: devModel.rotation.y + Math.PI * 2,
            duration: 40,
            ease: "none",
            repeat: -1
        });
        
        // Add pulsing effect
        gsap.to(devModel.scale, {
            x: devModel.scale.x * 1.05,
            y: devModel.scale.y * 1.05,
            z: devModel.scale.z * 1.05,
            duration: 2,
            ease: "power1.inOut",
            yoyo: true,
            repeat: -1
        });
    }
    
    // For fallback model, animation is handled in the animate loop
}

// Animation loop for the developer scene
function animateDev() {
    requestAnimationFrame(animateDev);
    
    const delta = devClock.getDelta();
    
    // Update controls
    if (devControls) {
        devControls.update();
    }
    
    // Animate fallback model
    if (devModel && devModel.isGroup && devModel.userData.isFallback) {
        // Rotate the entire model
        devModel.rotation.y += 0.005;
        
        // Animate each component
        devModel.children.forEach((child, index) => {
            // Animate floating cubes
            if (child.userData.orbit) {
                const orbit = child.userData.orbit;
                orbit.angle += delta * orbit.speed;
                
                child.position.x = Math.cos(orbit.angle) * orbit.radius;
                child.position.y = Math.sin(orbit.angle) * orbit.radius * 0.8;
                child.position.z = Math.sin(orbit.angle * 2 + orbit.phase) * 0.5;
                
                // Rotate the cube itself
                child.rotation.x += delta * 0.5;
                child.rotation.y += delta * 0.8;
            }
            
            // Update connection lines
            if (child.userData.connects) {
                const connects = child.userData.connects;
                const toObject = devModel.children[connects.to];
                
                if (toObject) {
                    // Update the line geometry to follow the target object
                    const points = [
                        connects.from,
                        toObject.position
                    ];
                    
                    const lineGeometry = new THREE.BufferGeometry().setFromPoints(points);
                    child.geometry.dispose();
                    child.geometry = lineGeometry;
                }
            }
        });
    }
    
    // Render the scene
    if (devRenderer) {
        devRenderer.render(devScene, devCamera);
    }
}

// Handle window resize
function onDevWindowResize() {
    const container = document.getElementById('model-container');
    if (!container || !devCamera || !devRenderer) return;
    
    const containerWidth = container.clientWidth;
    const containerHeight = container.clientHeight;
    
    devCamera.aspect = containerWidth / containerHeight;
    devCamera.updateProjectionMatrix();
    
    devRenderer.setSize(containerWidth, containerHeight);
}

// Initialize parallax effect on the model
function initModelParallax() {
    const model = document.querySelector('.dev-creation-core');
    if (!model) return;
    
    document.addEventListener('mousemove', (e) => {
        const mouseX = (e.clientX / window.innerWidth) - 0.5;
        const mouseY = (e.clientY / window.innerHeight) - 0.5;
        
        gsap.to(model, {
            x: mouseX * 40,
            y: mouseY * 40,
            duration: 1,
            ease: 'power2.out'
        });
    });
}

// Initialize scrolling animations
function initDevScrollAnimations() {
    // Services section cards animation
    const serviceCards = document.querySelectorAll('.dev-service-card');
    
    gsap.from(serviceCards, {
        y: 100,
        opacity: 0,
        duration: 0.6,
        stagger: 0.1,
        ease: 'power2.out',
        scrollTrigger: {
            trigger: '.dev-services-grid',
            start: 'top 80%'
        }
    });
    
    // Process steps animation
    const processSteps = document.querySelectorAll('.dev-process-step');
    
    gsap.from(processSteps, {
        y: 80,
        opacity: 0,
        duration: 0.6,
        stagger: 0.15,
        ease: 'power2.out',
        scrollTrigger: {
            trigger: '.dev-process-steps',
            start: 'top 80%'
        }
    });
    
    // Portfolio items animation
    const portfolioItems = document.querySelectorAll('.dev-portfolio-item');
    
    gsap.from(portfolioItems, {
        y: 100,
        opacity: 0,
        duration: 0.8,
        stagger: 0.2,
        ease: 'power2.out',
        scrollTrigger: {
            trigger: '.dev-portfolio-grid',
            start: 'top 80%'
        }
    });
    
    // Tech stack animation
    const techCategories = document.querySelectorAll('.dev-tech-category');
    
    gsap.from(techCategories, {
        y: 60,
        opacity: 0,
        duration: 0.6,
        stagger: 0.15,
        ease: 'power2.out',
        scrollTrigger: {
            trigger: '.dev-tech-grid',
            start: 'top 80%'
        }
    });
    
    // Testimonials animation
    const testimonials = document.querySelectorAll('.dev-testimonial-card');
    
    gsap.from(testimonials, {
        y: 60,
        opacity: 0,
        duration: 0.6,
        stagger: 0.15,
        ease: 'power2.out',
        scrollTrigger: {
            trigger: '.dev-testimonials-grid',
            start: 'top 80%'
        }
    });
    
    // Contact form animation
    gsap.from('.dev-contact-form', {
        y: 80,
        opacity: 0,
        duration: 0.8,
        ease: 'power2.out',
        scrollTrigger: {
            trigger: '.dev-contact-form',
            start: 'top 80%'
        }
    });
}

// Initialize typed effect for hero title
function initTypeEffect() {
    // Check if the script is loaded
    if (typeof Typed === 'undefined') {
        console.warn('Typed.js is not loaded. Skipping type effect.');
        return;
    }
    
    // Get the element
    const typeTarget = document.querySelector('.dev-hero-title span');
    if (!typeTarget) return;
    
    // Store the original text
    const originalText = typeTarget.textContent;
    
    // Clear the text
    typeTarget.textContent = '';
    
    // Initialize typed.js
    new Typed(typeTarget, {
        strings: [originalText],
        typeSpeed: 80,
        showCursor: true,
        cursorChar: '|',
        autoInsertCss: true
    });
}

// Initialize everything when the document is ready
document.addEventListener('DOMContentLoaded', function() {
    console.log('Developer.js loaded');
    
    // Initialize the developer 3D scene
    initDevScene();
    
    // Initialize parallax effect
    initModelParallax();
    
    // Initialize scroll animations if ScrollTrigger is available
    if (typeof ScrollTrigger !== 'undefined') {
        initDevScrollAnimations();
    } else {
        console.warn('ScrollTrigger not loaded. Animations will be limited.');
    }
    
    // Initialize typed effect for hero title (if available)
    if (typeof Typed !== 'undefined') {
        // Add a slight delay to ensure everything is loaded
        setTimeout(initTypeEffect, 1000);
    }
}); 