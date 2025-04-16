import React, { useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../redux/Store";
import { Experience } from "../types/form";
import { checkOverlappingDates } from "../utils/dateUtils";
import { addExperience, updateExperience, removeExperience } from "../redux/FormSlice";
import { motion, AnimatePresence } from "framer-motion";

const ExperienceStep: React.FC = React.memo(() => {
  const dispatch = useDispatch();
  const formData = useSelector((state: RootState) => state.form.formData);
  const errors = useSelector((state: RootState) => state.form.errors);

  const handleAddExperience = useCallback(() => {
    dispatch(
      addExperience({
        jobTitle: "",
        companyName: "",
        employmentType: "Full-time",
        startDate: "",
        endDate: "",
        currentlyWorking: false,
        responsibilities: "",
      })
    );
  }, [dispatch]);

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Work Experience</h2>
      {formData.experiences.length === 0 && (
        <motion.p
          className="text-sm text-red-500"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
        >
          Please add at least one experience.
        </motion.p>
      )}
      {formData.experiences.map((exp: Experience, index: number) => (
        <div
          key={index}
          className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-600"
        >
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Experience {index + 1}
            </h3>
            {formData.experiences.length > 1 && (
              <button
                onClick={() => dispatch(removeExperience(index))}
                className="px-3 py-1 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
                aria-label={`Remove experience ${index + 1}`}
              >
                Remove
              </button>
            )}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Job Title */}
            <div>
              <label
                htmlFor={`jobTitle-${index}`}
                className="block text-sm font-semibold text-gray-700 dark:text-gray-200"
              >
                Job Title
              </label>
              <input
                id={`jobTitle-${index}`}
                type="text"
                value={exp.jobTitle}
                onChange={(e) =>
                  dispatch(
                    updateExperience({
                      index,
                      data: { jobTitle: e.target.value },
                    })
                  )
                }
                className="mt-1 w-full p-3 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                aria-required="true"
                aria-invalid={!!errors?.experiences?.[index]?.jobTitle}
                aria-describedby={
                  errors?.experiences?.[index]?.jobTitle ? `jobTitle-error-${index}` : undefined
                }
              />
              <AnimatePresence>
                {errors?.experiences?.[index]?.jobTitle && (
                  <motion.p
                    id={`jobTitle-error-${index}`}
                    className="mt-1 text-sm text-red-500"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                  >
                    {errors.experiences[index].jobTitle}
                  </motion.p>
                )}
              </AnimatePresence>
            </div>

            {/* Company Name */}
            <div>
              <label
                htmlFor={`companyName-${index}`}
                className="block text-sm font-semibold text-gray-700 dark:text-gray-200"
              >
                Company Name
              </label>
              <input
                id={`companyName-${index}`}
                type="text"
                value={exp.companyName}
                onChange={(e) =>
                  dispatch(
                    updateExperience({
                      index,
                      data: { companyName: e.target.value },
                    })
                  )
                }
                className="mt-1 w-full p-3 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                aria-required="true"
                aria-invalid={!!errors?.experiences?.[index]?.companyName}
                aria-describedby={
                  errors?.experiences?.[index]?.companyName ? `companyName-error-${index}` : undefined
                }
              />
              <AnimatePresence>
                {errors?.experiences?.[index]?.companyName && (
                  <motion.p
                    id={`companyName-error-${index}`}
                    className="mt-1 text-sm text-red-500"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                  >
                    {errors.experiences[index].companyName}
                  </motion.p>
                )}
              </AnimatePresence>
            </div>

            {/* Employment Type */}
            <div>
              <label
                htmlFor={`employmentType-${index}`}
                className="block text-sm font-semibold text-gray-700 dark:text-gray-200"
              >
                Employment Type
              </label>
              <select
                id={`employmentType-${index}`}
                value={exp.employmentType}
                onChange={(e) =>
                  dispatch(
                    updateExperience({
                      index,
                      data: { employmentType: e.target.value as Experience["employmentType"] },
                    })
                  )
                }
                className="mt-1 w-full p-3 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              >
                <option value="Full-time">Full-time</option>
                <option value="Part-time">Part-time</option>
                <option value="Internship">Internship</option>
                <option value="Contract">Contract</option>
                <option value="Freelance">Freelance</option>
              </select>
            </div>

            {/* Start Date */}
            <div>
              <label
                htmlFor={`startDate-${index}`}
                className="block text-sm font-semibold text-gray-700 dark:text-gray-200"
              >
                Start Date
              </label>
              <input
                id={`startDate-${index}`}
                type="date"
                value={exp.startDate}
                onChange={(e) =>
                  dispatch(
                    updateExperience({
                      index,
                      data: { startDate: e.target.value },
                    })
                  )
                }
                className="mt-1 w-full p-3 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                aria-required="true"
                aria-invalid={!!errors?.experiences?.[index]?.startDate}
                aria-describedby={
                  errors?.experiences?.[index]?.startDate ? `startDate-error-${index}` : undefined
                }
              />
              <AnimatePresence>
                {errors?.experiences?.[index]?.startDate && (
                  <motion.p
                    id={`startDate-error-${index}`}
                    className="mt-1 text-sm text-red-500"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                  >
                    {errors.experiences[index].startDate}
                  </motion.p>
                )}
              </AnimatePresence>
            </div>

            {/* End Date */}
            {!exp.currentlyWorking && (
              <div>
                <label
                  htmlFor={`endDate-${index}`}
                  className="block text-sm font-semibold text-gray-700 dark:text-gray-200"
                >
                  End Date
                </label>
                <input
                  id={`endDate-${index}`}
                  type="date"
                  value={exp.endDate || ""}
                  onChange={(e) =>
                    dispatch(
                      updateExperience({
                        index,
                        data: { endDate: e.target.value },
                      })
                    )
                  }
                  className="mt-1 w-full p-3 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  aria-invalid={!!errors?.experiences?.[index]?.endDate}
                  aria-describedby={
                    errors?.experiences?.[index]?.endDate ? `endDate-error-${index}` : undefined
                  }
                />
                <AnimatePresence>
                  {errors?.experiences?.[index]?.endDate && (
                    <motion.p
                      id={`endDate-error-${index}`}
                      className="mt-1 text-sm text-red-500"
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.2 }}
                    >
                      {errors.experiences[index].endDate}
                    </motion.p>
                  )}
                </AnimatePresence>
              </div>
            )}

            {/* Currently Working */}
            <div className="flex items-center">
              <label
                htmlFor={`currentlyWorking-${index}`}
                className="flex items-center text-sm font-semibold text-gray-700 dark:text-gray-200"
              >
                <input
                  id={`currentlyWorking-${index}`}
                  type="checkbox"
                  checked={exp.currentlyWorking}
                  onChange={(e) =>
                    dispatch(
                      updateExperience({
                        index,
                        data: {
                          currentlyWorking: e.target.checked,
                          endDate: e.target.checked ? undefined : exp.endDate,
                        },
                      })
                    )
                  }
                  className="mr-2 h-4 w-4 text-blue-500 focus:ring-blue-500 border-gray-300 dark:border-gray-600 rounded"
                />
                Currently Working
              </label>
            </div>

            {/* Responsibilities */}
            <div className="md:col-span-2">
              <label
                htmlFor={`responsibilities-${index}`}
                className="block text-sm font-semibold text-gray-700 dark:text-gray-200"
              >
                Responsibilities
              </label>
              <textarea
                id={`responsibilities-${index}`}
                value={exp.responsibilities}
                onChange={(e) =>
                  dispatch(
                    updateExperience({
                      index,
                      data: { responsibilities: e.target.value },
                    })
                  )
                }
                className="mt-1 w-full p-3 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                rows={4}
                aria-required="true"
                aria-invalid={!!errors?.experiences?.[index]?.responsibilities}
                aria-describedby={
                  errors?.experiences?.[index]?.responsibilities
                    ? `responsibilities-error-${index}`
                    : undefined
                }
              />
              <AnimatePresence>
                {errors?.experiences?.[index]?.responsibilities && (
                  <motion.p
                    id={`responsibilities-error-${index}`}
                    className="mt-1 text-sm text-red-500"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                  >
                    {errors.experiences[index].responsibilities}
                  </motion.p>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Overlapping Dates Warning */}
          <AnimatePresence>
            {checkOverlappingDates(formData.experiences) && (
              <motion.p
                className="mt-4 text-sm text-red-500"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                Warning: Overlapping dates detected!
              </motion.p>
            )}
          </AnimatePresence>
        </div>
      ))}

      {/* Add Experience Button */}
      <button
        onClick={handleAddExperience}
        className="px-4 py-2 bg-green-500 text-white rounded-md shadow-sm hover:bg-green-600 transition-colors"
        aria-label="Add new experience"
      >
        Add Experience
      </button>

      {/* Global Errors */}
      <AnimatePresence>
        {errors?.experiences && typeof errors.experiences === "string" && (
          <motion.p
            className="mt-2 text-sm text-red-500"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {errors.experiences}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
});

export default ExperienceStep;