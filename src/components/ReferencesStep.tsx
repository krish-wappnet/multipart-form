/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "../redux/Store";
import { Reference } from "../types/form";
import { addReference, updateReference, removeReference } from "../redux/FormSlice";
import { motion, AnimatePresence } from "framer-motion";

interface ReferencesStepProps {
  skipReferences: boolean;
  setSkipReferences: (value: boolean) => void;
}

const ReferencesStep: React.FC<ReferencesStepProps> = React.memo(
  ({ skipReferences, setSkipReferences }) => {
    const dispatch = useDispatch<AppDispatch>();
    const formData = useSelector((state: RootState) => state.form.formData);
    const errors = useSelector((state: RootState) => state.form.errors);

    
    const handleAddReference = useCallback(() => {

      dispatch(
        addReference({
          name: "",
          relationship: "",
          company: "",
          contact: "",
        })
      );
    }, [dispatch]);

    const handleRemoveReference = useCallback(
      (index: number) => {
        dispatch(removeReference(index));
      },
      [dispatch]
    );

    const handleClearReferences = useCallback(() => {
      formData.references.forEach((_,) => {
        dispatch(removeReference(0)); 
      });
    }, [dispatch, formData.references]);

    return (
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">References</h2>
        <label
          htmlFor="skipReferences"
          className="flex items-center text-sm font-semibold text-gray-700 dark:text-gray-200"
        >
          <input
            id="skipReferences"
            type="checkbox"
            checked={skipReferences}
            onChange={() => {
              setSkipReferences(!skipReferences);
              if (!skipReferences) {
                handleClearReferences();
              }
            }}
            className="mr-2 h-4 w-4 text-blue-500 focus:ring-blue-500 border-gray-300 dark:border-gray-600 rounded"
          />
          Skip adding references
        </label>
        {!skipReferences && (
          <>
            {formData.references.map((ref: Reference, index: number) => (
              <div
                key={index}
                className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-600"
              >
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Reference {index + 1}
                  </h3>
                  <button
                    onClick={() => handleRemoveReference(index)}
                    className="px-3 py-1 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
                    aria-label={`Remove reference ${index + 1}`}
                  >
                    Remove
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Name */}
                  <div>
                    <label
                      htmlFor={`name-${index}`}
                      className="block text-sm font-semibold text-gray-700 dark:text-gray-200"
                    >
                      Name
                    </label>
                    <input
                      id={`name-${index}`}
                      type="text"
                      value={ref.name}
                      onChange={(e) =>
                        dispatch(
                          updateReference({
                            index,
                            data: { name: e.target.value },
                          })
                        )
                      }
                      className="mt-1 w-full p-3 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      aria-required="true"
                      aria-invalid={!!errors?.references?.[index]?.name}
                      aria-describedby={
                        errors?.references?.[index]?.name ? `name-error-${index}` : undefined
                      }
                    />
                    <AnimatePresence>
                      {errors?.references?.[index]?.name && (
                        <motion.p
                          id={`name-error-${index}`}
                          className="mt-1 text-sm text-red-500"
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          transition={{ duration: 0.2 }}
                        >
                          {errors.references[index].name}
                        </motion.p>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Relationship */}
                  <div>
                    <label
                      htmlFor={`relationship-${index}`}
                      className="block text-sm font-semibold text-gray-700 dark:text-gray-200"
                    >
                      Relationship
                    </label>
                    <input
                      id={`relationship-${index}`}
                      type="text"
                      value={ref.relationship}
                      onChange={(e) =>
                        dispatch(
                          updateReference({
                            index,
                            data: { relationship: e.target.value },
                          })
                        )
                      }
                      className="mt-1 w-full p-3 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      aria-required="true"
                      aria-invalid={!!errors?.references?.[index]?.relationship}
                      aria-describedby={
                        errors?.references?.[index]?.relationship
                          ? `relationship-error-${index}`
                          : undefined
                      }
                    />
                    <AnimatePresence>
                      {errors?.references?.[index]?.relationship && (
                        <motion.p
                          id={`relationship-error-${index}`}
                          className="mt-1 text-sm text-red-500"
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          transition={{ duration: 0.2 }}
                        >
                          {errors.references[index].relationship}
                        </motion.p>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Company */}
                  <div>
                    <label
                      htmlFor={`company-${index}`}
                      className="block text-sm font-semibold text-gray-700 dark:text-gray-200"
                    >
                      Company
                    </label>
                    <input
                      id={`company-${index}`}
                      type="text"
                      value={ref.company}
                      onChange={(e) =>
                        dispatch(
                          updateReference({
                            index,
                            data: { company: e.target.value },
                          })
                        )
                      }
                      className="mt-1 w-full p-3 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      aria-required="true"
                      aria-invalid={!!errors?.references?.[index]?.company}
                      aria-describedby={
                        errors?.references?.[index]?.company ? `company-error-${index}` : undefined
                      }
                    />
                    <AnimatePresence>
                      {errors?.references?.[index]?.company && (
                        <motion.p
                          id={`company-error-${index}`}
                          className="mt-1 text-sm text-red-500"
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          transition={{ duration: 0.2 }}
                        >
                          {errors.references[index].company}
                        </motion.p>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Contact */}
                  <div>
                    <label
                      htmlFor={`contact-${index}`}
                      className="block text-sm font-semibold text-gray-700 dark:text-gray-200"
                    >
                      Contact (Phone/Email)
                    </label>
                    <input
                      id={`contact-${index}`}
                      type="text"
                      value={ref.contact}
                      onChange={(e) =>
                        dispatch(
                          updateReference({
                            index,
                            data: { contact: e.target.value },
                          })
                        )
                      }
                      className="mt-1 w-full p-3 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      aria-required="true"
                      aria-invalid={!!errors?.references?.[index]?.contact}
                      aria-describedby={
                        errors?.references?.[index]?.contact ? `contact-error-${index}` : undefined
                      }
                    />
                    <AnimatePresence>
                      {errors?.references?.[index]?.contact && (
                        <motion.p
                          id={`contact-error-${index}`}
                          className="mt-1 text-sm text-red-500"
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          transition={{ duration: 0.2 }}
                        >
                          {errors.references[index].contact}
                        </motion.p>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              </div>
            ))}
            <button
              onClick={handleAddReference}
              className="px-4 py-2 bg-green-500 text-white rounded-md shadow-sm hover:bg-green-600 transition-colors"
              aria-label="Add new reference"
            >
              Add Reference
            </button>
            <AnimatePresence>
              {errors?.references && typeof errors.references === "string" && (
                <motion.p
                  className="mt-2 text-sm text-red-500"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                >
                  {errors.references}
                </motion.p>
              )}
            </AnimatePresence>
          </>
        )}
      </div>
    );
  }
);

export default ReferencesStep;