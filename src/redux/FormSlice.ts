/* eslint-disable @typescript-eslint/no-explicit-any */
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { FormData, PersonalInfo, Experience, Education, Skill, Reference } from "../types/form";

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

const formSlice = createSlice({
  name: "form",
  initialState,
  reducers: {
    updatePersonalInfo: (state, action: PayloadAction<Partial<PersonalInfo>>) => {
      state.formData.personalInfo = { ...state.formData.personalInfo, ...action.payload };
    },
    addExperience: (state, action: PayloadAction<Experience>) => {
      state.formData.experiences.push(action.payload);
    },
    updateExperience: (state, action: PayloadAction<{ index: number; data: Partial<Experience> }>) => {
      state.formData.experiences[action.payload.index] = {
        ...state.formData.experiences[action.payload.index],
        ...action.payload.data,
      };
    },
    removeExperience: (state, action: PayloadAction<number>) => {
      state.formData.experiences = state.formData.experiences.filter((_, i) => i !== action.payload);
    },
    addEducation: (state, action: PayloadAction<Education>) => {
      state.formData.education.push(action.payload);
    },
    updateEducation: (state, action: PayloadAction<{ index: number; data: Partial<Education> }>) => {
      state.formData.education[action.payload.index] = {
        ...state.formData.education[action.payload.index],
        ...action.payload.data,
      };
    },
    removeEducation: (state, action: PayloadAction<number>) => {
      state.formData.education = state.formData.education.filter((_, i) => i !== action.payload);
    },
    addSkill: (state, action: PayloadAction<Skill>) => {
      state.formData.skills.push(action.payload);
    },
    updateSkill: (state, action: PayloadAction<{ index: number; data: Partial<Skill> }>) => {
      state.formData.skills[action.payload.index] = {
        ...state.formData.skills[action.payload.index],
        ...action.payload.data,
      };
    },
    removeSkill: (state, action: PayloadAction<number>) => {
      state.formData.skills = state.formData.skills.filter((_, i) => i !== action.payload);
    },
    addReference: (state, action: PayloadAction<Reference>) => {
      state.formData.references.push(action.payload);
    },
    updateReference: (state, action: PayloadAction<{ index: number; data: Partial<Reference> }>) => {
      state.formData.references[action.payload.index] = {
        ...state.formData.references[action.payload.index],
        ...action.payload.data,
      };
    },
    removeReference: (state, action: PayloadAction<number>) => {
      state.formData.references = state.formData.references.filter((_, i) => i !== action.payload);
    },
    setTermsAgreed: (state, action: PayloadAction<boolean>) => {
      state.formData.termsAgreed = action.payload;
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
    },
  },
});

export const {
  updatePersonalInfo,
  addExperience,
  updateExperience,
  removeExperience,
  addEducation,
  updateEducation,
  removeEducation,
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