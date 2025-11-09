/**
 * Type definitions for kanjivganimate
 * https://github.com/nihongodera/kanjivganimate
 */

declare module "kanjivganimate" {
  class KanjivgAnimate {
    constructor(selector: Element | string, animationSpeed?: number);
  }

  export default KanjivgAnimate;
}

// Global window type for CDN-loaded script
declare global {
  interface Window {
    KanjivgAnimate?: {
      new (selector: Element | string, animationSpeed?: number): any;
    };
  }
}

// This is needed to make TypeScript treat this file as a module
export {};
