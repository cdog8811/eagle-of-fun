export function logGPUStatus() {
  console.log('🎮 GPU Status Check:');

  // Check for WebGPU support
  if ('gpu' in navigator) {
    console.log('✅ WebGPU available');
  } else {
    console.log('⚠️ WebGPU not available - Fallback to WebGL');
  }

  // Check WebGL renderer info
  const canvas = document.querySelector('canvas');
  if (canvas) {
    const gl = canvas.getContext('webgl2') || canvas.getContext('webgl');
    if (gl) {
      const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
      if (debugInfo) {
        const vendor = gl.getParameter(debugInfo.UNMASKED_VENDOR_WEBGL);
        const renderer = gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL);
        console.log(`🎮 GPU Vendor: ${vendor}`);
        console.log(`🎮 Renderer: ${renderer}`);
      } else {
        console.log('⚠️ WEBGL_debug_renderer_info not available');
      }

      // Check WebGL version
      const version = gl.getParameter(gl.VERSION);
      console.log(`🎮 WebGL Version: ${version}`);
    } else {
      console.log('❌ WebGL context not available');
    }
  } else {
    console.log('⚠️ Canvas element not found (check after game initialization)');
  }

  // Check browser and OS
  console.log(`🌐 Browser: ${navigator.userAgent}`);
  console.log(`💻 Platform: ${navigator.platform}`);
  console.log(`🖥️ Hardware Concurrency: ${navigator.hardwareConcurrency} cores`);
}
