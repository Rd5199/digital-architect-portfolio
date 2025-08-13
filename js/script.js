// Initialize Lenis for smooth scrolling
let lenis;

// Ensure updateDebug is defined
if (typeof updateDebug !== 'function') {
    window.updateDebug = function(message, type = 'info') {
        console.log(`[${type.toUpperCase()}] ${message}`);
        const debugOverlay = document.getElementById('debug-overlay');
        if (debugOverlay) {
            const debugMsg = document.createElement('div');
            debugMsg.className = `debug-msg debug-${type}`;
            debugMsg.textContent = message;
            debugOverlay.appendChild(debugMsg);
            
            // Auto-remove after 5 seconds
            setTimeout(() => {
                debugMsg.remove();
            }, 5000);
        }
    };
}

// Global variables
let scene, camera, renderer, controls, model, mixer;
let loadingManager, clock;
let isVRMode = false;
let vrButton;
let isInitialized = false;
let cameraTarget = null; // Will be initialized after THREE is loaded
let isDragging = false;
let initialMousePosition = { x: 0, y: 0 };
let targetRotation = { x: 0, y: 0 };
let currentRotation = { x: 0, y: 0 };
let sections = [];
let currentSection = 0;
let isScrolling = false;
let scrollTimeout;
let modelAnimationTimeline; // GSAP timeline for model animation
let spaceObjectTimeline; // GSAP timeline for space object animation
let spaceObject; // Reference to the space object model (satellite, rover, etc)
let totalSections = 3; // Define total number of sections for animations

// Logo SVG path data - updated to a simplified rocket shape
const logoPathData = 'M50,10 L30,90 L45,80 L50,95 L55,80 L70,90 Z';

// Debug counter to prevent infinite retries
let retryCount = 0;
const MAX_RETRIES = 5;

// GSAP Registration
gsap.registerPlugin(ScrollTrigger);

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', () => {
    if (typeof updateDebug === 'function') {
        updateDebug("DOM loaded, initiating launch sequence...");
    }
    
    // Set SVG path data right away
    const logoPath = document.querySelector('.logo-path');
    if (logoPath) {
        logoPath.setAttribute('d', logoPathData);
        if (typeof updateDebug === 'function') updateDebug("Rocket path initialized");
    } else {
        if (typeof updateDebug === 'function') updateDebug("WARNING: Rocket path element not found", "warning");
    }
    
    // Initialize sections for GTA-style scrolling
    initSections();
    
    // Set up scroll indicator click - make it more obvious
    const scrollIndicator = document.querySelector('.scroll-indicator');
    if (scrollIndicator) {
        if (typeof updateDebug === 'function') updateDebug("Launch button ready for mission start");
        scrollIndicator.addEventListener('click', () => {
            if (typeof updateDebug === 'function') updateDebug("⚡ Mission launch initiated");
            goToNextSection();
        });
        // Make it blink to draw attention
        gsap.to(scrollIndicator, {
            opacity: 0.5,
            duration: 1.5,
            repeat: -1,
            yoyo: true
        });
    } else {
        if (typeof updateDebug === 'function') updateDebug("WARNING: Launch button not found", "warning");
    }
    
    // Hide debug info after a delay in production
    setTimeout(() => {
        const debugInfo = document.getElementById('debug-info');
        if (debugInfo) {
            // Only in production - comment this out during development
            // debugInfo.style.display = 'none';
        }
    }, 5000);
    
    // Initialize smooth scrolling
    try {
        if (typeof updateDebug === 'function') updateDebug("Initializing navigation thrusters (smooth scroll)");
        lenis = new Lenis({
            duration: 1.2,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            orientation: 'vertical',
            gestureOrientation: 'vertical',
            smoothWheel: true,
            wheelMultiplier: 0.8, // Slower wheel for more controlled scrolling
            syncTouch: true // Better touch synchronization
        });
        
        // Hook into Lenis for controlled section scrolling
        lenis.on('scroll', ({ scroll, limit, velocity, direction, progress }) => {
            // Only process this if we're not already in a programmatic scroll
            if (!isScrolling) {
                // Store current scroll position for advanced scroll techniques
                updateScroll(scroll, progress);
            }
        });
        
        // Integrate Lenis with window.requestAnimationFrame
        function raf(time) {
            lenis.raf(time);
            requestAnimationFrame(raf);
        }
        requestAnimationFrame(raf);
        if (typeof updateDebug === 'function') updateDebug("Navigation thrusters online");
    } catch (e) {
        if (typeof updateDebug === 'function') updateDebug("ERROR: Navigation system failure: " + e.message, "error");
        console.error("Lenis initialization failed:", e);
    }
    
    // Setup wheel and touch event handling for section-based navigation
    window.addEventListener('wheel', handleWheel, { passive: false });
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('touchstart', handleTouchStart, { passive: false });
    window.addEventListener('touchmove', handleTouchMove, { passive: false });
    window.addEventListener('touchend', handleTouchEnd);
    
    // Try to initialize Three.js
    if (typeof updateDebug === 'function') updateDebug("Initializing 3D quantum engine");
    setTimeout(initializeThree, 500); // Short delay to ensure all scripts have loaded
});

// Initialize sections for GTA-style scrolling
function initSections() {
    // Get all main sections
    const sectionElements = document.querySelectorAll('section');
    sections = Array.from(sectionElements);
    
    if (typeof updateDebug === 'function') updateDebug(`Found ${sections.length} sections for GTA-style scrolling`);
    
    // Setup initial state
    sections.forEach((section, index) => {
        // Start with all sections except first hidden
        if (index !== 0) {
            gsap.set(section, { 
                autoAlpha: 0,
                y: '100vh', // Position below viewport
                pointerEvents: 'none' // Disable pointer events for hidden sections
            });
        } else {
            gsap.set(section, { 
                autoAlpha: 1,
                y: '0',
                pointerEvents: 'auto' // Enable pointer events for active section
            });
            section.classList.add('active'); // Add active class to first section
        }
        
        // Add data attribute for easier targeting
        section.setAttribute('data-section-index', index);
        
        // Get section title
        const title = section.getAttribute('data-section-title') || `Section ${index + 1}`;
        
        // Update section title if necessary
        const titleElement = section.querySelector('.section-title');
        if (titleElement && !titleElement.textContent) {
            titleElement.textContent = title;
        }
        
        // Set card indices for staggered animations
        const cards = section.querySelectorAll('.service-card');
        cards.forEach((card, cardIndex) => {
            card.style.setProperty('--card-index', cardIndex);
        });
    });
    
    // Initial section is active
    currentSection = 0;
    
    // Initialize progress indicators
    initProgressIndicators();
    
    // Ensure progress indicators are correctly set
    updateProgressIndicators(-1, 0);
    
    if (typeof updateDebug === 'function') updateDebug("Sections initialized for GTA-style scrolling");
}

// Handle wheel events for section-based scrolling
function handleWheel(e) {
    // If we're currently in a transition, don't process wheel events
    if (isScrolling) {
        e.preventDefault();
        return;
    }
    
    // Add a small timeout to prevent rapid firing of wheel events
    if (scrollTimeout) {
        clearTimeout(scrollTimeout);
    }
    
    scrollTimeout = setTimeout(() => {
        // Determine scroll direction
        const direction = e.deltaY > 0 ? 1 : -1;
        
        if (typeof updateDebug === 'function') {
            updateDebug(`Wheel navigation: ${direction > 0 ? 'forward' : 'backward'}`);
        }
        
        // Navigate to next/previous section
        if (direction > 0) {
            goToNextSection();
        } else {
            goToPrevSection();
        }
    }, 50); // Short timeout to debounce wheel events
    
    e.preventDefault(); // Prevent default scrolling
}

// Handle keyboard navigation with improved feedback
function handleKeyDown(e) {
    // If we're currently in a transition, don't process keys
    if (isScrolling) return;
    
    // Arrow down/right or Page Down to go to next section
    if (e.key === 'ArrowDown' || e.key === 'ArrowRight' || e.key === 'PageDown' || e.key === ' ') {
        if (typeof updateDebug === 'function') {
            updateDebug(`Key navigation: ${e.key} - moving forward`);
        }
        goToNextSection();
        e.preventDefault();
    }
    
    // Arrow up/left or Page Up to go to previous section
    if (e.key === 'ArrowUp' || e.key === 'ArrowLeft' || e.key === 'PageUp') {
        if (typeof updateDebug === 'function') {
            updateDebug(`Key navigation: ${e.key} - moving backward`);
        }
        goToPrevSection();
        e.preventDefault();
    }
    
    // ESC key to reset view
    if (e.key === 'Escape') {
        if (typeof updateDebug === 'function') {
            updateDebug(`Reset view triggered by Escape key`);
        }
        
        // Find and click the reset button
        const resetBtn = document.getElementById('reset-view');
        if (resetBtn) {
            resetBtn.click();
        }
        e.preventDefault();
    }
}

// Touch handling for mobile
let touchStartY = 0;
let touchEndY = 0;
const touchThreshold = 50; // Minimum swipe distance

function handleTouchStart(e) {
    if (isScrolling) {
        e.preventDefault();
        return;
    }
    
    touchStartY = e.touches[0].clientY;
}

function handleTouchMove(e) {
    if (isScrolling) {
        e.preventDefault();
    }
}

function handleTouchEnd(e) {
    if (isScrolling) return;
    
    touchEndY = e.changedTouches[0].clientY;
    
    // Calculate distance
    const touchDiff = touchStartY - touchEndY;
    
    // If the swipe is long enough
    if (Math.abs(touchDiff) > touchThreshold) {
        if (touchDiff > 0) {
            // Swipe up - go to next section
            if (typeof updateDebug === 'function') {
                updateDebug("Touch navigation: swipe up - moving forward");
            }
            goToNextSection();
        } else {
            // Swipe down - go to previous section
            if (typeof updateDebug === 'function') {
                updateDebug("Touch navigation: swipe down - moving backward");
            }
            goToPrevSection();
        }
    }
}

// Go to next section with enhanced GTA-style animation
function goToNextSection(duration = 1.2) {
    if (currentSection >= sections.length - 1 || isScrolling) return;
    
    isScrolling = true;
    
    const currentSectionEl = sections[currentSection];
    const nextSectionEl = sections[currentSection + 1];
    
    if (typeof updateDebug === 'function') updateDebug(`🚀 Transitioning to section ${currentSection + 1}`);
    
    // Make the next section visible but below viewport - GTA 6 style
    gsap.set(nextSectionEl, { 
        autoAlpha: 1,
        y: '100vh',
        scale: 0.9,
        transformOrigin: 'center center'
    });
    
    // Update progress indicators
    updateProgressIndicators(currentSection, currentSection + 1);
    
    // Add a cosmic flash effect
    const flash = document.createElement('div');
    flash.style.position = 'fixed';
    flash.style.top = '0';
    flash.style.left = '0';
    flash.style.width = '100%';
    flash.style.height = '100%';
    flash.style.backgroundColor = 'rgba(30, 30, 50, 0)';
    flash.style.zIndex = '1000';
    flash.style.pointerEvents = 'none';
    document.body.appendChild(flash);
    
    // GTA VI style: Current section zooms out while next section slides up and expands
    const timeline = gsap.timeline({
        onComplete: () => {
            // Hide previous section completely after transition to avoid overlap
            gsap.set(currentSectionEl, { autoAlpha: 0, y: '-100vh' });
            
            // Remove flash effect
            document.body.removeChild(flash);
            
            currentSection++;
            isScrolling = false;
            
            // If we have a 3D model and camera, update their positions
            updateModelForSection(currentSection);
            
            if (typeof updateDebug === 'function') updateDebug(`✓ Arrived at section ${currentSection}`);
        }
    });
    
    // Add flash effect
    timeline.to(flash, {
        backgroundColor: 'rgba(30, 30, 50, 0.2)',
        duration: duration * 0.2,
        ease: 'power2.in'
    }, 0);
    
    timeline.to(flash, {
        backgroundColor: 'rgba(30, 30, 50, 0)',
        duration: duration * 0.3,
        ease: 'power2.out'
    }, duration * 0.2);
    
    // GTA VI style - Current section scales down and fades up
    timeline.to(currentSectionEl, {
        y: '-10vh',
        scale: 0.9,
        autoAlpha: 0,
        transformOrigin: 'center center',
        duration: duration,
        ease: 'power2.inOut'
    }, 0);
    
    // GTA VI style - Next section expands and slides up
    timeline.to(nextSectionEl, { 
        y: '0vh',
        scale: 1,
        duration: duration,
        ease: 'power2.out'
    }, 0.1);
    
    // Apply 3D effect to the transition
    if (model) {
        timeline.to(model.rotation, {
            y: model.rotation.y + Math.PI * 0.25,
            duration: duration + 0.3,
            ease: 'power2.inOut'
        }, 0);
        
        if (camera) {
            // More dynamic camera movement
            const newZ = Math.max(camera.position.z - 1, 3);
            
            timeline.to(camera.position, {
                z: newZ,
                duration: duration + 0.3,
                ease: 'power2.inOut'
            }, 0);
        }
    }
    
    // Add some particles for transition effect
    addTransitionParticles('forward');
}

// Go to previous section with enhanced GTA-style animation
function goToPrevSection(duration = 1.2) {
    if (currentSection <= 0 || isScrolling) return;
    
    isScrolling = true;
    
    const currentSectionEl = sections[currentSection];
    const prevSectionEl = sections[currentSection - 1];
    
    if (typeof updateDebug === 'function') updateDebug(`🚀 Transitioning to section ${currentSection - 1}`);
    
    // Make the previous section visible - GTA 6 style
    gsap.set(prevSectionEl, { 
        autoAlpha: 1,
        y: '-100vh',
        scale: 0.9,
        transformOrigin: 'center center'
    });
    
    // Update progress indicators
    updateProgressIndicators(currentSection, currentSection - 1);
    
    // Add a cosmic flash effect
    const flash = document.createElement('div');
    flash.style.position = 'fixed';
    flash.style.top = '0';
    flash.style.left = '0';
    flash.style.width = '100%';
    flash.style.height = '100%';
    flash.style.backgroundColor = 'rgba(30, 30, 50, 0)';
    flash.style.zIndex = '1000';
    flash.style.pointerEvents = 'none';
    document.body.appendChild(flash);
    
    // GTA VI style: Current section slides down and shrinks as previous section expands from top
    const timeline = gsap.timeline({
        onComplete: () => {
            // Hide current section completely after transition to avoid overlap
            gsap.set(currentSectionEl, { autoAlpha: 0 });
            
            // Remove flash effect
            document.body.removeChild(flash);
            
            currentSection--;
            isScrolling = false;
            
            // If we have a 3D model and camera, update their positions
            updateModelForSection(currentSection);
            
            if (typeof updateDebug === 'function') updateDebug(`✓ Arrived at section ${currentSection}`);
        }
    });
    
    // Add flash effect
    timeline.to(flash, {
        backgroundColor: 'rgba(30, 30, 50, 0.2)',
        duration: duration * 0.2,
        ease: 'power2.in'
    }, 0);
    
    timeline.to(flash, {
        backgroundColor: 'rgba(30, 30, 50, 0)',
        duration: duration * 0.3,
        ease: 'power2.out'
    }, duration * 0.2);
    
    // GTA VI style - Current section scales down and moves down
    timeline.to(currentSectionEl, {
        y: '100vh',
        scale: 0.9,
        transformOrigin: 'center center',
        duration: duration,
        ease: 'power2.inOut'
    }, 0);
    
    // GTA VI style - Previous section expands and slides down
    timeline.to(prevSectionEl, {
        y: '0vh',
        scale: 1,
        duration: duration,
        ease: 'power2.out'
    }, 0.1);
    
    // Apply 3D effect to the transition
    if (model) {
        timeline.to(model.rotation, {
            y: model.rotation.y - Math.PI * 0.25,
            duration: duration + 0.3,
            ease: 'power2.inOut'
        }, 0);
        
        if (camera) {
            // More dynamic camera movement
            const newZ = Math.min(camera.position.z + 1, 10);
            
            timeline.to(camera.position, {
                z: newZ,
                duration: duration + 0.3,
                ease: 'power2.inOut'
            }, 0);
        }
    }
    
    // Add some particles for transition effect
    addTransitionParticles('backward');
}

// Add particles during section transitions for a more cosmic effect
function addTransitionParticles(direction) {
    if (!scene) return;
    
    // Create a temporary particle system
    const particleCount = 100;
    const particles = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particleCount * 3);
    const particleSizes = new Float32Array(particleCount);
    
    // Start position depends on transition direction
    const startZ = direction === 'forward' ? -10 : 10;
    const endZ = direction === 'forward' ? 10 : -10;
    const velocityZ = direction === 'forward' ? 0.5 : -0.5;
    
    for (let i = 0; i < particleCount; i++) {
        const i3 = i * 3;
        particlePositions[i3] = (Math.random() - 0.5) * 20; // x
        particlePositions[i3 + 1] = (Math.random() - 0.5) * 20; // y
        particlePositions[i3 + 2] = startZ + (Math.random() - 0.5) * 5; // z
        
        particleSizes[i] = Math.random() * 0.1 + 0.05;
    }
    
    particles.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
    particles.setAttribute('size', new THREE.BufferAttribute(particleSizes, 1));
    
    const particleMaterial = new THREE.PointsMaterial({
        color: 0x00e6ff,
        size: 0.1,
        transparent: true,
        opacity: 0.8,
        blending: THREE.AdditiveBlending,
        sizeAttenuation: true
    });
    
    const particleSystem = new THREE.Points(particles, particleMaterial);
    scene.add(particleSystem);
    
    // Animate particles moving past the camera
    const startTime = Date.now();
    const duration = 1500; // 1.5 seconds
    
    // Store the animation function reference to cancel it
    const animateParticles = function() {
        const elapsedTime = Date.now() - startTime;
        const progress = elapsedTime / duration;
        
        // Update particle positions
        const positions = particles.attributes.position.array;
        
        for (let i = 0; i < particleCount; i++) {
            const i3 = i * 3;
            positions[i3 + 2] += velocityZ; // Move along z-axis
        }
        
        particles.attributes.position.needsUpdate = true;
        
        // Fade out opacity near the end
        if (progress > 0.7) {
            const fadeProgress = (progress - 0.7) / 0.3;
            particleMaterial.opacity = 0.8 * (1 - fadeProgress);
        }
        
        // Remove particles when done
        if (progress >= 1) {
            scene.remove(particleSystem);
            particleSystem.geometry.dispose();
            particleMaterial.dispose();
            return;
        }
        
        requestAnimationFrame(animateParticles);
    };
    
    // Start animation
    animateParticles();
}

// Update model position and rotation based on current section
function updateModelForSection(sectionIndex) {
    if (!model || !camera) return;
    
    // Different model positions and rotations for each section
    const modelConfigs = [
        { scale: 2, posY: 0, rotY: 0, cameraZ: 8 },                 // Intro section
        { scale: 2.5, posY: -1, rotY: Math.PI * 0.5, cameraZ: 7 },  // Animation section
        { scale: 3, posY: -2, rotY: Math.PI, cameraZ: 6 },          // Content section
    ];
    
    // Get config for current section (with fallback to last config if section index is out of range)
    const config = modelConfigs[Math.min(sectionIndex, modelConfigs.length - 1)];
    
    // Animate model to new position/rotation
    gsap.to(model.scale, {
        x: config.scale,
        y: config.scale,
        z: config.scale,
        duration: 2,
        ease: 'power2.inOut'
    });
    
    gsap.to(model.position, {
        y: config.posY,
        duration: 2,
        ease: 'power2.inOut'
    });
    
    gsap.to(model.rotation, {
        y: config.rotY,
        duration: 2,
        ease: 'power2.inOut'
    });
    
    // Update current rotation values for drag interaction
    currentRotation.y = config.rotY;
    targetRotation.y = config.rotY;
    
    // Update camera position
    gsap.to(camera.position, {
        z: config.cameraZ,
        duration: 2,
        ease: 'power2.inOut',
        onUpdate: () => {
            if (controls) controls.update();
        }
    });
}

// Function to handle scroll updates
function updateScroll(scrollPos, progress) {
    // Additional scroll effects can be added here
    // This is where you would implement parallax effects on elements
    
    // Subtle model rotation based on scroll progress
    if (model && !isDragging) {
        const rotationAmount = progress * Math.PI * 0.1;
        gsap.to(model.rotation, {
            y: currentRotation.y + rotationAmount,
            duration: 0.5,
            ease: 'power1.out',
            overwrite: 'auto'
        });
    }
}

// Try to initialize Three.js when everything is ready
function initializeThree() {
    if (typeof updateDebug === 'function') {
        updateDebug("Initializing 3D quantum physics engine...");
    }
    
    // Fix for THREE is not defined - make sure Three.js is loaded
    if (typeof THREE === 'undefined') {
        retryCount++;
        if (typeof updateDebug === 'function') {
            updateDebug(`ERROR: 3D engine unresponsive! Retry ${retryCount}/${MAX_RETRIES}`, "error");
        }
        
        // Check if script tag is present and loaded correctly
        const threeScript = document.querySelector('script[src*="three"]');
        if (!threeScript) {
            if (typeof updateDebug === 'function') {
                updateDebug("THREE.js script tag not found - attempting to load dynamically", "warning");
            }
            
            // Try to add the script dynamically
            const script = document.createElement('script');
            script.src = 'https://cdn.jsdelivr.net/npm/three@0.149.0/build/three.min.js';
            script.onload = () => {
                if (typeof updateDebug === 'function') {
                    updateDebug("THREE.js dynamically loaded, initializing...");
                }
                // Reset retry count on successful load
                retryCount = 0;
                setTimeout(initializeThree, 500);
            };
            script.onerror = (e) => {
                if (typeof updateDebug === 'function') {
                    updateDebug("Failed to load THREE.js dynamically: " + e.message, "error");
                }
                
                // Try a different CDN as backup
                const backupScript = document.createElement('script');
                backupScript.src = 'https://unpkg.com/three@0.149.0/build/three.min.js';
                backupScript.onload = () => {
                    if (typeof updateDebug === 'function') {
                        updateDebug("THREE.js loaded from backup CDN, initializing...");
                    }
                    // Reset retry count on successful load
                    retryCount = 0;
                    setTimeout(initializeThree, 500);
                };
                backupScript.onerror = () => {
                    if (typeof updateDebug === 'function') {
                        updateDebug("All THREE.js loading attempts failed", "error");
                    }
                };
                document.body.appendChild(backupScript);
            }
            document.body.appendChild(script);
            return;
        }
        
        // Try again after a brief delay to allow scripts to load
        if (retryCount < MAX_RETRIES) {
            document.querySelector('.loading-text').textContent = `Warming up 3D engines... (attempt ${retryCount}/${MAX_RETRIES})`;
            setTimeout(initializeThree, 1500); // Increased delay for better reliability
        } else {
            // Create fallback experience if THREE fails to load
            if (typeof updateDebug === 'function') {
                updateDebug("CRITICAL: 3D engine failure after maximum retries", "error");
            }
            document.querySelector('.loading-text').textContent = 'Unable to initialize 3D engine. Please refresh or try a different browser.';
            document.querySelector('.loading-screen').style.opacity = 0.5;
            
            // Add a refresh button with glitch effect
            const refreshBtn = document.createElement('button');
            refreshBtn.textContent = 'Restart System';
            refreshBtn.style.padding = '15px 30px';
            refreshBtn.style.marginTop = '30px';
            refreshBtn.style.background = 'linear-gradient(45deg, #5c25e8, #00e6ff)';
            refreshBtn.style.border = 'none';
            refreshBtn.style.borderRadius = '30px';
            refreshBtn.style.color = 'white';
            refreshBtn.style.fontWeight = 'bold';
            refreshBtn.style.letterSpacing = '2px';
            refreshBtn.style.cursor = 'pointer';
            refreshBtn.style.boxShadow = '0 0 25px rgba(0, 230, 255, 0.5)';
            refreshBtn.style.position = 'relative';
            
            // Add glitch animation
            refreshBtn.style.animation = 'glitch 1s infinite';
            const style = document.createElement('style');
            style.textContent = `
                @keyframes glitch {
                    0% { transform: translate(0); }
                    20% { transform: translate(-5px, 5px); }
                    40% { transform: translate(-5px, -5px); }
                    60% { transform: translate(5px, 5px); }
                    80% { transform: translate(5px, -5px); }
                    100% { transform: translate(0); }
                }
            `;
            document.head.appendChild(style);
            
            refreshBtn.onclick = () => window.location.reload();
            document.querySelector('.loading-screen').appendChild(refreshBtn);
            
            // Check if WebGL is supported at all
            try {
                const canvas = document.createElement('canvas');
                const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
                if (!gl) {
                    const warningMsg = document.createElement('p');
                    warningMsg.textContent = 'Your browser may not support WebGL, which is required for 3D rendering.';
                    warningMsg.style.color = '#ff4e50';
                    warningMsg.style.marginTop = '20px';
                    warningMsg.style.maxWidth = '80%';
                    warningMsg.style.textAlign = 'center';
                    document.querySelector('.loading-screen').appendChild(warningMsg);
                }
            } catch (e) {
                if (typeof updateDebug === 'function') {
                    updateDebug("WebGL not supported: " + e.message, "error");
                }
            }
        }
    } else {
        // Three.js is loaded, proceed with initialization
        if (typeof updateDebug === 'function') updateDebug("✅ 3D quantum engine online, initializing space environment");
        
        // Check if extensions are loaded
        if (typeof THREE.OrbitControls === 'undefined') {
            if (typeof updateDebug === 'function') {
                updateDebug("OrbitControls not loaded, attempting to load extensions", "warning");
            }
            
            // Try to load dependencies in sequence
            loadDependency('https://unpkg.com/three@0.149.0/examples/js/controls/OrbitControls.js', () => {
                loadDependency('https://unpkg.com/three@0.149.0/examples/js/loaders/GLTFLoader.js', () => {
                    loadDependency('https://unpkg.com/three@0.149.0/examples/js/webxr/VRButton.js', () => {
                        if (typeof updateDebug === 'function') {
                            updateDebug("Extensions loaded, proceeding with initialization");
                        }
                        initialize();
                    });
                });
            });
        } else {
            initialize();
        }
    }
}

// Make initializeThree accessible globally for HTML to call
window.initializeThree = initializeThree;

// Helper function to load script dependencies
function loadDependency(url, callback) {
    const script = document.createElement('script');
    script.src = url;
    script.onload = callback;
    script.onerror = () => {
        if (typeof updateDebug === 'function') {
            updateDebug(`Failed to load dependency: ${url}`, "error");
        }
    };
    document.body.appendChild(script);
}

// Main initialization function
function initialize() {
    if (isInitialized) {
        if (typeof updateDebug === 'function') updateDebug("Systems already online, skipping initialization");
        return;
    }
    isInitialized = true;
    
    if (typeof updateDebug === 'function') updateDebug("Initializing space environment components");
    
    // Initialize cameraTarget now that THREE is loaded
    cameraTarget = new THREE.Vector3(0, 0, 0);
    
    // Initialize loading manager
    initLoadingManager();
    
    // Initialize 3D scene
    initThreeJS();
    
    // Set up control event listeners
    initControls();
    
    // Initialize animations
    initAnimations();
    
    // Add space glitch effect to text elements
    addGlitchEffect();
    
    // Ensure ScrollTrigger refresh after Three.js is loaded
    ScrollTrigger.refresh();
    
    // Debug logs for interactive elements
    const controlBtns = document.querySelectorAll('.control-btn');
    if (typeof updateDebug === 'function') updateDebug(`Found ${controlBtns.length} control interfaces`);
    
    // Add at the end of the function, before the closing brace
    initInteractiveFeatures();
}

// Initialize loading manager
function initLoadingManager() {
    loadingManager = new THREE.LoadingManager();
    
    loadingManager.onProgress = (url, loaded, total) => {
        const progressPercent = (loaded / total) * 100;
        console.log(`Loading: ${Math.round(progressPercent)}%`);
        document.querySelector('.loading-text').textContent = `Loading... ${Math.round(progressPercent)}%`;
    };
    
    loadingManager.onLoad = () => {
        console.log('Loading complete!');
        // Hide loading screen with animation
        gsap.to('.loading-screen', {
            opacity: 0,
            duration: 1.5,
            delay: 0.5,
            onComplete: () => {
                document.querySelector('.loading-screen').style.display = 'none';
            }
        });
    };
    
    loadingManager.onError = (url) => {
        console.error('Error loading', url);
        
        // Get file extension to determine type
        const fileExt = url.split('.').pop().toLowerCase();
        
        // More specific error messages based on file type
        let errorMessage = `Error loading ${url.split('/').pop()}`;
        
        if (fileExt === 'glb' || fileExt === 'gltf') {
            errorMessage = `Error loading 3D model: ${url.split('/').pop()}`;
            if (typeof updateDebug === 'function') updateDebug(`ERROR: Failed to load 3D model: ${url.split('/').pop()}`);
        } 
        else if (fileExt === 'png' || fileExt === 'jpg' || fileExt === 'jpeg') {
            errorMessage = `Error loading texture: ${url.split('/').pop()}`;
            if (typeof updateDebug === 'function') updateDebug(`ERROR: Failed to load texture: ${url.split('/').pop()}`);
        }
        else if (fileExt === 'bin') {
            errorMessage = `Error loading model data: ${url.split('/').pop()}`;
            if (typeof updateDebug === 'function') updateDebug(`ERROR: Failed to load model data: ${url.split('/').pop()}`);
        }
        
        document.querySelector('.loading-text').textContent = errorMessage;
        
        // Auto-recover by creating fallback models based on file type
        if (fileExt === 'glb' || fileExt === 'gltf') {
            if (url.includes('satellite') || url.includes('space_object')) {
                if (typeof updateDebug === 'function') updateDebug("Creating fallback satellite model");
                createSimpleSpaceObject();
            } else {
                if (typeof updateDebug === 'function') updateDebug("Creating fallback model");
                createFallbackModel();
            }
        }
    };
    
    // Initialize clock for animations
    clock = new THREE.Clock();
}

// Initialize Three.js scene
function initThreeJS() {
    try {
        // Get performance settings
        const perfSettings = window.PERF_SETTINGS || {
            pixelRatio: Math.min(1.5, window.devicePixelRatio || 1),
            cameraFar: 100,
            cameraNear: 0.1,
            maxObjects: 100,
            useLOD: true,
            lodDistance: 20,
            maxFPS: 60,
            enableFrustumCulling: true
        };
        
        // Scene setup with optimized settings
        scene = new THREE.Scene();
        scene.fog = new THREE.FogExp2(0x0a0a0f, 0.025);
        
        // Optimized camera setup
        camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 
            perfSettings.cameraNear, perfSettings.cameraFar);
        camera.position.set(0, 0, 5);
        
        // Renderer setup with performance optimizations
        renderer = new THREE.WebGLRenderer({ 
            antialias: false, // Disable antialiasing for performance
            alpha: false,     // Disable alpha for performance
            logarithmicDepthBuffer: false, // Disable for performance
            powerPreference: 'high-performance'
        });
        
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(perfSettings.pixelRatio);
        
        // Only enable shadows if necessary
        renderer.shadowMap.enabled = false;
        
        // Handle older Three.js versions
        if (typeof THREE.sRGBEncoding !== 'undefined') {
            renderer.outputEncoding = THREE.sRGBEncoding;
        }
        
        // Disable tone mapping for better performance
        if (typeof THREE.NoToneMapping !== 'undefined') {
            renderer.toneMapping = THREE.NoToneMapping;
        }
        
        // Enable frustum culling
        renderer.sortObjects = perfSettings.enableFrustumCulling;
        
        // Frame rate limiter variables
        let lastFrameTime = 0;
        const frameInterval = 1000 / perfSettings.maxFPS;
        
        const canvasContainer = document.getElementById('canvas-container');
        if (canvasContainer) {
            canvasContainer.appendChild(renderer.domElement);
            if (typeof updateDebug === 'function') updateDebug("Canvas added to container");
            
            // Add canvas event handlers for 360 interaction
            initFullViewInteraction(canvasContainer);
        } else {
            if (typeof updateDebug === 'function') updateDebug("ERROR: Canvas container not found");
            document.body.appendChild(renderer.domElement); // Fallback
        }
        
        // Check if WebXR is available and add VR support
        if (navigator.xr && 'isSessionSupported' in navigator.xr) {
            navigator.xr.isSessionSupported('immersive-vr').then((supported) => {
                if (supported && typeof VRButton !== 'undefined') {
                    // Add VR button through Three.js VRButton
                    try {
                        vrButton = VRButton.createButton(renderer);
                        const vrModeBtn = document.getElementById('vr-mode');
                        if (vrModeBtn) {
                            vrModeBtn.addEventListener('click', () => {
                                if (typeof updateDebug === 'function') updateDebug("VR mode button clicked");
                                if (!isVRMode) {
                                    document.body.appendChild(vrButton);
                                    vrButton.click();
                                    isVRMode = true;
                                } else {
                                    if (document.body.contains(vrButton)) {
                                        document.body.removeChild(vrButton);
                                    }
                                    isVRMode = false;
                                }
                            });
                        }
                        // Enable XR features
                        renderer.xr.enabled = true;
                        if (typeof updateDebug === 'function') updateDebug("VR support enabled");
                    } catch (e) {
                        if (typeof updateDebug === 'function') updateDebug("ERROR: VR setup failed: " + e.message);
                    }
                } else {
                    console.log('VR not supported by this browser');
                    if (typeof updateDebug === 'function') updateDebug("VR not supported by browser");
                    const vrModeBtn = document.getElementById('vr-mode');
                    if (vrModeBtn) vrModeBtn.style.display = 'none';
                }
            });
        } else {
            console.log('WebXR not available');
            if (typeof updateDebug === 'function') updateDebug("WebXR not available");
            const vrModeBtn = document.getElementById('vr-mode');
            if (vrModeBtn) vrModeBtn.style.display = 'none';
        }
        
        // OrbitControls - configure for smooth but optimized performance
        try {
            controls = new THREE.OrbitControls(camera, renderer.domElement);
            controls.enableDamping = true;
            controls.dampingFactor = 0.05;
            controls.enableZoom = true;
            controls.enablePan = false;
            controls.autoRotate = false;
            controls.minDistance = 3;
            controls.maxDistance = 20;
            controls.target.set(0, 0, 0);
            controls.maxPolarAngle = Math.PI; // Allow full vertical rotation
            controls.minPolarAngle = 0;
            controls.rotateSpeed = 0.7; // Slightly faster rotation
            if (typeof updateDebug === 'function') updateDebug("Controls initialized with 360° settings");
        } catch (e) {
            if (typeof updateDebug === 'function') updateDebug("ERROR: OrbitControls setup failed: " + e.message);
        }
        
        // Lighting - optimized setup
        setupLighting(perfSettings);
        
        // Load 3D models with LOD support
        loadModels(perfSettings);
        
        // Add Stars/particles - optimized
        addParticles(perfSettings);
        
        // Handle window resize
        window.addEventListener('resize', onWindowResize);
        
        // Animation loop with frame rate limiting
        function animateWithFrameLimit(time) {
            if (!isNaN(frameInterval)) {
                // Frame rate limiting
                if (time - lastFrameTime < frameInterval) {
                    requestAnimationFrame(animateWithFrameLimit);
                    return;
                }
                lastFrameTime = time;
            }
            
            animate();
            requestAnimationFrame(animateWithFrameLimit);
        }
        
        // Start optimized animation loop
        if (!renderer.xr.isPresenting) {
            requestAnimationFrame(animateWithFrameLimit);
        } else {
            renderer.setAnimationLoop(animate);
        }
        
        if (typeof updateDebug === 'function') updateDebug("3D scene setup complete with performance optimizations");
        
        // Hide loading screen
        document.querySelector('.loading-screen').style.display = 'none';
        
        // Clear timeout timer if it exists
        if (window.loadingTimeoutTimer) {
            clearInterval(window.loadingTimeoutTimer);
        }
    } catch (e) {
        console.error("Error initializing Three.js scene:", e);
        if (typeof updateDebug === 'function') updateDebug("CRITICAL: Scene init failed: " + e.message);
        document.querySelector('.loading-text').textContent = 'Error initializing 3D scene';
    }
}

// Set up scene lighting with optimized settings
function setupLighting(perfSettings) {
    // Ambient light - simple and performant
    const ambientLight = new THREE.AmbientLight(0x333344, 0.5);
    scene.add(ambientLight);
    
    // Main directional light without shadows for performance
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(5, 5, 5);
    scene.add(directionalLight);
    
    // Add minimal colored point lights
    const purpleLight = new THREE.PointLight(0x5e17eb, 1, 20);
    purpleLight.position.set(-5, 2, 3);
    scene.add(purpleLight);
}

// Add particle background effect - optimized
function addParticles(perfSettings) {
    const particleGeometry = new THREE.BufferGeometry();
    // Reduce particle count for better performance
    const particleCount = Math.min(500, perfSettings?.maxObjects || 500);  
    const particlePositions = new Float32Array(particleCount * 3);
    
    for (let i = 0; i < particleCount; i++) {
        const i3 = i * 3;
        particlePositions[i3] = (Math.random() - 0.5) * 50;
        particlePositions[i3 + 1] = (Math.random() - 0.5) * 50;
        particlePositions[i3 + 2] = (Math.random() - 0.5) * 50;
    }
    
    particleGeometry.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
    
    // Use basic material for better performance
    const particleMaterial = new THREE.PointsMaterial({
        color: 0xffffff,
        size: 0.05,
        transparent: false, // Disable transparency for performance
        sizeAttenuation: true
    });
    
    const particles = new THREE.Points(particleGeometry, particleMaterial);
    scene.add(particles);
    
    // Store for animation
    scene.userData.backgroundParticles = particles;
}

// Load models with LOD optimization
function loadModels(perfSettings = {}) {
    // Original loadModels function code...
    
    // Add model optimization when loading is complete
    // This will be called after the model is loaded
    const optimizeModel = (model) => {
        if (!model) return;
        
        // Apply optimizations to the model
        model.traverse(function(child) {
            if (child.isMesh) {
                // Enable frustum culling
                child.frustumCulled = perfSettings.enableFrustumCulling !== false;
                
                // Optimize geometry
                if (child.geometry) {
                    // Ensure bounding sphere is computed for proper culling
                    child.geometry.computeBoundingSphere();
                    
                    // Dispose of unnecessary attributes if present
                    if (child.geometry.attributes.normal && !child.material.needsNormals) {
                        child.geometry.deleteAttribute('normal');
                    }
                    if (child.geometry.attributes.uv && !child.material.map) {
                        child.geometry.deleteAttribute('uv');
                    }
                }
                
                // Simplify materials if needed
                if (perfSettings.simplifyMaterials) {
                    // Replace complex materials with simpler ones if needed
                    if (child.material.type === 'MeshStandardMaterial') {
                        child.material = new THREE.MeshPhongMaterial({
                            color: child.material.color,
                            map: child.material.map,
                            transparent: child.material.transparent,
                            opacity: child.material.opacity
                        });
                    }
                }
                
                // Disable shadows for performance
                child.castShadow = false;
                child.receiveShadow = false;
            }
        });
    };
    
    // Apply this optimization to loaded models...
}

// Create a valid model from scratch when JSON is invalid
function createPlaceholderModelFromJson() {
    if (typeof updateDebug === 'function') {
        updateDebug('Creating placeholder model due to JSON parse error');
    }
    
    // Create a group for the model
    const placeholderGroup = new THREE.Group();
    
    // Create a simple satellite model using geometries
    // Main body - cylinder
    const bodyGeometry = new THREE.CylinderGeometry(0.5, 0.5, 2, 16);
    const bodyMaterial = new THREE.MeshPhongMaterial({ 
        color: 0x444444,
        shininess: 70,
        specular: 0x111111
    });
    const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
    body.rotation.x = Math.PI / 2;
    placeholderGroup.add(body);
    
    // Solar panels
    const panelGeometry = new THREE.BoxGeometry(4, 1.5, 0.1);
    const panelMaterial = new THREE.MeshPhongMaterial({
        color: 0x2244aa,
        shininess: 100,
        specular: 0x3366ff
    });
    
    // Left panel
    const leftPanel = new THREE.Mesh(panelGeometry, panelMaterial);
    leftPanel.position.x = -2.5;
    leftPanel.position.y = 0.2;
    placeholderGroup.add(leftPanel);
    
    // Right panel
    const rightPanel = new THREE.Mesh(panelGeometry, panelMaterial);
    rightPanel.position.x = 2.5;
    rightPanel.position.y = 0.2;
    placeholderGroup.add(rightPanel);
    
    // Antenna
    const antennaGeometry = new THREE.ConeGeometry(0.2, 1.2, 8);
    const antennaMaterial = new THREE.MeshPhongMaterial({
        color: 0xcccccc,
        shininess: 50
    });
    const antenna = new THREE.Mesh(antennaGeometry, antennaMaterial);
    antenna.position.z = 1.5;
    antenna.rotation.x = Math.PI / 2;
    placeholderGroup.add(antenna);
    
    // Add some details
    const detailGeometry = new THREE.SphereGeometry(0.2, 16, 16);
    const detailMaterial = new THREE.MeshPhongMaterial({
        color: 0xff3333,
        emissive: 0x330000,
        shininess: 80
    });
    
    // Add details to the body
    for (let i = 0; i < 3; i++) {
        const detail = new THREE.Mesh(detailGeometry, detailMaterial);
        const angle = (i / 3) * Math.PI * 2;
        detail.position.set(
            Math.cos(angle) * 0.4,
            Math.sin(angle) * 0.4,
            -0.8
        );
        placeholderGroup.add(detail);
    }
    
    // Scale and position the model
    placeholderGroup.scale.set(0.5, 0.5, 0.5);
    placeholderGroup.position.set(0, 0, 0);
    placeholderGroup.rotation.y = Math.PI / 4;
    
    // Return the model
    return placeholderGroup;
}

// Load 3D models - updated to use asset manifest for discovery and enhanced loader
function loadModels() {
    if (typeof updateDebug === 'function') {
        updateDebug('Loading 3D space models');
    }

    // Check if THREE.GLTFLoader exists or if GLTFLoader is directly available
    let loader;
    if (typeof GLTFLoader !== 'undefined') {
        loader = new GLTFLoader(loadingManager);
    } else if (typeof THREE.GLTFLoader !== 'undefined') {
        loader = new THREE.GLTFLoader(loadingManager);
    } else {
        if (typeof updateDebug === 'function') {
            updateDebug('GLTFLoader not available, creating fallback models', 'warning');
        }
        createFallbackModel();
        createSimpleSpaceObject();
        return;
    }
    
    // Improved load error handling with path checking
    try {
        // Make sure to use the correct paths - check if assets folder exists
        const modelPath = 'assets/models/';
        
        // First try to load from assets/models
        loadSkyboxModel(loader, `${modelPath}deep_space_skybox.glb`);
        loadSatelliteModel(loader, `${modelPath}space_satellite.glb`);
    } catch (e) {
        if (typeof updateDebug === 'function') {
            updateDebug('Error initializing loader: ' + e.message, 'warning');
        }
        
        // Fallback to creating simple models
        createFallbackModel();
        createSimpleSpaceObject();
    }
}

// Helper function to load the skybox model with improved error handling
function loadSkyboxModel(loader, modelPath) {
    if (typeof updateDebug === 'function') {
        updateDebug(`Loading skybox from: ${modelPath}`);
    }
    
    loader.load(modelPath, 
        // Success callback
        function(gltf) {
            if (typeof updateDebug === 'function') {
                updateDebug('Space skybox model loaded successfully');
            }
            
            model = gltf.scene;
            model.scale.set(100, 100, 100);
            scene.add(model);
            
            if (model) {
                initModelAnimation();
                isModelVisible = true;
            }
        }, 
        // Progress callback
        function(xhr) {
            if (xhr.total > 0) {
                const progress = Math.round(xhr.loaded / xhr.total * 100);
                if (typeof updateDebug === 'function') {
                    updateDebug(`Loading skybox: ${progress}%`);
                }
                
                // Update loading screen text
                const loadingText = document.querySelector('.loading-text');
                if (loadingText) {
                    loadingText.textContent = `Loading skybox: ${progress}%`;
                }
            }
        }, 
        // Error callback
        function(error) {
            console.error('Error loading skybox model:', error);
            if (typeof updateDebug === 'function') {
                updateDebug('Error loading space skybox: ' + error.message, 'error');
            }
            
            // Try alternative path as fallback
            if (modelPath.startsWith('assets/')) {
                // Try without assets/ prefix
                const altPath = modelPath.replace('assets/', '');
                if (typeof updateDebug === 'function') {
                    updateDebug(`Trying alternate path: ${altPath}`, 'info');
                }
                loadSkyboxModel(loader, altPath);
            } else {
                // Create fallback model
                createFallbackModel();
            }
        }
    );
}

// Helper function to load the satellite model with improved error handling
function loadSatelliteModel(loader, modelPath) {
    if (typeof updateDebug === 'function') {
        updateDebug(`Loading satellite from: ${modelPath}`);
    }
    
    loader.load(modelPath, 
        // Success callback
        function(gltf) {
            if (typeof updateDebug === 'function') {
                updateDebug('Satellite model loaded successfully');
            }
            
            spaceObject = gltf.scene;
            spaceObject.scale.set(0.5, 0.5, 0.5);
            spaceObject.position.set(0, 0, 0);
            spaceObject.rotation.y = Math.PI / 4;
            scene.add(spaceObject);
            
            // Initialize animations
            if (spaceObject) {
                initSpaceObjectAnimation();
            }
        }, 
        // Progress callback
        function(xhr) {
            if (xhr.total > 0) {
                const progress = Math.round(xhr.loaded / xhr.total * 100);
                if (typeof updateDebug === 'function') {
                    updateDebug(`Loading satellite: ${progress}%`);
                }
                
                // Update loading screen text
                const loadingText = document.querySelector('.loading-text');
                if (loadingText) {
                    loadingText.textContent = `Loading satellite: ${progress}%`;
                }
            }
        }, 
        // Error callback
        function(error) {
            console.error('Error loading satellite model:', error);
            if (typeof updateDebug === 'function') {
                updateDebug('Error loading satellite model: ' + error.message, 'warning');
            }
            
            // Try alternative path as fallback
            if (modelPath.startsWith('assets/')) {
                // Try without assets/ prefix
                const altPath = modelPath.replace('assets/', '');
                if (typeof updateDebug === 'function') {
                    updateDebug(`Trying alternate path: ${altPath}`, 'info');
                }
                loadSatelliteModel(loader, altPath);
            } else {
                // If JSON parsing error, create placeholder model
                if (error.message && (error.message.includes("JSON") || error.message.includes("Unexpected token"))) {
                    if (typeof updateDebug === 'function') {
                        updateDebug('JSON parsing error detected, creating placeholder model', 'warning');
                    }
                    spaceObject = createPlaceholderModelFromJson();
                    scene.add(spaceObject);
                    initSpaceObjectAnimation();
                } 
                // Check if error is related to missing files
                else if (error.message && (error.message.includes("404") || error.message.includes("Not Found"))) {
                    if (typeof updateDebug === 'function') {
                        updateDebug('Model or texture file not found, creating simple satellite', 'warning');
                    }
                    createSimpleSpaceObject();
                }
                // Fallback for any other errors
                else {
                    createSimpleSpaceObject();
                }
            }
        }
    );
}

// Create a simple space object using Three.js geometries
function createSimpleSpaceObject() {
    if (typeof updateDebug === 'function') {
        updateDebug('Creating simple satellite model from primitives');
    }
    
    // Create a group to hold all satellite parts
    spaceObject = new THREE.Group();
    
    // Create materials with different colors - simplified to avoid unsupported properties
    const bodyMaterial = new THREE.MeshPhongMaterial({ 
        color: 0xdddddd,
        shininess: 100,
        specular: 0x111111
    });
    
    const panelMaterial = new THREE.MeshPhongMaterial({ 
        color: 0x2255ff, 
        shininess: 90,
        specular: 0x3366ff
    });
    
    const detailMaterial = new THREE.MeshPhongMaterial({ 
        color: 0x333333, 
        shininess: 50,
        specular: 0x555555
    });
    
    const goldMaterial = new THREE.MeshPhongMaterial({ 
        color: 0xffd700, 
        shininess: 90,
        specular: 0xffaa00
    });
    
    // Satellite body - main part
    const bodyGeometry = new THREE.CylinderGeometry(0.5, 0.5, 1.2, 16);
    const satelliteBody = new THREE.Mesh(bodyGeometry, bodyMaterial);
    satelliteBody.rotation.x = Math.PI / 2;
    spaceObject.add(satelliteBody);
    
    // Solar panels
    const panelGeometry = new THREE.BoxGeometry(3, 1, 0.05);
    
    // Left panel
    const leftPanel = new THREE.Mesh(panelGeometry, panelMaterial);
    leftPanel.position.x = -1.8;
    spaceObject.add(leftPanel);
    
    // Right panel
    const rightPanel = new THREE.Mesh(panelGeometry, panelMaterial);
    rightPanel.position.x = 1.8;
    spaceObject.add(rightPanel);
    
    // Antenna
    const antennaGeometry = new THREE.ConeGeometry(0.15, 0.8, 16);
    const antenna = new THREE.Mesh(antennaGeometry, detailMaterial);
    antenna.position.set(0, 0.8, 0);
    spaceObject.add(antenna);
    
    // Dish
    const dishGeometry = new THREE.SphereGeometry(0.5, 32, 16, 0, Math.PI);
    const dish = new THREE.Mesh(dishGeometry, goldMaterial);
    dish.rotation.x = Math.PI / 2;
    dish.position.set(0, 0, 0.8);
    spaceObject.add(dish);
    
    // Add some small details - sensors, thrusters, etc.
    const smallDetailGeometry = new THREE.BoxGeometry(0.2, 0.2, 0.2);
    
    // Add 4 small details around the body
    for (let i = 0; i < 4; i++) {
        const angle = (i / 4) * Math.PI * 2;
        const detail = new THREE.Mesh(smallDetailGeometry, detailMaterial);
        detail.position.set(
            Math.cos(angle) * 0.6,
            Math.sin(angle) * 0.6,
            0
        );
        spaceObject.add(detail);
    }
    
    // Add some light emitters
    const emitterGeometry = new THREE.SphereGeometry(0.08, 8, 8);
    const emitterMaterial = new THREE.MeshPhongMaterial({ 
        color: 0x00ffff, 
        emissive: 0x00ffff, 
        emissiveIntensity: 0.8,
        specular: 0xffffff
    });
    
    // Add a few emitters
    for (let i = 0; i < 3; i++) {
        const emitter = new THREE.Mesh(emitterGeometry, emitterMaterial);
        emitter.position.set(
            (Math.random() - 0.5) * 0.6,
            (Math.random() - 0.5) * 0.6,
            -0.6
        );
        spaceObject.add(emitter);
    }
    
    // Add the satellite to the scene
    spaceObject.position.set(0, 0, 0);
    spaceObject.rotation.y = Math.PI / 4;
    scene.add(spaceObject);
    
    // Initialize space object animations
    initSpaceObjectAnimation();
}

// Start a subtle idle animation for the model
function startIdleAnimation() {
    if (!model) return;
    
    // Subtle continuous rotation
    gsap.to(model.rotation, {
        y: model.rotation.y + Math.PI * 2, // Full 360 rotation
        duration: 120, // Very slow - 2 minutes per rotation
        ease: "none",
        repeat: -1
    });
}

// Create a more impressive fallback model if the GLB fails to load
function createFallbackModel() {
    if (typeof updateDebug === 'function') {
        updateDebug('Creating fallback skybox model', 'warning');
    }
    
    // Create a simple skybox from a box geometry
    const skyboxGeometry = new THREE.BoxGeometry(1000, 1000, 1000);
    const skyboxMaterials = [];
    
    // Create materials for each face with different colors
    const colors = [0x001133, 0x001144, 0x001155, 0x001166, 0x001177, 0x001188];
    
    for (let i = 0; i < 6; i++) {
        const material = new THREE.MeshBasicMaterial({
            color: colors[i],
            side: THREE.BackSide,
            transparent: true,
            opacity: 0.8
        });
        skyboxMaterials.push(material);
    }
    
    const skybox = new THREE.Mesh(skyboxGeometry, skyboxMaterials);
    scene.add(skybox);
    
    // Add some stars
    addStarsToScene();
    
    if (typeof updateDebug === 'function') {
        updateDebug('Fallback skybox created successfully', 'info');
    }
}

// Create a simple space object (satellite or spaceship)
function createSimpleSpaceObject() {
    if (typeof updateDebug === 'function') {
        updateDebug('Creating fallback space object', 'warning');
    }
    
    // Create a group to hold the satellite parts
    const satellite = new THREE.Group();
    
    // Create the main body
    const bodyGeometry = new THREE.BoxGeometry(2, 1, 1);
    const bodyMaterial = new THREE.MeshPhongMaterial({
        color: 0xaaaaaa,
        specular: 0x111111,
        shininess: 100
    });
    const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
    satellite.add(body);
    
    // Create solar panels
    const panelGeometry = new THREE.BoxGeometry(3, 0.1, 1);
    const panelMaterial = new THREE.MeshPhongMaterial({
        color: 0x0066ff,
        specular: 0x222222,
        shininess: 100
    });
    
    // Left panel
    const leftPanel = new THREE.Mesh(panelGeometry, panelMaterial);
    leftPanel.position.x = -2.5;
    satellite.add(leftPanel);
    
    // Right panel
    const rightPanel = new THREE.Mesh(panelGeometry, panelMaterial);
    rightPanel.position.x = 2.5;
    satellite.add(rightPanel);
    
    // Add satellite to scene
    satellite.position.set(0, 0, -20);
    scene.add(satellite);
    
    // Add animation for the satellite
    const satelliteAnimation = () => {
        satellite.rotation.y += 0.005;
        requestAnimationFrame(satelliteAnimation);
    };
    satelliteAnimation();
    
    if (typeof updateDebug === 'function') {
        updateDebug('Fallback space object created successfully', 'info');
    }
}

// Add stars to the scene
function addStarsToScene() {
    if (typeof updateDebug === 'function') {
        updateDebug('Adding stars to scene');
    }
    
    const starsGeometry = new THREE.BufferGeometry();
    const starsMaterial = new THREE.PointsMaterial({
        color: 0xffffff,
        size: 1,
        sizeAttenuation: false
    });
    
    const starsVertices = [];
    for (let i = 0; i < 5000; i++) {
        const x = Math.random() * 2000 - 1000;
        const y = Math.random() * 2000 - 1000;
        const z = Math.random() * 2000 - 1000;
        starsVertices.push(x, y, z);
    }
    
    starsGeometry.setAttribute('position', new THREE.Float32BufferAttribute(starsVertices, 3));
    const stars = new THREE.Points(starsGeometry, starsMaterial);
    scene.add(stars);
    
    if (typeof updateDebug === 'function') {
        updateDebug('Stars added to scene');
    }
}

// Handle window resize
function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

// Animation loop - updated for smooth 360 view
function animate() {
    const delta = clock.getDelta();
    
    // Update controls
    if (controls) controls.update();
    
    // Update any mixers (animations)
    if (mixer) mixer.update(delta);
    
    // Smoothly interpolate model rotation if not dragging
    if (model && !isDragging && !isScrolling) {
        // Apply very gentle inertia if the model was recently dragged
        if (Math.abs(model.rotation.y - targetRotation.y) > 0.001) {
            model.rotation.y += (targetRotation.y - model.rotation.y) * 0.1;
        }
        if (Math.abs(model.rotation.x - targetRotation.x) > 0.001) {
            model.rotation.x += (targetRotation.x - model.rotation.x) * 0.1;
        }
    }
    
    // Animate background particles
    if (scene.userData.backgroundParticles) {
        scene.userData.backgroundParticles.rotation.y += 0.0005;
        scene.userData.backgroundParticles.rotation.x += 0.0002;
    }
    
    // Animate fallback model if it's the custom group
    if (model && model.isGroup) {
        model.rotation.y += 0.001;
        
        // Animate the orbiting spheres
        model.children.forEach(child => {
            if (child.geometry && child.geometry.type === 'SphereGeometry') {
                if (child.userData.angle !== undefined) {
                    child.userData.angle += 0.01;
                    child.position.x = Math.cos(child.userData.angle) * child.userData.radius;
                    child.position.z = Math.sin(child.userData.angle) * child.userData.radius;
                    child.position.y = Math.sin(child.userData.angle * 2) * 0.5;
                }
            }
        });
    }
    
    // Look at target (for smoother camera movement)
    if (cameraTarget) camera.lookAt(cameraTarget);
    
    // Render
    renderer.render(scene, camera);
    
    // Call animation loop again
    if (!renderer.xr.isPresenting) {
        requestAnimationFrame(animate);
    }
}

// Initialize interactive controls - modified to handle 360 view
function initControls() {
    if (typeof updateDebug === 'function') updateDebug("Setting up interactive controls");
    
    // Rotate left button
    const rotateLeftBtn = document.getElementById('rotate-left');
    if (rotateLeftBtn) {
        rotateLeftBtn.addEventListener('click', function() {
            if (typeof updateDebug === 'function') updateDebug("⚡ Rotate left clicked");
            if (model) {
                // Add visual feedback
                this.classList.add('active-btn');
                setTimeout(() => this.classList.remove('active-btn'), 300);
                
                // Smooth rotation with GSAP
                gsap.to(model.rotation, {
                    y: model.rotation.y - Math.PI / 2,
                    duration: 1,
                    ease: 'power2.inOut'
                });
                
                // Update current rotation for mouse interaction
                setTimeout(() => {
                    currentRotation.y = model.rotation.y;
                    targetRotation.y = currentRotation.y;
                }, 1000);
            } else {
                if (typeof updateDebug === 'function') updateDebug("ERROR: No model to rotate");
            }
        });
    } else {
        if (typeof updateDebug === 'function') updateDebug("WARNING: Rotate left button not found");
    }
    
    // Rotate right button
    const rotateRightBtn = document.getElementById('rotate-right');
    if (rotateRightBtn) {
        rotateRightBtn.addEventListener('click', function() {
            if (typeof updateDebug === 'function') updateDebug("⚡ Rotate right clicked");
            if (model) {
                // Add visual feedback
                this.classList.add('active-btn');
                setTimeout(() => this.classList.remove('active-btn'), 300);
                
                // Smooth rotation with GSAP
                gsap.to(model.rotation, {
                    y: model.rotation.y + Math.PI / 2,
                    duration: 1,
                    ease: 'power2.inOut'
                });
                
                // Update current rotation for mouse interaction
                setTimeout(() => {
                    currentRotation.y = model.rotation.y;
                    targetRotation.y = currentRotation.y;
                }, 1000);
            } else {
                if (typeof updateDebug === 'function') updateDebug("ERROR: No model to rotate");
            }
        });
    } else {
        if (typeof updateDebug === 'function') updateDebug("WARNING: Rotate right button not found");
    }
    
    // Zoom in button
    const zoomInBtn = document.getElementById('zoom-in');
    if (zoomInBtn) {
        zoomInBtn.addEventListener('click', function() {
            if (typeof updateDebug === 'function') updateDebug("⚡ Zoom in clicked");
            if (camera && controls) {
                // Add visual feedback
                this.classList.add('active-btn');
                setTimeout(() => this.classList.remove('active-btn'), 300);
                
                gsap.to(camera.position, {
                    z: Math.max(camera.position.z - 1, controls.minDistance || 1),
                    duration: 0.5,
                    ease: 'power2.inOut',
                    onUpdate: () => controls.update()
                });
            } else {
                if (typeof updateDebug === 'function') updateDebug("ERROR: No camera/controls for zoom");
            }
        });
    } else {
        if (typeof updateDebug === 'function') updateDebug("WARNING: Zoom in button not found");
    }
    
    // Zoom out button
    const zoomOutBtn = document.getElementById('zoom-out');
    if (zoomOutBtn) {
        zoomOutBtn.addEventListener('click', function() {
            if (typeof updateDebug === 'function') updateDebug("⚡ Zoom out clicked");
            if (camera && controls) {
                // Add visual feedback
                this.classList.add('active-btn');
                setTimeout(() => this.classList.remove('active-btn'), 300);
                
                gsap.to(camera.position, {
                    z: Math.min(camera.position.z + 1, controls.maxDistance || 10),
                    duration: 0.5,
                    ease: 'power2.inOut',
                    onUpdate: () => controls.update()
                });
            } else {
                if (typeof updateDebug === 'function') updateDebug("ERROR: No camera/controls for zoom");
            }
        });
    } else {
        if (typeof updateDebug === 'function') updateDebug("WARNING: Zoom out button not found");
    }
    
    // Add a reset view button
    createResetViewButton();
    
    if (typeof updateDebug === 'function') updateDebug("Control event listeners attached");
}

// Create a reset view button
function createResetViewButton() {
    // Check if button already exists
    if (document.getElementById('reset-view')) return;
    
    const controlsContainer = document.querySelector('.interactive-controls');
    if (!controlsContainer) return;
    
    const resetBtn = document.createElement('button');
    resetBtn.id = 'reset-view';
    resetBtn.className = 'control-btn';
    resetBtn.innerHTML = '<span>↻</span>';
    resetBtn.title = 'Reset View';
    
    resetBtn.addEventListener('click', function() {
        if (typeof updateDebug === 'function') updateDebug("⚡ Reset view clicked");
        
        // Add visual feedback
        this.classList.add('active-btn');
        setTimeout(() => this.classList.remove('active-btn'), 300);
        
        if (model) {
            // Reset model rotation
            gsap.to(model.rotation, {
                x: 0,
                y: 0,
                z: 0,
                duration: 1,
                ease: 'power2.inOut'
            });
            
            currentRotation.x = 0;
            currentRotation.y = 0;
            targetRotation.x = 0;
            targetRotation.y = 0;
        }
        
        if (camera && controls) {
            // Reset camera position
            gsap.to(camera.position, {
                x: 0,
                y: 0,
                z: 8,
                duration: 1,
                ease: 'power2.inOut',
                onUpdate: () => controls.update()
            });
            
            // Reset controls target
            gsap.to(controls.target, {
                x: 0,
                y: 0,
                z: 0,
                duration: 1,
                ease: 'power2.inOut',
                onUpdate: () => controls.update()
            });
        }
    });
    
    // Insert after zoom out button
    controlsContainer.appendChild(resetBtn);
    
    if (typeof updateDebug === 'function') updateDebug("Added reset view button");
}

// Set up 360 degree interaction for the canvas
function initFullViewInteraction(container) {
    if (typeof updateDebug === 'function') updateDebug("Setting up 360° mouse view interaction");
    
    // Mouse/touch interaction for desktop and mobile
    container.style.cursor = 'grab';
    
    // Mouse down event
    container.addEventListener('mousedown', (e) => {
        if (typeof updateDebug === 'function') updateDebug("Mouse down - starting 360° view");
        isDragging = true;
        container.style.cursor = 'grabbing';
        initialMousePosition.x = e.clientX;
        initialMousePosition.y = e.clientY;
        
        // Store current model rotation
        if (model) {
            currentRotation.x = model.rotation.x;
            currentRotation.y = model.rotation.y;
        }
        
        // Disable controls temporarily
        if (controls) controls.enabled = false;
    });
    
    // Mouse move event
    window.addEventListener('mousemove', (e) => {
        if (!isDragging) return;
        
        const deltaX = (e.clientX - initialMousePosition.x) * 0.01;
        const deltaY = (e.clientY - initialMousePosition.y) * 0.01;
        
        targetRotation.y = currentRotation.y + deltaX;
        targetRotation.x = currentRotation.x + deltaY;
        
        // Apply rotation directly to model for smoother immediate feedback
        if (model) {
            model.rotation.y = targetRotation.y;
            model.rotation.x = targetRotation.x;
        }
    });
    
    // Mouse up event
    window.addEventListener('mouseup', () => {
        if (isDragging) {
            if (typeof updateDebug === 'function') updateDebug("Mouse up - ending 360° view");
            isDragging = false;
            container.style.cursor = 'grab';
            
            // Re-enable controls
            if (controls) controls.enabled = true;
        }
    });
    
    // Mouse leave event
    container.addEventListener('mouseleave', () => {
        if (isDragging) {
            if (typeof updateDebug === 'function') updateDebug("Mouse left canvas - ending 360° view");
            isDragging = false;
            container.style.cursor = 'grab';
            
            // Re-enable controls
            if (controls) controls.enabled = true;
        }
    });
    
    // Touch events for mobile
    container.addEventListener('touchstart', (e) => {
        if (e.touches.length === 1) {
            if (typeof updateDebug === 'function') updateDebug("Touch start - starting 360° view");
            isDragging = true;
            initialMousePosition.x = e.touches[0].clientX;
            initialMousePosition.y = e.touches[0].clientY;
            
            // Store current model rotation
            if (model) {
                currentRotation.x = model.rotation.x;
                currentRotation.y = model.rotation.y;
            }
            
            // Disable controls temporarily
            if (controls) controls.enabled = false;
        }
    });
    
    container.addEventListener('touchmove', (e) => {
        if (!isDragging || e.touches.length !== 1) return;
        
        const deltaX = (e.touches[0].clientX - initialMousePosition.x) * 0.01;
        const deltaY = (e.touches[0].clientY - initialMousePosition.y) * 0.01;
        
        targetRotation.y = currentRotation.y + deltaX;
        targetRotation.x = currentRotation.x + deltaY;
        
        // Apply rotation directly to model for smoother immediate feedback
        if (model) {
            model.rotation.y = targetRotation.y;
            model.rotation.x = targetRotation.x;
        }
        
        // Prevent page scrolling
        e.preventDefault();
    });
    
    container.addEventListener('touchend', () => {
        if (isDragging) {
            if (typeof updateDebug === 'function') updateDebug("Touch end - ending 360° view");
            isDragging = false;
            
            // Re-enable controls
            if (controls) controls.enabled = true;
        }
    });
}

// Initialize model animation based on scroll
function initModelAnimation(model, camera) {
    if (typeof updateDebug === 'function') updateDebug("Setting up scroll-based model animation");
    
    // Make sure model is valid
    if (!model) {
        if (typeof updateDebug === 'function') updateDebug("ERROR: No model available for animation");
        return;
    }
    
    // Create a timeline for the 3D model animation
    try {
        const modelTimeline = gsap.timeline({
            scrollTrigger: {
                trigger: ".animation-section",
                start: "top 80%", // Start earlier to ensure trigger
                end: "bottom top",
                scrub: 0.5,
                pin: false, // Changed to false to prevent overlap with our custom section transitions
                markers: false, // Set to false to remove debug markers in production
                onEnter: () => {
                    if (typeof updateDebug === 'function') updateDebug("⚡ Entering model animation section");
                    // Disable orbit controls during animation
                    if (controls) controls.enabled = false;
                },
                onLeave: () => {
                    if (typeof updateDebug === 'function') updateDebug("⚡ Leaving model animation section");
                    // Enable orbit controls after animation
                    if (controls) controls.enabled = true;
                }
            }
        });
        
        // Ensure the model is visible
        if (model.visible === false) model.visible = true;
        
        // More complex model animation
        modelTimeline.to(model.rotation, {
            y: Math.PI * 2, // Full 360-degree rotation
            duration: 1,
            ease: "power1.inOut"
        }, 0);
        
        modelTimeline.to(model.scale, {
            x: 1.5,
            y: 1.5,
            z: 1.5,
            duration: 0.5,
            ease: "power1.inOut"
        }, 0.3);
        
        modelTimeline.to(model.scale, {
            x: 1,
            y: 1,
            z: 1,
            duration: 0.5,
            ease: "power1.inOut"
        }, 0.8);
        
        // Camera movement path
        if (camera) {
            modelTimeline.to(camera.position, {
                x: 3,
                y: 1,
                z: 4,
                duration: 0.3,
                ease: "power1.inOut"
            }, 0);
            
            modelTimeline.to(camera.position, {
                x: -2,
                y: 0.5,
                z: 3,
                duration: 0.3,
                ease: "power1.inOut"
            }, 0.3);
            
            modelTimeline.to(camera.position, {
                x: 0,
                y: 0,
                z: 5,
                duration: 0.4,
                ease: "power1.inOut"
            }, 0.6);
        }
        
        // Target for camera to look at
        if (cameraTarget) {
            modelTimeline.to(cameraTarget, {
                x: 0,
                y: 0,
                z: 0,
                duration: 1,
                ease: "none"
            }, 0);
        }
        
        // Refresh ScrollTrigger to ensure it works
        ScrollTrigger.refresh();
        if (typeof updateDebug === 'function') updateDebug("Model animation setup complete");
    } catch (e) {
        console.error("Error setting up model animation:", e);
        if (typeof updateDebug === 'function') updateDebug("ERROR: Model animation setup failed: " + e.message);
        
        // Attempt to create a simpler animation as fallback
        try {
            if (model && typeof gsap !== 'undefined') {
                // Simple rotation animation as fallback
                gsap.to(model.rotation, {
                    y: Math.PI * 2,
                    duration: 20,
                    repeat: -1,
                    ease: "none"
                });
                
                if (typeof updateDebug === 'function') updateDebug("Created fallback simple rotation animation");
            }
        } catch (fallbackError) {
            console.error("Even fallback animation failed:", fallbackError);
        }
    }
}

// Initialize scroll animations for HTML elements
function initAnimations() {
    console.log("Setting up UI animations");
    
    // Loading animation
    gsap.set('.loading-screen', { autoAlpha: 1 });
    
    // Initial sequence - fade out logo and text, zoom background
    const introTimeline = gsap.timeline({
        scrollTrigger: {
            trigger: ".intro-section",
            start: "top top",
            end: "bottom top",
            scrub: true,
            markers: false // Remove debug markers in production
        }
    });
    
    introTimeline.to(".initial-logo", {
        opacity: 0,
        y: -50,
        scale: 0.8,
        duration: 0.3
    }, 0);
    
    introTimeline.to(".intro-text", {
        opacity: 0,
        y: -50,
        duration: 0.3
    }, 0);
    
    introTimeline.to(".scroll-indicator", {
        opacity: 0,
        y: 20,
        duration: 0.2
    }, 0);
    
    introTimeline.to(".background-image", {
        scale: 1,
        duration: 1,
        ease: "power2.out"
    }, 0);
    
    // SVG mask animation - more dramatic effect
    const maskTimeline = gsap.timeline({
        scrollTrigger: {
            trigger: ".animation-section",
            start: "top 90%",
            end: "center center",
            scrub: 0.5,
            markers: false // Remove debug markers in production
        }
    });
    
    // Start with extremely large scale
    gsap.set(".logo-svg", { scale: 350, opacity: 0 });
    
    maskTimeline.to(".logo-svg", {
        scale: 1,
        opacity: 1,
        duration: 1,
        ease: "power2.inOut"
    });
    
    // Text reveal with gradient
    const textTimeline = gsap.timeline({
        scrollTrigger: {
            trigger: ".animation-section",
            start: "30% center",
            end: "70% center",
            scrub: 0.5,
            markers: false // Remove debug markers in production
        }
    });
    
    textTimeline.to(".overlay-copy", {
        opacity: 1,
        y: -30,
        duration: 0.5
    });
    
    textTimeline.from(".overlay-copy h2", {
        backgroundSize: "100% 0",
        backgroundPosition: "0 100%",
        y: 50,
        duration: 0.5
    }, 0);
    
    // Content section reveal
    gsap.from(".content-section .container", {
        opacity: 0,
        y: 50,
        duration: 1,
        ease: "power2.out",
        scrollTrigger: {
            trigger: ".content-section",
            start: "top 80%",
            end: "center 80%",
            scrub: 0.3,
            markers: false // Remove debug markers in production
        }
    });
    
    // Reveal the CTA button with a flash
    gsap.from(".cta-button", {
        opacity: 0,
        scale: 0.5,
        duration: 0.5,
        ease: "back.out(1.7)",
        scrollTrigger: {
            trigger: ".content-section",
            start: "30% center",
            toggleActions: "play none none reverse",
            markers: false // Remove debug markers
        }
    });
    
    // Refresh ScrollTrigger to ensure everything works
    ScrollTrigger.refresh();
}

// Set initial states for animation
window.addEventListener('load', () => {
    console.log("Window loaded");
    
    // Set initial scale for background image (zoomed in)
    gsap.set(".background-image", { scale: 1.5 });
    
    // Show controls after a delay
    gsap.from(".interactive-controls", {
        opacity: 0,
        x: 50,
        stagger: 0.1,
        duration: 0.5,
        delay: 2,
        ease: "power2.out"
    });
    
    // Make sure ScrollTrigger is refreshed after everything is loaded
    ScrollTrigger.refresh();
});

// Add the goToSection function to allow direct navigation to a specific section
function goToSection(targetSectionIndex) {
    if (targetSectionIndex === currentSection || isScrolling) return;
    
    if (typeof updateDebug === 'function') updateDebug(`Navigating directly to section ${targetSectionIndex}`);
    
    if (targetSectionIndex > currentSection) {
        // Going forward
        while (currentSection < targetSectionIndex) {
            // We need to animate through each section
            goToNextSection(targetSectionIndex === currentSection + 1 ? 1.2 : 0.6); // Faster if skipping sections
        }
    } else {
        // Going backward
        while (currentSection > targetSectionIndex) {
            // We need to animate through each section
            goToPrevSection(targetSectionIndex === currentSection - 1 ? 1.2 : 0.6); // Faster if skipping sections
        }
    }
}

// Add function to update progress indicators
function updateProgressIndicators(fromIndex, toIndex) {
    // Update progress indicators
    const progressItems = document.querySelectorAll('.progress-item');
    if (progressItems.length === 0) return;
    
    // Update active class
    progressItems.forEach((item, index) => {
        if (index === toIndex) {
            item.classList.add('active');
            // Make active indicator wider
            gsap.to(item, {
                width: '8px',
                duration: 0.3,
                ease: 'power2.out'
            });
        } else {
            item.classList.remove('active');
            // Reset inactive indicators
            gsap.to(item, {
                width: '5px',
                duration: 0.3,
                ease: 'power2.out'
            });
        }
    });
    
    // Update fill height with GTA 6-style animations
    progressItems.forEach((item, index) => {
        const fill = item.querySelector('.progress-fill');
        if (!fill) return;
        
        if (index < toIndex) {
            // Sections before current are 100% filled
            gsap.to(fill, {
                height: '100%',
                duration: 0.5,
                ease: 'power2.out'
            });
        } else if (index === toIndex) {
            // Current section filled with animation
            gsap.to(fill, {
                height: '100%',
                duration: 0.8,
                ease: 'power2.inOut'
            });
        } else {
            // Future sections are empty
            gsap.to(fill, {
                height: '0%',
                duration: 0.3,
                ease: 'power2.inOut'
            });
        }
    });
    
    // Also update section navigation buttons
    const navButtons = document.querySelectorAll('.section-nav-btn');
    navButtons.forEach((btn, index) => {
        if (index === toIndex) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });
}

// Initialize space object animation timeline
function initSpaceObjectAnimation() {
    if (typeof updateDebug === 'function') {
        updateDebug('Initializing space object animations');
    }
    
    if (typeof gsap === 'undefined') {
        if (typeof updateDebug === 'function') {
            updateDebug('GSAP not available for space object animations', 'error');
        }
        return;
    }
    
    if (!spaceObject) {
        if (typeof updateDebug === 'function') {
            updateDebug('No space object available for animation', 'warning');
        }
        return;
    }
    
    try {
        // Create a subtle idle animation for the space object
        spaceObjectTimeline = gsap.timeline({repeat: -1, yoyo: true});
        
        spaceObjectTimeline
            .to(spaceObject.position, {
                y: 0.2,
                duration: 3,
                ease: "sine.inOut"
            })
            .to(spaceObject.rotation, {
                z: 0.05,
                duration: 2,
                ease: "sine.inOut"
            }, 0);
        
        // Add a scroll-based animation that updates the space object's display based on the current section
        gsap.timeline({
            scrollTrigger: {
                trigger: 'body',
                start: 'top top',
                end: 'bottom bottom',
                scrub: 1,
                markers: false,
                onUpdate: function(self) {
                    // Calculate which section we're in based on scroll progress
                    const sectionIndex = Math.floor(self.progress * totalSections);
                    
                    // Change space object display based on section
                    if (spaceObject) {
                        // Make the space object prominent in section 1 (index 0)
                        if (sectionIndex === 0) {
                            gsap.to(spaceObject.position, {
                                z: 0,
                                x: 0,
                                y: 0,
                                duration: 1,
                                ease: "power2.out"
                            });
                            gsap.to(spaceObject.rotation, {
                                y: Math.PI / 4,
                                duration: 1
                            });
                        } 
                        // Move the space object to orbit in section 2 (index 1)
                        else if (sectionIndex === 1) {
                            gsap.to(spaceObject.position, {
                                x: 2,
                                y: 0.5,
                                z: -1,
                                duration: 1,
                                ease: "power2.out"
                            });
                            gsap.to(spaceObject.rotation, {
                                y: Math.PI / 2 + Math.PI / 4,
                                duration: 1
                            });
                        }
                        // Show the space object from a different angle in section 3 (index 2)
                        else if (sectionIndex === 2) {
                            gsap.to(spaceObject.position, {
                                x: -2,
                                y: 0,
                                z: -1,
                                duration: 1,
                                ease: "power2.out"
                            });
                            gsap.to(spaceObject.rotation, {
                                y: -Math.PI / 4,
                                duration: 1
                            });
                        }
                    }
                }
            }
        });
        
        if (typeof updateDebug === 'function') {
            updateDebug('Space object animations initialized successfully');
        }
    } catch (e) {
        console.error("Error setting up space object animations:", e);
        if (typeof updateDebug === 'function') {
            updateDebug('Failed to initialize space animations: ' + e.message, 'error');
        }
    }
}

// Update scroll functionality to affect the space object
function updateScroll() {
    // Get scroll position
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrollPercent = scrollTop / docHeight;
    
    // Subtly rotate model based on scroll progress
    if (spaceObject) {
        // Apply a subtle rotation based on scroll
        spaceObject.rotation.y = Math.PI / 4 + (scrollPercent * Math.PI / 2);
    }
}

// Add glitch effect to text elements for a more high-tech space look
function addGlitchEffect() {
    // Add glitch CSS
    const style = document.createElement('style');
    style.textContent = `
        .glitch {
            position: relative;
        }
        
        .glitch::before,
        .glitch::after {
            content: attr(data-text);
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            opacity: 0.8;
        }
        
        .glitch::before {
            animation: glitch-effect 3s infinite;
            clip-path: polygon(0 0, 100% 0, 100% 45%, 0 45%);
            text-shadow: -2px 0 #00e6ff;
            /* webkit prefix for compatibility */
            -webkit-clip-path: polygon(0 0, 100% 0, 100% 45%, 0 45%);
        }
        
        .glitch::after {
            animation: glitch-effect 2s infinite reverse;
            clip-path: polygon(0 55%, 100% 55%, 100% 100%, 0 100%);
            text-shadow: 2px 0 #ff3e6b;
            /* webkit prefix for compatibility */
            -webkit-clip-path: polygon(0 55%, 100% 55%, 100% 100%, 0 100%);
        }
        
        @keyframes glitch-effect {
            0% {
                transform: translateX(0);
            }
            25% {
                transform: translateX(-5px);
            }
            50% {
                transform: translateX(5px);
            }
            75% {
                transform: translateX(-2px);
            }
            100% {
                transform: translateX(0);
            }
        }
    `;
    document.head.appendChild(style);
    
    // Apply glitch to section titles
    const sectionTitles = document.querySelectorAll('.section-title');
    sectionTitles.forEach(title => {
        title.classList.add('glitch');
        title.setAttribute('data-text', title.textContent);
    });
    
    // Apply to main titles with randomized effect
    const h2Elements = document.querySelectorAll('h2');
    h2Elements.forEach(h2 => {
        // Only 50% chance to add glitch for variety
        if (Math.random() > 0.5) {
            h2.classList.add('glitch');
            h2.setAttribute('data-text', h2.textContent);
        }
    });
}

// Enhanced mouse parallax effect
function addMouseParallaxEffect() {
  if (typeof updateDebug === 'function') updateDebug("Setting up mouse parallax effect");
  
  const container = document.getElementById('canvas-container');
  if (!container) return;
  
  let mouseX = 0;
  let mouseY = 0;
  let targetX = 0;
  let targetY = 0;
  const windowHalfX = window.innerWidth / 2;
  const windowHalfY = window.innerHeight / 2;
  
  // Track mouse position
  document.addEventListener('mousemove', (event) => {
    mouseX = (event.clientX - windowHalfX) / 100;
    mouseY = (event.clientY - windowHalfY) / 100;
  });
  
  // Apply subtle movement to objects based on mouse position
  function updateParallaxEffect() {
    // Smooth transition
    targetX += (mouseX - targetX) * 0.05;
    targetY += (mouseY - targetY) * 0.05;
    
    // Apply to model if it exists
    if (model && !isDragging && !isScrolling) {
      model.rotation.y += (targetX * 0.01 - model.rotation.y) * 0.01;
      model.rotation.x += (targetY * 0.01 - model.rotation.x) * 0.01;
    }
    
    // Apply to background stars if they exist
    if (scene && scene.userData.backgroundParticles) {
      scene.userData.backgroundParticles.rotation.y += targetX * 0.0001;
      scene.userData.backgroundParticles.rotation.x += targetY * 0.0001;
    }
    
    // Apply to camera for subtle movement
    if (camera && !isDragging && !controls.enabled) {
      camera.position.x += (targetX * 0.05 - camera.position.x) * 0.01;
      camera.position.y += (-targetY * 0.05 - camera.position.y) * 0.01;
      camera.lookAt(cameraTarget);
    }
    
    requestAnimationFrame(updateParallaxEffect);
  }
  
  // Start the effect
  updateParallaxEffect();
  
  if (typeof updateDebug === 'function') updateDebug("Mouse parallax effect initialized");
}

// Add cursor effects that follow mouse movement
function addCursorEffects() {
  if (typeof updateDebug === 'function') updateDebug("Setting up cursor effects");
  
  // Create cursor follower element
  const cursorFollower = document.createElement('div');
  cursorFollower.className = 'cursor-follower';
  document.body.appendChild(cursorFollower);
  
  // Create cursor dot
  const cursorDot = document.createElement('div');
  cursorDot.className = 'cursor-dot';
  document.body.appendChild(cursorDot);
  
  // Set initial positions off-screen
  gsap.set(cursorFollower, { xPercent: -50, yPercent: -50, opacity: 0 });
  gsap.set(cursorDot, { xPercent: -50, yPercent: -50 });
  
  // Variables for cursor positions
  let mouseX = window.innerWidth / 2;
  let mouseY = window.innerHeight / 2;
  let followerX = window.innerWidth / 2;
  let followerY = window.innerHeight / 2;
  
  // Track mouse position
  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    
    // Show cursor elements when mouse moves
    gsap.to(cursorFollower, { opacity: 0.4, duration: 0.3 });
    gsap.to(cursorDot, { opacity: 1, duration: 0.3 });
  });
  
  // Handle interactive elements
  const interactiveElements = document.querySelectorAll('button, a, .control-btn, .section-nav-btn, .scroll-indicator');
  interactiveElements.forEach(el => {
    el.addEventListener('mouseenter', () => {
      cursorFollower.classList.add('cursor-active');
      cursorDot.classList.add('cursor-active');
    });
    
    el.addEventListener('mouseleave', () => {
      cursorFollower.classList.remove('cursor-active');
      cursorDot.classList.remove('cursor-active');
    });
  });
  
  // Hide cursor when mouse leaves window
  document.addEventListener('mouseleave', () => {
    gsap.to(cursorFollower, { opacity: 0, duration: 0.3 });
    gsap.to(cursorDot, { opacity: 0, duration: 0.3 });
  });
  
  // Update cursor position in animation loop
  function updateCursorPosition() {
    // Smooth follower movement with lag
    followerX += (mouseX - followerX) * 0.1;
    followerY += (mouseY - followerY) * 0.1;
    
    // Apply positions
    gsap.set(cursorDot, { x: mouseX, y: mouseY });
    gsap.set(cursorFollower, { x: followerX, y: followerY });
    
    requestAnimationFrame(updateCursorPosition);
  }
  
  updateCursorPosition();
  if (typeof updateDebug === 'function') updateDebug("Cursor effects initialized");
}

// Add hover effects for interactive elements
function addInteractiveHoverEffects() {
  if (typeof updateDebug === 'function') updateDebug("Setting up interactive hover effects");
  
  // Add hover effects to buttons
  const buttons = document.querySelectorAll('.control-btn, .cta-button a, .section-nav-btn');
  buttons.forEach(button => {
    button.addEventListener('mouseenter', () => {
      // Scale up slightly
      gsap.to(button, { 
        scale: 1.1, 
        duration: 0.3, 
        ease: "back.out(1.7)" 
      });
      
      // Add subtle glow effect
      if (!button.querySelector('.btn-glow')) {
        const glow = document.createElement('div');
        glow.className = 'btn-glow';
        button.appendChild(glow);
        
        gsap.fromTo(glow, 
          { opacity: 0, scale: 0.8 },
          { opacity: 0.7, scale: 1.4, duration: 0.6, repeat: -1, yoyo: true }
        );
      }
    });
    
    button.addEventListener('mouseleave', () => {
      // Return to normal size
      gsap.to(button, { 
        scale: 1, 
        duration: 0.3 
      });
      
      // Remove glow
      const glow = button.querySelector('.btn-glow');
      if (glow) {
        gsap.to(glow, { 
          opacity: 0, 
          duration: 0.3,
          onComplete: () => glow.remove()
        });
      }
    });
  });
  
  // Add interaction effects to the scroll indicator
  const scrollIndicator = document.querySelector('.scroll-indicator');
  if (scrollIndicator) {
    scrollIndicator.addEventListener('mouseenter', () => {
      gsap.to(scrollIndicator, { 
        scale: 1.1, 
        duration: 0.3 
      });
      
      // Add subtle animation to arrow
      const arrow = scrollIndicator.querySelector('.scroll-arrow');
      if (arrow) {
        gsap.to(arrow, { 
          y: 8, 
          duration: 0.5, 
          repeat: -1, 
          yoyo: true 
        });
      }
    });
    
    scrollIndicator.addEventListener('mouseleave', () => {
      gsap.to(scrollIndicator, { 
        scale: 1, 
        duration: 0.3
      });
      
      // Reset arrow animation
      const arrow = scrollIndicator.querySelector('.scroll-arrow');
      if (arrow) {
        gsap.killTweensOf(arrow);
        gsap.to(arrow, { y: 0, duration: 0.3 });
      }
    });
  }
  
  if (typeof updateDebug === 'function') updateDebug("Interactive hover effects initialized");
}

// Initialize all the interactive features
function initInteractiveFeatures() {
  addMouseParallaxEffect();
  addCursorEffects();
  addInteractiveHoverEffects();
}

// Debug functions
let debugOverlay = null;

function initDebugOverlay() {
    // Create debug overlay if it doesn't exist
    if (!debugOverlay) {
        debugOverlay = document.createElement('div');
        debugOverlay.className = 'debug-overlay';
        document.body.appendChild(debugOverlay);
        updateDebug('Debug overlay initialized');
    }
}

function updateDebug(message, type = 'info') {
    // Create debug overlay if it doesn't exist
    if (!debugOverlay) {
        initDebugOverlay();
    }
    
    // Create message element
    const msgElement = document.createElement('div');
    msgElement.className = `debug-msg debug-${type}`;
    msgElement.textContent = `[${new Date().toLocaleTimeString()}] ${message}`;
    
    // Add to overlay
    debugOverlay.appendChild(msgElement);
    
    // Trim old messages if too many
    while (debugOverlay.children.length > 20) {
        debugOverlay.removeChild(debugOverlay.firstChild);
    }
    
    // Scroll to bottom
    debugOverlay.scrollTop = debugOverlay.scrollHeight;
    
    // Log to console as well
    console.log(`[DEBUG:${type}] ${message}`);
}

// Show debug info on page load
window.addEventListener('load', function() {
    initDebugOverlay();
    updateDebug('Page loaded. Initializing 3D scene...');
});

// Add click listeners to progress indicator items
function initProgressIndicators() {
    const progressItems = document.querySelectorAll('.progress-item');
    
    if (progressItems.length > 0) {
        if (typeof updateDebug === 'function') updateDebug("Setting up GTA-style progress indicators");
        
        progressItems.forEach((item) => {
            item.addEventListener('click', function() {
                const sectionIndex = parseInt(this.getAttribute('data-section'));
                if (typeof updateDebug === 'function') {
                    updateDebug(`Progress indicator clicked: navigating to section ${sectionIndex}`);
                }
                
                // Navigate to the section
                goToSection(sectionIndex);
            });
            
            // Add hover effect
            item.addEventListener('mouseenter', function() {
                if (!this.classList.contains('active')) {
                    gsap.to(this, {
                        width: '8px',
                        duration: 0.3,
                        ease: 'power2.out'
                    });
                }
            });
            
            item.addEventListener('mouseleave', function() {
                if (!this.classList.contains('active')) {
                    gsap.to(this, {
                        width: '5px',
                        duration: 0.3,
                        ease: 'power2.out'
                    });
                }
            });
        });
    } else {
        if (typeof updateDebug === 'function') updateDebug("Warning: No progress indicators found", "warning");
    }
}