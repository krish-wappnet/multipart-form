/* eslint-disable @typescript-eslint/no-explicit-any */
import { FormData } from "../types/form";

type Path<T> = T extends object
  ? {
      [K in keyof T]: K extends string
        ? T[K] extends Array<infer U>
          ? `${K}[${number}]${U extends object ? `.${Path<U>}` : ""}`
          : T[K] extends object
          ? `${K}.${Path<T[K]>}`
          : K
        : never;
    }[keyof T]
  : never;

export type FormDataPath = Path<FormData>;

export function getNestedValue<T>(obj: T, path: string): any {
  try {
    return path.split(".").reduce((current, key) => {
      if (key.includes("[")) {
        const [arrayKey, index] = key.split("[");
        const idx = Number(index.replace("]", ""));
        return (current as any)[arrayKey][idx];
      }
      return (current as any)[key];
    }, obj);
  } catch {
    return undefined;
  }
}