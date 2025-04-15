import React, { useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "../redux/Store";
import { Experience, Education, Reference } from "../types/form";
import { setCurrentStep } from "../redux/FormSlice";
import { calculateTotalExperience } from "../utils/dateUtils";

interface SummaryStepProps {
  skipReferences: boolean;
  age: number | null;
}

const SummaryStep: React.FC<SummaryStepProps> = React.memo(({ skipReferences, age }) => {
  const dispatch = useDispatch<AppDispatch>();
  const formData = useSelector((state: RootState) => state.form.formData);
  const totalExperience = calculateTotalExperience(formData.experiences);

  console.log("Current formData:", formData); // Debug log

  const handleEditStep = useCallback(
    (step: number) => {
      console.log("Navigating to step:", step); // Debug log
      dispatch(setCurrentStep(step));
    },
    [dispatch]
  );

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Summary</h2>
      <div>
        <div className="flex justify-between">
          <h3 className="text-lg font-medium">Personal Information</h3>
          <button
            onClick={() => handleEditStep(1)}
            className="text-blue-500 hover:text-blue-700"
            aria-label="Edit personal information"
          >
            Edit
          </button>
        </div>
        <p>
          <strong>Name:</strong> {formData.personalInfo.fullName}
        </p>
        <p>
          <strong>Email:</strong> {formData.personalInfo.email}
        </p>
        <p>
          <strong>Phone:</strong> {formData.personalInfo.phoneNumber}
        </p>
        {age && (
          <p>
            <strong>Age:</strong> {age}
          </p>
        )}
        <p>
          <strong>Gender:</strong> {formData.personalInfo.gender}
        </p>
        <p>
          <strong>Location:</strong> {formData.personalInfo.currentLocation.city},{" "}
          {formData.personalInfo.currentLocation.country}
        </p>
        <p>
          <strong>Education Level:</strong> {formData.personalInfo.educationLevel}
        </p>
      </div>
      <div>
        <div className="flex justify-between">
          <h3 className="text-lg font-medium">Experience (Total: {totalExperience} years)</h3>
          <button
            onClick={() => handleEditStep(2)}
            className="text-blue-500 hover:text-blue-700"
            aria-label="Edit experience"
          >
            Edit
          </button>
        </div>
        {formData.experiences.map((exp: Experience, index: number) => (
          <div key={index} className="mt-2">
            <p>
              <strong>{exp.jobTitle}</strong> at {exp.companyName}
            </p>
            <p>
              {exp.employmentType} | {exp.startDate} - {exp.currentlyWorking ? "Present" : exp.endDate}
            </p>
            <p>{exp.responsibilities}</p>
          </div>
        ))}
      </div>

      {formData.personalInfo.educationLevel === "Graduate or higher" && Array.isArray(formData.education) && (
        <div>
          <div className="flex justify-between">
            <h3 className="text-lg font-medium">Education</h3>
            <button
              onClick={() => handleEditStep(3)}
              className="text-blue-500 hover:text-blue-700"
              aria-label="Edit education"
            >
              Edit
            </button>
          </div>
          {formData.education.map((edu: Education, index: number) => (
            <div key={index} className="mt-2">
              <p>
                <strong>{edu.degree}</strong> in {edu.fieldOfStudy} from {edu.schoolName}
              </p>
              <p>
                {edu.startYear} - {edu.endYear}
              </p>
              {edu.grade && <p>Grade: {edu.grade}</p>}
              {Array.isArray(edu.certificates) && edu.certificates.length > 0 && (
                <p>Certificates: {edu.certificates.map((c) => c.name).join(", ")}</p>
              )}
            </div>
          ))}
        </div>
      )}


      {Array.isArray(formData.skills) && (
        <div>
          <div className="flex justify-between">
            <h3 className="text-lg font-medium">Skills (Total: {formData.skills.length})</h3>
            <button
              onClick={() => handleEditStep(4)}
              className="text-blue-500 hover:text-blue-700"
              aria-label="Edit skills"
            >
              Edit
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {formData.skills.map((skill, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-blue-100 rounded-full dark:bg-blue-900"
              >
                {skill.name} {skill.yearsOfExperience ? `(${skill.yearsOfExperience} yrs)` : ""}
              </span>
            ))}
          </div>
        </div>
      )}

      {!skipReferences && formData.references.length > 0 && (
        <div>
          <div className="flex justify-between">
            <h3 className="text-lg font-medium">References</h3>
            <button
              onClick={() => handleEditStep(5)}
              className="text-blue-500 hover:text-blue-700"
              aria-label="Edit references"
            >
              Edit
            </button>
          </div>
          {formData.references.map((ref: Reference, index: number) => (
            <div key={index} className="mt-2">
              <p>
                <strong>{ref.name}</strong>, {ref.relationship} at {ref.company}
              </p>
              <p>Contact: {ref.contact}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
});

export default SummaryStep;