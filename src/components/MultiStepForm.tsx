/* eslint-disable @typescript-eslint/no-explicit-any */
import PhoneInput from 'react-phone-input-2';
import React, { useState, useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import { z } from "zod";
import {
  loadFormData,
  updatePersonalInfo,
  addExperience,
  updateExperience,
  removeExperience,
  addEducation,
  updateEducation,
  addSkill,
  updateSkill,
  removeSkill,
  addReference,
  updateReference,
  removeReference,
  setTermsAgreed,
  setCurrentStep,
  setErrors,
  resetForm,
} from "../redux/FormSlice";
import { RootState } from "../redux/Store";
import { PersonalInfo, Experience, Education } from "../types/form";
import {
  personalInfoSchema,
  experienceSchema,
  educationSchema,
  skillSchema,
  referenceSchema,
  formSchema,
} from "../utils/Validations";
import { calculateAge, checkOverlappingDates, calculateTotalExperience } from "../utils/dateUtils";

import 'react-phone-input-2/lib/style.css';

const predefinedSkills = ["React", "Node.js", "Python", "Docker", "TypeScript"];

// Memoize sub-components
const PersonalInfoStep = React.memo(({ formData, errors, dispatch, age }: any) => {
  const handleFullNameChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => dispatch(updatePersonalInfo({ fullName: e.target.value })),
    [dispatch]
  );
  const handleEmailChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => dispatch(updatePersonalInfo({ email: e.target.value })),
    [dispatch]
  );
  const handlePhoneChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => dispatch(updatePersonalInfo({ phoneNumber: e.target.value })),
    [dispatch]
  );
  const handleDobChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => dispatch(updatePersonalInfo({ dateOfBirth: e.target.value })),
    [dispatch]
  );
  const handleGenderChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) =>
      dispatch(updatePersonalInfo({ gender: e.target.value as PersonalInfo["gender"] })),
    [dispatch]
  );
  const handleCountryChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) =>
      dispatch(
        updatePersonalInfo({
          currentLocation: { ...formData.personalInfo.currentLocation, country: e.target.value },
        })
      ),
    [dispatch, formData.personalInfo.currentLocation]
  );
  const handleCityChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) =>
      dispatch(
        updatePersonalInfo({
          currentLocation: { ...formData.personalInfo.currentLocation, city: e.target.value },
        })
      ),
    [dispatch, formData.personalInfo.currentLocation]
  );
  const handleEducationLevelChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) =>
      dispatch(updatePersonalInfo({ educationLevel: e.target.value as PersonalInfo["educationLevel"] })),
    [dispatch]
  );

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Personal Information</h2>
      <div>
        <label className="block text-sm font-medium">Full Name</label>
        <input
          type="text"
          value={formData.personalInfo.fullName}
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
          value={formData.personalInfo.email}
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
            country={'in'}
            value={formData.personalInfo.phoneNumber}
            onChange={(value: string) =>
                handlePhoneChange({
                target: {
                    value,
                },
                } as React.ChangeEvent<HTMLInputElement>)
            }
            inputProps={{
                name: 'phoneNumber',
                required: true,
                autoFocus: false,
            }}
            inputClass="!w-full !p-2 !pl-14 !border !rounded !text-sm !bg-white dark:!bg-gray-700 dark:!border-gray-600"
            buttonClass="!bg-gray-100 dark:!bg-gray-600 !border-r dark:!border-gray-500 !rounded-l"
            containerClass="!w-full"
            dropdownClass="!bg-white dark:!bg-gray-700 !text-sm"
            enableSearch
            />
        </div>
        {errors.phoneNumber && (
            <p className="text-red-500 text-sm">{errors.phoneNumber}</p>
        )}
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
          value={formData.personalInfo.gender}
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
          value={formData.personalInfo.currentLocation.country}
          onChange={handleCountryChange}
          className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600 mb-2"
          aria-required="true"
        />
        <input
          type="text"
          placeholder="City"
          value={formData.personalInfo.currentLocation.city}
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

const ExperienceStep = React.memo(({ formData, errors, dispatch }: any) => {
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

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Work Experience</h2>
      {formData.experiences.map((exp: Experience, index: number) => (
        <div key={index} className="border p-4 rounded dark:border-gray-600">
          <div className="flex justify-between">
            <h3 className="text-lg font-medium">Experience {index + 1}</h3>
            {formData.experiences.length > 1 && (
              <button
                onClick={() => dispatch(removeExperience(index))}
                className="text-red-500 hover:text-red-700"
                aria-label={`Remove experience ${index + 1}`}
              >
                Remove
              </button>
            )}
          </div>
          <div className="space-y-2">
            <div>
              <label className="block text-sm font-medium">Job Title</label>
              <input
                type="text"
                value={exp.jobTitle}
                onChange={(e) =>
                  dispatch(updateExperience({ index, data: { jobTitle: e.target.value } }))
                }
                className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600"
                aria-required="true"
              />
              {errors?.experiences?.[index]?.jobTitle && (
                <p className="text-red-500 text-sm">{errors.experiences[index].jobTitle}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium">Company Name</label>
              <input
                type="text"
                value={exp.companyName}
                onChange={(e) =>
                  dispatch(updateExperience({ index, data: { companyName: e.target.value } }))
                }
                className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600"
                aria-required="true"
              />
              {errors?.experiences?.[index]?.companyName && (
                <p className="text-red-500 text-sm">{errors.experiences[index].companyName}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium">Employment Type</label>
              <select
                value={exp.employmentType}
                onChange={(e) =>
                  dispatch(
                    updateExperience({
                      index,
                      data: { employmentType: e.target.value as Experience["employmentType"] },
                    })
                  )
                }
                className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600"
              >
                <option value="Full-time">Full-time</option>
                <option value="Part-time">Part-time</option>
                <option value="Internship">Internship</option>
                <option value="Contract">Contract</option>
                <option value="Freelance">Freelance</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium">Start Date</label>
              <input
                type="date"
                value={exp.startDate}
                onChange={(e) =>
                  dispatch(updateExperience({ index, data: { startDate: e.target.value } }))
                }
                className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600"
                aria-required="true"
              />
              {errors?.experiences?.[index]?.startDate && (
                <p className="text-red-500 text-sm">{errors.experiences[index].startDate}</p>
              )}
            </div>
            {!exp.currentlyWorking && (
              <div>
                <label className="block text-sm font-medium">End Date</label>
                <input
                  type="date"
                  value={exp.endDate || ""}
                  onChange={(e) =>
                    dispatch(updateExperience({ index, data: { endDate: e.target.value } }))
                  }
                  className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600"
                />
                {errors?.experiences?.[index]?.endDate && (
                  <p className="text-red-500 text-sm">{errors.experiences[index].endDate}</p>
                )}
              </div>
            )}
            <div>
              <label className="block text-sm font-medium">
                <input
                  type="checkbox"
                  checked={exp.currentlyWorking}
                  onChange={(e) =>
                    dispatch(
                      updateExperience({
                        index,
                        data: {
                          currentlyWorking: e.target.checked,
                          endDate: e.target.checked ? undefined : exp.endDate,
                        },
                      })
                    )
                  }
                  className="mr-2"
                />
                Currently Working
              </label>
            </div>
            <div>
              <label className="block text-sm font-medium">Responsibilities</label>
              <textarea
                value={exp.responsibilities}
                onChange={(e) =>
                  dispatch(updateExperience({ index, data: { responsibilities: e.target.value } }))
                }
                className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600"
                rows={4}
                aria-required="true"
              />
              {errors?.experiences?.[index]?.responsibilities && (
                <p className="text-red-500 text-sm">{errors.experiences[index].responsibilities}</p>
              )}
            </div>
          </div>
          {checkOverlappingDates(formData.experiences) && (
            <p className="text-red-500 text-sm">Warning: Overlapping dates detected!</p>
          )}
        </div>
      ))}
      <button
        onClick={handleAddExperience}
        className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
        aria-label="Add new experience"
      >
        Add Experience
      </button>
      {errors?.experiences && typeof errors.experiences === "string" && (
        <p className="text-red-500 text-sm">{errors.experiences}</p>
      )}
    </div>
  );
});

const EducationStep = React.memo(({ formData, errors, dispatch }: any) => {
  const handleAddEducation = useCallback(() => {
    dispatch(
      addEducation({
        schoolName: "",
        degree: "",
        fieldOfStudy: "",
        startYear: "",
        endYear: "",
        grade: "",
        certificates: [],
      })
    );
  }, [dispatch]);

  const handleUpdateEducation = useCallback(
    (index: number, field: keyof Education, value: any) => {
      dispatch(updateEducation({ index, data: { [field]: value } }));
    },
    [dispatch]
  );

  const handleAddCertificate = useCallback(
    (index: number, certName: string, file?: File) => {
      const currentCertificates = formData.education[index].certificates || [];
      dispatch(
        updateEducation({
          index,
          data: { certificates: [...currentCertificates, { name: certName, file }] },
        })
      );
    },
    [dispatch, formData.education]
  );

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Education</h2>
      {formData.education.map((edu: Education, index: number) => (
        <div key={index} className="border p-4 rounded dark:border-gray-600">
          <h3 className="text-lg font-medium">Education {index + 1}</h3>
          <div className="space-y-2">
            <div>
              <label className="block text-sm font-medium">School/University Name</label>
              <input
                type="text"
                value={edu.schoolName}
                onChange={(e) => handleUpdateEducation(index, "schoolName", e.target.value)}
                className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600"
                aria-required="true"
              />
              {errors?.education?.[index]?.schoolName && (
                <p className="text-red-500 text-sm">{errors.education[index].schoolName}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium">Degree</label>
              <input
                type="text"
                value={edu.degree}
                onChange={(e) => handleUpdateEducation(index, "degree", e.target.value)}
                className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600"
                aria-required="true"
              />
              {errors?.education?.[index]?.degree && (
                <p className="text-red-500 text-sm">{errors.education[index].degree}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium">Field of Study</label>
              <input
                type="text"
                value={edu.fieldOfStudy}
                onChange={(e) => handleUpdateEducation(index, "fieldOfStudy", e.target.value)}
                className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600"
                aria-required="true"
              />
              {errors?.education?.[index]?.fieldOfStudy && (
                <p className="text-red-500 text-sm">{errors.education[index].fieldOfStudy}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium">Start Year</label>
              <input
                type="text"
                value={edu.startYear}
                onChange={(e) => handleUpdateEducation(index, "startYear", e.target.value)}
                className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600"
                aria-required="true"
              />
              {errors?.education?.[index]?.startYear && (
                <p className="text-red-500 text-sm">{errors.education[index].startYear}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium">End Year</label>
              <input
                type="text"
                value={edu.endYear}
                onChange={(e) => handleUpdateEducation(index, "endYear", e.target.value)}
                className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600"
                aria-required="true"
              />
              {errors?.education?.[index]?.endYear && (
                <p className="text-red-500 text-sm">{errors.education[index].endYear}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium">Grade/GPA</label>
              <input
                type="text"
                value={edu.grade || ""}
                onChange={(e) => handleUpdateEducation(index, "grade", e.target.value)}
                className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600"
              />
            </div>
            <div>
              <label className="block text-sm font-medium">Certificates</label>
              <input
                type="text"
                placeholder="Certificate Name"
                onKeyDown={(e) => {
                  if (e.key === "Enter" && e.currentTarget.value) {
                    handleAddCertificate(index, e.currentTarget.value);
                    e.currentTarget.value = "";
                  }
                }}
                className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600"
              />
              <div className="mt-2">
                {edu.certificates?.map((cert, certIndex) => (
                  <div key={certIndex} className="flex items-center">
                    <span>{cert.name}</span>
                    <input
                      type="file"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          handleAddCertificate(index, cert.name, file);
                        }
                      }}
                      className="ml-2"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      ))}
      <button
        onClick={handleAddEducation}
        className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
        aria-label="Add new education"
      >
        Add Education
      </button>
      {errors?.education && typeof errors.education === "string" && (
        <p className="text-red-500 text-sm">{errors.education}</p>
      )}
    </div>
  );
});

const SkillsStep = React.memo(({ formData, dispatch, errors }: any) => {
  const [customSkill, setCustomSkill] = useState<string>("");

  const handleAddSkill = useCallback(
    (skillName: string) => {
      if (formData.skills.some((s: any) => s.name.toLowerCase() === skillName.toLowerCase())) {
        alert("Skill already added!");
        return;
      }
      dispatch(addSkill({ name: skillName }));
      setCustomSkill("");
    },
    [dispatch, formData.skills]
  );

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Skills</h2>
      <div>
        <label className="block text-sm font-medium">Predefined Skills</label>
        <div className="flex flex-wrap gap-2">
          {predefinedSkills.map((skill) => (
            <button
              key={skill}
              onClick={() => handleAddSkill(skill)}
              className="px-3 py-1 bg-gray-200 rounded-full hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600"
              disabled={formData.skills.some((s: any) => s.name === skill)}
            >
              {skill}
            </button>
          ))}
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium">Custom Skill</label>
        <div className="flex">
          <input
            type="text"
            value={customSkill}
            onChange={(e) => setCustomSkill(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && customSkill) {
                handleAddSkill(customSkill);
              }
            }}
            className="flex-1 p-2 border rounded-l dark:bg-gray-700 dark:border-gray-600"
            aria-label="Add custom skill"
          />
          <button
            onClick={() => customSkill && handleAddSkill(customSkill)}
            className="px-4 py-2 bg-blue-500 text-white rounded-r hover:bg-blue-600"
          >
            Add
          </button>
        </div>
      </div>
      <div className="flex flex-wrap gap-2">
        {formData.skills.map((skill: any, index: number) => (
          <div
            key={index}
            className="flex items-center px-3 py-1 bg-blue-100 rounded-full dark:bg-blue-900"
          >
            <span>{skill.name}</span>
            <input
              type="number"
              placeholder="Years"
              min="0"
              className="w-16 mx-2 p-1 border rounded dark:bg-gray-700 dark:border-gray-600"
              value={skill.yearsOfExperience || ""}
              onChange={(e) =>
                dispatch(updateSkill({ index, data: { yearsOfExperience: Number(e.target.value) } }))
              }
            />
            <button
              onClick={() => dispatch(removeSkill(index))}
              className="text-red-500 hover:text-red-700"
              aria-label={`Remove ${skill.name}`}
            >
              ×
            </button>
          </div>
        ))}
      </div>
      {errors?.skills && <p className="text-red-500 text-sm">{errors.skills}</p>}
    </div>
  );
});

const ReferencesStep = React.memo(({ formData, dispatch, skipReferences, setSkipReferences, errors }: any) => {
  const handleAddReference = useCallback(() => {
    dispatch(
      addReference({
        name: "",
        relationship: "",
        company: "",
        contact: "",
      })
    );
  }, [dispatch]);

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">References</h2>
      <label className="block text-sm font-medium">
        <input
          type="checkbox"
          checked={skipReferences}
          onChange={() => {
            setSkipReferences(!skipReferences);
            if (!skipReferences) {
              dispatch(removeReference(0)); // Clear references
            }
          }}
          className="mr-2"
        />
        Skip adding references
      </label>
      {!skipReferences && (
        <>
          {formData.references.map((ref: any, index: number) => (
            <div key={index} className="border p-4 rounded dark:border-gray-600">
              <div className="flex justify-between">
                <h3 className="text-lg font-medium">Reference {index + 1}</h3>
                {formData.references.length > 1 && (
                  <button
                    onClick={() => dispatch(removeReference(index))}
                    className="text-red-500 hover:text-red-700"
                    aria-label={`Remove reference ${index + 1}`}
                  >
                    Remove
                  </button>
                )}
              </div>
              <div className="space-y-2">
                <div>
                  <label className="block text-sm font-medium">Name</label>
                  <input
                    type="text"
                    value={ref.name}
                    onChange={(e) =>
                      dispatch(updateReference({ index, data: { name: e.target.value } }))
                    }
                    className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600"
                    aria-required="true"
                  />
                  {errors?.references?.[index]?.name && (
                    <p className="text-red-500 text-sm">{errors.references[index].name}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium">Relationship</label>
                  <input
                    type="text"
                    value={ref.relationship}
                    onChange={(e) =>
                      dispatch(updateReference({ index, data: { relationship: e.target.value } }))
                    }
                    className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600"
                    aria-required="true"
                  />
                  {errors?.references?.[index]?.relationship && (
                    <p className="text-red-500 text-sm">{errors.references[index].relationship}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium">Company</label>
                  <input
                    type="text"
                    value={ref.company}
                    onChange={(e) =>
                      dispatch(updateReference({ index, data: { company: e.target.value } }))
                    }
                    className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600"
                    aria-required="true"
                  />
                  {errors?.references?.[index]?.company && (
                    <p className="text-red-500 text-sm">{errors.references[index].company}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium">Contact (Phone/Email)</label>
                  <input
                    type="text"
                    value={ref.contact}
                    onChange={(e) =>
                      dispatch(updateReference({ index, data: { contact: e.target.value } }))
                    }
                    className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600"
                    aria-required="true"
                  />
                  {errors?.references?.[index]?.contact && (
                    <p className="text-red-500 text-sm">{errors.references[index].contact}</p>
                  )}
                </div>
              </div>
            </div>
          ))}
          <button
            onClick={handleAddReference}
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
            aria-label="Add new reference"
          >
            Add Reference
          </button>
          {errors?.references && typeof errors.references === "string" && (
            <p className="text-red-500 text-sm">{errors.references}</p>
          )}
        </>
      )}
    </div>
  );
});

const SummaryStep = React.memo(({ formData, dispatch, skipReferences, age }: any) => {
  const totalExperience = calculateTotalExperience(formData.experiences);

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Summary</h2>
      <div>
        <div className="flex justify-between">
          <h3 className="text-lg font-medium">Personal Information</h3>
          <button
            onClick={() => dispatch(setCurrentStep(1))}
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
            onClick={() => dispatch(setCurrentStep(2))}
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
      {formData.personalInfo.educationLevel === "Graduate or higher" && (
        <div>
          <div className="flex justify-between">
            <h3 className="text-lg font-medium">Education</h3>
            <button
              onClick={() => dispatch(setCurrentStep(3))}
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
              {edu.certificates && edu.certificates.length > 0 && (
                <p>Certificates: {edu.certificates.map((c) => c.name).join(", ")}</p>
              )}
            </div>
          ))}
        </div>
      )}
      <div>
        <div className="flex justify-between">
          <h3 className="text-lg font-medium">Skills (Total: {formData.skills.length})</h3>
          <button
            onClick={() => dispatch(setCurrentStep(4))}
            className="text-blue-500 hover:text-blue-700"
            aria-label="Edit skills"
          >
            Edit
          </button>
        </div>
        <div className="flex flex-wrap gap-2">
          {formData.skills.map((skill: any, index: number) => (
            <span
              key={index}
              className="px-3 py-1 bg-blue-100 rounded-full dark:bg-blue-900"
            >
              {skill.name} {skill.yearsOfExperience ? `(${skill.yearsOfExperience} yrs)` : ""}
            </span>
          ))}
        </div>
      </div>
      {!skipReferences && formData.references.length > 0 && (
        <div>
          <div className="flex justify-between">
            <h3 className="text-lg font-medium">References</h3>
            <button
              onClick={() => dispatch(setCurrentStep(5))}
              className="text-blue-500 hover:text-blue-700"
              aria-label="Edit references"
            >
              Edit
            </button>
          </div>
          {formData.references.map((ref: any, index: number) => (
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

const SubmitStep = React.memo(({ formData, dispatch, errors }: any) => {
  const handleSubmit = useCallback(() => {
    if (formData.validateStep(7)) {
      alert("Form submitted successfully!");
      dispatch(resetForm());
    }
  }, [dispatch, formData]);

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Submit</h2>
      <label className="block text-sm font-medium">
        <input
          type="checkbox"
          checked={formData.termsAgreed}
          onChange={(e) => dispatch(setTermsAgreed(e.target.checked))}
          className="mr-2"
        />
        I agree to the Terms & Conditions
      </label>
      {errors.termsAgreed && <p className="text-red-500 text-sm">{errors.termsAgreed}</p>}
      <button
        onClick={handleSubmit}
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        aria-label="Submit form"
      >
        Submit
      </button>
    </div>
  );
});

const MultiStepForm: React.FC = () => {
  const dispatch = useDispatch();
  const { formData, currentStep, errors } = useSelector((state: RootState) => state.form);
  const [isDark, setIsDark] = useState<boolean>(false);
  const [age, setAge] = useState<number | null>(null);
  const [skipReferences, setSkipReferences] = useState<boolean>(formData.references.length === 0);

  // Load saved data on mount
  useEffect(() => {
    dispatch(loadFormData());
  }, [dispatch]);

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
        return <ExperienceStep formData={formData} errors={errors} dispatch={dispatch} />;
      case 3:
        return <EducationStep formData={formData} errors={errors} dispatch={dispatch} />;
      case 4:
        return <SkillsStep formData={formData} dispatch={dispatch} errors={errors} />;
      case 5:
        return (
          <ReferencesStep
            formData={formData}
            dispatch={dispatch}
            skipReferences={skipReferences}
            setSkipReferences={setSkipReferences}
            errors={errors}
          />
        );
      case 6:
        return (
          <SummaryStep
            formData={formData}
            dispatch={dispatch}
            skipReferences={skipReferences}
            age={age}
          />
        );
      case 7:
        return <SubmitStep formData={{ ...formData, validateStep }} dispatch={dispatch} errors={errors} />;
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