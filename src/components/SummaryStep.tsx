
import React, { useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "../redux/Store";
import { Experience, Education, Reference } from "../types/form";
import { setCurrentStep } from "../redux/FormSlice";
import { calculateTotalExperience } from "../utils/dateUtils";
import { motion } from "framer-motion";

interface SummaryStepProps {
  skipReferences: boolean;
  age: number | null;
}

const SummaryStep: React.FC<SummaryStepProps> = React.memo(({ skipReferences, age }) => {
  const dispatch = useDispatch<AppDispatch>();
  const formData = useSelector((state: RootState) => state.form.formData);
  const totalExperience = calculateTotalExperience(formData.experiences);

  const handleEditStep = useCallback(
    (step: number) => {
      dispatch(setCurrentStep(step));
    },
    [dispatch]
  );

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Summary</h2>

      {/* Personal Information */}
      <motion.div
        className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-600"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Personal Information
          </h3>
          <button
            onClick={() => handleEditStep(1)}
            className="px-3 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
            aria-label="Edit personal information"
          >
            Edit
          </button>
        </div>
        <dl className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-700 dark:text-gray-300">
          <div>
            <dt className="font-semibold text-gray-900 dark:text-white">Name</dt>
            <dd>{formData.personalInfo.fullName || "Not provided"}</dd>
          </div>
          <div>
            <dt className="font-semibold text-gray-900 dark:text-white">Email</dt>
            <dd>{formData.personalInfo.email || "Not provided"}</dd>
          </div>
          <div>
            <dt className="font-semibold text-gray-900 dark:text-white">Phone</dt>
            <dd>{formData.personalInfo.phoneNumber || "Not provided"}</dd>
          </div>
          {age !== null && (
            <div>
              <dt className="font-semibold text-gray-900 dark:text-white">Age</dt>
              <dd>{age}</dd>
            </div>
          )}
          <div>
            <dt className="font-semibold text-gray-900 dark:text-white">Gender</dt>
            <dd>{formData.personalInfo.gender || "Not provided"}</dd>
          </div>
          <div>
            <dt className="font-semibold text-gray-900 dark:text-white">Location</dt>
            <dd>
              {formData.personalInfo.currentLocation.city &&
              formData.personalInfo.currentLocation.country
                ? `${formData.personalInfo.currentLocation.city}, ${formData.personalInfo.currentLocation.country}`
                : "Not provided"}
            </dd>
          </div>
          <div>
            <dt className="font-semibold text-gray-900 dark:text-white">Education Level</dt>
            <dd>{formData.personalInfo.educationLevel || "Not provided"}</dd>
          </div>
        </dl>
      </motion.div>

      {/* Experience */}
      <motion.div
        className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-600"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
      >
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Experience (Total: {totalExperience} years)
          </h3>
          <button
            onClick={() => handleEditStep(2)}
            className="px-3 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
            aria-label="Edit experience"
          >
            Edit
          </button>
        </div>
        {formData.experiences.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {formData.experiences.map((exp: Experience, index: number) => (
              <div
                key={index}
                className="p-4 bg-gray-50 dark:bg-gray-700 rounded-md border border-gray-200 dark:border-gray-600"
              >
                <p className="font-semibold text-gray-900 dark:text-white">
                  {exp.jobTitle || "Untitled"} at {exp.companyName || "Unknown Company"}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {exp.employmentType || "N/A"} | {exp.startDate || "N/A"} -{" "}
                  {exp.currentlyWorking ? "Present" : exp.endDate || "N/A"}
                </p>
                <p className="text-sm mt-1 text-gray-700 dark:text-gray-300">
                  {exp.responsibilities || "No responsibilities provided"}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-gray-600 dark:text-gray-400">No experience provided</p>
        )}
      </motion.div>

      {/* Education */}
      {Array.isArray(formData.education) && (
        <motion.div
          className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-600"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Education</h3>
            <button
              onClick={() => handleEditStep(3)}
              className="px-3 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
              aria-label="Edit education"
            >
              Edit
            </button>
          </div>
          {formData.education.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {formData.education.map((edu: Education, index: number) => (
                <div
                  key={index}
                  className="p-4 bg-gray-50 dark:bg-gray-700 rounded-md border border-gray-200 dark:border-gray-600"
                >
                  <p className="font-semibold text-gray-900 dark:text-white">
                    {edu.degree || "Untitled"} in {edu.fieldOfStudy || "Unknown Field"} from{" "}
                    {edu.schoolName || "Unknown Institution"}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {edu.startYear || "N/A"} - {edu.endYear || "N/A"}
                  </p>
                  {edu.grade && (
                    <p className="text-sm text-gray-700 dark:text-gray-300">Grade: {edu.grade}</p>
                  )}
                  {Array.isArray(edu.certificates) && edu.certificates.length > 0 && (
                    <p className="text-sm text-gray-700 dark:text-gray-300">
                      Certificates: {edu.certificates.map((c) => c.name).join(", ")}
                    </p>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-600 dark:text-gray-400">No education provided</p>
          )}
        </motion.div>
      )}

      {/* Skills */}
      {Array.isArray(formData.skills) && (
        <motion.div
          className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-600"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.3 }}
        >
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Skills (Total: {formData.skills.length})
            </h3>
            <button
              onClick={() => handleEditStep(4)}
              className="px-3 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
              aria-label="Edit skills"
            >
              Edit
            </button>
          </div>
          {formData.skills.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {formData.skills.map((skill, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full text-sm shadow-sm"
                >
                  {skill.name || "Unnamed Skill"}{" "}
                  {skill.yearsOfExperience ? `(${skill.yearsOfExperience} yrs)` : ""}
                </span>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-600 dark:text-gray-400">No skills provided</p>
          )}
        </motion.div>
      )}

      {/* References */}
      {!skipReferences && formData.references.length > 0 && (
        <motion.div
          className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-600"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.4 }}
        >
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">References</h3>
            <button
              onClick={() => handleEditStep(5)}
              className="px-3 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
              aria-label="Edit references"
            >
              Edit
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {formData.references.map((ref: Reference, index: number) => (
              <div
                key={index}
                className="p-4 bg-gray-50 dark:bg-gray-700 rounded-md border border-gray-200 dark:border-gray-600"
              >
                <p className="font-semibold text-gray-900 dark:text-white">
                  {ref.name || "Unnamed Reference"}, {ref.relationship || "N/A"} at{" "}
                  {ref.company || "Unknown Company"}
                </p>
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  Contact: {ref.contact || "Not provided"}
                </p>
              </div>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
});

export default SummaryStep;