/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import { z } from "zod";
import { setCurrentStep, setErrors } from "../redux/FormSlice";
import { RootState } from "../redux/Store";
import {
  personalInfoSchema,
  experienceSchema,
  educationSchema,
  skillSchema,
  referenceSchema,
  formSchema,
} from "../utils/Validations";
import { calculateAge } from "../utils/dateUtils";
import PersonalInfoStep from "./PersonalInfoStep";
import ExperienceStep from "./ExperienceStep";
import EducationStep from "./EducationStep";
import SkillsStep from "./SkillsStep";
import ReferencesStep from "./ReferencesStep";
import SummaryStep from "./SummaryStep";
import SubmitStep from "./SubmitStep";

const MultiStepForm: React.FC = () => {
  const dispatch = useDispatch();
  const { formData, currentStep, errors } = useSelector((state: RootState) => state.form);
  const [isDark, setIsDark] = useState<boolean>(false);
  const [age, setAge] = useState<number | null>(null);
  const [skipReferences, setSkipReferences] = useState<boolean>(formData.references.length === 0);
  const [validationCache, setValidationCache] = useState<Record<number, boolean>>({});

  // Dark mode toggle
  useEffect(() => {
    const saved = localStorage.getItem("darkMode");
    if (saved) {
      const darkMode = JSON.parse(saved);
      setIsDark(darkMode);
      if (darkMode) {
        document.documentElement.classList.add("dark");
      }
    }
  }, []);

  const toggleDarkMode = useCallback(() => {
    setIsDark((prev) => {
      const newMode = !prev;
      localStorage.setItem("darkMode", JSON.stringify(newMode));
      document.documentElement.classList.toggle("dark", newMode);
      return newMode;
    });
  }, []);

  // Calculate age when DOB changes
  useEffect(() => {
    if (formData.personalInfo.dateOfBirth) {
      setAge(calculateAge(formData.personalInfo.dateOfBirth));
    } else {
      setAge(null);
    }
  }, [formData.personalInfo.dateOfBirth]);

  // Validation logic (matches working version, with caching)
  const validateStep = useCallback(
    (step: number): boolean => {
      if (validationCache[step] !== undefined) {
        return validationCache[step];
      }
      try {
        if (step === 1) {
          personalInfoSchema.parse(formData.personalInfo);
        } else if (step === 2) {
          z.array(experienceSchema).min(1, "At least one experience is required").parse(formData.experiences);
        } else if (step === 3 && formData.personalInfo.educationLevel === "Graduate or higher") {
          z.array(educationSchema).min(1, "At least one education entry is required").parse(formData.education);
        } else if (step === 4) {
          z.array(skillSchema).min(1, "At least one skill is required").parse(formData.skills);
        } else if (step === 5 && !skipReferences) {
          z.array(referenceSchema).min(1, "At least one reference is required").parse(formData.references);
        } else if (step === 7) {
          formSchema.parse(formData);
        }
        dispatch(setErrors({}));
        setValidationCache((prev) => ({ ...prev, [step]: true }));
        return true;
      } catch (error: any) {
        console.error(`Validation error for step ${step}:`, error);
        dispatch(setErrors(error.formErrors?.fieldErrors || error.errors || {}));
        setValidationCache((prev) => ({ ...prev, [step]: false }));
        return false;
      }
    },
    [dispatch, formData, skipReferences]
  );

  // Navigation
  const nextStep = useCallback(() => {
    if (validateStep(currentStep)) {
      let next = currentStep + 1;
      if (currentStep === 3 && formData.personalInfo.educationLevel !== "Graduate or higher") {
        next += 1; // Skip Education
      }
      dispatch(setCurrentStep(next));
    }
  }, [currentStep, dispatch, validateStep, formData.personalInfo.educationLevel]);

  const prevStep = useCallback(() => {
    dispatch(setCurrentStep(Math.max(1, currentStep - 1)));
  }, [currentStep, dispatch]);

  // Step labels for sidebar
  const stepLabels = [
    { step: 1, label: "Personal Info" },
    { step: 2, label: "Experience" },
    { step: 3, label: "Education" },
    { step: 4, label: "Skills" },
    { step: 5, label: "References" },
    { step: 6, label: "Summary" },
    { step: 7, label: "Submit" },
  ];

  // Memoized step completion status
  const stepCompletionStatus = useMemo(() => {
    return stepLabels.reduce((acc, { step }) => {
      if (step >= currentStep) {
        acc[step] = false;
      } else if (step === 3 && formData.personalInfo.educationLevel !== "Graduate or higher") {
        acc[step] = true; // Skipped
      } else if (step === 5 && skipReferences) {
        acc[step] = true; // Skipped
      } else {
        acc[step] = validateStep(step);
      }
      return acc;
    }, {} as Record<number, boolean>);
  }, [currentStep, formData.personalInfo.educationLevel, skipReferences, validateStep]);

  // Render step
  const renderStep = useCallback(() => {
    switch (currentStep) {
      case 1:
        return <PersonalInfoStep formData={formData} errors={errors} dispatch={dispatch} age={age} />;
      case 2:
        return <ExperienceStep />;
      case 3:
        return <EducationStep />;
      case 4:
        return <SkillsStep />;
      case 5:
        return <ReferencesStep skipReferences={skipReferences} setSkipReferences={setSkipReferences} />;
      case 6:
        return <SummaryStep skipReferences={skipReferences} age={age} />;
      case 7:
        return <SubmitStep validateStep={validateStep} />;
      default:
        return null;
    }
  }, [currentStep, formData, errors, dispatch, age, skipReferences]);

  return (
    <div
      className={`min-h-screen p-6 ${
        isDark ? "dark bg-gray-900 text-white" : "bg-gray-100 text-gray-900"
      }`}
    >
      <div className="max-w-5xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Application Form</h1>
          <button
            onClick={toggleDarkMode}
            className="p-2 rounded-full bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition"
            aria-label="Toggle dark mode"
          >
            {isDark ? "🌞 Light" : "🌙 Dark"}
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="lg:col-span-1 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4">
            <h2 className="text-lg font-semibold mb-4">Progress</h2>
            <ul className="space-y-2">
              {stepLabels.map(({ step, label }) => {
                const isActive = currentStep === step;
                const isCompleted = stepCompletionStatus[step];
                const isSkipped =
                  (step === 3 && formData.personalInfo.educationLevel !== "Graduate or higher") ||
                  (step === 5 && skipReferences);

                return (
                  <li
                    key={step}
                    className={`flex items-center p-2 rounded-lg transition-colors duration-200 ${
                      isActive
                        ? "bg-blue-500 text-white"
                        : isCompleted
                        ? "bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300"
                        : isSkipped
                        ? "bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400"
                        : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
                    } hover:bg-blue-100 dark:hover:bg-blue-900 cursor-pointer`}
                    onClick={() => {
                      if (step <= currentStep || isCompleted) {
                        dispatch(setCurrentStep(step));
                      }
                    }}
                  >
                    <span
                      className={`w-6 h-6 flex items-center justify-center rounded-full mr-2 ${
                        isActive
                          ? "bg-white text-blue-500"
                          : isCompleted
                          ? "bg-green-500 text-white"
                          : isSkipped
                          ? "bg-gray-400 text-white"
                          : "bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-gray-300"
                      }`}
                    >
                      {isCompleted ? "✓" : step}
                    </span>
                    {label}
                    {isSkipped && <span className="ml-2 text-xs italic">(Skipped)</span>}
                  </li>
                );
              })}
            </ul>
            <div className="mt-4">
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div
                  className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${((currentStep - 1) / 6) * 100}%` }}
                ></div>
              </div>
              <p className="text-sm mt-2 text-center">
                {Math.round(((currentStep - 1) / 6) * 100)}% Complete
              </p>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                {renderStep()}
                <div className="flex justify-between mt-6">
                  {currentStep > 1 && (
                    <button
                      onClick={prevStep}
                      className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition"
                      aria-label="Previous step"
                    >
                      Previous
                    </button>
                  )}
                  {currentStep < 7 && (
                    <button
                      onClick={nextStep}
                      className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
                      aria-label="Next step"
                    >
                      Next
                    </button>
                  )}
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MultiStepForm;