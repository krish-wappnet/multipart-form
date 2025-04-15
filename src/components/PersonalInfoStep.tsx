/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useCallback } from "react";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { updatePersonalInfo } from "../redux/FormSlice";
import { PersonalInfo } from "../types/form";

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
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Personal Information</h2>
      <div>
        <label className="block text-sm font-medium">Full Name</label>
        <input
          type="text"
          value={formData.personalInfo.fullName || ""}
          onChange={handleFullNameChange}
          className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600"
          aria-required="true"
        />
        {errors.fullName && <p className="text-red-500 text-sm">{errors.fullName}</p>}
      </div>
      <div>
        <label className="block text-sm font-medium">Email</label>
        <input
          type="email"
          value={formData.personalInfo.email || ""}
          onChange={handleEmailChange}
          className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600"
          aria-required="true"
        />
        {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
      </div>
      <div>
        <label className="block text-sm font-medium">Phone Number</label>
        <div className="w-full">
          <PhoneInput
            country={"in"}
            value={formData.personalInfo.phoneNumber || ""}
            onChange={handlePhoneChange}
            inputProps={{
              name: "phoneNumber",
              required: true,
              autoFocus: false,
            }}
            inputClass="!w-full !p-2 !pl-14 !border !rounded !text-sm !bg-white dark:!bg-gray-700 dark:!border-gray-600"
            buttonClass="!bg-gray-100 dark:!bg-gray-600 !border-r dark:!border-gray-500 !rounded-l"
            containerClass="!w-full"
            dropdownClass="!bg-white dark:!bg-gray-700 !text-sm"
            enableSearch
            specialLabel=""
            countryCodeEditable={false}
            placeholder="+91 1234567890"
          />
        </div>
        {errors.phoneNumber && <p className="text-red-500 text-sm">{errors.phoneNumber}</p>}
      </div>
      <div>
        <label className="block text-sm font-medium">Date of Birth</label>
        <input
          type="date"
          value={formData.personalInfo.dateOfBirth || ""}
          onChange={handleDobChange}
          className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600"
        />
        {age !== null && <p className="text-sm text-gray-600 dark:text-gray-400">Age: {age}</p>}
      </div>
      <div>
        <label className="block text-sm font-medium">Gender</label>
        <select
          value={formData.personalInfo.gender || "Prefer not to say"}
          onChange={handleGenderChange}
          className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600"
        >
          <option value="Male">Male</option>
          <option value="Female">Female</option>
          <option value="Other">Other</option>
          <option value="Prefer not to say">Prefer not to say</option>
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium">Current Location</label>
        <input
          type="text"
          placeholder="Country"
          value={formData.personalInfo.currentLocation.country || ""}
          onChange={handleCountryChange}
          className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600 mb-2"
          aria-required="true"
        />
        <input
          type="text"
          placeholder="City"
          value={formData.personalInfo.currentLocation.city || ""}
          onChange={handleCityChange}
          className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600"
          aria-required="true"
        />
        {errors.currentLocation && <p className="text-red-500 text-sm">{errors.currentLocation}</p>}
      </div>
      <div>
        <label className="block text-sm font-medium">Education Level</label>
        <select
          value={formData.personalInfo.educationLevel || "High School"}
          onChange={handleEducationLevelChange}
          className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600"
        >
          <option value="High School">High School</option>
          <option value="Undergraduate">Undergraduate</option>
          <option value="Graduate or higher">Graduate or higher</option>
        </select>
      </div>
    </div>
  );
});

export default PersonalInfoStep;