/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect, useCallback } from "react";
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

const steps = [
  { id: 1, label: "Personal Info" },
  { id: 2, label: "Experience" },
  { id: 3, label: "Education" },
  { id: 4, label: "Skills" },
  { id: 5, label: "References" },
  { id: 6, label: "Summary" },
  { id: 7, label: "Submit" },
];

const MultiStepForm: React.FC = () => {
  const dispatch = useDispatch();
  const { formData, currentStep, errors } = useSelector((state: RootState) => state.form);
  const [isDark, setIsDark] = useState<boolean>(false);
  const [age, setAge] = useState<number | null>(null);
  const [skipReferences, setSkipReferences] = useState<boolean>(formData.references.length === 0);

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

  useEffect(() => {
    if (formData.personalInfo.dateOfBirth) {
      setAge(calculateAge(formData.personalInfo.dateOfBirth));
    } else {
      setAge(null);
    }
  }, [formData.personalInfo.dateOfBirth]);

  const validateStep = useCallback(
    (step: number): boolean => {
      try {
        if (step === 1) {
          personalInfoSchema.parse(formData.personalInfo);
        } else if (step === 2) {
          z.array(experienceSchema)
            .min(1, "At least one experience is required")
            .parse(formData.experiences);
        } else if (step === 3) {
          z.array(educationSchema)
            .min(1, "At least one education entry is required")
            .parse(formData.education);
        } else if (step === 4) {
          z.array(skillSchema).min(1, "At least one skill is required").parse(formData.skills);
        } else if (step === 5 && !skipReferences) {
          z.array(referenceSchema)
            .min(1, "At least one reference is required")
            .parse(formData.references);
        } else if (step === 7) {
          formSchema.parse(formData);
        }
        dispatch(setErrors({}));
        return true;
      } catch (error) {
        if (error instanceof z.ZodError) {
          const formattedErrors: any = {};
          if (step === 1) {
            const fieldErrors = error.flatten().fieldErrors;
            formattedErrors.personalInfo = {};
            Object.keys(fieldErrors).forEach((key) => {
              if (key === 'currentLocation') {
                formattedErrors.personalInfo.currentLocation = {};
                Object.keys(fieldErrors.currentLocation || {}).forEach((subKey) => {
                  formattedErrors.personalInfo.currentLocation[subKey] =
                    fieldErrors.currentLocation?.[subKey]?.[0];
                });
              } else {
                formattedErrors.personalInfo[key] = fieldErrors[key]?.[0];
              }
            });
          } else if (step === 2) {
            if (error.errors.some((e) => e.path.length === 0)) {
              formattedErrors.experiences = "At least one experience is required";
            } else {
              formattedErrors.experiences = error.errors.reduce((acc: any[], e) => {
                const index = Number(e.path[0]);
                if (!acc[index]) acc[index] = {};
                const field = e.path[1] as string;
                acc[index][field] = e.message;
                return acc;
              }, []);
            }
          } else if (step === 3) {
            if (error.errors.some((e) => e.path.length === 0)) {
              formattedErrors.education = "At least one education entry is required";
            } else {
              formattedErrors.education = error.errors.reduce((acc: any[], e) => {
                const index = Number(e.path[0]);
                if (!acc[index]) acc[index] = {};
                const field = e.path[1] as string;
                acc[index][field] = e.message;
                return acc;
              }, []);
            }
          } else if (step === 4) {
            if (error.errors.some((e) => e.path.length === 0)) {
              formattedErrors.skills = "At least one skill is required";
            } else {
              formattedErrors.skills = error.errors.reduce((acc: any[], e) => {
                const index = Number(e.path[0]);
                if (!acc[index]) acc[index] = {};
                const field = e.path[1] as string;
                acc[index][field] = e.message;
                return acc;
              }, []);
            }
          } else if (step === 5) {
            if (error.errors.some((e) => e.path.length === 0)) {
              formattedErrors.references = "At least one reference is required";
            } else {
              formattedErrors.references = error.errors.reduce((acc: any[], e) => {
                const index = Number(e.path[0]);
                if (!acc[index]) acc[index] = {};
                const field = e.path[1] as string;
                acc[index][field] = e.message;
                return acc;
              }, []);
            }
          } else if (step === 7) {
            const fieldErrors = error.flatten().fieldErrors;
            formattedErrors.personalInfo = {};
            Object.keys(fieldErrors.personalInfo || {}).forEach((key) => {
              if (key === 'currentLocation') {
                formattedErrors.personalInfo.currentLocation = {};
                Object.keys(fieldErrors.personalInfo?.currentLocation || {}).forEach((subKey) => {
                  formattedErrors.personalInfo.currentLocation[subKey as 'country' | 'city'] =
                    fieldErrors.personalInfo?.currentLocation?.[subKey]?.[0];
                });
              } else {
                formattedErrors.personalInfo[key] = fieldErrors.personalInfo?.[key]?.[0];
              }
            });
            formattedErrors.experiences = fieldErrors.experiences;
            formattedErrors.education = fieldErrors.education;
            formattedErrors.skills = fieldErrors.skills;
            formattedErrors.references = fieldErrors.references;
            formattedErrors.termsAgreed = fieldErrors.termsAgreed?.[0];
          }
          dispatch(setErrors(formattedErrors));
          return false;
        }
        return false;
      }
    },
    [dispatch, formData, skipReferences]
  );

  const navigateToStep = useCallback(
    (stepId: number) => {
      // Prevent navigation if current step is invalid
      if (currentStep !== stepId && !validateStep(currentStep)) {
        return;
      }
      // Handle Education step skip logic
      if (stepId === 3 && formData.personalInfo.educationLevel !== "Graduate or higher") {
        return; // Prevent navigating to Education if not applicable
      }
      // Allow navigation to the clicked step
      dispatch(setCurrentStep(stepId));
    },
    [currentStep, dispatch, validateStep, formData.personalInfo.educationLevel]
  );

  const nextStep = useCallback(() => {
    if (validateStep(currentStep)) {
      let next = currentStep + 1;
      if (currentStep === 2 && formData.personalInfo.educationLevel !== "Graduate or higher") {
        next += 1; // Skip Education
      }
      dispatch(setCurrentStep(next));
    }
  }, [currentStep, dispatch, validateStep, formData.personalInfo.educationLevel]);

  const prevStep = useCallback(() => {
    dispatch(setCurrentStep(Math.max(1, currentStep - 1)));
  }, [currentStep, dispatch]);

  const renderStep = useCallback(() => {
    switch (currentStep) {
      case 1:
        return <PersonalInfoStep formData={formData} errors={errors} age={age} />;
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
  }, [currentStep, formData, errors, age, skipReferences]);

  return (
    <div className={`min-h-screen p-6 ${isDark ? "dark bg-gray-900 text-white" : "bg-gray-100 text-gray-900"}`}>
      <div className="max-w-3xl mx-auto">
        <div className="flex justify-between mb-6">
          <h1 className="text-2xl font-bold">Multi-Step Form</h1>
          <button
            onClick={toggleDarkMode}
            className="p-2 rounded-full bg-gray-200 dark:bg-gray-700"
            aria-label="Toggle dark mode"
          >
            {isDark ? "🌙" : "☀️"}
          </button>
        </div>

        {/* Stepper UI */}
        <div className="mb-6">
          <div className="flex items-center justify-between relative">
            {steps.map((step, index) => (
              <React.Fragment key={step.id}>
                <div
                  className="flex flex-col items-center z-10"
                  aria-current={currentStep === step.id ? "step" : undefined}
                >
                  <button
                    onClick={() => navigateToStep(step.id)}
                    className={`w-10 h-10 flex items-center justify-center rounded-full border-2 transition-colors duration-300 cursor-pointer ${
                      currentStep > step.id
                        ? "bg-green-500 border-green-500 text-white"
                        : currentStep === step.id
                        ? "bg-blue-500 border-blue-500 text-white"
                        : "bg-gray-200 dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-500 dark:text-gray-400"
                    } ${step.id === 3 && formData.personalInfo.educationLevel !== "Graduate or higher" ? "opacity-50 cursor-not-allowed" : ""}`}
                    disabled={step.id === 3 && formData.personalInfo.educationLevel !== "Graduate or higher"}
                    aria-label={`Go to ${step.label} step`}
                  >
                    {currentStep > step.id ? (
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                      </svg>
                    ) : (
                      step.id
                    )}
                  </button>
                  <span
                    className={`mt-2 text-sm font-medium text-center ${
                      currentStep >= step.id
                        ? "text-gray-900 dark:text-white"
                        : "text-gray-500 dark:text-gray-400"
                    }`}
                  >
                    {step.label}
                  </span>
                </div>
                {index < steps.length - 1 && (
                  <div
                    className={`flex-1 h-1 mx-2 transition-colors duration-300 ${
                      currentStep > step.id
                        ? "bg-green-500"
                        : currentStep === step.id
                        ? "bg-blue-500"
                        : "bg-gray-300 dark:bg-gray-600"
                    }`}
                  />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.3 }}
            className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg"
          >
            {renderStep()}
            <div className="flex justify-between mt-6">
              {currentStep > 1 && (
                <button
                  onClick={prevStep}
                  className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
                  aria-label="Previous step"
                >
                  Previous
                </button>
              )}
              {currentStep < 7 && (
                <button
                  onClick={nextStep}
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
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
  );
};

export default MultiStepForm;