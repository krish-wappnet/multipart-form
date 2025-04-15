/* eslint-disable @typescript-eslint/no-explicit-any */
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { FormData, PersonalInfo, Experience, Education, Skill, Reference } from "../types/form";
import { throttle, cloneDeep } from "lodash";

const saveToLocalStorage = throttle((data: { formData: FormData; currentStep: number }) => {
  console.log("Saving to localStorage:", data); // Debug log
  try {
    localStorage.setItem("formState", JSON.stringify(data));
  } catch (error) {
    console.error("Error saving to localStorage:", error);
  }
}, 1000);

const loadFromLocalStorage = (): { formData: FormData; currentStep: number } | null => {
  console.log("Checking localStorage for formState"); // Debug log
  try {
    const saved = localStorage.getItem("formState");
    if (saved) {
      const parsed = JSON.parse(saved);
      console.log("Loaded from localStorage:", parsed);
      return parsed;
    }
    return null;
  } catch (error) {
    console.error("Error loading from localStorage:", error);
    return null;
  }
};

// Load persisted state once during initialization
const persistedState = loadFromLocalStorage();

const initialState: {
  formData: FormData;
  currentStep: number;
  errors: any;
} = {
  formData: persistedState?.formData || {
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
  currentStep: persistedState?.currentStep || 1,
  errors: {},
};

const formSlice = createSlice({
  name: "form",
  initialState,
  reducers: {
    updatePersonalInfo: (state, action: PayloadAction<Partial<PersonalInfo>>) => {
      console.log("Before updatePersonalInfo:", state.formData.personalInfo);
      state.formData.personalInfo = { ...state.formData.personalInfo, ...action.payload };
      console.log("After updatePersonalInfo:", state.formData.personalInfo);
      saveToLocalStorage({ formData: cloneDeep(state.formData), currentStep: state.currentStep });
    },
    addExperience: (state, action: PayloadAction<Experience>) => {
      console.log("Adding experience:", action.payload);
      state.formData.experiences.push(action.payload);
      saveToLocalStorage({ formData: cloneDeep(state.formData), currentStep: state.currentStep });
    },
    updateExperience: (state, action: PayloadAction<{ index: number; data: Partial<Experience> }>) => {
      console.log("Updating experience at index:", action.payload.index);
      state.formData.experiences[action.payload.index] = {
        ...state.formData.experiences[action.payload.index],
        ...action.payload.data,
      };
      saveToLocalStorage({ formData: cloneDeep(state.formData), currentStep: state.currentStep });
    },
    removeExperience: (state, action: PayloadAction<number>) => {
      console.log("Removing experience at index:", action.payload);
      state.formData.experiences = state.formData.experiences.filter((_, i) => i !== action.payload);
      saveToLocalStorage({ formData: cloneDeep(state.formData), currentStep: state.currentStep });
    },
    addEducation: (state, action: PayloadAction<Education>) => {
      console.log("Adding education:", action.payload);
      state.formData.education.push(action.payload);
      saveToLocalStorage({ formData: cloneDeep(state.formData), currentStep: state.currentStep });
    },
    updateEducation: (state, action: PayloadAction<{ index: number; data: Partial<Education> }>) => {
      console.log("Updating education at index:", action.payload.index);
      state.formData.education[action.payload.index] = {
        ...state.formData.education[action.payload.index],
        ...action.payload.data,
      };
      saveToLocalStorage({ formData: cloneDeep(state.formData), currentStep: state.currentStep });
    },
    removeEducation: (state, action: PayloadAction<number>) => {
      console.log("Removing education at index:", action.payload);
      state.formData.education = state.formData.education.filter((_, i) => i !== action.payload);
      saveToLocalStorage({ formData: cloneDeep(state.formData), currentStep: state.currentStep });
    },
    addSkill: (state, action: PayloadAction<Skill>) => {
      console.log("Adding skill:", action.payload);
      state.formData.skills.push(action.payload);
      saveToLocalStorage({ formData: cloneDeep(state.formData), currentStep: state.currentStep });
    },
    updateSkill: (state, action: PayloadAction<{ index: number; data: Partial<Skill> }>) => {
      console.log("Updating skill at index:", action.payload.index);
      state.formData.skills[action.payload.index] = {
        ...state.formData.skills[action.payload.index],
        ...action.payload.data,
      };
      saveToLocalStorage({ formData: cloneDeep(state.formData), currentStep: state.currentStep });
    },
    removeSkill: (state, action: PayloadAction<number>) => {
      console.log("Removing skill at index:", action.payload);
      state.formData.skills = state.formData.skills.filter((_, i) => i !== action.payload);
      saveToLocalStorage({ formData: cloneDeep(state.formData), currentStep: state.currentStep });
    },
    addReference: (state, action: PayloadAction<Reference>) => {
      console.log("Adding reference:", action.payload);
      state.formData.references.push(action.payload);
      saveToLocalStorage({ formData: cloneDeep(state.formData), currentStep: state.currentStep });
    },
    updateReference: (state, action: PayloadAction<{ index: number; data: Partial<Reference> }>) => {
      console.log("Updating reference at index:", action.payload.index);
      state.formData.references[action.payload.index] = {
        ...state.formData.references[action.payload.index],
        ...action.payload.data,
      };
      saveToLocalStorage({ formData: cloneDeep(state.formData), currentStep: state.currentStep });
    },
    removeReference: (state, action: PayloadAction<number>) => {
      console.log("Removing reference at index:", action.payload);
      state.formData.references = state.formData.references.filter((_, i) => i !== action.payload);
      saveToLocalStorage({ formData: cloneDeep(state.formData), currentStep: state.currentStep });
    },
    setTermsAgreed: (state, action: PayloadAction<boolean>) => {
      console.log("Setting terms agreed to:", action.payload);
      state.formData.termsAgreed = action.payload;
      saveToLocalStorage({ formData: cloneDeep(state.formData), currentStep: state.currentStep });
    },
    setCurrentStep: (state, action: PayloadAction<number>) => {
      console.log("Setting current step to:", action.payload);
      state.currentStep = action.payload;
      saveToLocalStorage({ formData: cloneDeep(state.formData), currentStep: state.currentStep });
    },
    setErrors: (state, action: PayloadAction<any>) => {
      console.log("Setting errors:", action.payload);
      state.errors = action.payload;
    },
    resetForm: (state) => {
      console.log("Resetting form, setting step to 1");
      state.formData = initialState.formData;
      state.currentStep = 1;
      state.errors = {};
      localStorage.removeItem("formState");
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