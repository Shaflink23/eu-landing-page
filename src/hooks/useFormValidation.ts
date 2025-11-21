import { useState, useCallback } from 'react';
import { z } from 'zod';

export interface ValidationResult<T> {
  data: T | null;
  errors: Record<string, string>;
  isValid: boolean;
}

export function useFormValidation<T>(
  schema: z.ZodSchema<T>,
  initialData: Partial<T> = {}
) {
  const [data, setData] = useState<Partial<T>>(initialData);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const validate = useCallback((formData: Partial<T> = data): ValidationResult<T> => {
    try {
      const validData = schema.parse(formData);
      setErrors({});
      return { data: validData, errors: {}, isValid: true };
    } catch (error) {
      if (error instanceof z.ZodError) {
        const fieldErrors: Record<string, string> = {};
        error.issues.forEach((issue) => {
          const path = issue.path.join('.');
          fieldErrors[path] = issue.message;
        });
        setErrors(fieldErrors);
        return { data: null, errors: fieldErrors, isValid: false };
      }
      return { data: null, errors: { general: 'Validation failed' }, isValid: false };
    }
  }, [schema, data]);

  const validateField = useCallback((field: keyof T, value: any) => {
    try {
      // Create a partial schema for just this field
      const fieldSchema = (schema as any).shape?.[field];
      if (fieldSchema) {
        fieldSchema.parse(value);
        setErrors(prev => {
          const newErrors = { ...prev };
          delete newErrors[field as string];
          return newErrors;
        });
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        const fieldError = error.issues[0]?.message || 'Invalid value';
        setErrors(prev => ({ ...prev, [field as string]: fieldError }));
      }
    }
  }, [schema]);

  const setFieldValue = useCallback((field: keyof T, value: any) => {
    setData(prev => ({ ...prev, [field]: value }));
    setTouched(prev => ({ ...prev, [field as string]: true }));
    validateField(field, value);
  }, [validateField]);

  const setFieldTouched = useCallback((field: keyof T) => {
    setTouched(prev => ({ ...prev, [field as string]: true }));
  }, []);

  const reset = useCallback(() => {
    setData(initialData);
    setErrors({});
    setTouched({});
  }, [initialData]);

  const getFieldError = useCallback((field: keyof T): string | undefined => {
    const fieldName = field as string;
    return touched[fieldName] ? errors[fieldName] : undefined;
  }, [errors, touched]);

  const hasFieldError = useCallback((field: keyof T): boolean => {
    const fieldName = field as string;
    return touched[fieldName] && !!errors[fieldName];
  }, [errors, touched]);

  return {
    data,
    errors,
    touched,
    validate,
    validateField,
    setFieldValue,
    setFieldTouched,
    reset,
    getFieldError,
    hasFieldError,
    isValid: Object.keys(errors).length === 0
  };
}