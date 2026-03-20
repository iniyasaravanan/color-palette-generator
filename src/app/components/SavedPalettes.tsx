import React from 'react';
import { Trash, Eye } from 'lucide-react';
import { Palette } from '../utils/colorUtils';

interface SavedPalettesProps {
  palettes: Palette[];
  onLoad: (palette: Palette) => void;
  onDelete: (id: string) => void;
}

export function SavedPalettes({ palettes, onLoad, onDelete }: SavedPalettesProps) {
  if (palettes.length === 0) {
    return (
      <div className="rounded-lg border border-gray-200 bg-white p-6 text-center dark:border-gray-700 dark:bg-gray-800">
        <p className="text-gray-500 dark:text-gray-400">No saved palettes yet</p>
        <p className="mt-1 text-sm text-gray-400 dark:text-gray-500">
          Generate a palette and save it to see it here
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
      <h2 className="mb-4">Saved Palettes</h2>
      <div className="flex flex-col gap-3">
        {palettes.map((palette) => (
          <div
            key={palette.id}
            className="group flex items-center gap-3 rounded-lg border border-gray-200 p-3 transition-all hover:border-gray-300 dark:border-gray-700 dark:hover:border-gray-600"
          >
            {/* Color Preview */}
            <div className="flex flex-1 overflow-hidden rounded">
              {palette.colors.map((color, idx) => (
                <div
                  key={idx}
                  className="h-12 flex-1"
                  style={{ backgroundColor: color.hex }}
                  title={color.hex}
                />
              ))}
            </div>

            {/* Palette Info */}
            <div className="flex flex-col">
              <span className="text-sm">{palette.name}</span>
              <span className="text-xs text-gray-500 dark:text-gray-400">
                {new Date(palette.createdAt).toLocaleDateString()}
              </span>
            </div>

            {/* Actions */}
            <div className="flex gap-2 opacity-0 transition-opacity group-hover:opacity-100">
              <button
                onClick={() => onLoad(palette)}
                className="rounded-lg p-2 transition-colors hover:bg-gray-100 dark:hover:bg-gray-700"
                title="Load palette"
              >
                <Eye className="h-4 w-4" />
              </button>
              <button
                onClick={() => onDelete(palette.id)}
                className="rounded-lg p-2 text-red-600 transition-colors hover:bg-red-50 dark:hover:bg-red-900/20"
                title="Delete palette"
              >
                <Trash className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
