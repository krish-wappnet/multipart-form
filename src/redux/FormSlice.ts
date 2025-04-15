import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { FormData, PersonalInfo, Experience, Education, Skill, Reference } from "../types/form";
import { throttle } from "lodash";

const initialState: {
  formData: FormData;
  currentStep: number;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
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

// Throttled autosave to localStorage
const saveToLocalStorage = throttle((formData: FormData) => {
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
      state.formData.personalInfo = { ...state.formData.personalInfo, ...action.payload };
      saveToLocalStorage(state.formData);
    },
    addExperience: (state, action: PayloadAction<Experience>) => {
      state.formData.experiences.push(action.payload);
      saveToLocalStorage(state.formData);
    },
    updateExperience: (state, action: PayloadAction<{ index: number; data: Partial<Experience> }>) => {
      state.formData.experiences[action.payload.index] = {
        ...state.formData.experiences[action.payload.index],
        ...action.payload.data,
      };
      saveToLocalStorage(state.formData);
    },
    removeExperience: (state, action: PayloadAction<number>) => {
      state.formData.experiences = state.formData.experiences.filter((_, i) => i !== action.payload);
      saveToLocalStorage(state.formData);
    },
    addEducation: (state, action: PayloadAction<Education>) => {
      state.formData.education.push(action.payload);
      saveToLocalStorage(state.formData);
    },
    updateEducation: (state, action: PayloadAction<{ index: number; data: Partial<Education> }>) => {
      state.formData.education[action.payload.index] = {
        ...state.formData.education[action.payload.index],
        ...action.payload.data,
      };
      saveToLocalStorage(state.formData);
    },
    addSkill: (state, action: PayloadAction<Skill>) => {
      state.formData.skills.push(action.payload);
      saveToLocalStorage(state.formData);
    },
    updateSkill: (state, action: PayloadAction<{ index: number; data: Partial<Skill> }>) => {
      state.formData.skills[action.payload.index] = {
        ...state.formData.skills[action.payload.index],
        ...action.payload.data,
      };
      saveToLocalStorage(state.formData);
    },
    removeSkill: (state, action: PayloadAction<number>) => {
      state.formData.skills = state.formData.skills.filter((_, i) => i !== action.payload);
      saveToLocalStorage(state.formData);
    },
    addReference: (state, action: PayloadAction<Reference>) => {
      state.formData.references.push(action.payload);
      saveToLocalStorage(state.formData);
    },
    updateReference: (state, action: PayloadAction<{ index: number; data: Partial<Reference> }>) => {
      state.formData.references[action.payload.index] = {
        ...state.formData.references[action.payload.index],
        ...action.payload.data,
      };
      saveToLocalStorage(state.formData);
    },
    removeReference: (state, action: PayloadAction<number>) => {
      state.formData.references = state.formData.references.filter((_, i) => i !== action.payload);
      saveToLocalStorage(state.formData);
    },
    setTermsAgreed: (state, action: PayloadAction<boolean>) => {
      state.formData.termsAgreed = action.payload;
      saveToLocalStorage(state.formData);
    },
    setCurrentStep: (state, action: PayloadAction<number>) => {
      state.currentStep = action.payload;
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
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