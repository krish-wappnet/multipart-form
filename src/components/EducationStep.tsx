import React, { useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "../redux/Store";
import { Education } from "../types/form";
import { addEducation, updateEducation, removeEducation } from "../redux/FormSlice";

const EducationStep: React.FC = React.memo(() => {
  const dispatch = useDispatch<AppDispatch>();
  const formData = useSelector((state: RootState) => state.form.formData);
  const errors = useSelector((state: RootState) => state.form.errors);

  console.log("Current education entries:", formData.education); // Debug log

  const handleAddEducation = useCallback(() => {
    console.log("Add Education clicked");
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
    (index: number, field: keyof Education, value: string | { name: string; file?: File }[]) => {
      dispatch(
        updateEducation({
          index,
          data: { [field]: value },
        })
      );
    },
    [dispatch]
  );

  const handleAddCertificate = useCallback(
    (index: number, certName: string, file?: File) => {
      const currentCertificates = formData.education[index].certificates || [];
      dispatch(
        updateEducation({
          index,
          data: {
            certificates: [...currentCertificates, { name: certName, file }],
          },
        })
      );
    },
    [dispatch, formData.education]
  );

  const handleRemoveEducation = useCallback(
    (index: number) => {
      console.log("Remove Education clicked for index:", index); // Debug log
      dispatch(removeEducation(index));
    },
    [dispatch]
  );

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Education</h2>
      {formData.education.map((edu: Education, index: number) => (
        <div key={index} className="border p-4 rounded dark:border-gray-600">
          <div className="flex justify-between">
            <h3 className="text-lg font-medium">Education {index + 1}</h3>
            {formData.education.length > 1 && (
              <button
                onClick={() => handleRemoveEducation(index)}
                className="text-red-500 hover:text-red-700"
                aria-label={`Remove education ${index + 1}`}
              >
                Remove
              </button>
            )}
          </div>
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
                onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
                  if (e.key === "Enter" && e.currentTarget.value) {
                    handleAddCertificate(index, e.currentTarget.value);
                    e.currentTarget.value = "";
                  }
                }}
                className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600"
              />
              <div className="mt-2">
                {edu.certificates?.map((cert: { name: string; file?: File }, certIndex: number) => (
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

export default EducationStep;