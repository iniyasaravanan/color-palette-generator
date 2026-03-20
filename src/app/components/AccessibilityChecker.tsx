import React, { useState } from 'react';
import { Check, X } from 'lucide-react';
import { Color, checkWCAGCompliance } from '../utils/colorUtils';

interface AccessibilityCheckerProps {
  colors: Color[];
}

export function AccessibilityChecker({ colors }: AccessibilityCheckerProps) {
  const [selectedColor1, setSelectedColor1] = useState(0);
  const [selectedColor2, setSelectedColor2] = useState(1);
  const [level, setLevel] = useState<'AA' | 'AAA'>('AA');
  const [size, setSize] = useState<'large' | 'normal'>('normal');

  const result = checkWCAGCompliance(
    colors[selectedColor1]?.hex || '#000000',
    colors[selectedColor2]?.hex || '#ffffff',
    level,
    size
  );

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
      <h2 className="mb-4">Accessibility Checker</h2>

      {/* Color Selection */}
      <div className="mb-4 grid grid-cols-2 gap-4">
        <div className="flex flex-col gap-2">
          <label className="text-sm">Foreground</label>
          <select
            value={selectedColor1}
            onChange={(e) => setSelectedColor1(Number(e.target.value))}
            className="rounded border border-gray-300 px-3 py-2 dark:border-gray-600 dark:bg-gray-700"
          >
            {colors.map((color, idx) => (
              <option key={idx} value={idx}>
                {color.hex}
              </option>
            ))}
          </select>
          <div
            className="h-16 rounded border border-gray-300 dark:border-gray-600"
            style={{ backgroundColor: colors[selectedColor1]?.hex }}
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-sm">Background</label>
          <select
            value={selectedColor2}
            onChange={(e) => setSelectedColor2(Number(e.target.value))}
            className="rounded border border-gray-300 px-3 py-2 dark:border-gray-600 dark:bg-gray-700"
          >
            {colors.map((color, idx) => (
              <option key={idx} value={idx}>
                {color.hex}
              </option>
            ))}
          </select>
          <div
            className="h-16 rounded border border-gray-300 dark:border-gray-600"
            style={{ backgroundColor: colors[selectedColor2]?.hex }}
          />
        </div>
      </div>

      {/* WCAG Options */}
      <div className="mb-4 grid grid-cols-2 gap-4">
        <div className="flex flex-col gap-2">
          <label className="text-sm">WCAG Level</label>
          <select
            value={level}
            onChange={(e) => setLevel(e.target.value as 'AA' | 'AAA')}
            className="rounded border border-gray-300 px-3 py-2 dark:border-gray-600 dark:bg-gray-700"
          >
            <option value="AA">AA</option>
            <option value="AAA">AAA</option>
          </select>
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-sm">Text Size</label>
          <select
            value={size}
            onChange={(e) => setSize(e.target.value as 'large' | 'normal')}
            className="rounded border border-gray-300 px-3 py-2 dark:border-gray-600 dark:bg-gray-700"
          >
            <option value="normal">Normal</option>
            <option value="large">Large (18pt+)</option>
          </select>
        </div>
      </div>

      {/* Preview */}
      <div className="mb-4">
        <div
          className="rounded-lg p-6"
          style={{
            backgroundColor: colors[selectedColor2]?.hex,
            color: colors[selectedColor1]?.hex,
          }}
        >
          <p className="text-lg">
            The quick brown fox jumps over the lazy dog
          </p>
          <p className="mt-2 text-sm">
            Smaller text example for testing readability
          </p>
        </div>
      </div>

      {/* Results */}
      <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-900">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Contrast Ratio
            </p>
            <p className="font-mono text-2xl">{result.ratio.toFixed(2)}:1</p>
          </div>
          <div
            className={`flex items-center gap-2 rounded-lg px-4 py-2 ${
              result.passes
                ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                : 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
            }`}
          >
            {result.passes ? (
              <>
                <Check className="h-5 w-5" />
                <span>Passes {level}</span>
              </>
            ) : (
              <>
                <X className="h-5 w-5" />
                <span>Fails {level}</span>
              </>
            )}
          </div>
        </div>

        <div className="mt-4 text-sm text-gray-600 dark:text-gray-400">
          <p>WCAG {level} Requirements ({size} text):</p>
          <ul className="mt-2 space-y-1">
            <li>• AA Normal: 4.5:1 minimum</li>
            <li>• AA Large: 3:1 minimum</li>
            <li>• AAA Normal: 7:1 minimum</li>
            <li>• AAA Large: 4.5:1 minimum</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
