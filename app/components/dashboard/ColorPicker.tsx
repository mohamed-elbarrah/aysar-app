"use client";

import { useState, useRef, useEffect } from "react";
import { HexColorPicker } from "react-colorful";

interface ColorPickerProps {
  label: string;
  color: string;
  onChange: (color: string) => void;
}

export function ColorPicker({ label, color, onChange }: ColorPickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [localColor, setLocalColor] = useState(color || "#ffffff");
  const pickerRef = useRef<HTMLDivElement>(null);
  const [currentColor, setCurrentColor] = useState(color);

  if (currentColor !== color) {
    setCurrentColor(color);
    setLocalColor(color || "#ffffff");
  }

  // Close picker when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (pickerRef.current && !pickerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const handleColorChange = (newColor: string) => {
    setLocalColor(newColor);
    onChange(newColor);
  };

  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Only update if it's a valid hex color
    if (/^#[0-9A-Fa-f]{6}$/.test(value)) {
      setLocalColor(value);
      onChange(value);
    } else {
      setLocalColor(value);
    }
  };

  return (
    <div className="form-group-contact" ref={pickerRef}>
      <label>{label}</label>
      <div className="flex items-center gap-3">
        {/* Color Preview Box - Click to open picker */}
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="اختيار لون"
          className="w-10 h-10 rounded-lg border-2 border-[#e8edf5] shadow-sm transition-transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-[#2d2e83] focus:ring-offset-2"
          style={{ backgroundColor: localColor }}
          title="Click to open color picker"
        />
        
        {/* Hex Input */}
        <input
          type="text"
          value={localColor}
          onChange={handleTextChange}
          className="form-control-contact flex-1"
          placeholder="#ffffff"
          maxLength={7}
        />
      </div>

      {/* Color Picker Popover */}
      {isOpen && (
        <div className="absolute z-50 mt-2 p-3 bg-white rounded-xl shadow-xl border border-[#e8edf5]">
          <HexColorPicker
            color={localColor}
            onChange={handleColorChange}
            style={{ width: "200px", height: "200px" }}
          />
          <div className="mt-3 flex items-center justify-between">
            <span className="text-sm text-[#6b7a94] font-mono">{localColor}</span>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="text-sm px-3 py-1 bg-[#0c2954] text-white rounded-lg hover:opacity-90 transition-opacity"
            >
              تم
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
