import React from "react";
import { FieldError, UseFormRegisterReturn } from "react-hook-form";

interface InputFieldProps {
  type?: string;
  label: string;
  register?: UseFormRegisterReturn<any>;
  placeholder: string;
  required?: boolean;
  error?: FieldError;
  rows?: number;
  className?: string;
  name?: string;
}

const InputTextAreaField: React.FC<InputFieldProps> = ({
  type,
  label,
  register,
  placeholder,
  required,
  error,
  rows,
  className,
  name,
}) => {
  return (
    <label className={`form-control w-full max-w-xl ${className}`}>
      <div className="label">
        <span className="label-text">{label}</span>
      </div>
      <textarea
        {...register}
        placeholder={placeholder}
        required={required}
        rows={rows}
        className={`input input-bordered w-full max-w-xl ${
          error ? "input-error" : ""
        }`}
        name={name}
      />
      {error && <p className="text-error">{error.message}</p>}
    </label>
  );
};

export default InputTextAreaField;
