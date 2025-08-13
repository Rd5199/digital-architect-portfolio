/**
 * GLTF Helper for Cosmic Web Development
 * Helps with loading and managing 3D models
 */

const GLTFHelper = (function() {
    // Private variables
    const DEFAULT_MODEL_PATH = 'assets/models/';
    const DEFAULT_TEXTURE_PATH = 'assets/textures/';
    
    // Model/asset catalog
    const modelCatalog = {
        'space_skybox': 'deep_space_skybox.glb',
        'satellite': 'space_satellite.glb',
        'rover': 'mars_rover.glb',
        'spaceship': 'spaceship.glb',
        'station': 'space_station.glb'
    };
    
    /**
     * Check if a file exists by sending a HEAD request
     */
    async function fileExists(url) {
        try {
            const response = await fetch(url, { method: 'HEAD' });
            return response.ok;
        } catch (error) {
            return false;
        }
    }
    
    /**
     * Find a model file in various possible locations
     */
    async function findModelFile(filename) {
        // Try possible paths in order of likelihood
        const possiblePaths = [
            `${DEFAULT_MODEL_PATH}${filename}`,
            `models/${filename}`,
            `${filename}`
        ];
        
        for (const path of possiblePaths) {
            if (await fileExists(path)) {
                return path;
            }
        }
        
        throw new Error(`Model file ${filename} not found in any expected location`);
    }
    
    /**
     * Load the assets manifest if it exists
     */
    async function loadAssetsManifest() {
        try {
            const response = await fetch('assets/assets-manifest.json');
            if (response.ok) {
                return await response.json();
            }
            return null;
        } catch (error) {
            console.warn('Assets manifest not found or invalid', error);
            return null;
        }
    }
    
    /**
     * Find model in manifest or default catalog
     */
    async function findModelInManifest(modelKey) {
        try {
            // First try to load from manifest
            const manifest = await loadAssetsManifest();
            if (manifest && manifest.models && manifest.models[modelKey]) {
                return manifest.models[modelKey];
            }
            
            // Fall back to catalog
            if (modelCatalog[modelKey]) {
                return findModelFile(modelCatalog[modelKey]);
            }
            
            throw new Error(`Model ${modelKey} not found in manifest or catalog`);
        } catch (error) {
            throw error;
        }
    }
    
    /**
     * Try alternative paths for a model that failed to load
     */
    async function tryAlternativePaths(originalPath) {
        const filename = originalPath.split('/').pop();
        
        // Try other possible paths
        const altPaths = [
            `${DEFAULT_MODEL_PATH}${filename}`,
            `models/${filename}`,
            filename
        ];
        
        // Filter out the original path
        const alternatives = altPaths.filter(path => path !== originalPath);
        
        // Try each alternative
        for (const path of alternatives) {
            if (await fileExists(path)) {
                return path;
            }
        }
        
        throw new Error('No alternative paths found for ' + originalPath);
    }
    
    /**
     * Create an enhanced GLTFLoader with better error handling
     */
    function createEnhancedGLTFLoader(THREE) {
        if (!THREE || !THREE.GLTFLoader) {
            console.warn('THREE.GLTFLoader not available for enhancement');
            return null;
        }
        
        class EnhancedGLTFLoader extends THREE.GLTFLoader {
            constructor(manager) {
                super(manager);
                this.crossOrigin = 'anonymous';
            }
            
            load(url, onLoad, onProgress, onError) {
                // Add more robust error handling
                const enhancedOnError = (error) => {
                    console.error('GLTF loading error:', error);
                    
                    // Try to provide more helpful error information
                    let errorInfo = error;
                    if (error instanceof Error) {
                        if (error.message.includes('Failed to load buffer')) {
                            errorInfo = new Error(`Binary file for model not found. Make sure both .gltf and .bin files are present in the same directory. Original error: ${error.message}`);
                        } else if (error.message.includes('Unexpected token')) {
                            errorInfo = new Error(`JSON parse error: The model file appears to be corrupt or not valid GLTF. Original error: ${error.message}`);
                        } else if (error.message.includes('404')) {
                            errorInfo = new Error(`Model file not found (404). Check the path: ${url}`);
                        }
                    }
                    
                    if (onError) onError(errorInfo);
                };
                
                // Call original loader with enhanced error handler
                super.load(url, onLoad, onProgress, enhancedOnError);
            }
        }
        
        return EnhancedGLTFLoader;
    }
    
    /**
     * Log model info for debugging
     */
    function logModelInfo(gltf) {
        if (!gltf) return;
        
        console.group('GLTF Model Info');
        console.log('Scenes:', gltf.scenes ? gltf.scenes.length : 0);
        console.log('Animations:', gltf.animations ? gltf.animations.length : 0);
        console.log('Cameras:', gltf.cameras ? gltf.cameras.length : 0);
        
        // Count meshes
        let meshCount = 0;
        if (gltf.scene) {
            gltf.scene.traverse(obj => {
                if (obj.isMesh) meshCount++;
            });
        }
        console.log('Meshes:', meshCount);
        console.groupEnd();
    }
    
    // Public API
    return {
        findModelFile,
        loadAssetsManifest,
        findModelInManifest,
        tryAlternativePaths,
        createEnhancedGLTFLoader,
        logModelInfo
    };
})();

// Make available globally
window.GLTFHelper = GLTFHelper; 