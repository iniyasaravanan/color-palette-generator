import React, { useState, useEffect } from 'react';
import { Sun, Moon, Save, Download, Settings, Wand, ArrowUpDown } from 'lucide-react';
import { ColorCard } from './components/ColorCard';
import { GenerationPanel } from './components/GenerationPanel';
import { ExportModal } from './components/ExportModal';
import { SavedPalettes } from './components/SavedPalettes';
import { AccessibilityChecker } from './components/AccessibilityChecker';
import {
  Color,
  Palette,
  createColorFromHex,
  generatePaletteFromHarmony,
  extractColorsFromImage,
  adjustColor,
  createGradientPalette,
  sortColorsAesthetically,
} from './utils/colorUtils';

const STORAGE_KEY = 'color-palette-generator-saved';

export default function App() {
  const [colors, setColors] = useState<Color[]>([]);
  const [savedPalettes, setSavedPalettes] = useState<Palette[]>([]);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showAsGradient, setShowAsGradient] = useState(false);
  const [adjustments, setAdjustments] = useState({
    hue: 0,
    saturation: 0,
    brightness: 0,
  });

  // Load saved palettes from localStorage
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        setSavedPalettes(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to load saved palettes');
      }
    }

    // Initialize with a random palette
    handleGenerate(generatePaletteFromHarmony('#3b82f6', 'random'));
  }, []);

  // Save palettes to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(savedPalettes));
  }, [savedPalettes]);

  // Dark mode toggle
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const handleGenerate = (hexColors: string[]) => {
    const newColors = hexColors.map((hex, idx) =>
      createColorFromHex(hex, colors[idx]?.locked || false)
    );
    setColors(newColors);
    setAdjustments({ hue: 0, saturation: 0, brightness: 0 });
  };

  const handleRegenerateUnlocked = () => {
    const newColors = colors.map((color) => {
      if (color.locked) {
        return color;
      }
      return createColorFromHex(generatePaletteFromHarmony(color.hex, 'random')[0], false);
    });
    setColors(newColors);
  };

  const handleToggleLock = (index: number) => {
    const newColors = [...colors];
    newColors[index].locked = !newColors[index].locked;
    setColors(newColors);
  };

  const handleColorChange = (index: number, newHex: string) => {
    const newColors = [...colors];
    newColors[index] = createColorFromHex(newHex, newColors[index].locked);
    setColors(newColors);
  };

  const handleSavePalette = () => {
    const name = prompt('Enter a name for this palette:');
    if (name) {
      const palette: Palette = {
        id: Date.now().toString(),
        name,
        colors: colors.map(c => ({ ...c })),
        createdAt: new Date().toISOString(),
      };
      setSavedPalettes([palette, ...savedPalettes]);
    }
  };

  const handleLoadPalette = (palette: Palette) => {
    setColors(palette.colors.map(c => ({ ...c })));
  };

  const handleDeletePalette = (id: string) => {
    setSavedPalettes(savedPalettes.filter(p => p.id !== id));
  };

  const handleImageUpload = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d')!;
        
        // Resize image for faster processing
        const maxSize = 200;
        let width = img.width;
        let height = img.height;
        
        if (width > height) {
          if (width > maxSize) {
            height = (height * maxSize) / width;
            width = maxSize;
          }
        } else {
          if (height > maxSize) {
            width = (width * maxSize) / height;
            height = maxSize;
          }
        }
        
        canvas.width = width;
        canvas.height = height;
        ctx.drawImage(img, 0, 0, width, height);
        
        const imageData = ctx.getImageData(0, 0, width, height);
        const extractedColors = extractColorsFromImage(imageData, 5);
        handleGenerate(extractedColors);
      };
      img.src = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const handleApplyAdjustments = () => {
    const newColors = colors.map((color) => {
      if (color.locked) return color;
      const adjustedHex = adjustColor(color.hex, adjustments);
      return createColorFromHex(adjustedHex, color.locked);
    });
    setColors(newColors);
  };

  const handleCreateGradient = () => {
    const newColors = createGradientPalette(colors);
    setColors(newColors);
  };

  const handleSortColors = () => {
    const newColors = sortColorsAesthetically(colors);
    setColors(newColors);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="border-b border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div>
              <h1>Color Palette Generator</h1>
              <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                Create, explore, and export beautiful color palettes
              </p>
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-500">
                By Iniya Saravanan
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowSettings(!showSettings)}
                className="rounded-lg p-2 transition-colors hover:bg-gray-100 dark:hover:bg-gray-700"
                title="Settings"
              >
                <Settings className="h-5 w-5" />
              </button>
              <button
                onClick={() => setIsDarkMode(!isDarkMode)}
                className="rounded-lg p-2 transition-colors hover:bg-gray-100 dark:hover:bg-gray-700"
                title="Toggle dark mode"
              >
                {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">
          {/* Left Sidebar - Controls */}
          <div className="lg:col-span-1">
            <div className="sticky top-8 flex flex-col gap-6">
              <GenerationPanel
                onGenerate={handleGenerate}
                onImageUpload={handleImageUpload}
              />

              {/* Adjustment Controls */}
              {showSettings && (
                <div className="flex flex-col gap-4 rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
                  <h3>Adjust Colors</h3>
                  
                  <div className="flex flex-col gap-2">
                    <label className="text-sm">Hue ({adjustments.hue}°)</label>
                    <input
                      type="range"
                      min="-180"
                      max="180"
                      value={adjustments.hue}
                      onChange={(e) =>
                        setAdjustments({ ...adjustments, hue: Number(e.target.value) })
                      }
                      className="w-full"
                    />
                  </div>

                  <div className="flex flex-col gap-2">
                    <label className="text-sm">Saturation ({adjustments.saturation}%)</label>
                    <input
                      type="range"
                      min="-100"
                      max="100"
                      value={adjustments.saturation}
                      onChange={(e) =>
                        setAdjustments({ ...adjustments, saturation: Number(e.target.value) })
                      }
                      className="w-full"
                    />
                  </div>

                  <div className="flex flex-col gap-2">
                    <label className="text-sm">Brightness ({adjustments.brightness}%)</label>
                    <input
                      type="range"
                      min="-100"
                      max="100"
                      value={adjustments.brightness}
                      onChange={(e) =>
                        setAdjustments({ ...adjustments, brightness: Number(e.target.value) })
                      }
                      className="w-full"
                    />
                  </div>

                  <button
                    onClick={handleApplyAdjustments}
                    className="rounded-lg bg-blue-600 px-4 py-2 text-white transition-colors hover:bg-blue-700"
                  >
                    Apply Adjustments
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Main Palette Area */}
          <div className="lg:col-span-3">
            <div className="flex flex-col gap-6">
              {/* Action Buttons */}
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={handleRegenerateUnlocked}
                  className="rounded-lg bg-blue-600 px-4 py-2 text-white transition-colors hover:bg-blue-700"
                >
                  Regenerate Unlocked
                </button>
                <button
                  onClick={handleSavePalette}
                  className="flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 transition-colors hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-700 dark:hover:bg-gray-600"
                >
                  <Save className="h-4 w-4" />
                  Save Palette
                </button>
                <button
                  onClick={() => setIsExportModalOpen(true)}
                  className="flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 transition-colors hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-700 dark:hover:bg-gray-600"
                >
                  <Download className="h-4 w-4" />
                  Export
                </button>
                <button
                  onClick={() => setShowAsGradient(!showAsGradient)}
                  className={`flex items-center gap-2 rounded-lg px-4 py-2 transition-colors ${
                    showAsGradient
                      ? 'bg-blue-600 text-white hover:bg-blue-700'
                      : 'border border-gray-300 bg-white hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-700 dark:hover:bg-gray-600'
                  }`}
                >
                  <Wand className="h-4 w-4" />
                  {showAsGradient ? 'Show Cards' : 'Show Gradient'}
                </button>
                <button
                  onClick={handleSortColors}
                  className="flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 transition-colors hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-700 dark:hover:bg-gray-600"
                >
                  <ArrowUpDown className="h-4 w-4" />
                  Sort Colors
                </button>
              </div>

              {/* Color Display */}
              {showAsGradient ? (
                /* Gradient View */
                <div className="flex flex-col gap-4">
                  {/* Main Gradient */}
                  <div
                    className="h-64 w-full rounded-lg shadow-lg"
                    style={{
                      background: `linear-gradient(to right, ${colors.map(c => c.hex).join(', ')})`,
                    }}
                  />
                  
                  {/* Color Swatches Below Gradient */}
                  <div className="grid grid-cols-5 gap-2">
                    {colors.map((color, index) => (
                      <div key={index} className="flex flex-col gap-2">
                        <div
                          className="h-16 w-full rounded border border-gray-300 dark:border-gray-600"
                          style={{ backgroundColor: color.hex }}
                        />
                        <div className="flex flex-col items-center gap-1">
                          <span className="font-mono text-xs">{color.hex}</span>
                          <button
                            onClick={() => handleToggleLock(index)}
                            className="rounded p-1 hover:bg-gray-100 dark:hover:bg-gray-700"
                          >
                            {color.locked ? (
                              <span className="text-xs">🔒</span>
                            ) : (
                              <span className="text-xs">🔓</span>
                            )}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                /* Card View */
                <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-5">
                  {colors.map((color, index) => (
                    <ColorCard
                      key={index}
                      color={color}
                      onToggleLock={() => handleToggleLock(index)}
                      onColorChange={(newColor) => handleColorChange(index, newColor)}
                    />
                  ))}
                </div>
              )}

              {/* Accessibility Checker */}
              {colors.length > 0 && <AccessibilityChecker colors={colors} />}

              {/* Saved Palettes */}
              <SavedPalettes
                palettes={savedPalettes}
                onLoad={handleLoadPalette}
                onDelete={handleDeletePalette}
              />
            </div>
          </div>
        </div>
      </main>

      {/* Export Modal */}
      <ExportModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        colors={colors}
      />
    </div>
  );
}