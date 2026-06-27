"use client";

import {
  forwardRef,
  useEffect,
  useId,
  useImperativeHandle,
  useRef,
  useState,
  type ButtonHTMLAttributes,
  type KeyboardEvent,
} from "react";
import { createPortal } from "react-dom";
import { Check, ChevronDown } from "lucide-react";

export interface SelectOption {
  value: string;
  label: string;
}

export interface SelectChangeEvent {
  target: {
    name?: string;
    value: string;
  };
  currentTarget: {
    name?: string;
    value: string;
  };
}

export interface SelectProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "onChange" | "value" | "defaultValue"> {
  label?: string;
  error?: string;
  hint?: string;
  options: SelectOption[];
  containerClassName?: string;
  value?: string;
  defaultValue?: string;
  name?: string;
  placeholder?: string;
  onChange?: (event: SelectChangeEvent) => void;
}

const MENU_GAP = 6;
const MENU_MAX_HEIGHT = 260;

const Select = forwardRef<HTMLButtonElement, SelectProps>(function Select(
  {
    label,
    error,
    hint,
    options,
    className = "",
    containerClassName = "",
    id,
    value,
    defaultValue,
    name,
    placeholder = "선택",
    disabled,
    onChange,
    onKeyDown,
    ...rest
  },
  ref,
) {
  const generatedId = useId();
  const selectId =
    id ?? (label ? `select-${label.replace(/\s+/g, "-").toLowerCase()}` : `select-${generatedId}`);
  const listboxId = `${selectId}-listbox`;
  const buttonRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const [internalValue, setInternalValue] = useState(defaultValue ?? options[0]?.value ?? "");
  const [highlightedIndex, setHighlightedIndex] = useState(0);
  const [menuStyle, setMenuStyle] = useState({
    left: 0,
    maxHeight: MENU_MAX_HEIGHT,
    top: 0,
    width: 0,
  });

  useImperativeHandle(ref, () => buttonRef.current as HTMLButtonElement);

  const selectedValue = value ?? internalValue;
  const selectedIndex = options.findIndex((option) => option.value === selectedValue);
  const selectedOption = selectedIndex >= 0 ? options[selectedIndex] : undefined;

  const updateMenuPosition = () => {
    const button = buttonRef.current;
    if (!button) return;
    const rect = button.getBoundingClientRect();
    const spaceBelow = window.innerHeight - rect.bottom - MENU_GAP - 8;
    const spaceAbove = rect.top - MENU_GAP - 8;
    const showAbove = spaceBelow < 180 && spaceAbove > spaceBelow;
    const maxHeight = Math.max(120, Math.min(MENU_MAX_HEIGHT, showAbove ? spaceAbove : spaceBelow));
    setMenuStyle({
      left: Math.round(rect.left),
      maxHeight,
      top: Math.round(showAbove ? rect.top - MENU_GAP - maxHeight : rect.bottom + MENU_GAP),
      width: Math.round(rect.width),
    });
  };

  const openMenu = () => {
    if (disabled || options.length === 0) return;
    updateMenuPosition();
    setHighlightedIndex(selectedIndex >= 0 ? selectedIndex : 0);
    setOpen(true);
  };

  const closeMenu = () => setOpen(false);

  const selectValue = (nextValue: string) => {
    if (value === undefined) setInternalValue(nextValue);
    onChange?.({
      currentTarget: { name, value: nextValue },
      target: { name, value: nextValue },
    });
    closeMenu();
    buttonRef.current?.focus();
  };

  useEffect(() => {
    if (!open) return;

    const onPointerDown = (event: PointerEvent) => {
      const target = event.target as Node;
      if (buttonRef.current?.contains(target) || menuRef.current?.contains(target)) return;
      closeMenu();
    };
    const onPositionChange = () => updateMenuPosition();

    document.addEventListener("pointerdown", onPointerDown);
    window.addEventListener("resize", onPositionChange);
    window.addEventListener("scroll", onPositionChange, true);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("resize", onPositionChange);
      window.removeEventListener("scroll", onPositionChange, true);
    };
  }, [open]);

  const handleKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    onKeyDown?.(event);
    if (event.defaultPrevented) return;

    if (event.key === "Escape") {
      closeMenu();
      return;
    }

    if (event.key === "ArrowDown") {
      event.preventDefault();
      if (!open) {
        openMenu();
        return;
      }
      setHighlightedIndex((current) => Math.min(options.length - 1, current + 1));
      return;
    }

    if (event.key === "ArrowUp") {
      event.preventDefault();
      if (!open) {
        openMenu();
        return;
      }
      setHighlightedIndex((current) => Math.max(0, current - 1));
      return;
    }

    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      if (!open) {
        openMenu();
        return;
      }
      const option = options[highlightedIndex];
      if (option) selectValue(option.value);
    }
  };

  const borderState = error
    ? "border-red-500/40 focus:border-red-500/60 focus:ring-red-500/20"
    : "border-white/10 focus:border-emerald-400/50 focus:ring-emerald-400/15";
  const triggerState = disabled
    ? "cursor-not-allowed opacity-50"
    : "cursor-pointer hover:bg-white/[0.07]";

  return (
    <div className={containerClassName}>
      {label && (
        <label
          htmlFor={selectId}
          className="block text-xs font-medium text-white/60 mb-1.5"
        >
          {label}
        </label>
      )}
      <button
        ref={buttonRef}
        id={selectId}
        type="button"
        role="combobox"
        aria-controls={listboxId}
        aria-expanded={open}
        aria-haspopup="listbox"
        aria-label={rest["aria-label"]}
        disabled={disabled}
        onClick={() => (open ? closeMenu() : openMenu())}
        onKeyDown={handleKeyDown}
        className={`focus-ring w-full bg-white/5 border rounded-lg px-3 py-2 text-left text-sm text-white focus:outline-none focus:bg-white/[0.07] focus:ring-2 transition-colors ${borderState} ${triggerState} ${className}`}
        {...rest}
      >
        <span className="flex min-w-0 items-center justify-between gap-3">
          <span className={`truncate ${selectedOption ? "text-white" : "text-white/35"}`}>
            {selectedOption?.label ?? placeholder}
          </span>
          <ChevronDown
            size={16}
            className={`shrink-0 text-white/40 transition-transform ${open ? "rotate-180" : ""}`}
          />
        </span>
      </button>
      {name && <input type="hidden" name={name} value={selectedValue} />}
      {error && <p className="text-xs text-red-400 mt-1">{error}</p>}
      {!error && hint && <p className="text-xs text-white/35 mt-1">{hint}</p>}

      {open &&
        createPortal(
          <div
            ref={menuRef}
            id={listboxId}
            role="listbox"
            style={{
              left: menuStyle.left,
              maxHeight: menuStyle.maxHeight,
              top: menuStyle.top,
              width: menuStyle.width,
            }}
            className="fixed z-[80] overflow-y-auto rounded-lg border border-white/12 bg-surface-4/95 p-1 shadow-2xl shadow-black/40 backdrop-blur-md"
          >
            {options.map((option, index) => {
              const selected = option.value === selectedValue;
              const highlighted = index === highlightedIndex;
              return (
                <button
                  key={option.value}
                  type="button"
                  role="option"
                  aria-selected={selected}
                  onClick={() => selectValue(option.value)}
                  onMouseEnter={() => setHighlightedIndex(index)}
                  className={`flex w-full items-center justify-between gap-3 rounded-md px-3 py-2 text-left text-sm transition-colors ${
                    highlighted ? "bg-white/10 text-white" : "text-white/70 hover:bg-white/7 hover:text-white"
                  }`}
                >
                  <span className="truncate">{option.label}</span>
                  {selected && <Check size={14} className="shrink-0 text-emerald-300" />}
                </button>
              );
            })}
          </div>,
          document.body,
        )}
    </div>
  );
});

export default Select;
