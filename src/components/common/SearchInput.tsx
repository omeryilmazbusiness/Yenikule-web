"use client";

import { Search, X } from "lucide-react";
import { useEffect, useId, useState } from "react";

import { Input } from "@/components/ui/input";
import { cn } from "@/lib/cn";

type SearchInputProps = {
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  onDebouncedChange?: (value: string) => void;
  debounceMs?: number;
  placeholder?: string;
  className?: string;
  inputClassName?: string;
  disabled?: boolean;
  autoFocus?: boolean;
};

export function SearchInput({
  value: controlledValue,
  defaultValue = "",
  onChange,
  onDebouncedChange,
  debounceMs = 300,
  placeholder = "Ara...",
  className,
  inputClassName,
  disabled,
  autoFocus,
}: SearchInputProps) {
  const inputId = useId();
  const isControlled = controlledValue !== undefined;
  const [internalValue, setInternalValue] = useState(defaultValue);
  const value = isControlled ? controlledValue : internalValue;

  useEffect(() => {
    if (!onDebouncedChange) return;

    const timer = window.setTimeout(() => {
      onDebouncedChange(value);
    }, debounceMs);

    return () => window.clearTimeout(timer);
  }, [value, debounceMs, onDebouncedChange]);

  function updateValue(next: string) {
    if (!isControlled) {
      setInternalValue(next);
    }
    onChange?.(next);
  }

  function handleClear() {
    updateValue("");
  }

  return (
    <div className={cn("relative", className)}>
      <label htmlFor={inputId} className="sr-only">
        {placeholder}
      </label>
      <Search
        className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
        aria-hidden
      />
      <Input
        id={inputId}
        type="search"
        value={value}
        onChange={(event) => updateValue(event.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        autoFocus={autoFocus}
        className={cn("pl-9 pr-9", inputClassName)}
      />
      {value ? (
        <button
          type="button"
          onClick={handleClear}
          className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md p-1 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
          aria-label="Aramayı temizle"
        >
          <X className="size-4" aria-hidden />
        </button>
      ) : null}
    </div>
  );
}
