/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useCallback, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Formik, Form } from 'formik';
import { RootState, AppDispatch } from '../redux/Store';
import { Skill, skillYupSchema } from '../utils/Validations';
import { addSkill, updateSkill, removeSkill } from '../redux/FormSlice';
import { motion, AnimatePresence } from 'framer-motion';

const predefinedSkills = ['Node.js', 'React', 'Angular', 'Vue', 'Python'];

const SkillsStep: React.FC = React.memo(() => {
  const dispatch = useDispatch<AppDispatch>();
  const formData = useSelector((state: RootState) => state.form.formData);
  const errors = useSelector((state: RootState) => state.form.errors);
  const [customSkill, setCustomSkill] = useState<string>('');

  const handleAddSkill = useCallback(
    (skillName: string, setFieldValue: (field: string, value: any) => void) => {
      if (
        formData.skills.some((s: Skill) => s.name.toLowerCase() === skillName.toLowerCase())
      ) {
        alert('Skill already added!');
        return;
      }
      const newSkill = { name: skillName, yearsOfExperience: undefined };
      dispatch(addSkill(newSkill));
      setFieldValue('skills', [...formData.skills, newSkill]);
      setCustomSkill('');
    },
    [dispatch, formData.skills]
  );

  const handleRemoveSkill = useCallback(
    (index: number, setFieldValue: (field: string, value: any) => void) => {
      dispatch(removeSkill(index));
      setFieldValue(
        'skills',
        formData.skills.filter((_, i) => i !== index)
      );
    },
    [dispatch, formData.skills]
  );

  return (
    <Formik
      initialValues={{ skills: formData.skills }}
      validationSchema={skillYupSchema}
      enableReinitialize
      onSubmit={() => {
        // Navigation handled by MultiStepForm
      }}
    >
      {({ setFieldValue }) => (
        <Form className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Skills</h2>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
              Predefined Skills
            </label>
            <div className="flex flex-wrap gap-2">
              {predefinedSkills.map((skill) => (
                <button
                  key={skill}
                  type="button"
                  onClick={() => handleAddSkill(skill, setFieldValue)}
                  className="px-3 py-1 bg-gray-200 rounded-full hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 disabled:opacity-50"
                  disabled={formData.skills.some((s: Skill) => s.name === skill)}
                >
                  {skill}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
              Custom Skill
            </label>
            <div className="flex">
              <input
                type="text"
                value={customSkill}
                onChange={(e) => setCustomSkill(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && customSkill.trim()) {
                    handleAddSkill(customSkill.trim(), setFieldValue);
                  }
                }}
                className="flex-1 p-2 border rounded-l dark:bg-gray-700 dark:border-gray-600 text-gray-900 dark:text-white"
                aria-label="Add custom skill"
              />
              <button
                type="button"
                onClick={() =>
                  customSkill.trim() && handleAddSkill(customSkill.trim(), setFieldValue)
                }
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
                <span className="text-gray-900 dark:text-white">{skill.name}</span>
                <input
                  type="number"
                  placeholder="Years"
                  min="0"
                  className="w-16 mx-2 p-1 border rounded dark:bg-gray-700 dark:border-gray-600 text-gray-900 dark:text-white"
                  value={skill.yearsOfExperience || ''}
                  onChange={(e) => {
                    const numValue = e.target.value ? Number(e.target.value) : undefined;
                    dispatch(
                      updateSkill({
                        index,
                        data: { yearsOfExperience: numValue },
                      })
                    );
                    setFieldValue(`skills[${index}].yearsOfExperience`, numValue);
                  }}
                />
                <button
                  type="button"
                  onClick={() => handleRemoveSkill(index, setFieldValue)}
                  className="text-red-500 hover:text-red-700"
                  aria-label={`Remove ${skill.name}`}
                >
                  ×
                </button>
              </div>
            ))}
          </div>
          <AnimatePresence>
            {errors?.skills && typeof errors.skills === 'string' && (
              <motion.p
                className="text-red-500 text-sm"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                {errors.skills}
              </motion.p>
            )}
          </AnimatePresence>
        </Form>
      )}
    </Formik>
  );
});

export default SkillsStep;
