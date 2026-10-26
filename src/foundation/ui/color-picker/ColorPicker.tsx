import * as React from "react";

import { mergeClassNames } from "@foundation/lib/class-names";

import styles from "./ColorPicker.module.scss";

interface HsvColor {
  h: number;
  s: number;
  v: number;
}

interface RgbColor {
  r: number;
  g: number;
  b: number;
}

export interface ColorPickerProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "onChange"> {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  ariaLabel?: string;
}

const presetColors = [
  "#d0021b",
  "#f5a623",
  "#f8e71c",
  "#8b572a",
  "#7ed321",
  "#417505",
  "#bd10e0",
  "#9013fe",
  "#4a90e2",
  "#50e3c2",
  "#b8e986",
  "#000000",
  "#4a4a4a",
  "#9b9b9b",
  "#ffffff",
] as const;

function clamp(value: number, minimum: number, maximum: number) {
  return Math.min(maximum, Math.max(minimum, value));
}

export function normalizeHexColor(value: string): string | null {
  const candidate = value.trim().toLowerCase();
  const withHash = candidate.startsWith("#") ? candidate : `#${candidate}`;

  if (/^#[0-9a-f]{6}$/.test(withHash)) return withHash;
  if (!/^#[0-9a-f]{3}$/.test(withHash)) return null;

  return `#${withHash
    .slice(1)
    .split("")
    .map((character) => `${character}${character}`)
    .join("")}`;
}

function hexToRgb(value: string): RgbColor {
  return {
    r: parseInt(value.slice(1, 3), 16),
    g: parseInt(value.slice(3, 5), 16),
    b: parseInt(value.slice(5, 7), 16),
  };
}

function rgbToHex({ r, g, b }: RgbColor) {
  return `#${[r, g, b]
    .map((channel) =>
      Math.round(clamp(channel, 0, 255)).toString(16).padStart(2, "0"),
    )
    .join("")}`;
}

function hexToHsv(value: string): HsvColor {
  const rgb = hexToRgb(value);
  const red = rgb.r / 255;
  const green = rgb.g / 255;
  const blue = rgb.b / 255;
  const maximum = Math.max(red, green, blue);
  const minimum = Math.min(red, green, blue);
  const delta = maximum - minimum;
  let hue = 0;

  if (delta !== 0) {
    if (maximum === red) hue = 60 * (((green - blue) / delta) % 6);
    else if (maximum === green) hue = 60 * ((blue - red) / delta + 2);
    else hue = 60 * ((red - green) / delta + 4);
  }

  if (hue < 0) hue += 360;
  return {
    h: hue,
    s: maximum === 0 ? 0 : delta / maximum,
    v: maximum,
  };
}

function hsvToHex({ h, s, v }: HsvColor) {
  const normalizedHue = ((h % 360) + 360) % 360;
  const chroma = clamp(v, 0, 1) * clamp(s, 0, 1);
  const intermediate =
    chroma * (1 - Math.abs(((normalizedHue / 60) % 2) - 1));
  const offset = clamp(v, 0, 1) - chroma;
  let red = 0;
  let green = 0;
  let blue = 0;

  if (normalizedHue < 60) [red, green, blue] = [chroma, intermediate, 0];
  else if (normalizedHue < 120)
    [red, green, blue] = [intermediate, chroma, 0];
  else if (normalizedHue < 180)
    [red, green, blue] = [0, chroma, intermediate];
  else if (normalizedHue < 240)
    [red, green, blue] = [0, intermediate, chroma];
  else if (normalizedHue < 300)
    [red, green, blue] = [intermediate, 0, chroma];
  else [red, green, blue] = [chroma, 0, intermediate];

  return `#${[red, green, blue]
    .map((channel) =>
      Math.round((channel + offset) * 255)
        .toString(16)
        .padStart(2, "0"),
    )
    .join("")}`;
}

export function ColorPicker({
  value,
  onChange,
  disabled = false,
  className,
  ariaLabel = "颜色选择器",
  ...props
}: ColorPickerProps) {
  const normalizedValue = normalizeHexColor(value) ?? "#ffffff";
  const rgb = hexToRgb(normalizedValue);
  const [hsv, setHsv] = React.useState(() => hexToHsv(normalizedValue));
  const [draft, setDraft] = React.useState(
    normalizedValue.slice(1).toUpperCase(),
  );
  const [redDraft, setRedDraft] = React.useState(String(rgb.r));
  const [greenDraft, setGreenDraft] = React.useState(String(rgb.g));
  const [blueDraft, setBlueDraft] = React.useState(String(rgb.b));
  const [alpha, setAlpha] = React.useState(100);
  const [alphaDraft, setAlphaDraft] = React.useState("100");
  const [controlledSyncRevision, requestControlledSync] = React.useReducer(
    (revision: number) => revision + 1,
    0,
  );

  const syncColorDrafts = (nextValue: string) => {
    const nextRgb = hexToRgb(nextValue);
    setDraft(nextValue.slice(1).toUpperCase());
    setRedDraft(String(nextRgb.r));
    setGreenDraft(String(nextRgb.g));
    setBlueDraft(String(nextRgb.b));
  };

  React.useLayoutEffect(() => {
    setHsv((currentHsv) =>
      hsvToHex(currentHsv) === normalizedValue
        ? currentHsv
        : hexToHsv(normalizedValue),
    );
    syncColorDrafts(normalizedValue);
  }, [controlledSyncRevision, normalizedValue]);

  const emitHsv = (nextHsv: HsvColor) => {
    const nextValue = hsvToHex(nextHsv);
    setHsv(nextHsv);
    syncColorDrafts(nextValue);
    if (nextValue !== normalizedValue) {
      requestControlledSync();
      onChange(nextValue);
    }
  };

  const emitHex = (nextValue: string) => {
    const normalized = normalizeHexColor(nextValue);
    if (!normalized) return false;
    syncColorDrafts(normalized);
    setHsv(hexToHsv(normalized));
    if (normalized !== normalizedValue) {
      requestControlledSync();
      onChange(normalized);
    }
    return true;
  };

  const updateRgbChannel = (
    channel: keyof RgbColor,
    nextDraft: string,
  ) => {
    if (channel === "r") setRedDraft(nextDraft);
    else if (channel === "g") setGreenDraft(nextDraft);
    else setBlueDraft(nextDraft);

    const parsed = Number(nextDraft);
    if (!Number.isInteger(parsed) || parsed < 0 || parsed > 255) return;
    emitHex(rgbToHex({ ...rgb, [channel]: parsed }));
  };

  const updateAlpha = (nextAlpha: number) => {
    const clamped = Math.round(clamp(nextAlpha, 0, 100));
    setAlpha(clamped);
    setAlphaDraft(String(clamped));
  };

  const updateSaturationFromPointer = (
    event: React.PointerEvent<HTMLDivElement>,
  ) => {
    const bounds = event.currentTarget.getBoundingClientRect();
    emitHsv({
      h: hsv.h,
      s: clamp((event.clientX - bounds.left) / bounds.width, 0, 1),
      v: clamp(1 - (event.clientY - bounds.top) / bounds.height, 0, 1),
    });
  };

  const updateHueFromPointer = (
    event: React.PointerEvent<HTMLDivElement>,
  ) => {
    const bounds = event.currentTarget.getBoundingClientRect();
    emitHsv({
      ...hsv,
      h: clamp((event.clientX - bounds.left) / bounds.width, 0, 1) * 359,
    });
  };

  const updateAlphaFromPointer = (
    event: React.PointerEvent<HTMLDivElement>,
  ) => {
    const bounds = event.currentTarget.getBoundingClientRect();
    updateAlpha(((event.clientX - bounds.left) / bounds.width) * 100);
  };

  const saturationKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    const step = event.shiftKey ? 0.1 : 0.01;
    let next = hsv;

    if (event.key === "ArrowLeft") next = { ...hsv, s: clamp(hsv.s - step, 0, 1) };
    else if (event.key === "ArrowRight")
      next = { ...hsv, s: clamp(hsv.s + step, 0, 1) };
    else if (event.key === "ArrowUp")
      next = { ...hsv, v: clamp(hsv.v + step, 0, 1) };
    else if (event.key === "ArrowDown")
      next = { ...hsv, v: clamp(hsv.v - step, 0, 1) };
    else if (event.key === "Home") next = { ...hsv, s: 0, v: 1 };
    else if (event.key === "End") next = { ...hsv, s: 1, v: 0 };
    else return;

    event.preventDefault();
    emitHsv(next);
  };

  const hueKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    const step = event.shiftKey ? 10 : 1;
    let nextHue = hsv.h;

    if (event.key === "ArrowLeft" || event.key === "ArrowDown")
      nextHue = clamp(hsv.h - step, 0, 359);
    else if (event.key === "ArrowRight" || event.key === "ArrowUp")
      nextHue = clamp(hsv.h + step, 0, 359);
    else if (event.key === "Home") nextHue = 0;
    else if (event.key === "End") nextHue = 359;
    else return;

    event.preventDefault();
    emitHsv({ ...hsv, h: nextHue });
  };

  const alphaKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    const step = event.shiftKey ? 10 : 1;
    let nextAlpha = alpha;

    if (event.key === "ArrowLeft" || event.key === "ArrowDown")
      nextAlpha = alpha - step;
    else if (event.key === "ArrowRight" || event.key === "ArrowUp")
      nextAlpha = alpha + step;
    else if (event.key === "Home") nextAlpha = 0;
    else if (event.key === "End") nextAlpha = 100;
    else return;

    event.preventDefault();
    updateAlpha(nextAlpha);
  };

  const renderRgbField = (
    label: "R" | "G" | "B",
    channel: keyof RgbColor,
    channelDraft: string,
  ) => (
    <label className={styles.singleField}>
      <input
        className={styles.fieldInput}
        value={channelDraft}
        disabled={disabled}
        inputMode="numeric"
        spellCheck={false}
        aria-label={`${label} 颜色通道`}
        onChange={(event) => updateRgbChannel(channel, event.target.value)}
        onBlur={() => {
          const parsed = Number(channelDraft);
          if (!Number.isInteger(parsed) || parsed < 0 || parsed > 255) {
            updateRgbChannel(channel, String(rgb[channel]));
          }
        }}
        data-color-picker-channel={label.toLowerCase()}
      />
      <span className={styles.fieldLabel}>{label}</span>
    </label>
  );

  return (
    <div
      {...props}
      className={mergeClassNames(styles.picker, className)}
      data-color-picker
      data-color-picker-value={normalizedValue}
      data-disabled={disabled ? "" : undefined}
      aria-label={ariaLabel}
    >
      <div
        className={styles.saturation}
        style={
          {
            "--color-picker-hue-background": `hsl(${hsv.h}, 100%, 50%)`,
          } as React.CSSProperties
        }
        role="slider"
        tabIndex={disabled ? -1 : 0}
        aria-label="饱和度和亮度"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(hsv.s * hsv.v * 100)}
        aria-valuetext={`饱和度 ${Math.round(hsv.s * 100)}%，亮度 ${Math.round(hsv.v * 100)}%`}
        aria-disabled={disabled || undefined}
        onKeyDown={disabled ? undefined : saturationKeyDown}
        onPointerDown={
          disabled
            ? undefined
            : (event) => {
                event.currentTarget.setPointerCapture(event.pointerId);
                updateSaturationFromPointer(event);
              }
        }
        onPointerMove={
          disabled
            ? undefined
            : (event) => {
                if (event.currentTarget.hasPointerCapture(event.pointerId)) {
                  updateSaturationFromPointer(event);
                }
              }
        }
        data-color-picker-saturation
      >
        <span className={styles.saturationWhite} aria-hidden="true" />
        <span className={styles.saturationBlack} aria-hidden="true" />
        <span
          className={styles.saturationThumb}
          style={
            {
              "--color-picker-saturation-x": `${hsv.s * 100}%`,
              "--color-picker-saturation-y": `${(1 - hsv.v) * 100}%`,
            } as React.CSSProperties
          }
          aria-hidden="true"
        />
      </div>

      <div className={styles.controls}>
        <div className={styles.sliders}>
          <div
            className={styles.hue}
            role="slider"
            tabIndex={disabled ? -1 : 0}
            aria-label="色相"
            aria-valuemin={0}
            aria-valuemax={359}
            aria-valuenow={Math.round(hsv.h)}
            aria-disabled={disabled || undefined}
            onKeyDown={disabled ? undefined : hueKeyDown}
            onPointerDown={
              disabled
                ? undefined
                : (event) => {
                    event.currentTarget.setPointerCapture(event.pointerId);
                    updateHueFromPointer(event);
                  }
            }
            onPointerMove={
              disabled
                ? undefined
                : (event) => {
                    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
                      updateHueFromPointer(event);
                    }
                  }
            }
            data-color-picker-hue
          >
            <span
              className={styles.hueThumb}
              style={
                {
                  "--color-picker-hue-x": `${(hsv.h / 359) * 100}%`,
                } as React.CSSProperties
              }
              aria-hidden="true"
            />
          </div>
          <div
            className={styles.alpha}
            role="slider"
            tabIndex={disabled ? -1 : 0}
            aria-label="透明度"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={alpha}
            aria-disabled={disabled || undefined}
            onKeyDown={disabled ? undefined : alphaKeyDown}
            onPointerDown={
              disabled
                ? undefined
                : (event) => {
                    event.currentTarget.setPointerCapture(event.pointerId);
                    updateAlphaFromPointer(event);
                  }
            }
            onPointerMove={
              disabled
                ? undefined
                : (event) => {
                    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
                      updateAlphaFromPointer(event);
                    }
                  }
            }
            data-color-picker-alpha
          >
            <span className={styles.checkboard} aria-hidden="true" />
            <span
              className={styles.alphaGradient}
              style={
                {
                  "--color-picker-alpha-gradient": `linear-gradient(to right, rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0), rgb(${rgb.r}, ${rgb.g}, ${rgb.b}))`,
                } as React.CSSProperties
              }
              aria-hidden="true"
            />
            <span
              className={styles.alphaThumb}
              style={
                {
                  "--color-picker-alpha-x": `${alpha}%`,
                } as React.CSSProperties
              }
              aria-hidden="true"
            />
          </div>
        </div>
        <span className={styles.preview} aria-hidden="true">
          <span className={styles.checkboard} />
          <span
            className={styles.activeColor}
            style={
              {
                "--color-picker-active-color": `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${alpha / 100})`,
              } as React.CSSProperties
            }
          />
        </span>
      </div>

      <div className={styles.fields}>
        <label className={styles.hexField}>
          <input
            className={styles.fieldInput}
            value={draft}
            disabled={disabled}
            spellCheck={false}
            aria-label="十六进制颜色"
            onChange={(event) => {
              const nextDraft = event.target.value;
              setDraft(nextDraft);
              if (/^#?[0-9a-f]{6}$/i.test(nextDraft.trim())) {
                emitHex(nextDraft);
              }
            }}
            onKeyDown={(event) => {
              if (event.key !== "Enter") return;
              event.preventDefault();
              if (!emitHex(draft)) {
                setDraft(normalizedValue.slice(1).toUpperCase());
              }
            }}
            onBlur={() => {
              if (!emitHex(draft)) {
                setDraft(normalizedValue.slice(1).toUpperCase());
              }
            }}
            data-color-picker-input
          />
          <span className={styles.fieldLabel}>Hex</span>
        </label>
        {renderRgbField("R", "r", redDraft)}
        {renderRgbField("G", "g", greenDraft)}
        {renderRgbField("B", "b", blueDraft)}
        <label className={styles.singleField}>
          <input
            className={styles.fieldInput}
            value={alphaDraft}
            disabled={disabled}
            inputMode="numeric"
            spellCheck={false}
            aria-label="透明度百分比"
            onChange={(event) => {
              const nextDraft = event.target.value;
              setAlphaDraft(nextDraft);
              const parsed = Number(nextDraft);
              if (
                Number.isInteger(parsed) &&
                parsed >= 0 &&
                parsed <= 100
              ) {
                setAlpha(parsed);
              }
            }}
            onBlur={() => {
              const parsed = Number(alphaDraft);
              if (!Number.isInteger(parsed) || parsed < 0 || parsed > 100) {
                setAlphaDraft(String(alpha));
              }
            }}
            data-color-picker-channel="a"
          />
          <span className={styles.fieldLabel}>A</span>
        </label>
      </div>

      <div className={styles.palette} aria-label="预设颜色">
        {presetColors.map((color) => (
          <button
            key={color}
            className={styles.swatch}
            style={
              {
                "--color-picker-swatch-color": color,
              } as React.CSSProperties
            }
            type="button"
            title={color}
            aria-label={`选择颜色 ${color}`}
            disabled={disabled}
            onClick={() => emitHex(color)}
            data-color-picker-swatch={color}
          />
        ))}
      </div>
    </div>
  );
}
