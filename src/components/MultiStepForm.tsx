/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import { z } from "zod";
import {
  setCurrentStep,
  setErrors,
} from "../redux/FormSlice";
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

  // Load saved data on mount
  // useEffect(() => {
  //   dispatch(loadFormData());
  // }, [dispatch]);

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

  // Validation logic
  const validateStep = useCallback(
    (step: number): boolean => {
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
        return true;
      } catch (error: any) {
        dispatch(setErrors(error.formErrors?.fieldErrors || error.errors));
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

  // Render step
  const renderStep = useCallback(() => {
    switch (currentStep) {
      case 1:
        return <PersonalInfoStep formData={formData} errors={errors} dispatch={dispatch} age={age} />;
      case 2:
        return <ExperienceStep />;
      case 3:
        return <EducationStep/>;
      case 4:
        return <SkillsStep />;
      case 5:
        return (
          <ReferencesStep
          skipReferences={skipReferences}
          setSkipReferences={setSkipReferences}
        />
        );
      case 6:
        return (
          <SummaryStep skipReferences={skipReferences} age={age} />
        );
      case 7:
        return <SubmitStep validateStep={validateStep} />;
      default:
        return null;
    }
  }, [currentStep, formData, errors, dispatch, age, skipReferences]);

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
            {isDark ? "dark" : "light"}
          </button>
        </div>

        <div className="flex mb-6">
          {[1, 2, 3, 4, 5, 6, 7].map((step) => (
            <div
              key={step}
              className={`flex-1 text-center py-2 ${
                currentStep === step ? "bg-blue-500 text-white" : "bg-gray-300 dark:bg-gray-700"
              }`}
            >
              Step {step}
            </div>
          ))}
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