"use client";

import { forwardRef, type InputHTMLAttributes, type TextareaHTMLAttributes } from "react";
import { cn } from "@/lib/cn";

type FieldProps = {
  label?: string;
  hint?: string;
  error?: string;
  prefix?: React.ReactNode;
  suffix?: React.ReactNode;
};

type InputProps = Omit<InputHTMLAttributes<HTMLInputElement>, "prefix"> & FieldProps;

export const Input = forwardRef<HTMLInputElement, InputProps>(
  function Input({ label, hint, error, prefix, suffix, className, id, ...rest }, ref) {
    const inputId = id || rest.name;
    return (
      <div className="space-y-1.5">
        {label && (
          <label htmlFor={inputId} className="block text-sm font-medium text-foreground">
            {label}
          </label>
        )}
        <div
          className={cn(
            "flex items-center gap-2 h-11 px-3.5 rounded-2xl border bg-background transition-colors",
            "focus-within:ring-2 focus-within:ring-accent/30 focus-within:border-accent/50",
            rest.disabled ? "opacity-50 cursor-not-allowed bg-foreground/5" : "",
            error ? "border-red-400" : "border-border",
          )}
        >
          {prefix && <span className="text-muted text-sm shrink-0">{prefix}</span>}
          <input
            ref={ref}
            id={inputId}
            className={cn(
              "flex-1 bg-transparent outline-none text-[15px] placeholder:text-muted/70",
              className,
            )}
            {...rest}
          />
          {suffix && <span className="text-muted text-sm shrink-0">{suffix}</span>}
        </div>
        {error ? (
          <p className="text-xs text-red-600">{error}</p>
        ) : hint ? (
          <p className="text-xs text-muted">{hint}</p>
        ) : null}
      </div>
    );
  },
);

export const Textarea = forwardRef<
  HTMLTextAreaElement,
  TextareaHTMLAttributes<HTMLTextAreaElement> & FieldProps
>(function Textarea({ label, hint, error, className, id, ...rest }, ref) {
  const inputId = id || rest.name;
  return (
    <div className="space-y-1.5">
      {label && (
        <label htmlFor={inputId} className="block text-sm font-medium text-foreground">
          {label}
        </label>
      )}
      <textarea
        ref={ref}
        id={inputId}
        className={cn(
          "block w-full rounded-2xl border bg-background px-3.5 py-3 text-[15px] outline-none transition-colors",
          "placeholder:text-muted/70 focus:ring-2 focus:ring-accent/30 focus:border-accent/50",
          rest.disabled ? "opacity-50 cursor-not-allowed bg-foreground/5" : "",
          error ? "border-red-400" : "border-border",
          className,
        )}
        rows={4}
        {...rest}
      />
      {error ? (
        <p className="text-xs text-red-600">{error}</p>
      ) : hint ? (
        <p className="text-xs text-muted">{hint}</p>
      ) : null}
    </div>
  );
});
