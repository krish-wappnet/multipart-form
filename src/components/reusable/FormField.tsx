/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import classNames from "classnames";

interface FormFieldProps {
  id: string;
  label: string;
  type?: string;
  value: any;
  onChange: (value: any) => void;
  error?: string;
  options?: string[]; // For select
  rows?: number; // For textarea
  required?: boolean;
  className?: string;
}

const FormField: React.FC<FormFieldProps> = ({
  id,
  label,
  type = "text",
  value,
  onChange,
  error,
  options,
  rows,
  required,
  className,
}) => {
  const baseInputClasses =
    "mt-1 w-full p-3 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors";

  return (
    <div className={classNames("space-y-1", className)}>
      <label
        htmlFor={id}
        className="block text-sm font-semibold text-gray-700 dark:text-gray-200"
      >
        {label}
      </label>
      {type === "select" && options ? (
        <select
          id={id}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={baseInputClasses}
          aria-invalid={!!error}
          aria-describedby={error ? `${id}-error` : undefined}
          required={required}
        >
          {options.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      ) : type === "textarea" ? (
        <textarea
          id={id}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={baseInputClasses}
          rows={rows}
          aria-invalid={!!error}
          aria-describedby={error ? `${id}-error` : undefined}
          required={required}
        />
      ) : type === "checkbox" ? (
        <input
          id={id}
          type="checkbox"
          checked={value}
          onChange={(e) => onChange(e.target.checked)}
          className="mr-2 h-4 w-4 text-blue-500 focus:ring-blue-500 border-gray-300 dark:border-gray-600 rounded"
          aria-invalid={!!error}
          aria-describedby={error ? `${id}-error` : undefined}
        />
      ) : (
        <input
          id={id}
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={baseInputClasses}
          aria-invalid={!!error}
          aria-describedby={error ? `${id}-error` : undefined}
          required={required}
        />
      )}
      <AnimatePresence>
        {error && (
          <motion.p
            id={`${id}-error`}
            className="mt-1 text-sm text-red-500"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {error}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
};

export default FormField;