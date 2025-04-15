import React, { useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "../redux/Store";
import { setTermsAgreed, resetForm } from "../redux/FormSlice";

interface SubmitStepProps {
  validateStep: (step: number) => boolean;
}

const SubmitStep: React.FC<SubmitStepProps> = React.memo(({ validateStep }) => {
  const dispatch = useDispatch<AppDispatch>();
  const formData = useSelector((state: RootState) => state.form.formData);
  const errors = useSelector((state: RootState) => state.form.errors);


  const handleToggleTerms = useCallback(
    (checked: boolean) => {
      dispatch(setTermsAgreed(checked));
    },
    [dispatch]
  );

  const handleSubmit = useCallback(() => {
    if (validateStep(7)) {
      alert("Form submitted successfully!");
      dispatch(resetForm());
    } else {
      console.log("Validation failed:", errors); 
    }
  }, [dispatch, validateStep, errors]);

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Submit</h2>
      <label className="block text-sm font-medium">
        <input
          type="checkbox"
          checked={formData.termsAgreed}
          onChange={(e) => handleToggleTerms(e.target.checked)}
          className="mr-2"
        />
        I agree to the Terms & Conditions
      </label>
      {errors.termsAgreed && <p className="text-red-500 text-sm">{errors.termsAgreed}</p>}
      <button
        onClick={handleSubmit}
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        aria-label="Submit form"
      >
        Submit
      </button>
    </div>
  );
});

export default SubmitStep;