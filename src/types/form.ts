
export type Errors = {
  personalInfo?: Partial<Record<keyof PersonalInfo, string>>;
  experiences?: Array<Partial<Record<keyof Experience, string>>>;
  education?: Array<Partial<Record<keyof Education, string>>>;
  skills?: Array<Partial<Record<keyof Skill, string>>>;
  references?: Array<Partial<Record<keyof Reference, string>>>;
  termsAgreed?: string;
};

export interface PersonalInfo {
    fullName: string;
    email: string;
    phoneNumber: string;
    dateOfBirth?: string;
    gender: "Male" | "Female" | "Other" | "Prefer not to say";
    currentLocation: { country: string; city: string };
    educationLevel?: "High School" | "Undergraduate" | "Graduate or higher";
  }
  
  export interface Experience {
    jobTitle: string;
    companyName: string;
    employmentType: "Full-time" | "Part-time" | "Internship" | "Contract" | "Freelance";
    startDate: string;
    endDate?: string;
    currentlyWorking: boolean;
    responsibilities: string;
    
  }
  
  export interface Education {
    schoolName: string;
    degree: string;
    fieldOfStudy: string;
    startYear: string;
    endYear: string;
    grade?: string;
    certificates?: { name: string; file?: File }[];
  }
  
  export interface Skill {
    name: string;
    yearsOfExperience?: number;
  }
  
  export interface Reference {
    name: string;
    relationship: string;
    company: string;
    contact: string;
  }
  
  export interface FormData {
    personalInfo: PersonalInfo;
    experiences: Experience[];
    education: Education[];
    skills: Skill[];
    references: Reference[];
    termsAgreed: boolean;
  }