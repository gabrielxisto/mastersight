/* eslint-disable react-hooks/exhaustive-deps */
import type React from "react";
import { useCallback, useMemo } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";
import { Pipette, Plus } from "lucide-react";
import { RgbaColorPicker } from "react-colorful";
import { debounce } from "lodash";
import { Button } from "./button";
import { Input } from "./input";

const DEFAULT_CHILDREN = (
  <div className="bg-gradient-to-br from-pink-300/20 via-violet-300/20 to-indigo-300/20 flex items-center justify-center rounded-full h-fit w-fit aspect-square p-[0.2rem] md:p-[0.2vw]">
    <div className="bg-gradient-to-br from-pink-300 via-violet-300 to-indigo-300 h-[2rem] md:h-[2vw] aspect-square rounded-full flex items-center justify-center">
      <Pipette className="text-white w-[1rem] md:w-[1vw] aspect-square" />
    </div>
  </div>
);

type TColorPicker = {
  value: string;
  onChange: (value: string) => void;
  handleSave?: (value: string) => void;
  children?: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
};

function rgbaToHex(r: number, g: number, b: number, a = 1) {
  const toHex = (n: number) => {
    const hex = n.toString(16);
    return hex.length === 1 ? `0${hex}` : hex;
  };

  const alpha = Number.isNaN(a) ? 255 : Math.round(a * 255);

  return `#${toHex(r)}${toHex(g)}${toHex(b)}${
    alpha === 255 ? "" : toHex(alpha)
  }`;
}

function hexToRgba(hex: string) {
  if (!hex) return null;
  let normalizedHex = hex.replace(/^#/, "");

  if (normalizedHex.length === 3) {
    normalizedHex = normalizedHex
      .split("")
      .map((char) => char + char)
      .join("");
  }

  if (normalizedHex.length !== 6 && normalizedHex.length !== 8) return null;

  const r = Number.parseInt(normalizedHex.substring(0, 2), 16);
  const g = Number.parseInt(normalizedHex.substring(2, 4), 16);
  const b = Number.parseInt(normalizedHex.substring(4, 6), 16);
  const a = normalizedHex.length === 8 ? Number.parseInt(normalizedHex.substring(6, 8), 16) / 255 : 1;

  return { r, g, b, a };
}

const ColorPicker: React.FC<TColorPicker> = ({
  value,
  onChange,
  handleSave,
  open,
  onOpenChange,
  children = DEFAULT_CHILDREN,
}) => {
  const color = useMemo(() => {
    const rgba = hexToRgba(value);
    return { hex: value, alpha: rgba ? rgba.a : 1 };
  }, [value]);

  const debouncedOnChange = useMemo(
    () => debounce((newValue: string) => onChange(newValue), 50),
    [onChange]
  );

  const handleChangeColor = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newColor: any = e.target.value;
    onChange(newColor);
  };

  const handleColorChange = useCallback(
    (newColor: { r: number; g: number; b: number; a: number }) => {
      const { r, g, b, a } = newColor;
      const newHex = rgbaToHex(r, g, b, a);
      debouncedOnChange(newHex);
    },
    [debouncedOnChange]
  );

  return (
    <Popover open={open} onOpenChange={onOpenChange}>
      <PopoverTrigger>{children}</PopoverTrigger>
      <PopoverContent align="center" side="top" className="w-[18rem] h-[22rem]">
        <div className="size-full flex flex-col items-center justify-between">
          <RgbaColorPicker
            color={hexToRgba(color.hex) as any}
            onChange={handleColorChange}
            className="!w-full aspect-square"
          />
          <div className="w-full flex flex-col items-center gap-[1.5rem] md:gap-[1.5vw] mt-[0.5rem] md:mt-[0.5vw]">
            <div className="w-full h-[2.5rem] md:h-[2.5vw] flex items-center justify-center">
              <label htmlFor="hex-input" className="mr-[0.5rem] md:mr-[0.5vw]">HEX</label>
              <Input
                id="hex-input"
                className="w-full !rounded-r-none !tracking-widest"
                value={color.hex}
                onChange={handleChangeColor}
              />
            </div>
            {handleSave && (
              <Button
                className="w-full gap-0"
                onClick={() => handleSave(value)}
              >
                <Plus className="h-4 md:h-[1.2vw] aspect-square" />
                Salvar cor
              </Button>
            )}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default ColorPicker;