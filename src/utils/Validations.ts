import { z } from "zod";
import * as Yup from 'yup';

const phoneRegex = /^\+\d{10,18}$/;
const nameRegex = /^[a-zA-Z\s]+$/;

export const personalInfoYupSchema = Yup.object({
  fullName: Yup.string().required('Name is required'),
  email: Yup.string().email('Invalid email address').required('Email is required'),
  phoneNumber: Yup.string()
    .matches(/^\+\d{10,15}$/, 'Invalid phone number')
    .required('Phone number is required'),
  dateOfBirth: Yup.string().optional(),
  gender: Yup.string()
    .oneOf(['Male', 'Female', 'Other', 'Prefer not to say'])
    .required('Gender is required'),
  educationLevel: Yup.string()
    .oneOf(['High School', 'Undergraduate', 'Graduate or higher', ''])
    .optional(),
  currentLocation: Yup.object({
    country: Yup.string().required('Country is required'),
    city: Yup.string().required('City is required'),
  }),
});

export const personalInfoSchema = z.object({
  fullName: z.string().regex(nameRegex, "Name must contain only letters and spaces").min(1, "Name is required"),
  email: z.string().email("Invalid email format"),
  phoneNumber: z
    .string()
    .min(1, "Phone number is required")
    .transform((val) => {
      return val.replace(/[\s-]/g, "");
    })
    .refine(
      (val) => {
        const isValid = phoneRegex.test(val);
        return isValid;
      },
      {
        message: "Invalid phone number format (e.g., +917383923807)",
      }
    ),
  dateOfBirth: z.string().optional(),
  gender: z.enum(["Male", "Female", "Other", "Prefer not to say"]),
  currentLocation: z.object({
    country: z.string().min(1, "Country is required"),
    city: z.string().min(1, "City is required"),
  }),
  educationLevel: z.enum(["High School", "Undergraduate", "Graduate or higher"]).optional(),
});

export const experienceYupSchema = Yup.array()
  .of(
    Yup.object({
      jobTitle: Yup.string().required('Job title is required'),
      companyName: Yup.string().required('Company name is required'),
      employmentType: Yup.string()
        .oneOf(['Full-time', 'Part-time', 'Contract', 'Internship'])
        .required('Employment type is required'),
      startDate: Yup.string().required('Start date is required'),
      endDate: Yup.string().optional(),
      currentlyWorking: Yup.boolean().required(),
      responsibilities: Yup.string().optional(),
    })
  )
  .min(1, 'At least one experience is required');

export const experienceSchema = z.object({
  jobTitle: z.string().min(1, "Job title is required"),
  companyName: z.string().min(1, "Company name is required"),
  employmentType: z.enum(["Full-time", "Part-time", "Internship", "Contract", "Freelance"]),
  startDate: z.string().min(1, "Start date is required"),
  endDate: z.string().optional(),
  currentlyWorking: z.boolean(),
  responsibilities: z.string().min(1, "Responsibilities are required"),
}).refine(
  (data) => data.currentlyWorking || !!data.endDate,
  { message: "End date is required unless currently working", path: ["endDate"] }
);


export const educationYupSchema = Yup.array()
  .of(
    Yup.object({
      schoolName: Yup.string().required('School name is required'),
      degree: Yup.string().required('Degree is required'),
      fieldOfStudy: Yup.string().required('Field of study is required'),
      startYear: Yup.string().required('Start year is required'),
      endYear: Yup.string().required('End year is required'),
      grade: Yup.string().optional(),
      certificates: Yup.array()
        .of(Yup.object({ name: Yup.string().required('Certificate name is required') }))
        .optional(),
    })
  )
  .min(1, 'At least one education entry is required');

export const educationSchema = z.object({
  schoolName: z.string().min(1, "School name is required"),
  degree: z.string().min(1, "Degree is required"),
  fieldOfStudy: z.string().min(1, "Field of study is required"),
  startYear: z
    .string()
    .min(1, "Start year is required")
    .regex(/^\d{4}$/, "Start year must be a 4-digit year"),
  endYear: z
    .string()
    .min(1, "End year is required")
    .regex(/^\d{4}$/, "End year must be a 4-digit year"),
  grade: z.string().optional(),
  certificates: z.array(z.object({ name: z.string(), file: z.any().optional() })).optional(),
}).refine(
  (data) => Number(data.endYear) >= Number(data.startYear),
  { message: "End year must be greater than or equal to start year", path: ["endYear"] }
);

export const skillYupSchema = Yup.array()
  .of(
    Yup.object({
      name: Yup.string().required('Skill name is required'),
      yearsOfExperience: Yup.number().optional(),
    })
  )
  .min(1, 'At least one skill is required');

export const skillSchema = z.object({
  name: z.string().min(1, "Skill name is required"),
  yearsOfExperience: z.number().optional(),
});

export const referenceSchema = z.object({
  name: z.string().min(1, "Name is required"),
  relationship: z.string().min(1, "Relationship is required"),
  company: z.string().min(1, "Company is required"),
  contact: z.string().min(1, "Contact is required"),
});

export const referenceYupSchema = Yup.array()
  .of(
    Yup.object({
      name: Yup.string().required('Name is required'),
      relationship: Yup.string().required('Relationship is required'),
      company: Yup.string().required('Company is required'),
      contact: Yup.string().required('Contact is required'),
    })
  )
  .optional();

export const formSchema = z.object({
  personalInfo: personalInfoSchema,
  experiences: z.array(experienceSchema).min(1, "At least one experience is required"),
  education: z.array(educationSchema).min(1, "At least one education entry is required"),
  skills: z.array(skillSchema).min(1, "At least one skill is required"),
  references: z.array(referenceSchema).optional(),
  termsAgreed: z.boolean().refine((val) => val, { message: "You must agree to the terms" }),
});

export type PersonalInfo = z.infer<typeof personalInfoSchema>;
export type Experience = z.infer<typeof experienceSchema>;
export type Education = z.infer<typeof educationSchema>;
export type Skill = z.infer<typeof skillSchema>;
export type Reference = z.infer<typeof referenceSchema>;
export type FormData = z.infer<typeof formSchema>;

export type PersonalInfoErrors = {
  fullName?: string[];
  email?: string[];
  phoneNumber?: string[];
  dateOfBirth?: string[];
  gender?: string[];
  educationLevel?: string[];
  currentLocation?: {
    country?: string[];
    city?: string[];
  };
};