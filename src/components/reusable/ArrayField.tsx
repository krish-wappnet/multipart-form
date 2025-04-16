/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import Card from "./Card";

interface ArrayFieldProps<T> {
  items: T[];
  renderItem: (item: T, index: number) => React.ReactNode;
  addItem: () => void;
  removeItem: (index: number) => void;
  title: string;
  addButtonLabel: string;
  minItems?: number;
  errors?: any;
}

const ArrayField = <T,>({
  items,
  renderItem,
  addItem,
  removeItem,
  title,
  addButtonLabel,
  minItems = 1,
  errors,
}: ArrayFieldProps<T>) => {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{title}</h2>
      {items.length === 0 && (
        <motion.p
          className="text-sm text-red-500"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
        >
          Please add at least one {title.toLowerCase()}.
        </motion.p>
      )}
      {items.map((item, index) => (
        <Card key={index}>
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              {title} {index + 1}
            </h3>
            {items.length > minItems && (
              <button
                onClick={() => removeItem(index)}
                className="px-3 py-1 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
                aria-label={`Remove ${title.toLowerCase()} ${index + 1}`}
              >
                Remove
              </button>
            )}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {renderItem(item, index)}
          </div>
        </Card>
      ))}
      <button
        onClick={addItem}
        className="px-4 py-2 bg-green-500 text-white rounded-md shadow-sm hover:bg-green-600 transition-colors"
        aria-label={`Add new ${title.toLowerCase()}`}
      >
        {addButtonLabel}
      </button>
      <AnimatePresence>
        {errors && typeof errors === "string" && (
          <motion.p
            className="mt-2 text-sm text-red-500"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {errors}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ArrayField;