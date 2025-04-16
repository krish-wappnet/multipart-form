/* eslint-disable @typescript-eslint/no-explicit-any */
import { FormData } from "../types/form";
import {
  updateExperience,
  updateEducation,
  addExperience,
  addEducation,
  removeExperience,
  removeEducation,
} from "../redux/FormSlice";

export function updateArrayField<T extends keyof FormData>(
  key: T,
  index: number,
  field: string,
  value: any
) {
  if (key === "experiences") {
    return updateExperience({ index, data: { [field]: value } });
  }
  if (key === "education") {
    return updateEducation({ index, data: { [field]: value } });
  }
  // Add skills, references as needed
  return { type: "", payload: {} };
}

export function addArrayItem(key: keyof FormData) {
  if (key === "experiences") {
    return addExperience({
      jobTitle: "",
      companyName: "",
      employmentType: "Full-time",
      startDate: "",
      endDate: "",
      currentlyWorking: false,
      responsibilities: "",
    });
  }
  if (key === "education") {
    return addEducation({
      schoolName: "",
      degree: "",
      fieldOfStudy: "",
      startYear: "",
      endYear: "",
      grade: "",
      certificates: [],
    });
  }
  // Add skills, references
  return { type: "", payload: {} };
}

export function removeArrayItem(key: keyof FormData, index: number) {
  if (key === "experiences") {
    return removeExperience(index);
  }
  if (key === "education") {
    return removeEducation(index);
  }
  // Add skills, references
  return { type: "", payload: {} };
}