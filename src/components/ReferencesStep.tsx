import React, { useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "../redux/Store";
import { Reference } from "../types/form";
import { addReference, updateReference, removeReference } from "../redux/FormSlice";

interface ReferencesStepProps {
  skipReferences: boolean;
  setSkipReferences: (value: boolean) => void;
}

const ReferencesStep: React.FC<ReferencesStepProps> = React.memo(
  ({ skipReferences, setSkipReferences }) => {
    const dispatch = useDispatch<AppDispatch>();
    const formData = useSelector((state: RootState) => state.form.formData);
    const errors = useSelector((state: RootState) => state.form.errors);

    console.log("Current references:", formData.references); // Debug log

    const handleAddReference = useCallback(() => {
      console.log("Add Reference clicked"); // Debug log
      dispatch(
        addReference({
          name: "",
          relationship: "",
          company: "",
          contact: "",
        })
      );
    }, [dispatch]);

    const handleRemoveReference = useCallback(
      (index: number) => {
        console.log("Remove Reference clicked for index:", index); // Debug log
        dispatch(removeReference(index));
      },
      [dispatch]
    );

    const handleClearReferences = useCallback(() => {
      console.log("Clearing all references"); // Debug log
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      formData.references.forEach((_, index) => {
        dispatch(removeReference(0)); // Always remove index 0 as array shrinks
      });
    }, [dispatch, formData.references]);

    return (
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">References</h2>
        <label className="block text-sm font-medium">
          <input
            type="checkbox"
            checked={skipReferences}
            onChange={() => {
              setSkipReferences(!skipReferences);
              if (!skipReferences) {
                handleClearReferences();
              }
            }}
            className="mr-2"
          />
          Skip adding references
        </label>
        {!skipReferences && (
          <>
            {formData.references.map((ref: Reference, index: number) => (
              <div key={index} className="border p-4 rounded dark:border-gray-600">
                <div className="flex justify-between">
                  <h3 className="text-lg font-medium">Reference {index + 1}</h3>
                  <button
                    onClick={() => handleRemoveReference(index)}
                    className="text-red-500 hover:text-red-700"
                    aria-label={`Remove reference ${index + 1}`}
                  >
                    Remove
                  </button>
                </div>
                <div className="space-y-2">
                  <div>
                    <label className="block text-sm font-medium">Name</label>
                    <input
                      type="text"
                      value={ref.name}
                      onChange={(e) =>
                        dispatch(
                          updateReference({
                            index,
                            data: { name: e.target.value },
                          })
                        )
                      }
                      className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600"
                      aria-required="true"
                    />
                    {errors?.references?.[index]?.name && (
                      <p className="text-red-500 text-sm">{errors.references[index].name}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium">Relationship</label>
                    <input
                      type="text"
                      value={ref.relationship}
                      onChange={(e) =>
                        dispatch(
                          updateReference({
                            index,
                            data: { relationship: e.target.value },
                          })
                        )
                      }
                      className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600"
                      aria-required="true"
                    />
                    {errors?.references?.[index]?.relationship && (
                      <p className="text-red-500 text-sm">{errors.references[index].relationship}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium">Company</label>
                    <input
                      type="text"
                      value={ref.company}
                      onChange={(e) =>
                        dispatch(
                          updateReference({
                            index,
                            data: { company: e.target.value },
                          })
                        )
                      }
                      className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600"
                      aria-required="true"
                    />
                    {errors?.references?.[index]?.company && (
                      <p className="text-red-500 text-sm">{errors.references[index].company}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium">Contact (Phone/Email)</label>
                    <input
                      type="text"
                      value={ref.contact}
                      onChange={(e) =>
                        dispatch(
                          updateReference({
                            index,
                            data: { contact: e.target.value },
                          })
                        )
                      }
                      className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600"
                      aria-required="true"
                    />
                    {errors?.references?.[index]?.contact && (
                      <p className="text-red-500 text-sm">{errors.references[index].contact}</p>
                    )}
                  </div>
                </div>
              </div>
            ))}
            <button
              onClick={handleAddReference}
              className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
              aria-label="Add new reference"
            >
              Add Reference
            </button>
            {errors?.references && typeof errors.references === "string" && (
              <p className="text-red-500 text-sm">{errors.references}</p>
            )}
          </>
        )}
      </div>
    );
  }
);

export default ReferencesStep;