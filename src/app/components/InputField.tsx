import React from "react";
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

const InputField: React.FC<InputFieldProps> = ({
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
}) => {
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
        multiple
        accept={accept}
        name={name}
      />
      {error && <p className="text-error">{error.message}</p>}
    </label>
  );
};

export default InputField;
