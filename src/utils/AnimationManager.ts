import * as THREE from 'three';

type AnimationFunction = () => void;

interface AnimationItem {
  id: number;
  fn: AnimationFunction;
  priority: number;
}

class AnimationManager {
  private static animations: AnimationItem[] = [];
  private static nextId: number = 1;
  private static isRunning: boolean = false;
  private static isPaused: boolean = false;
  private static clock: THREE.Clock;
  
  static {
    // Initialize clock
    this.clock = new THREE.Clock();
  }

  // Start the animation loop
  public static start(): void {
    if (this.isRunning) return;
    
    this.isRunning = true;
    this.clock.start();
    console.log('Animation manager started');
    
    // Start animation loop
    this.animate();
  }
  
  // Main animation loop
  private static animate(): void {
    // Request next frame immediately to ensure smooth animation
    requestAnimationFrame(() => this.animate());
    
    // Skip execution if paused
    if (this.isPaused) return;
    
    // Get delta time for smooth animations
    const delta = this.clock.getDelta();
    
    // Execute all animations in priority order (highest first)
    const sortedAnimations = [...this.animations].sort((a, b) => b.priority - a.priority);
    
    for (const animation of sortedAnimations) {
      try {
        animation.fn();
      } catch (error) {
        console.error('Error in animation function:', error);
      }
    }
  }
  
  // Add a new animation function
  public static addAnimation(fn: AnimationFunction, priority: number = 0): number {
    const id = this.nextId++;
    
    this.animations.push({
      id,
      fn,
      priority
    });
    
    // Start animations if not already running
    if (!this.isRunning) {
      this.start();
    }
    
    console.log(`Added animation ${id} with priority ${priority}`);
    return id;
  }
  
  // Remove an animation by ID
  public static removeAnimation(fnOrId: AnimationFunction | number): void {
    if (typeof fnOrId === 'number') {
      // Remove by ID
      const index = this.animations.findIndex(a => a.id === fnOrId);
      if (index !== -1) {
        this.animations.splice(index, 1);
        console.log(`Removed animation ${fnOrId}`);
      }
    } else {
      // Remove by function reference
      const index = this.animations.findIndex(a => a.fn === fnOrId);
      if (index !== -1) {
        const id = this.animations[index].id;
        this.animations.splice(index, 1);
        console.log(`Removed animation ${id}`);
      }
    }
  }
  
  // Pause or resume all animations
  public static togglePause(pause: boolean): void {
    this.isPaused = pause;
    console.log(pause ? 'Animations paused' : 'Animations resumed');
  }
  
  // Get current animation count
  public static get count(): number {
    return this.animations.length;
  }
}

export default AnimationManager; 