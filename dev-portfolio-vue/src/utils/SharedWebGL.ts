import * as THREE from 'three';
import AnimationManager from './AnimationManager'; // Assuming AnimationManager calls SharedWebGL's render method

interface SubSceneConfig {
  name: string;
  scene: THREE.Scene;
  camera: THREE.Camera;
  containerElement: HTMLElement; // The div <SectionBackground3D> renders
  targetElement: HTMLElement;    // The actual <section> element to map to
  updateCallback: (renderer: THREE.WebGLRenderer, scene: THREE.Scene, camera: THREE.Camera, targetElement: HTMLElement) => SubSceneViewport | { shouldRender: false };
  currentViewport?: SubSceneViewport;
  shouldRender?: boolean;
}

interface SubSceneViewport {
  x: number;
  y: number;
  width: number;
  height: number;
  shouldRender: true;
}

class SharedWebGL {
  private static instance: SharedWebGL;
  public renderer!: THREE.WebGLRenderer;
  public mainScene!: THREE.Scene;
  public mainCamera!: THREE.Camera;
  public cameras: Map<string, THREE.Camera> = new Map();
  private mountedContainer: HTMLElement | null = null;
  private animationFrameId?: number;
  private subScenes: Map<string, SubSceneConfig> = new Map();

  private constructor() {
    if (SharedWebGL.instance) {
      throw new Error("Error: Instantiation failed: Use SharedWebGL.getInstance() instead of new.");
    }
    this.init();
  }

  public static getInstance(): SharedWebGL {
    if (!SharedWebGL.instance) {
      SharedWebGL.instance = new SharedWebGL();
    }
    return SharedWebGL.instance;
  }

  private init(): void {
    this.mainScene = new THREE.Scene();
    // Default main camera, can be replaced or adjusted
    this.mainCamera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    this.mainCamera.position.z = 5;
    this.cameras.set('main', this.mainCamera);

    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance'
    });
    this.renderer.setPixelRatio(window.devicePixelRatio || 1);
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setClearColor(0x000000, 0); // Default transparent background
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.renderer.outputColorSpace = THREE.SRGBColorSpace; // Correct color space
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.0;
    this.renderer.autoClear = false; // We will manually clear for multi-scene rendering

    // Add to AnimationManager to handle the render loop
    AnimationManager.addAnimation(() => this.render(), 0); // Render with priority 0 (background)

    window.addEventListener('resize', this.onWindowResize.bind(this), false);
    console.log("SharedWebGL initialized with new renderer and multi-scene capability prepped.");
  }

  public mount(container: HTMLElement): void {
    if (this.mountedContainer && this.mountedContainer.contains(this.renderer.domElement)) {
      this.mountedContainer.removeChild(this.renderer.domElement);
    }
    container.appendChild(this.renderer.domElement);
    this.mountedContainer = container;
    this.renderer.domElement.style.position = 'absolute';
    this.renderer.domElement.style.top = '0';
    this.renderer.domElement.style.left = '0';
    this.renderer.domElement.style.width = '100%';
    this.renderer.domElement.style.height = '100%';
    this.renderer.domElement.classList.add('webgl-shared-canvas');
    this.onWindowResize(); // Initial size update
    console.log("SharedWebGL canvas mounted to", container);
  }

  public createScene(name: string): THREE.Scene {
    const scene = new THREE.Scene();
    // Potentially add this to a map if needed, but for now, mainScene is separate
    // And subScenes are handled by registerSubScene
    console.log(`Scene created: ${name}`);
    return scene;
  }

  public registerSubScene(config: SubSceneConfig): void {
    if (this.subScenes.has(config.name)) {
      console.warn(`SubScene "${config.name}" already registered. Overwriting.`);
    }
    // Initial call to set viewport and shouldRender status
    const viewportResult = config.updateCallback(this.renderer, config.scene, config.camera, config.targetElement);
    if (viewportResult.shouldRender) {
      config.currentViewport = viewportResult;
      config.shouldRender = true;
    } else {
      config.shouldRender = false;
    }
    this.subScenes.set(config.name, config);
    console.log(`SubScene "${config.name}" registered.`);
  }

  public unregisterSubScene(name: string): void {
    if (this.subScenes.delete(name)) {
      console.log(`SubScene "${name}" unregistered.`);
    } else {
      console.warn(`SubScene "${name}" not found for unregistration.`);
    }
  }

  public updateSubSceneView(name: string): void {
    const subSceneConfig = this.subScenes.get(name);
    if (subSceneConfig) {
      const viewportResult = subSceneConfig.updateCallback(this.renderer, subSceneConfig.scene, subSceneConfig.camera, subSceneConfig.targetElement);
      if (viewportResult.shouldRender) {
        subSceneConfig.currentViewport = viewportResult;
        subSceneConfig.shouldRender = true;
      } else {
        subSceneConfig.shouldRender = false;
      }
    } else {
      console.warn(`Cannot update view for non-existent SubScene: "${name}"`);
    }
  }

  private onWindowResize(): void {
    if (!this.renderer || !this.mainCamera) return;

    const container = this.renderer.domElement.parentElement || window;
    const width = container instanceof Window ? container.innerWidth : container.clientWidth;
    const height = container instanceof Window ? container.innerHeight : container.clientHeight;

    this.renderer.setSize(width, height);

    if (this.mainCamera instanceof THREE.PerspectiveCamera) {
      this.mainCamera.aspect = width / height;
      this.mainCamera.updateProjectionMatrix();
    }
    this.cameras.forEach(camera => {
      if (camera instanceof THREE.PerspectiveCamera) {
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
      } else if (camera instanceof THREE.OrthographicCamera) {
        // For orthographic cameras, viewport might need specific handling if not full screen
        // This generic resize might not be enough if frustum depends on aspect ratio for ortho
        const aspect = width / height;
        // Example: if frustumSize was a constant for orthographic height
        // camera.left = -frustumSize * aspect / 2;
        // camera.right = frustumSize * aspect / 2;
        // camera.top = frustumSize / 2;
        // camera.bottom = -frustumSize / 2;
        camera.updateProjectionMatrix();
      }
    });
    
    // Trigger view updates for all sub-scenes as their viewports might change with window resize
    this.subScenes.forEach(subScene => {
      this.updateSubSceneView(subScene.name);
    });
  }

  public render(): void {
    if (!this.renderer) return;

    this.renderer.clear(); // Clear color, depth, stencil

    // 1. Render main scene (e.g., global background)
    if (this.mainScene && this.mainCamera) {
        this.renderer.setViewport(0, 0, this.renderer.domElement.width, this.renderer.domElement.height);
        this.renderer.setScissor(0, 0, this.renderer.domElement.width, this.renderer.domElement.height);
        this.renderer.setScissorTest(false); // Typically no scissor for main full-screen scene
        this.renderer.render(this.mainScene, this.mainCamera);
    }
    
    // 2. Render registered sub-scenes (e.g., section backgrounds)
    this.subScenes.forEach(config => {
      if (config.shouldRender && config.currentViewport) {
        const { x, y, width, height } = config.currentViewport;
        if (width > 0 && height > 0) {
            this.renderer.setViewport(x, y, width, height);
            this.renderer.setScissor(x, y, width, height);
            this.renderer.setScissorTest(true);
            this.renderer.render(config.scene, config.camera);
        }
      }
    });

    // The cursor rendering is handled by Cursor3D.animateCursor with higher priority in AnimationManager

    this.renderer.setScissorTest(false); // Reset scissor test
  }

  public dispose(): void {
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
    }
    window.removeEventListener('resize', this.onWindowResize.bind(this));
    this.subScenes.clear();
    this.cameras.clear();
    if (this.renderer) {
      this.renderer.dispose();
      // Remove canvas from DOM if it's still there
      if (this.renderer.domElement.parentElement) {
        this.renderer.domElement.parentElement.removeChild(this.renderer.domElement);
      }
    }
    console.log("SharedWebGL disposed.");
    // Needs a way to reset the singleton instance if we were to re-initialize, e.g., for HMR
    // (SharedWebGL.instance as any) = null; // Not standard practice
  }
}

export default SharedWebGL; 