/* eslint-disable @typescript-eslint/no-explicit-any */
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "../../redux/Store";
import { FormData, Errors } from "../../types/form";
import { getNestedValue, FormDataPath } from "../../utils/path";

interface UseFormFieldProps<T> {
  path: FormDataPath;
  updateAction: (value: T) => { type: string; payload: any };
}

export function useFormField<T>({ path, updateAction }: UseFormFieldProps<T>) {
  const dispatch = useDispatch<AppDispatch>();
  const formData = useSelector((state: RootState) => state.form.formData);
  const errors = useSelector((state: RootState) => state.form.errors);

  const getValue = (): T => {
    return getNestedValue<FormData>(formData, path);
  };

  const getError = (): string | undefined => {
    return getNestedValue<Errors>(errors, path);
  };

  const handleChange = (value: T) => {
    dispatch(updateAction(value));
  };

  return {
    value: getValue(),
    error: getError(),
    handleChange,
  };
}