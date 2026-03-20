import tinycolor from 'tinycolor2';

export interface Color {
  hex: string;
  rgb: string;
  hsl: string;
  name: string;
  locked: boolean;
}

export interface Palette {
  id: string;
  name: string;
  colors: Color[];
  createdAt: string;
}

// Generate random color
export const generateRandomColor = (): string => {
  return tinycolor.random().toHexString();
};

// Color harmony generators
export const generateAnalogous = (baseColor: string): string[] => {
  const color = tinycolor(baseColor);
  const analogous = color.analogous(5);
  return analogous.map(c => c.toHexString());
};

export const generateComplementary = (baseColor: string): string[] => {
  const color = tinycolor(baseColor);
  const complement = color.complement();
  return [
    color.toHexString(),
    color.lighten(10).toHexString(),
    complement.toHexString(),
    complement.lighten(10).toHexString(),
    complement.darken(10).toHexString(),
  ];
};

export const generateTriadic = (baseColor: string): string[] => {
  const color = tinycolor(baseColor);
  const triadic = color.triad();
  return [
    triadic[0].toHexString(),
    triadic[0].lighten(10).toHexString(),
    triadic[1].toHexString(),
    triadic[1].lighten(10).toHexString(),
    triadic[2].toHexString(),
  ];
};

export const generateMonochromatic = (baseColor: string): string[] => {
  const color = tinycolor(baseColor);
  const monochromatic = color.monochromatic(5);
  return monochromatic.map(c => c.toHexString());
};

export const generateSplitComplementary = (baseColor: string): string[] => {
  const color = tinycolor(baseColor);
  const splitComp = color.splitcomplement();
  return [
    splitComp[0].toHexString(),
    splitComp[0].lighten(10).toHexString(),
    splitComp[1].toHexString(),
    splitComp[2].toHexString(),
    splitComp[2].lighten(10).toHexString(),
  ];
};

// Generate palette from harmony rule
export const generatePaletteFromHarmony = (
  baseColor: string,
  harmonyType: 'analogous' | 'complementary' | 'triadic' | 'monochromatic' | 'split-complementary' | 'random'
): string[] => {
  switch (harmonyType) {
    case 'analogous':
      return generateAnalogous(baseColor);
    case 'complementary':
      return generateComplementary(baseColor);
    case 'triadic':
      return generateTriadic(baseColor);
    case 'monochromatic':
      return generateMonochromatic(baseColor);
    case 'split-complementary':
      return generateSplitComplementary(baseColor);
    case 'random':
      return Array.from({ length: 5 }, () => generateRandomColor());
    default:
      return Array.from({ length: 5 }, () => generateRandomColor());
  }
};

// Create Color object from hex
export const createColorFromHex = (hex: string, locked: boolean = false): Color => {
  const color = tinycolor(hex);
  const rgb = color.toRgb();
  const hsl = color.toHsl();
  
  return {
    hex: color.toHexString(),
    rgb: `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`,
    hsl: `hsl(${Math.round(hsl.h)}, ${Math.round(hsl.s * 100)}%, ${Math.round(hsl.l * 100)}%)`,
    name: color.toName() || color.toHexString(),
    locked,
  };
};

// Adjust color properties
export const adjustColor = (
  hex: string,
  adjustments: { hue?: number; saturation?: number; brightness?: number }
): string => {
  let color = tinycolor(hex);
  
  if (adjustments.hue !== undefined) {
    color = color.spin(adjustments.hue);
  }
  
  if (adjustments.saturation !== undefined) {
    if (adjustments.saturation > 0) {
      color = color.saturate(adjustments.saturation);
    } else {
      color = color.desaturate(Math.abs(adjustments.saturation));
    }
  }
  
  if (adjustments.brightness !== undefined) {
    if (adjustments.brightness > 0) {
      color = color.brighten(adjustments.brightness);
    } else {
      color = color.darken(Math.abs(adjustments.brightness));
    }
  }
  
  return color.toHexString();
};

// WCAG contrast ratio
export const getContrastRatio = (color1: string, color2: string): number => {
  return tinycolor.readability(color1, color2);
};

// Check if contrast passes WCAG standards
export const checkWCAGCompliance = (
  color1: string,
  color2: string,
  level: 'AA' | 'AAA' = 'AA',
  size: 'large' | 'normal' = 'normal'
): { passes: boolean; ratio: number } => {
  const ratio = getContrastRatio(color1, color2);
  
  let threshold: number;
  if (level === 'AA') {
    threshold = size === 'large' ? 3 : 4.5;
  } else {
    threshold = size === 'large' ? 4.5 : 7;
  }
  
  return {
    passes: ratio >= threshold,
    ratio,
  };
};

// Extract dominant colors from image (simplified version)
export const extractColorsFromImage = (imageData: ImageData, count: number = 5): string[] => {
  const pixels: { r: number; g: number; b: number }[] = [];
  
  // Sample pixels (every 10th pixel for performance)
  for (let i = 0; i < imageData.data.length; i += 40) {
    const r = imageData.data[i];
    const g = imageData.data[i + 1];
    const b = imageData.data[i + 2];
    const a = imageData.data[i + 3];
    
    // Skip transparent pixels
    if (a < 128) continue;
    
    pixels.push({ r, g, b });
  }
  
  // Simple color quantization using k-means clustering
  const clusters: { r: number; g: number; b: number; count: number }[] = [];
  
  // Initialize random cluster centers
  for (let i = 0; i < count; i++) {
    const randomPixel = pixels[Math.floor(Math.random() * pixels.length)];
    clusters.push({ ...randomPixel, count: 0 });
  }
  
  // Simple clustering (5 iterations)
  for (let iter = 0; iter < 5; iter++) {
    // Reset counts
    clusters.forEach(c => c.count = 0);
    
    // Assign pixels to nearest cluster
    const assignments: number[][] = clusters.map(() => []);
    
    pixels.forEach(pixel => {
      let minDist = Infinity;
      let minIdx = 0;
      
      clusters.forEach((cluster, idx) => {
        const dist = Math.sqrt(
          Math.pow(pixel.r - cluster.r, 2) +
          Math.pow(pixel.g - cluster.g, 2) +
          Math.pow(pixel.b - cluster.b, 2)
        );
        
        if (dist < minDist) {
          minDist = dist;
          minIdx = idx;
        }
      });
      
      assignments[minIdx].push(pixel.r, pixel.g, pixel.b);
      clusters[minIdx].count++;
    });
    
    // Update cluster centers
    clusters.forEach((cluster, idx) => {
      const assigned = assignments[idx];
      if (assigned.length > 0) {
        let r = 0, g = 0, b = 0;
        for (let i = 0; i < assigned.length; i += 3) {
          r += assigned[i];
          g += assigned[i + 1];
          b += assigned[i + 2];
        }
        const count = assigned.length / 3;
        cluster.r = Math.round(r / count);
        cluster.g = Math.round(g / count);
        cluster.b = Math.round(b / count);
      }
    });
  }
  
  // Sort by count and convert to hex
  return clusters
    .sort((a, b) => b.count - a.count)
    .map(c => tinycolor({ r: c.r, g: c.g, b: c.b }).toHexString());
};

// Export formats
export const exportAsCSS = (colors: Color[]): string => {
  return colors.map((color, idx) => `--color-${idx + 1}: ${color.hex};`).join('\n');
};

export const exportAsTailwind = (colors: Color[]): string => {
  const config = {
    theme: {
      extend: {
        colors: colors.reduce((acc, color, idx) => {
          acc[`palette-${idx + 1}`] = color.hex;
          return acc;
        }, {} as Record<string, string>)
      }
    }
  };
  
  return JSON.stringify(config, null, 2);
};

export const exportAsJSON = (colors: Color[]): string => {
  return JSON.stringify(
    colors.map((color, idx) => ({
      name: `color-${idx + 1}`,
      hex: color.hex,
      rgb: color.rgb,
      hsl: color.hsl,
    })),
    null,
    2
  );
};

// Create gradient between colors
export const createGradientPalette = (colors: Color[], steps: number = 10): Color[] => {
  if (colors.length < 2) return colors;
  
  const gradientColors: Color[] = [];
  const segmentSteps = Math.floor(steps / (colors.length - 1));
  
  for (let i = 0; i < colors.length - 1; i++) {
    const color1 = tinycolor(colors[i].hex);
    const color2 = tinycolor(colors[i + 1].hex);
    
    for (let j = 0; j < segmentSteps; j++) {
      const ratio = j / segmentSteps;
      const mixed = tinycolor.mix(color1, color2, ratio * 100);
      gradientColors.push(createColorFromHex(mixed.toHexString(), false));
    }
  }
  
  // Add the last color
  gradientColors.push(createColorFromHex(colors[colors.length - 1].hex, colors[colors.length - 1].locked));
  
  return gradientColors;
};

// Sort colors aesthetically
export const sortColorsAesthetically = (colors: Color[]): Color[] => {
  // Create a copy to avoid mutating locked colors
  const colorsCopy = colors.map(c => ({ ...c }));
  
  // Separate locked and unlocked colors
  const locked = colorsCopy.filter(c => c.locked);
  const unlocked = colorsCopy.filter(c => !c.locked);
  
  // Sort unlocked colors by hue, then by lightness
  unlocked.sort((a, b) => {
    const hslA = tinycolor(a.hex).toHsl();
    const hslB = tinycolor(b.hex).toHsl();
    
    // First sort by hue
    if (Math.abs(hslA.h - hslB.h) > 5) {
      return hslA.h - hslB.h;
    }
    
    // Then by saturation
    if (Math.abs(hslA.s - hslB.s) > 0.1) {
      return hslB.s - hslA.s;
    }
    
    // Finally by lightness
    return hslA.l - hslB.l;
  });
  
  // If there are locked colors, we need to preserve their positions
  if (locked.length === 0) {
    return unlocked;
  }
  
  // Reconstruct the array with locked colors in their original positions
  const result: Color[] = [];
  let unlockedIndex = 0;
  
  for (let i = 0; i < colors.length; i++) {
    if (colors[i].locked) {
      result.push(colors[i]);
    } else {
      result.push(unlocked[unlockedIndex++]);
    }
  }
  
  return result;
};