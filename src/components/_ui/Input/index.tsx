"use client"

import type React from "react"
import type { InputProps } from "./types"
import Loading from "../Loading"

const Input: React.FC<InputProps> = ({
  containerClassName,
  className,
  value,
  setValue,
  onBlur,
  placeholder,
  type,
  label,
  icon,
  readOnly,
  name,
  disabled,
  required,
  autocomplete,
  ref,
  error,
  min,
  max,
  id,
  loading,
  ...otherProps
}) => {
  const inputId = id || name || `input-${Math.random().toString(36).substr(2, 9)}`;
  const errorId = error ? `${inputId}-error` : undefined;

  return (
    <div className={`relative ${error ? "mb-4" : ""} ${containerClassName || ""}`}>
      {label && (
        <label htmlFor={inputId} className="block text-gray-700 mb-1">
          {label}
          {required && <span className="text-red-500 ml-1" aria-hidden="true">*</span>}
        </label>
      )}
      <div
        className={`flex items-center border rounded-lg transition-all duration-200 ${
          error
            ? "border-red-700 focus-within:ring-2 focus-within:ring-red-700"
            : "border-gray-300 focus-within:ring-2 focus-within:ring-[#4F85A6]"
        } ${disabled ? "bg-gray-50" : "bg-white"}`}
      >
        {icon && <div className="ml-2">{icon}</div>}
        <input
          id={inputId}
          className={`flex-1 w-full p-3 outline-none bg-transparent rounded-lg ${className || ""}`}
          type={type}
          placeholder={placeholder}
          value={value ?? ""}
          onChange={(e) => (setValue ? setValue(e.target.value) : undefined)}
          onBlur={onBlur}
          readOnly={readOnly}
          disabled={disabled}
          required={required}
          ref={ref}
          autoComplete={autocomplete}
          min={min}
          max={max}
          aria-invalid={error ? "true" : "false"}
          aria-describedby={errorId}
          {...otherProps}
        />
        {loading && (
          <div className="relative min-w-8 min-h-full flex justify-center items-center">
            <Loading size="xs" variant="spinner" />
          </div>
        )}
        
      </div>
      {error && (
        <span 
          id={errorId}
          className="absolute -bottom-6 left-0 text-red-700 text-sm"
          role="alert"
        >
          {error.message}
        </span>
      )}
    </div>
  )
}

export default Input
