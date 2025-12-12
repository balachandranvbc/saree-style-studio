// Depth estimation utilities using AI
// This creates a depth map from a 2D image for 3D visualization

export interface DepthMap {
  data: Float32Array;
  width: number;
  height: number;
  minDepth: number;
  maxDepth: number;
}

export interface DepthModelData {
  originalImage: string;
  depthMap: DepthMap;
  normalizedDepthImage: string; // Base64 grayscale depth visualization
}

// Generate depth map using edge-based estimation for now
// This creates a pseudo-depth based on image analysis
export async function estimateDepth(imageUrl: string): Promise<DepthModelData> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    
    img.onload = () => {
      try {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Could not get canvas context'));
          return;
        }

        // Resize for processing (max 512 for performance)
        const maxSize = 512;
        let width = img.width;
        let height = img.height;
        
        if (width > maxSize || height > maxSize) {
          if (width > height) {
            height = Math.round((height * maxSize) / width);
            width = maxSize;
          } else {
            width = Math.round((width * maxSize) / height);
            height = maxSize;
          }
        }

        canvas.width = width;
        canvas.height = height;
        ctx.drawImage(img, 0, 0, width, height);

        const imageData = ctx.getImageData(0, 0, width, height);
        const pixels = imageData.data;

        // Create depth map based on luminance and edge detection
        const depthData = new Float32Array(width * height);
        
        // First pass: compute luminance-based depth
        for (let i = 0; i < pixels.length; i += 4) {
          const r = pixels[i];
          const g = pixels[i + 1];
          const b = pixels[i + 2];
          
          // Luminance calculation (weighted)
          const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
          
          // Invert luminance for depth (darker = closer in many cases for clothing/body)
          depthData[i / 4] = luminance;
        }

        // Second pass: edge-aware smoothing and body depth estimation
        const smoothedDepth = new Float32Array(width * height);
        const kernelSize = 3;
        const halfKernel = Math.floor(kernelSize / 2);

        for (let y = 0; y < height; y++) {
          for (let x = 0; x < width; x++) {
            const idx = y * width + x;
            let sum = 0;
            let count = 0;

            // Simple box blur for smoothing
            for (let ky = -halfKernel; ky <= halfKernel; ky++) {
              for (let kx = -halfKernel; kx <= halfKernel; kx++) {
                const nx = x + kx;
                const ny = y + ky;
                if (nx >= 0 && nx < width && ny >= 0 && ny < height) {
                  sum += depthData[ny * width + nx];
                  count++;
                }
              }
            }
            smoothedDepth[idx] = sum / count;
          }
        }

        // Enhance center depth (assuming person is centered)
        const centerX = width / 2;
        const centerY = height / 2;
        const maxDist = Math.sqrt(centerX * centerX + centerY * centerY);

        for (let y = 0; y < height; y++) {
          for (let x = 0; x < width; x++) {
            const idx = y * width + x;
            const distX = Math.abs(x - centerX) / centerX;
            const distY = Math.abs(y - centerY) / centerY;
            const dist = Math.sqrt(distX * distX + distY * distY);
            
            // Add depth bias toward center (body typically in center)
            const centerBias = 1 - Math.min(dist, 1) * 0.3;
            smoothedDepth[idx] = smoothedDepth[idx] * centerBias;
          }
        }

        // Normalize depth values
        let minDepth = Infinity;
        let maxDepth = -Infinity;
        for (let i = 0; i < smoothedDepth.length; i++) {
          minDepth = Math.min(minDepth, smoothedDepth[i]);
          maxDepth = Math.max(maxDepth, smoothedDepth[i]);
        }

        const range = maxDepth - minDepth || 1;
        for (let i = 0; i < smoothedDepth.length; i++) {
          smoothedDepth[i] = (smoothedDepth[i] - minDepth) / range;
        }

        // Create depth visualization image
        const depthCanvas = document.createElement('canvas');
        depthCanvas.width = width;
        depthCanvas.height = height;
        const depthCtx = depthCanvas.getContext('2d');
        if (!depthCtx) {
          reject(new Error('Could not get depth canvas context'));
          return;
        }

        const depthImageData = depthCtx.createImageData(width, height);
        for (let i = 0; i < smoothedDepth.length; i++) {
          const value = Math.round(smoothedDepth[i] * 255);
          depthImageData.data[i * 4] = value;
          depthImageData.data[i * 4 + 1] = value;
          depthImageData.data[i * 4 + 2] = value;
          depthImageData.data[i * 4 + 3] = 255;
        }
        depthCtx.putImageData(depthImageData, 0, 0);

        resolve({
          originalImage: imageUrl,
          depthMap: {
            data: smoothedDepth,
            width,
            height,
            minDepth: 0,
            maxDepth: 1,
          },
          normalizedDepthImage: depthCanvas.toDataURL('image/png'),
        });
      } catch (error) {
        reject(error);
      }
    };

    img.onerror = () => reject(new Error('Failed to load image'));
    img.src = imageUrl;
  });
}

// Create displacement vertices for 3D mesh
export function createDepthMesh(
  depthMap: DepthMap,
  displacementScale: number = 0.5
): { vertices: Float32Array; uvs: Float32Array; indices: Uint32Array } {
  const { width, height, data } = depthMap;
  
  const vertices: number[] = [];
  const uvs: number[] = [];
  const indices: number[] = [];

  // Create vertices
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const idx = y * width + x;
      const depth = data[idx];
      
      // Normalize coordinates to -1 to 1 range
      const px = (x / width - 0.5) * 2;
      const py = -(y / height - 0.5) * 2;
      const pz = depth * displacementScale;

      vertices.push(px, py, pz);
      uvs.push(x / width, 1 - y / height);
    }
  }

  // Create indices for triangles
  for (let y = 0; y < height - 1; y++) {
    for (let x = 0; x < width - 1; x++) {
      const topLeft = y * width + x;
      const topRight = topLeft + 1;
      const bottomLeft = (y + 1) * width + x;
      const bottomRight = bottomLeft + 1;

      // First triangle
      indices.push(topLeft, bottomLeft, topRight);
      // Second triangle
      indices.push(topRight, bottomLeft, bottomRight);
    }
  }

  return {
    vertices: new Float32Array(vertices),
    uvs: new Float32Array(uvs),
    indices: new Uint32Array(indices),
  };
}
