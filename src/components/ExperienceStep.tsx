import React, { useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../redux/Store";
import { Experience } from "../types/form";
import { checkOverlappingDates } from "../utils/dateUtils";
import { addExperience, updateExperience, removeExperience } from "../redux/FormSlice";

const ExperienceStep: React.FC = React.memo(() => {
  const dispatch = useDispatch();
  const formData = useSelector((state: RootState) => state.form.formData);
  const errors = useSelector((state: RootState) => state.form.errors);

  const handleAddExperience = useCallback(() => {
    console.log("Add Experience clicked"); // Debug log
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
                  dispatch(
                    updateExperience({
                      index,
                      data: { jobTitle: e.target.value },
                    })
                  )
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
                  dispatch(
                    updateExperience({
                      index,
                      data: { companyName: e.target.value },
                    })
                  )
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
                  dispatch(
                    updateExperience({
                      index,
                      data: { startDate: e.target.value },
                    })
                  )
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
                    dispatch(
                      updateExperience({
                        index,
                        data: { endDate: e.target.value },
                      })
                    )
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
                  dispatch(
                    updateExperience({
                      index,
                      data: { responsibilities: e.target.value },
                    })
                  )
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

export default ExperienceStep;