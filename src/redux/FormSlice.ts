/* eslint-disable @typescript-eslint/no-explicit-any */
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { FormData, PersonalInfo, Experience, Education, Skill, Reference } from "../types/form";
import { throttle, cloneDeep } from "lodash";

const initialState: {
  formData: FormData;
  currentStep: number;
  errors: any;
} = {
  formData: {
    personalInfo: {
      fullName: "",
      email: "",
      phoneNumber: "",
      dateOfBirth: "",
      gender: "Prefer not to say",
      currentLocation: { country: "", city: "" },
      educationLevel: "High School",
    },
    experiences: [],
    education: [],
    skills: [],
    references: [],
    termsAgreed: false,
  },
  currentStep: 1,
  errors: {},
};

const saveToLocalStorage = throttle((formData: FormData) => {
  console.log("Saving to localStorage:", formData);
  localStorage.setItem("formData", JSON.stringify(formData));
}, 1000);

const formSlice = createSlice({
  name: "form",
  initialState,
  reducers: {
    loadFormData: (state) => {
      const saved = localStorage.getItem("formData");
      if (saved) {
        state.formData = JSON.parse(saved);
      }
    },
    updatePersonalInfo: (state, action: PayloadAction<Partial<PersonalInfo>>) => {
      console.log("Before updatePersonalInfo:", state.formData.personalInfo);
      state.formData.personalInfo = { ...state.formData.personalInfo, ...action.payload };
      console.log("After updatePersonalInfo:", state.formData.personalInfo);
      saveToLocalStorage(cloneDeep(state.formData));
    },
    addExperience: (state, action: PayloadAction<Experience>) => {
      state.formData.experiences.push(action.payload);
      saveToLocalStorage(cloneDeep(state.formData));
    },
    updateExperience: (state, action: PayloadAction<{ index: number; data: Partial<Experience> }>) => {
      state.formData.experiences[action.payload.index] = {
        ...state.formData.experiences[action.payload.index],
        ...action.payload.data,
      };
      saveToLocalStorage(cloneDeep(state.formData));
    },
    removeExperience: (state, action: PayloadAction<number>) => {
      state.formData.experiences = state.formData.experiences.filter((_, i) => i !== action.payload);
      saveToLocalStorage(cloneDeep(state.formData));
    },
    addEducation: (state, action: PayloadAction<Education>) => {
      state.formData.education.push(action.payload);
      saveToLocalStorage(cloneDeep(state.formData));
    },
    updateEducation: (state, action: PayloadAction<{ index: number; data: Partial<Education> }>) => {
      state.formData.education[action.payload.index] = {
        ...state.formData.education[action.payload.index],
        ...action.payload.data,
      };
      saveToLocalStorage(cloneDeep(state.formData));
    },
    removeEducation: (state, action: PayloadAction<number>) => {
      console.log("Removing education at index:", action.payload); // Debug log
      state.formData.education = state.formData.education.filter((_, i) => i !== action.payload);
      saveToLocalStorage(cloneDeep(state.formData));
    },
    addSkill: (state, action: PayloadAction<Skill>) => {
      state.formData.skills.push(action.payload);
      saveToLocalStorage(cloneDeep(state.formData));
    },
    updateSkill: (state, action: PayloadAction<{ index: number; data: Partial<Skill> }>) => {
      state.formData.skills[action.payload.index] = {
        ...state.formData.skills[action.payload.index],
        ...action.payload.data,
      };
      saveToLocalStorage(cloneDeep(state.formData));
    },
    removeSkill: (state, action: PayloadAction<number>) => {
      state.formData.skills = state.formData.skills.filter((_, i) => i !== action.payload);
      saveToLocalStorage(cloneDeep(state.formData));
    },
    addReference: (state, action: PayloadAction<Reference>) => {
      state.formData.references.push(action.payload);
      saveToLocalStorage(cloneDeep(state.formData));
    },
    updateReference: (state, action: PayloadAction<{ index: number; data: Partial<Reference> }>) => {
      state.formData.references[action.payload.index] = {
        ...state.formData.references[action.payload.index],
        ...action.payload.data,
      };
      saveToLocalStorage(cloneDeep(state.formData));
    },
    removeReference: (state, action: PayloadAction<number>) => {
      state.formData.references = state.formData.references.filter((_, i) => i !== action.payload);
      saveToLocalStorage(cloneDeep(state.formData));
    },
    setTermsAgreed: (state, action: PayloadAction<boolean>) => {
      state.formData.termsAgreed = action.payload;
      saveToLocalStorage(cloneDeep(state.formData));
    },
    setCurrentStep: (state, action: PayloadAction<number>) => {
      state.currentStep = action.payload;
    },
    setErrors: (state, action: PayloadAction<any>) => {
      state.errors = action.payload;
    },
    resetForm: (state) => {
      state.formData = initialState.formData;
      state.currentStep = 1;
      state.errors = {};
      localStorage.removeItem("formData");
    },
  },
});

export const {
  loadFormData,
  updatePersonalInfo,
  addExperience,
  updateExperience,
  removeExperience,
  addEducation,
  updateEducation,
  removeEducation, // Added
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
} = formSlice.actions;

export default formSlice.reducer;