/* eslint-disable @typescript-eslint/no-explicit-any */

/* eslint-disable @typescript-eslint/no-unused-vars */
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Formik, Form } from 'formik';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import { AppDispatch, RootState } from '../redux/Store';
import { updatePersonalInfo } from '../redux/FormSlice';
import { PersonalInfo, personalInfoYupSchema } from '../utils/Validations';
import { useFormField } from './reusable/useFormField';
import FormField from './reusable/FormField';
import { FormDataPath } from '../utils/path';
import { motion, AnimatePresence } from 'framer-motion';

// Field configuration for PersonalInfo
interface FieldConfig {
  key: keyof PersonalInfo | 'country' | 'city';
  label: string;
  type: 'text' | 'email' | 'date' | 'select' | 'phone';
  required?: boolean;
  options?: string[];
  className?: string;
  isNested?: boolean;
}

const personalInfoFields: FieldConfig[] = [
  { key: 'fullName', label: 'Full Name', type: 'text', required: true },
  { key: 'email', label: 'Email', type: 'email', required: true },
  { key: 'phoneNumber', label: 'Phone Number', type: 'phone', required: true },
  { key: 'dateOfBirth', label: 'Date of Birth', type: 'date', required: false },
  {
    key: 'gender',
    label: 'Gender',
    type: 'select',
    required: true,
    options: ['Male', 'Female', 'Other', 'Prefer not to say'],
  },
  {
    key: 'educationLevel',
    label: 'Education Level',
    type: 'select',
    required: false,
    options: ['High School', 'Undergraduate', 'Graduate or higher'],
  },
  {
    key: 'country',
    label: 'Country',
    type: 'text',
    required: true,
    isNested: true,
    className: 'sm:col-span-1',
  },
  {
    key: 'city',
    label: 'City',
    type: 'text',
    required: true,
    isNested: true,
    className: 'sm:col-span-1',
  },
];

interface PersonalInfoItemProps {
  field: FieldConfig;
  formData: { personalInfo: PersonalInfo };
  errors: { personalInfo?: { [key: string]: string | undefined } };
  age: number | null;
  setFieldValue: (field: string, value: any) => void;
}

const PersonalInfoItem: React.FC<PersonalInfoItemProps> = React.memo(
  ({ field, formData, errors, age, setFieldValue }) => {
    const dispatch = useDispatch<AppDispatch>();
    const personalInfoErrors = errors.personalInfo || {};
    const fieldPath = field.isNested
      ? `personalInfo.currentLocation.${field.key}`
      : `personalInfo.${field.key}`;
    const formikFieldPath = field.isNested ? `currentLocation.${field.key}` : field.key;

    const { value, error, handleChange } = useFormField<string>({
      path: fieldPath as FormDataPath,
      updateAction: (value: string) => {
        if (field.isNested) {
          return updatePersonalInfo({
            currentLocation: {
              ...formData.personalInfo.currentLocation,
              [field.key]: value,
            },
          });
        }
        if (field.key === 'phoneNumber') {
          let normalizedValue = value.replace(/[\s-]/g, '');
          if (!normalizedValue.startsWith('+')) {
            normalizedValue = `+${normalizedValue}`;
          }
          return updatePersonalInfo({ phoneNumber: normalizedValue });
        }
        return updatePersonalInfo({ [field.key]: value });
      },
    });

    const id = field.key;

    if (field.type === 'phone') {
      return (
        <div className={field.className}>
          <label
            htmlFor={id}
            className="block text-sm font-semibold text-gray-700 dark:text-gray-200"
          >
            {field.label}
          </label>
          <PhoneInput
            country={'in'}
            value={value || ''}
            onChange={(phoneValue) => {
              let normalizedValue = phoneValue.replace(/[\s-]/g, '');
              if (!normalizedValue.startsWith('+')) {
                normalizedValue = `+${normalizedValue}`;
              }
              handleChange(normalizedValue);
              setFieldValue(formikFieldPath, normalizedValue);
            }}
            inputProps={{
              id,
              name: field.key,
              required: field.required,
              autoFocus: false,
            }}
            inputClass="!mt-1 !w-full !p-3 !pl-14 !border !border-gray-300 dark:!border-gray-600 !rounded-md !shadow-sm !bg-white dark:!bg-gray-700 !text-gray-900 dark:!text-white !focus:ring-2 !focus:ring-blue-500 !focus:border-blue-500 !transition-colors"
            buttonClass="!mt-1 !bg-gray-100 dark:!bg-gray-600 !border-r dark:!border-gray-500 !rounded-l-md !shadow-sm"
            containerClass="!w-full"
            dropdownClass="!bg-white dark:!bg-gray-700 !text-sm !border !border-gray-300 dark:!border-gray-600 !rounded-md !shadow-lg"
            enableSearch
            specialLabel=""
            countryCodeEditable={false}
            placeholder="+91 1234567890"
          />
          <AnimatePresence>
            {(error || personalInfoErrors[field.key]) && (
              <motion.p
                id={`${id}-error`}
                className="mt-1 text-sm text-red-500"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                {error || personalInfoErrors[field.key]}
              </motion.p>
            )}
          </AnimatePresence>
        </div>
      );
    }

    return (
      <div className={field.className || (field.isNested ? 'sm:col-span-1' : '')}>
        <FormField
          id={id}
          label={field.label}
          type={field.type}
          value={value ?? ''}
          onChange={(value: string) => {
            handleChange(value);
            setFieldValue(formikFieldPath, value);
          }}
          error={error || personalInfoErrors[field.key]}
          required={field.required}
          options={field.options}
          className={field.isNested ? 'w-full' : undefined}
        />
        {field.key === 'dateOfBirth' && age !== null && (
          <p
            id="age-info"
            className="mt-1 text-sm text-gray-600 dark:text-gray-400"
          >
            Age: {age}
          </p>
        )}
      </div>
    );
  }
);

interface PersonalInfoStepProps {
  formData: { personalInfo: PersonalInfo };
  errors: { personalInfo?: { [key: string]: string | undefined } };
  age: number | null;
}

const PersonalInfoStep: React.FC<PersonalInfoStepProps> = React.memo(({ formData, errors, age }) => {
  const personalInfo = useSelector((state: RootState) => state.form.formData.personalInfo);

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Personal Information</h2>
      <Formik
        initialValues={personalInfo}
        validationSchema={personalInfoYupSchema}
        enableReinitialize
        onSubmit={(values) => {
          // Navigation handled by MultiStepForm; no need to dispatch here
        }}
      >
        {({ setFieldValue }) => (
          <Form className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {personalInfoFields.map((field) => (
              <PersonalInfoItem
                key={field.key}
                field={field}
                formData={formData}
                errors={errors}
                age={age}
                setFieldValue={setFieldValue}
              />
            ))}
            <button type="submit" className="hidden" />
          </Form>
        )}
      </Formik>
    </div>
  );
});

export default PersonalInfoStep;
