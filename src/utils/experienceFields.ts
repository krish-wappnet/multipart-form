import { Experience } from "../types/form";

interface FieldConfig {
  key: keyof Experience;
  label: string;
  type?: "text" | "select" | "date" | "checkbox" | "textarea";
  required?: boolean;
  options?: string[];
  hidden?: (item: Experience) => boolean;
  className?: string;
  rows?: number;
}

export const experienceFields: FieldConfig[] = [
  {
    key: "jobTitle",
    label: "Job Title",
    type: "text",
    required: true,
  },
  {
    key: "companyName",
    label: "Company Name",
    type: "text",
    required: true,
  },
  {
    key: "employmentType",
    label: "Employment Type",
    type: "select",
    options: ["Full-time", "Part-time", "Internship", "Contract", "Freelance"],
    required: true,
  },
  {
    key: "startDate",
    label: "Start Date",
    type: "date",
    required: true,
  },
  {
    key: "endDate",
    label: "End Date",
    type: "date",
    hidden: (exp) => exp.currentlyWorking,
  },
  {
    key: "currentlyWorking",
    label: "Currently Working",
    type: "checkbox",
    className: "flex items-center",
  },
  {
    key: "responsibilities",
    label: "Responsibilities",
    type: "textarea",
    required: true,
    rows: 4,
    className: "md:col-span-2",
  },
  
];