/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useCallback } from "react";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { updatePersonalInfo } from "../redux/FormSlice";
import { PersonalInfo } from "../types/form";
import { motion, AnimatePresence } from "framer-motion";

interface PersonalInfoStepProps {
  formData: { personalInfo: PersonalInfo };
  errors: Partial<Record<keyof PersonalInfo | "currentLocation", string>>;
  dispatch: any;
  age: number | null;
}

const PersonalInfoStep: React.FC<PersonalInfoStepProps> = React.memo(({ formData, errors, dispatch, age }) => {
  const handleFullNameChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      dispatch(updatePersonalInfo({ fullName: e.target.value }));
    },
    [dispatch]
  );

  const handleEmailChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      dispatch(updatePersonalInfo({ email: e.target.value }));
    },
    [dispatch]
  );

  const handlePhoneChange = useCallback(
    (value: string) => {
      let normalizedValue = value.replace(/[\s-]/g, "");
      if (!normalizedValue.startsWith("+")) {
        normalizedValue = `+${normalizedValue}`;
      }
      dispatch(updatePersonalInfo({ phoneNumber: normalizedValue }));
    },
    [dispatch]
  );

  const handleDobChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      dispatch(updatePersonalInfo({ dateOfBirth: e.target.value }));
    },
    [dispatch]
  );

  const handleGenderChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      const value = e.target.value as PersonalInfo["gender"];
      dispatch(updatePersonalInfo({ gender: value }));
    },
    [dispatch]
  );

  const handleCountryChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      dispatch(
        updatePersonalInfo({
          currentLocation: { ...formData.personalInfo.currentLocation, country: e.target.value },
        })
      );
    },
    [dispatch, formData.personalInfo.currentLocation]
  );

  const handleCityChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      dispatch(
        updatePersonalInfo({
          currentLocation: { ...formData.personalInfo.currentLocation, city: e.target.value },
        })
      );
    },
    [dispatch, formData.personalInfo.currentLocation]
  );

  const handleEducationLevelChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      const value = e.target.value as PersonalInfo["educationLevel"];
      dispatch(updatePersonalInfo({ educationLevel: value }));
    },
    [dispatch]
  );

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Personal Information</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Full Name */}
        <div>
          <label htmlFor="fullName" className="block text-sm font-semibold text-gray-700 dark:text-gray-200">
            Full Name
          </label>
          <input
            id="fullName"
            type="text"
            value={formData.personalInfo.fullName || ""}
            onChange={handleFullNameChange}
            className="mt-1 w-full p-3 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            aria-required="true"
            aria-invalid={!!errors.fullName}
            aria-describedby={errors.fullName ? "fullName-error" : undefined}
          />
          <AnimatePresence>
            {errors.fullName && (
              <motion.p
                id="fullName-error"
                className="mt-1 text-sm text-red-500"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                {errors.fullName}
              </motion.p>
            )}
          </AnimatePresence>
        </div>

        {/* Email */}
        <div>
          <label htmlFor="email" className="block text-sm font-semibold text-gray-700 dark:text-gray-200">
            Email
          </label>
          <input
            id="email"
            type="email"
            value={formData.personalInfo.email || ""}
            onChange={handleEmailChange}
            className="mt-1 w-full p-3 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            aria-required="true"
            aria-invalid={!!errors.email}
            aria-describedby={errors.email ? "email-error" : undefined}
          />
          <AnimatePresence>
            {errors.email && (
              <motion.p
                id="email-error"
                className="mt-1 text-sm text-red-500"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                {errors.email}
              </motion.p>
            )}
          </AnimatePresence>
        </div>

        {/* Phone Number */}
        <div>
          <label htmlFor="phoneNumber" className="block text-sm font-semibold text-gray-700 dark:text-gray-200">
            Phone Number
          </label>
          <PhoneInput
            country={"in"}
            value={formData.personalInfo.phoneNumber || ""}
            onChange={handlePhoneChange}
            inputProps={{
              id: "phoneNumber",
              name: "phoneNumber",
              required: true,
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
            {errors.phoneNumber && (
              <motion.p
                id="phoneNumber-error"
                className="mt-1 text-sm text-red-500"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                {errors.phoneNumber}
              </motion.p>
            )}
          </AnimatePresence>
        </div>

        {/* Date of Birth */}
        <div>
          <label htmlFor="dateOfBirth" className="block text-sm font-semibold text-gray-700 dark:text-gray-200">
            Date of Birth
          </label>
          <input
            id="dateOfBirth"
            type="date"
            value={formData.personalInfo.dateOfBirth || ""}
            onChange={handleDobChange}
            className="mt-1 w-full p-3 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            aria-describedby={age !== null ? "age-info" : undefined}
          />
          {age !== null && (
            <p id="age-info" className="mt-1 text-sm text-gray-600 dark:text-gray-400">
              Age: {age}
            </p>
          )}
        </div>

        {/* Gender */}
        <div>
          <label htmlFor="gender" className="block text-sm font-semibold text-gray-700 dark:text-gray-200">
            Gender
          </label>
          <select
            id="gender"
            value={formData.personalInfo.gender || "Prefer not to say"}
            onChange={handleGenderChange}
            className="mt-1 w-full p-3 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
          >
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
            <option value="Prefer not to say">Prefer not to say</option>
          </select>
        </div>

        {/* Education Level */}
        <div>
          <label htmlFor="educationLevel" className="block text-sm font-semibold text-gray-700 dark:text-gray-200">
            Education Level
          </label>
          <select
            id="educationLevel"
            value={formData.personalInfo.educationLevel || "High School"}
            onChange={handleEducationLevelChange}
            className="mt-1 w-full p-3 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
          >
            <option value="High School">High School</option>
            <option value="Undergraduate">Undergraduate</option>
            <option value="Graduate or higher">Graduate or higher</option>
          </select>
        </div>

        {/* Current Location */}
        <div className="md:col-span-2">
          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200">Current Location</label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-1">
            <input
              id="country"
              type="text"
              placeholder="Country"
              value={formData.personalInfo.currentLocation.country || ""}
              onChange={handleCountryChange}
              className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              aria-required="true"
              aria-invalid={!!errors.currentLocation}
              aria-describedby={errors.currentLocation ? "currentLocation-error" : undefined}
            />
            <input
              id="city"
              type="text"
              placeholder="City"
              value={formData.personalInfo.currentLocation.city || ""}
              onChange={handleCityChange}
              className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              aria-required="true"
              aria-invalid={!!errors.currentLocation}
              aria-describedby={errors.currentLocation ? "currentLocation-error" : undefined}
            />
          </div>
          <AnimatePresence>
            {errors.currentLocation && (
              <motion.p
                id="currentLocation-error"
                className="mt-1 text-sm text-red-500"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                {errors.currentLocation}
              </motion.p>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
});

export default PersonalInfoStep;