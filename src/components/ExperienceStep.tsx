
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Formik, Form } from 'formik';
import { RootState, AppDispatch } from '../redux/Store';
import { Experience, experienceYupSchema } from '../utils/Validations';
import { checkOverlappingDates } from '../utils/dateUtils';
import { addExperience, updateExperience, removeExperience } from '../redux/FormSlice';
import ArrayField from './reusable/ArrayField';
import FormField from './reusable/FormField';
import { useFormField } from './reusable/useFormField';
import { motion, AnimatePresence } from 'framer-motion';
import { experienceFields } from '../utils/experienceFields';

// Component to handle a single experience
const ExperienceItem: React.FC<{
  exp: Experience;
  index: number;
  setFieldValue: (field: string, value: any) => void;
}> = React.memo(({ exp, index, setFieldValue }) => {
  const dispatch = useDispatch<AppDispatch>();

  // Compute hooks for this experience's fields
  const fieldHooks = experienceFields.map((field) => {
    const fieldPath = `experiences[${index}].${field.key}` as const;
    const formikFieldPath = `experiences[${index}].${field.key}`;

    type FieldType = typeof field.key extends 'currentlyWorking'
      ? boolean
      : typeof field.key extends 'employmentType'
      ? Experience['employmentType']
      : string | undefined;

    return {
      field,
      hook: useFormField<FieldType>({
        path: fieldPath,
        updateAction: (value: FieldType) => {
          if (field.key === 'currentlyWorking') {
            return updateExperience({
              index,
              data: {
                currentlyWorking: value as unknown as boolean,
                endDate: value ? undefined : exp.endDate,
              },
            });
          }
          return updateExperience({
            index,
            data: { [field.key]: value },
          });
        },
      }),
      formikFieldPath,
    };
  });

  return (
    <>
      {fieldHooks.map(({ field, hook, formikFieldPath }) => {
        if (field.hidden?.(exp)) return null;

        return (
          <div key={field.key as string} className={field.className}>
            <FormField
              id={`${field.key}-${index}`}
              label={field.label}
              type={field.type}
              value={hook.value}
              onChange={(value: any) => {
                hook.handleChange(value);
                setFieldValue(formikFieldPath, value);
              }}
              error={hook.error}
              required={field.required}
              options={field.options}
              rows={field.rows}
            />
          </div>
        );
      })}
      <AnimatePresence>
        {checkOverlappingDates([exp]) && (
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
});

const ExperienceStep: React.FC = React.memo(() => {
  const dispatch = useDispatch<AppDispatch>();
  const formData = useSelector((state: RootState) => state.form.formData);
  const errors = useSelector((state: RootState) => state.form.errors);

  const handleAddExperience = useCallback(() => {
    dispatch(
      addExperience({
        jobTitle: '',
        companyName: '',
        employmentType: 'Full-time',
        startDate: '',
        endDate: '',
        currentlyWorking: false,
        responsibilities: '',
      })
    );
  }, [dispatch]);

  const renderExperience = (exp: Experience, index: number, setFieldValue: (field: string, value: any) => void) => {
    return <ExperienceItem exp={exp} index={index} setFieldValue={setFieldValue} />;
  };

  return (
    <Formik
      initialValues={{ experiences: formData.experiences }}
      validationSchema={experienceYupSchema}
      enableReinitialize
      onSubmit={() => {
        // Navigation handled by MultiStepForm
      }}
    >
      {({ setFieldValue }) => (
        <Form>
          <ArrayField
            items={formData.experiences}
            renderItem={(exp, index) => renderExperience(exp, index, setFieldValue)}
            addItem={handleAddExperience}
            removeItem={(index) => dispatch(removeExperience(index))}
            title="Experience"
            addButtonLabel="Add Experience"
            errors={errors.experiences}
          />
        </Form>
      )}
    </Formik>
  );
});

export default ExperienceStep;
