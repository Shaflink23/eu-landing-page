// React Hook Form Types
import { z } from 'zod';

// Schema for TravellerVibesForm - matches the actual form fields
export const travellerVibesSchema = z.object({
  name: z.string()
    .min(1, 'Name is required')
    .max(100, 'Name must be less than 100 characters'),

  email: z.string()
    .min(1, 'Email is required')
    .email('Please enter a valid email address')
    .max(255, 'Email must be less than 255 characters'),

  phone: z.string().optional(),

  country: z.string().optional(),

  beenToAfrica: z.enum(['yes', 'no']).optional(),

  travellerType: z.array(z.string())
    .min(1, 'Please select at least one traveller type')
    .max(5, 'Please select no more than 5 traveller types'),

  hearAbout: z.string().optional(),

  pioneeerTraveller: z.enum(['yes', 'maybe']).optional(),

  photo: z.string().optional()
}).refine((data) => {
  // Ensure at least name, email, and one traveller type are provided
  return data.name.trim() !== '' &&
         data.email.trim() !== '' &&
         data.travellerType &&
         data.travellerType.length > 0;
}, {
  message: 'Please fill in all required fields',
  path: ['name'] // Focus error on first required field
});

// Schema for DreamTripForm
export const dreamTripSchema = z.object({
  startDate: z.string()
    .min(1, 'Please select a start date')
    .refine((date) => {
      const selectedDate = new Date(date);
      const today = new Date();
      const minDate = new Date(today);
      minDate.setDate(today.getDate() + 20); // 20 days from today
      return selectedDate >= minDate;
    }, 'Start date must be at least 20 days from today'),

  endDate: z.string()
    .min(1, 'Please select an end date')
    .refine((endDate) => {
      // This will be validated against startDate in the context
      return new Date(endDate) instanceof Date && !isNaN(new Date(endDate).getTime());
    }, 'Please select a valid end date'),

  experiences: z.array(z.string())
    .min(3, 'Please select exactly 3 experiences')
    .max(3, 'Please select exactly 3 experiences'),

  companion: z.string()
    .min(1, 'Please select your travel companion'),

  companionCount: z.string()
    .optional()
    .refine((val) => {
      if (!val) return true;
      const num = parseInt(val);
      return !isNaN(num) && num >= 2;
    }, 'Please enter a valid number'),

  dreamWords: z.string()
    .max(100, 'Description must be less than 100 characters')
    .optional()
});

// Export types for use in components
export type TravellerVibesFormData = z.infer<typeof travellerVibesSchema>;
export type DreamTripFormData = z.infer<typeof dreamTripSchema>;