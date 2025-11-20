// Dream Trip Form Types
import { z } from 'zod';

export const dreamTripSchema = z.object({
  startDate: z.string()
    .min(1, 'Please select a start date')
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Please select a valid start date'),

  endDate: z.string()
    .min(1, 'Please select an end date')
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Please select a valid end date'),

  experiences: z.array(z.string())
    .min(3, 'Please select exactly 3 experiences')
    .max(3, 'Please select exactly 3 experiences'),

  companion: z.string()
    .min(1, 'Please select who is traveling with you'),

  companionCount: z.string()
    .optional(),

  dreamWords: z.string()
    .max(100, 'Dream description must be less than 100 characters')
    .optional()
}).refine((data) => {
  // Validate that end date is after start date
  const start = new Date(data.startDate);
  const end = new Date(data.endDate);
  return end > start;
}, {
  message: 'End date must be after start date',
  path: ['endDate']
});

export type DreamTripFormData = z.infer<typeof dreamTripSchema>;