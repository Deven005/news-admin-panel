import React, { forwardRef } from "react";
import { FieldError, UseFormRegisterReturn } from "react-hook-form";

interface InputFieldProps {
  type: string;
  label: string;
  register?: UseFormRegisterReturn<any>;
  placeholder: string;
  required?: boolean;
  error?: FieldError;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  accept?: string;
  className?: string;
  name?: string;
}

// Use React.forwardRef to forward the ref to the input element
const InputField = forwardRef<HTMLInputElement, InputFieldProps>(
  (
    {
      type,
      label,
      register,
      placeholder,
      required,
      error,
      onChange,
      accept,
      className,
      name,
    },
    ref
  ) => {
    return (
      <label className={`form-control w-full max-w-xl ${className}`}>
        <div className="label">
          <span className="label-text">{label}</span>
        </div>
        <input
          type={type}
          {...register}
          placeholder={placeholder}
          required={required}
          className={`input input-bordered w-full max-w-xl ${
            error ? "input-error" : ""
          }`}
          onChange={onChange}
          accept={accept}
          name={name}
          ref={ref} // Forward the ref here
        />
        {error && <p className="text-error">{error.message}</p>}
      </label>
    );
  }
);

// Display name helps with debugging
InputField.displayName = "InputField";

export default InputField;
