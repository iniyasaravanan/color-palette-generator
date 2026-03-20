import React, { useState } from 'react';
import { Shuffle, Upload, Palette } from 'lucide-react';
import { generatePaletteFromHarmony, generateRandomColor } from '../utils/colorUtils';

interface GenerationPanelProps {
  onGenerate: (colors: string[]) => void;
  onImageUpload: (file: File) => void;
}

export function GenerationPanel({ onGenerate, onImageUpload }: GenerationPanelProps) {
  const [baseColor, setBaseColor] = useState('#3b82f6');
  const [harmonyType, setHarmonyType] = useState<'analogous' | 'complementary' | 'triadic' | 'monochromatic' | 'split-complementary' | 'random'>('random');

  const handleGenerate = () => {
    const colors = generatePaletteFromHarmony(baseColor, harmonyType);
    onGenerate(colors);
  };

  const handleRandom = () => {
    const randomBase = generateRandomColor();
    setBaseColor(randomBase);
    const colors = generatePaletteFromHarmony(randomBase, 'random');
    onGenerate(colors);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onImageUpload(file);
    }
  };

  return (
    <div className="flex flex-col gap-6 rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
      <h2 className="flex items-center gap-2">
        <Palette className="h-5 w-5" />
        Generate Palette
      </h2>

      {/* Base Color */}
      <div className="flex flex-col gap-2">
        <label className="text-sm">Base Color</label>
        <div className="flex gap-2">
          <input
            type="color"
            value={baseColor}
            onChange={(e) => setBaseColor(e.target.value)}
            className="h-12 w-20 cursor-pointer rounded border border-gray-300 dark:border-gray-600"
          />
          <input
            type="text"
            value={baseColor}
            onChange={(e) => setBaseColor(e.target.value)}
            className="flex-1 rounded border border-gray-300 px-3 py-2 font-mono dark:border-gray-600 dark:bg-gray-700"
            placeholder="#000000"
          />
        </div>
      </div>

      {/* Harmony Type */}
      <div className="flex flex-col gap-2">
        <label className="text-sm">Color Harmony</label>
        <select
          value={harmonyType}
          onChange={(e) => setHarmonyType(e.target.value as any)}
          className="rounded border border-gray-300 px-3 py-2 dark:border-gray-600 dark:bg-gray-700"
        >
          <option value="random">Random</option>
          <option value="analogous">Analogous</option>
          <option value="complementary">Complementary</option>
          <option value="triadic">Triadic</option>
          <option value="monochromatic">Monochromatic</option>
          <option value="split-complementary">Split Complementary</option>
        </select>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col gap-2">
        <button
          onClick={handleGenerate}
          className="flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-3 text-white transition-colors hover:bg-blue-700"
        >
          <Palette className="h-5 w-5" />
          Generate Palette
        </button>

        <button
          onClick={handleRandom}
          className="flex items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-3 transition-colors hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-700 dark:hover:bg-gray-600"
        >
          <Shuffle className="h-5 w-5" />
          Random Palette
        </button>

        <label className="flex cursor-pointer items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-3 transition-colors hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-700 dark:hover:bg-gray-600">
          <Upload className="h-5 w-5" />
          From Image
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />
        </label>
      </div>
    </div>
  );
}
