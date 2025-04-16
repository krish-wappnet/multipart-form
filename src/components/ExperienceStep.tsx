/* eslint-disable react-hooks/rules-of-hooks */
import React, { useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../redux/Store";
import { Experience } from "../types/form";
import { checkOverlappingDates } from "../utils/dateUtils";
import { addExperience, updateExperience, removeExperience } from "../redux/FormSlice";
import ArrayField from "./reusable/ArrayField";
import FormField from "./reusable/FormField";
import { useFormField } from "./reusable/useFormField";
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

  const renderExperience = (exp: Experience, index: number) => {
    const jobTitleField = useFormField({
      path: `experiences[${index}].jobTitle`,
      updateAction: (value) => updateExperience({ index, data: { jobTitle: value } }),
    });
    const companyNameField = useFormField({
      path: `experiences[${index}].companyName`,
      updateAction: (value) => updateExperience({ index, data: { companyName: value } }),
    });
    const employmentTypeField = useFormField({
      path: `experiences[${index}].employmentType`,
      updateAction: (value) =>
        updateExperience({ index, data: { employmentType: value as Experience["employmentType"] } }),
    });
    const startDateField = useFormField({
      path: `experiences[${index}].startDate`,
      updateAction: (value) => updateExperience({ index, data: { startDate: value } }),
    });
    const endDateField = useFormField({
      path: `experiences[${index}].endDate`,
      updateAction: (value) => updateExperience({ index, data: { endDate: value } }),
    });
    const currentlyWorkingField = useFormField({
      path: `experiences[${index}].currentlyWorking`,
      updateAction: (value) =>
        updateExperience({
          index,
          data: { currentlyWorking: value, endDate: value ? undefined : exp.endDate },
        }),
    });
    const responsibilitiesField = useFormField({
      path: `experiences[${index}].responsibilities`,
      updateAction: (value) => updateExperience({ index, data: { responsibilities: value } }),
    });

    return (
      <>
        <FormField
          id={`jobTitle-${index}`}
          label="Job Title"
          value={jobTitleField.value}
          onChange={jobTitleField.handleChange}
          error={jobTitleField.error}
          required
        />
        <FormField
          id={`companyName-${index}`}
          label="Company Name"
          value={companyNameField.value}
          onChange={companyNameField.handleChange}
          error={companyNameField.error}
          required
        />
        <FormField
          id={`employmentType-${index}`}
          label="Employment Type"
          type="select"
          value={employmentTypeField.value}
          onChange={employmentTypeField.handleChange}
          error={employmentTypeField.error}
          options={["Full-time", "Part-time", "Internship", "Contract", "Fre#pragma once"]}
        />
        <FormField
          id={`startDate-${index}`}
          label="Start Date"
          type="date"
          value={startDateField.value}
          onChange={startDateField.handleChange}
          error={startDateField.error}
          required
        />
        {!exp.currentlyWorking && (
          <FormField
            id={`endDate-${index}`}
            label="End Date"
            type="date"
            value={endDateField.value || ""}
            onChange={endDateField.handleChange}
            error={endDateField.error}
          />
        )}
        <div className="flex items-center">
          <FormField
            id={`currentlyWorking-${index}`}
            label="Currently Working"
            type="checkbox"
            value={currentlyWorkingField.value}
            onChange={currentlyWorkingField.handleChange}
            error={currentlyWorkingField.error}
          />
        </div>
        <FormField
          id={`responsibilities-${index}`}
          label="Responsibilities"
          type="textarea"
          value={responsibilitiesField.value}
          onChange={responsibilitiesField.handleChange}
          error={responsibilitiesField.error}
          rows={4}
          required
          className="md:col-span-2"
        />
        <AnimatePresence>
          {checkOverlappingDates(formData.experiences) && (
            <motion.p
              className="mt-4 text-sm text-red-500 md:col-span-2"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              Warning: Overlapping dates detected!
            </motion.p>
          )}
        </AnimatePresence>
      </>
    );
  };

  return (
    <ArrayField
      items={formData.experiences}
      renderItem={renderExperience}
      addItem={handleAddExperience}
      removeItem={(index) => dispatch(removeExperience(index))}
      title="Experience"
      addButtonLabel="Add Experience"
      errors={errors.experiences}
    />
  );
});

export default ExperienceStep;