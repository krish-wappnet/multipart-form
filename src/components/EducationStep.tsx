import React, { useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "../redux/Store";
import { Education } from "../types/form";
import { addEducation, updateEducation, removeEducation } from "../redux/FormSlice";
import { motion, AnimatePresence } from "framer-motion";

const EducationStep: React.FC = React.memo(() => {
  const dispatch = useDispatch<AppDispatch>();
  const formData = useSelector((state: RootState) => state.form.formData);
  const errors = useSelector((state: RootState) => state.form.errors);

  const handleAddEducation = useCallback(() => {
    dispatch(
      addEducation({
        schoolName: "",
        degree: "",
        fieldOfStudy: "",
        startYear: "",
        endYear: "",
        grade: "",
        certificates: [],
      })
    );
  }, [dispatch]);

  const handleUpdateEducation = useCallback(
    (index: number, field: keyof Education, value: string | { name: string; file?: File }[]) => {
      dispatch(
        updateEducation({
          index,
          data: { [field]: value },
        })
      );
    },
    [dispatch]
  );

  const handleAddCertificate = useCallback(
    (index: number, file: File) => {
      // Basic validation for file
      const allowedTypes = ["application/pdf", "image/jpeg", "image/png"];
      const maxSize = 5 * 1024 * 1024; // 5MB
      if (!allowedTypes.includes(file.type)) {
        alert("Only PDF, JPEG, or PNG files are allowed.");
        return;
      }
      if (file.size > maxSize) {
        alert("File size must be less than 5MB.");
        return;
      }

      const currentCertificates = formData.education[index].certificates || [];
      const certName = file.name;
      dispatch(
        updateEducation({
          index,
          data: {
            certificates: [...currentCertificates, { name: certName, file }],
          },
        })
      );
    },
    [dispatch, formData.education]
  );

  const handleRemoveCertificate = useCallback(
    (eduIndex: number, certIndex: number) => {
      const currentCertificates = formData.education[eduIndex].certificates || [];
      const updatedCertificates = currentCertificates.filter((_, i) => i !== certIndex);
      dispatch(
        updateEducation({
          index: eduIndex,
          data: {
            certificates: updatedCertificates,
          },
        })
      );
    },
    [dispatch, formData.education]
  );

  const handleRemoveEducation = useCallback(
    (index: number) => {
      dispatch(removeEducation(index));
    },
    [dispatch]
  );

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Education</h2>
      {formData.education.map((edu: Education, index: number) => (
        <div
          key={index}
          className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-600"
        >
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Education {index + 1}
            </h3>
            {formData.education.length > 1 && (
              <button
                onClick={() => handleRemoveEducation(index)}
                className="px-3 py-1 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
                aria-label={`Remove education ${index + 1}`}
              >
                Remove
              </button>
            )}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* School/University Name */}
            <div>
              <label
                htmlFor={`schoolName-${index}`}
                className="block text-sm font-semibold text-gray-700 dark:text-gray-200"
              >
                School/University Name
              </label>
              <input
                id={`schoolName-${index}`}
                type="text"
                value={edu.schoolName}
                onChange={(e) => handleUpdateEducation(index, "schoolName", e.target.value)}
                className="mt-1 w-full p-3 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                aria-required="true"
                aria-invalid={!!errors?.education?.[index]?.schoolName}
                aria-describedby={
                  errors?.education?.[index]?.schoolName ? `schoolName-error-${index}` : undefined
                }
              />
              <AnimatePresence>
                {errors?.education?.[index]?.schoolName && (
                  <motion.p
                    id={`schoolName-error-${index}`}
                    className="mt-1 text-sm text-red-500"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                  >
                    {errors.education[index].schoolName}
                  </motion.p>
                )}
              </AnimatePresence>
            </div>

            {/* Degree */}
            <div>
              <label
                htmlFor={`degree-${index}`}
                className="block text-sm font-semibold text-gray-700 dark:text-gray-200"
              >
                Degree
              </label>
              <input
                id={`degree-${index}`}
                type="text"
                value={edu.degree}
                onChange={(e) => handleUpdateEducation(index, "degree", e.target.value)}
                className="mt-1 w-full p-3 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                aria-required="true"
                aria-invalid={!!errors?.education?.[index]?.degree}
                aria-describedby={
                  errors?.education?.[index]?.degree ? `degree-error-${index}` : undefined
                }
              />
              <AnimatePresence>
                {errors?.education?.[index]?.degree && (
                  <motion.p
                    id={`degree-error-${index}`}
                    className="mt-1 text-sm text-red-500"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                  >
                    {errors.education[index].degree}
                  </motion.p>
                )}
              </AnimatePresence>
            </div>

            {/* Field of Study */}
            <div>
              <label
                htmlFor={`fieldOfStudy-${index}`}
                className="block text-sm font-semibold text-gray-700 dark:text-gray-200"
              >
                Field of Study
              </label>
              <input
                id={`fieldOfStudy-${index}`}
                type="text"
                value={edu.fieldOfStudy}
                onChange={(e) => handleUpdateEducation(index, "fieldOfStudy", e.target.value)}
                className="mt-1 w-full p-3 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                aria-required="true"
                aria-invalid={!!errors?.education?.[index]?.fieldOfStudy}
                aria-describedby={
                  errors?.education?.[index]?.fieldOfStudy ? `fieldOfStudy-error-${index}` : undefined
                }
              />
              <AnimatePresence>
                {errors?.education?.[index]?.fieldOfStudy && (
                  <motion.p
                    id={`fieldOfStudy-error-${index}`}
                    className="mt-1 text-sm text-red-500"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                  >
                    {errors.education[index].fieldOfStudy}
                  </motion.p>
                )}
              </AnimatePresence>
            </div>

            {/* Start Year */}
            <div>
              <label
                htmlFor={`startYear-${index}`}
                className="block text-sm font-semibold text-gray-700 dark:text-gray-200"
              >
                Start Year
              </label>
              <input
                id={`startYear-${index}`}
                type="text"
                value={edu.startYear}
                onChange={(e) => handleUpdateEducation(index, "startYear", e.target.value)}
                className="mt-1 w-full p-3 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                aria-required="true"
                aria-invalid={!!errors?.education?.[index]?.startYear}
                aria-describedby={
                  errors?.education?.[index]?.startYear ? `startYear-error-${index}` : undefined
                }
              />
              <AnimatePresence>
                {errors?.education?.[index]?.startYear && (
                  <motion.p
                    id={`startYear-error-${index}`}
                    className="mt-1 text-sm text-red-500"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                  >
                    {errors.education[index].startYear}
                  </motion.p>
                )}
              </AnimatePresence>
            </div>

            {/* End Year */}
            <div>
              <label
                htmlFor={`endYear-${index}`}
                className="block text-sm font-semibold text-gray-700 dark:text-gray-200"
              >
                End Year
              </label>
              <input
                id={`endYear-${index}`}
                type="text"
                value={edu.endYear}
                onChange={(e) => handleUpdateEducation(index, "endYear", e.target.value)}
                className="mt-1 w-full p-3 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                aria-required="true"
                aria-invalid={!!errors?.education?.[index]?.endYear}
                aria-describedby={
                  errors?.education?.[index]?.endYear ? `endYear-error-${index}` : undefined
                }
              />
              <AnimatePresence>
                {errors?.education?.[index]?.endYear && (
                  <motion.p
                    id={`endYear-error-${index}`}
                    className="mt-1 text-sm text-red-500"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                  >
                    {errors.education[index].endYear}
                  </motion.p>
                )}
              </AnimatePresence>
            </div>

            {/* Grade/GPA */}
            <div>
              <label
                htmlFor={`grade-${index}`}
                className="block text-sm font-semibold text-gray-700 dark:text-gray-200"
              >
                Grade/GPA
              </label>
              <input
                id={`grade-${index}`}
                type="text"
                value={edu.grade || ""}
                onChange={(e) => handleUpdateEducation(index, "grade", e.target.value)}
                className="mt-1 w-full p-3 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                aria-invalid={!!errors?.education?.[index]?.grade}
                aria-describedby={errors?.education?.[index]?.grade ? `grade-error-${index}` : undefined}
              />
              <AnimatePresence>
                {errors?.education?.[index]?.grade && (
                  <motion.p
                    id={`grade-error-${index}`}
                    className="mt-1 text-sm text-red-500"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                  >
                    {errors.education[index].grade}
                  </motion.p>
                )}
              </AnimatePresence>
            </div>

            {/* Certificates */}
            <div className="md:col-span-2">
              <label
                htmlFor={`certificates-${index}`}
                className="block text-sm font-semibold text-gray-700 dark:text-gray-200"
              >
                Certificates
              </label>
              <input
                id={`certificates-${index}`}
                type="file"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    handleAddCertificate(index, file);
                    e.target.value = "";
                  }
                }}
                className="mt-1 w-full p-3 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:bg-blue-500 file:text-white file:hover:bg-blue-600 transition-colors"
                accept=".pdf,.jpg,.jpeg,.png"
              />
              <div className="mt-2 space-y-2">
                {edu.certificates?.map((cert: { name: string; file?: File }, certIndex: number) => (
                  <div
                    key={certIndex}
                    className="flex items-center justify-between p-2 bg-gray-100 dark:bg-gray-700 rounded-md"
                  >
                    <span className="text-sm text-gray-900 dark:text-white truncate">{cert.name}</span>
                    <button
                      onClick={() => handleRemoveCertificate(index, certIndex)}
                      className="px-2 py-1 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors text-sm"
                      aria-label={`Remove certificate ${cert.name}`}
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      ))}
      <button
        onClick={handleAddEducation}
        className="px-4 py-2 bg-green-500 text-white rounded-md shadow-sm hover:bg-green-600 transition-colors"
        aria-label="Add new education"
      >
        Add Education
      </button>
      <AnimatePresence>
        {errors?.education && typeof errors.education === "string" && (
          <motion.p
            className="mt-2 text-sm text-red-500"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {errors.education}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
});

export default EducationStep;