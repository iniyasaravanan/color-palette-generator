import React, { useState } from 'react';
import { Copy, Lock, Unlock, Check } from 'lucide-react';
import { Color } from '../utils/colorUtils';
import tinycolor from 'tinycolor2';

interface ColorCardProps {
  color: Color;
  onToggleLock: () => void;
  onColorChange?: (newColor: string) => void;
}

export function ColorCard({ color, onToggleLock, onColorChange }: ColorCardProps) {
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(color.hex);

  const copyToClipboard = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const isDark = tinycolor(color.hex).isDark();

  const handleColorInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newColor = e.target.value;
    setEditValue(newColor);
    if (tinycolor(newColor).isValid() && onColorChange) {
      onColorChange(newColor);
    }
  };

  return (
    <div className="group relative flex flex-col overflow-hidden rounded-lg shadow-md transition-all hover:shadow-xl">
      {/* Color Preview */}
      <div
        className="relative h-48 w-full cursor-pointer transition-all"
        style={{ backgroundColor: color.hex }}
        onClick={() => setIsEditing(!isEditing)}
      >
        {/* Lock Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleLock();
          }}
          className="absolute right-2 top-2 rounded-md bg-white/20 p-2 opacity-0 backdrop-blur-sm transition-all hover:bg-white/30 group-hover:opacity-100"
        >
          {color.locked ? (
            <Lock className="h-4 w-4" style={{ color: isDark ? '#fff' : '#000' }} />
          ) : (
            <Unlock className="h-4 w-4" style={{ color: isDark ? '#fff' : '#000' }} />
          )}
        </button>

        {/* Color Input (when editing) */}
        {isEditing && onColorChange && (
          <input
            type="color"
            value={color.hex}
            onChange={handleColorInputChange}
            className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
            onClick={(e) => e.stopPropagation()}
          />
        )}
      </div>

      {/* Color Info */}
      <div className="flex flex-col gap-1 bg-white p-4 dark:bg-gray-800">
        {/* Color Name */}
        {color.name !== color.hex && (
          <div className="mb-1">
            <span className="text-sm text-gray-600 dark:text-gray-400">{color.name}</span>
          </div>
        )}

        {/* HEX */}
        <div className="flex items-center justify-between group/item">
          <div className="flex flex-col">
            <span className="text-xs uppercase text-gray-500 dark:text-gray-500">HEX</span>
            <input
              type="text"
              value={editValue}
              onChange={(e) => {
                setEditValue(e.target.value);
              }}
              onBlur={() => {
                if (tinycolor(editValue).isValid() && onColorChange) {
                  onColorChange(editValue);
                } else {
                  setEditValue(color.hex);
                }
              }}
              className="w-20 border-none bg-transparent p-0 font-mono outline-none focus:ring-0"
            />
          </div>
          <button
            onClick={() => copyToClipboard(color.hex, 'hex')}
            className="rounded p-1 opacity-0 transition-opacity hover:bg-gray-100 group-hover/item:opacity-100 dark:hover:bg-gray-700"
          >
            {copiedField === 'hex' ? (
              <Check className="h-3.5 w-3.5 text-green-600" />
            ) : (
              <Copy className="h-3.5 w-3.5 text-gray-600 dark:text-gray-400" />
            )}
          </button>
        </div>

        {/* RGB */}
        <div className="flex items-center justify-between group/item">
          <div className="flex flex-col">
            <span className="text-xs uppercase text-gray-500 dark:text-gray-500">RGB</span>
            <span className="font-mono text-sm">{color.rgb}</span>
          </div>
          <button
            onClick={() => copyToClipboard(color.rgb, 'rgb')}
            className="rounded p-1 opacity-0 transition-opacity hover:bg-gray-100 group-hover/item:opacity-100 dark:hover:bg-gray-700"
          >
            {copiedField === 'rgb' ? (
              <Check className="h-3.5 w-3.5 text-green-600" />
            ) : (
              <Copy className="h-3.5 w-3.5 text-gray-600 dark:text-gray-400" />
            )}
          </button>
        </div>

        {/* HSL */}
        <div className="flex items-center justify-between group/item">
          <div className="flex flex-col">
            <span className="text-xs uppercase text-gray-500 dark:text-gray-500">HSL</span>
            <span className="font-mono text-sm">{color.hsl}</span>
          </div>
          <button
            onClick={() => copyToClipboard(color.hsl, 'hsl')}
            className="rounded p-1 opacity-0 transition-opacity hover:bg-gray-100 group-hover/item:opacity-100 dark:hover:bg-gray-700"
          >
            {copiedField === 'hsl' ? (
              <Check className="h-3.5 w-3.5 text-green-600" />
            ) : (
              <Copy className="h-3.5 w-3.5 text-gray-600 dark:text-gray-400" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
