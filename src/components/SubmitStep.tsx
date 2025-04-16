import React, { useCallback, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "../redux/Store";
import { setTermsAgreed, resetForm } from "../redux/FormSlice";
import { motion, AnimatePresence } from "framer-motion";

interface SubmitStepProps {
  validateStep: (step: number) => boolean;
}

const SubmitStep: React.FC<SubmitStepProps> = React.memo(({ validateStep }) => {
  const dispatch = useDispatch<AppDispatch>();
  const formData = useSelector((state: RootState) => state.form.formData);
  const errors = useSelector((state: RootState) => state.form.errors);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleToggleTerms = useCallback(
    (checked: boolean) => {
      dispatch(setTermsAgreed(checked));
    },
    [dispatch]
  );

  const handleSubmit = useCallback(() => {
    if (validateStep(7)) {
      setShowSuccess(true);
      dispatch(resetForm());
      setTimeout(() => setShowSuccess(false), 3000); // Hide success message after 3s
    } else {
      console.log("Validation failed:", errors);
    }
  }, [dispatch, validateStep, errors]);

  return (
    <motion.div
      className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-600"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Submit</h2>
      <div className="space-y-4">
        {/* Terms Checkbox */}
        <label
          htmlFor="termsAgreed"
          className="flex items-center text-sm font-semibold text-gray-700 dark:text-gray-200"
        >
          <input
            id="termsAgreed"
            type="checkbox"
            checked={formData.termsAgreed}
            onChange={(e) => handleToggleTerms(e.target.checked)}
            className="mr-2 h-4 w-4 text-blue-500 focus:ring-blue-500 border-gray-300 dark:border-gray-600 rounded"
            aria-invalid={!!errors.termsAgreed}
            aria-describedby={errors.termsAgreed ? "terms-error" : undefined}
          />
          I agree to the Terms & Conditions
        </label>

        {/* Error Message */}
        <AnimatePresence>
          {errors.termsAgreed && (
            <motion.p
              id="terms-error"
              className="text-sm text-red-500"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              {errors.termsAgreed}
            </motion.p>
          )}
        </AnimatePresence>

        {/* Success Message */}
        <AnimatePresence>
          {showSuccess && (
            <motion.div
              className="p-3 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 rounded-md text-sm"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              Form submitted successfully!
            </motion.div>
          )}
        </AnimatePresence>

        {/* Submit Button */}
        <button
          onClick={handleSubmit}
          disabled={!formData.termsAgreed}
          className={`px-4 py-2 rounded-md shadow-sm text-white transition-colors focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 ${
            formData.termsAgreed
              ? "bg-blue-500 hover:bg-blue-600"
              : "bg-blue-300 opacity-50 cursor-not-allowed"
          }`}
          aria-label="Submit form"
        >
          Submit
        </button>
      </div>
    </motion.div>
  );
});

export default SubmitStep;