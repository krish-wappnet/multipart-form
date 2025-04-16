
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Formik, Form } from 'formik';
import { RootState, AppDispatch } from '../redux/Store';
import { Education, educationYupSchema } from '../utils/Validations';
import { addEducation, updateEducation, removeEducation } from '../redux/FormSlice';
import ArrayField from './reusable/ArrayField';
import FormField from './reusable/FormField';
import { useFormField } from './reusable/useFormField';
import { motion, AnimatePresence } from 'framer-motion';

// Field configuration
interface FieldConfig {
  key: keyof Omit<Education, 'certificates'>;
  label: string;
  type: 'text' | 'textarea';
  required?: boolean;
  className?: string;
}

const educationFields: FieldConfig[] = [
  { key: 'schoolName', label: 'School/University Name', type: 'text', required: true },
  { key: 'degree', label: 'Degree', type: 'text', required: true },
  { key: 'fieldOfStudy', label: 'Field of Study', type: 'text', required: true },
  { key: 'startYear', label: 'Start Year', type: 'text', required: true },
  { key: 'endYear', label: 'End Year', type: 'text', required: true },
  { key: 'grade', label: 'Grade/GPA', type: 'text', required: false },
];

// Component for a single education entry
const EducationItem: React.FC<{
  edu: Education;
  index: number;
  setFieldValue: (field: string, value: any) => void;
}> = React.memo(({ edu, index, setFieldValue }) => {
  const dispatch = useDispatch<AppDispatch>();

  // Form fields using useFormField
  const fieldHooks = educationFields.map((field) => {
    const fieldPath = `education[${index}].${field.key}` as const;
    const formikFieldPath = `education[${index}].${field.key}`;

    return {
      field,
      hook: useFormField<string>({
        path: fieldPath,
        updateAction: (value: string) => updateEducation({ index, data: { [field.key]: value } }),
      }),
      formikFieldPath,
    };
  });

  // Certificate handling
  const handleAddCertificate = useCallback(
    (file: File) => {
      const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png'];
      const maxSize = 5 * 1024 * 1024; // 5MB
      if (!allowedTypes.includes(file.type)) {
        alert('Only PDF, JPEG, or PNG files are allowed.');
        return;
      }
      if (file.size > maxSize) {
        alert('File size must be less than 5MB.');
        return;
      }

      const currentCertificates = edu.certificates || [];
      const certName = file.name;
      const newCertificates = [...currentCertificates, { name: certName, file }];
      dispatch(updateEducation({ index, data: { certificates: newCertificates } }));
      setFieldValue(`education[${index}].certificates`, newCertificates.map(({ name }) => ({ name })));
    },
    [dispatch, edu.certificates, index, setFieldValue]
  );

  const handleRemoveCertificate = useCallback(
    (certIndex: number) => {
      const currentCertificates = edu.certificates || [];
      const updatedCertificates = currentCertificates.filter((_, i) => i !== certIndex);
      dispatch(updateEducation({ index, data: { certificates: updatedCertificates } }));
      setFieldValue(`education[${index}].certificates`, updatedCertificates.map(({ name }) => ({ name })));
    },
    [dispatch, edu.certificates, index, setFieldValue]
  );

  return (
    <>
      {fieldHooks.map(({ field, hook, formikFieldPath }) => (
        <div key={field.key} className={field.className || 'sm:col-span-1'}>
          <FormField
            id={`${field.key}-${index}`}
            label={field.label}
            type={field.type}
            value={hook.value ?? ''}
            onChange={(value: string) => {
              hook.handleChange(value);
              setFieldValue(formikFieldPath, value);
            }}
            error={hook.error}
            required={field.required}
          />
        </div>
      ))}
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
              handleAddCertificate(file);
              e.target.value = '';
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
                onClick={() => handleRemoveCertificate(certIndex)}
                className="px-2 py-1 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors text-sm"
                aria-label={`Remove certificate ${cert.name}`}
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      </div>
    </>
  );
});

const EducationStep: React.FC = React.memo(() => {
  const dispatch = useDispatch<AppDispatch>();
  const formData = useSelector((state: RootState) => state.form.formData);
  const errors = useSelector((state: RootState) => state.form.errors);

  const handleAddEducation = useCallback(() => {
    dispatch(
      addEducation({
        schoolName: '',
        degree: '',
        fieldOfStudy: '',
        startYear: '',
        endYear: '',
        grade: '',
        certificates: [],
      })
    );
  }, [dispatch]);

  const renderEducation = (edu: Education, index: number, setFieldValue: (field: string, value: any) => void) => {
    return <EducationItem edu={edu} index={index} setFieldValue={setFieldValue} />;
  };

  return (
    <Formik
      initialValues={{ education: formData.education }}
      validationSchema={educationYupSchema}
      enableReinitialize
      onSubmit={() => {
        // Navigation handled by MultiStepForm
      }}
    >
      {({ setFieldValue }) => (
        <Form>
          <ArrayField
            items={formData.education}
            renderItem={(edu, index) => renderEducation(edu, index, setFieldValue)}
            addItem={handleAddEducation}
            removeItem={(index) => dispatch(removeEducation(index))}
            title="Education"
            addButtonLabel="Add Education"
            errors={errors.education}
          />
        </Form>
      )}
    </Formik>
  );
});

export default EducationStep;
