import React, { useCallback, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "../redux/Store";
import { Skill } from "../types/form";
import { addSkill, updateSkill, removeSkill } from "../redux/FormSlice";

const predefinedSkills = ["Node.js", "React", "Angular", "Vue", "Python"];

const SkillsStep: React.FC = React.memo(() => {
  const dispatch = useDispatch<AppDispatch>();
  const formData = useSelector((state: RootState) => state.form.formData);
  const errors = useSelector((state: RootState) => state.form.errors);
  const [customSkill, setCustomSkill] = useState<string>("");



  const handleAddSkill = useCallback(
    (skillName: string) => {
      if (formData.skills.some((s: Skill) => s.name.toLowerCase() === skillName.toLowerCase())) {
        alert("Skill already added!");
        return;
      }
      dispatch(addSkill({ name: skillName }));
      setCustomSkill("");
    },
    [dispatch, formData.skills]
  );

  const handleRemoveSkill = useCallback(
    (index: number) => {
      dispatch(removeSkill(index));
    },
    [dispatch]
  );

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Skills</h2>
      <div>
        <label className="block text-sm font-medium">Predefined Skills</label>
        <div className="flex flex-wrap gap-2">
          {predefinedSkills.map((skill) => (
            <button
              key={skill}
              onClick={() => handleAddSkill(skill)}
              className="px-3 py-1 bg-gray-200 rounded-full hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600"
              disabled={formData.skills.some((s: Skill) => s.name === skill)}
            >
              {skill}
            </button>
          ))}
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium">Custom Skill</label>
        <div className="flex">
          <input
            type="text"
            value={customSkill}
            onChange={(e) => setCustomSkill(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && customSkill) {
                handleAddSkill(customSkill);
              }
            }}
            className="flex-1 p-2 border rounded-l dark:bg-gray-700 dark:border-gray-600"
            aria-label="Add custom skill"
          />
          <button
            onClick={() => customSkill && handleAddSkill(customSkill)}
            className="px-4 py-2 bg-blue-500 text-white rounded-r hover:bg-blue-600"
          >
            Add
          </button>
        </div>
      </div>
      <div className="flex flex-wrap gap-2">
        {formData.skills.map((skill: Skill, index: number) => (
          <div
            key={index}
            className="flex items-center px-3 py-1 bg-blue-100 rounded-full dark:bg-blue-900"
          >
            <span>{skill.name}</span>
            <input
              type="number"
              placeholder="Years"
              min="0"
              className="w-16 mx-2 p-1 border rounded dark:bg-gray-700 dark:border-gray-600"
              value={skill.yearsOfExperience || ""}
              onChange={(e) =>
                dispatch(
                  updateSkill({
                    index,
                    data: { yearsOfExperience: Number(e.target.value) || undefined },
                  })
                )
              }
            />
            <button
              onClick={() => handleRemoveSkill(index)}
              className="text-red-500 hover:text-red-700"
              aria-label={`Remove ${skill.name}`}
            >
              ×
            </button>
          </div>
        ))}
      </div>
      {errors?.skills && <p className="text-red-500 text-sm">{errors.skills}</p>}
    </div>
  );
});

export default SkillsStep;