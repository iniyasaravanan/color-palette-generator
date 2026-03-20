import React, { useState } from 'react';
import { X, Download, Copy, Check } from 'lucide-react';
import { Color, exportAsCSS, exportAsTailwind, exportAsJSON } from '../utils/colorUtils';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  colors: Color[];
}

export function ExportModal({ isOpen, onClose, colors }: ExportModalProps) {
  const [exportFormat, setExportFormat] = useState<'css' | 'tailwind' | 'json' | 'svg'>('css');
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const getExportCode = () => {
    switch (exportFormat) {
      case 'css':
        return exportAsCSS(colors);
      case 'tailwind':
        return exportAsTailwind(colors);
      case 'json':
        return exportAsJSON(colors);
      case 'svg':
        return generateSVG();
      default:
        return '';
    }
  };

  const generateSVG = () => {
    const width = 500;
    const height = 100;
    const colorWidth = width / colors.length;

    return `<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
${colors.map((color, idx) => `  <rect x="${idx * colorWidth}" y="0" width="${colorWidth}" height="${height}" fill="${color.hex}"/>`).join('\n')}
</svg>`;
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(getExportCode());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const code = getExportCode();
    const blob = new Blob([code], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    
    const extensions = {
      css: 'css',
      tailwind: 'json',
      json: 'json',
      svg: 'svg',
    };
    
    a.download = `palette.${extensions[exportFormat]}`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleDownloadPNG = () => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d')!;
    const width = 1000;
    const height = 200;
    const colorWidth = width / colors.length;

    canvas.width = width;
    canvas.height = height;

    colors.forEach((color, idx) => {
      ctx.fillStyle = color.hex;
      ctx.fillRect(idx * colorWidth, 0, colorWidth, height);
    });

    canvas.toBlob((blob) => {
      if (blob) {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'palette.png';
        a.click();
        URL.revokeObjectURL(url);
      }
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={onClose}>
      <div
        className="w-full max-w-2xl rounded-lg bg-white shadow-xl dark:bg-gray-800"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-200 p-6 dark:border-gray-700">
          <h2>Export Palette</h2>
          <button
            onClick={onClose}
            className="rounded-lg p-2 transition-colors hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Format Selection */}
          <div className="mb-4 flex flex-col gap-2">
            <label className="text-sm">Export Format</label>
            <div className="flex gap-2">
              <button
                onClick={() => setExportFormat('css')}
                className={`rounded-lg px-4 py-2 transition-colors ${
                  exportFormat === 'css'
                    ? 'bg-blue-600 text-white'
                    : 'border border-gray-300 dark:border-gray-600'
                }`}
              >
                CSS Variables
              </button>
              <button
                onClick={() => setExportFormat('tailwind')}
                className={`rounded-lg px-4 py-2 transition-colors ${
                  exportFormat === 'tailwind'
                    ? 'bg-blue-600 text-white'
                    : 'border border-gray-300 dark:border-gray-600'
                }`}
              >
                Tailwind Config
              </button>
              <button
                onClick={() => setExportFormat('json')}
                className={`rounded-lg px-4 py-2 transition-colors ${
                  exportFormat === 'json'
                    ? 'bg-blue-600 text-white'
                    : 'border border-gray-300 dark:border-gray-600'
                }`}
              >
                JSON
              </button>
              <button
                onClick={() => setExportFormat('svg')}
                className={`rounded-lg px-4 py-2 transition-colors ${
                  exportFormat === 'svg'
                    ? 'bg-blue-600 text-white'
                    : 'border border-gray-300 dark:border-gray-600'
                }`}
              >
                SVG
              </button>
            </div>
          </div>

          {/* Code Preview */}
          <div className="mb-4">
            <pre className="max-h-64 overflow-auto rounded-lg border border-gray-300 bg-gray-50 p-4 font-mono text-sm dark:border-gray-600 dark:bg-gray-900">
              {getExportCode()}
            </pre>
          </div>

          {/* Actions */}
          <div className="flex gap-2">
            <button
              onClick={handleCopy}
              className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-gray-300 px-4 py-2 transition-colors hover:bg-gray-50 dark:border-gray-600 dark:hover:bg-gray-700"
            >
              {copied ? (
                <>
                  <Check className="h-4 w-4" />
                  Copied!
                </>
              ) : (
                <>
                  <Copy className="h-4 w-4" />
                  Copy Code
                </>
              )}
            </button>
            <button
              onClick={handleDownload}
              className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-white transition-colors hover:bg-blue-700"
            >
              <Download className="h-4 w-4" />
              Download {exportFormat.toUpperCase()}
            </button>
            <button
              onClick={handleDownloadPNG}
              className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-gray-300 px-4 py-2 transition-colors hover:bg-gray-50 dark:border-gray-600 dark:hover:bg-gray-700"
            >
              <Download className="h-4 w-4" />
              Download PNG
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
