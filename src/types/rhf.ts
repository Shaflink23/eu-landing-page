// React Hook Form Types
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

// Update existing schemas for React Hook Form compatibility
export const travellerVibesSchema = z.object({
  name: z.string()
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name must be less than 100 characters')
    .regex(/^[a-zA-Z\s'-]+$/, 'Name can only contain letters, spaces, hyphens, and apostrophes'),

  email: z.string()
    .email('Please enter a valid email address')
    .max(255, 'Email must be less than 255 characters'),

  phone: z.string()
    .optional()
    .refine((val) => !val || /^[\+]?[1-9][\d]{0,15}$/.test(val), {
      message: 'Please enter a valid phone number'
    }),

  country: z.string()
    .min(1, 'Please select your country of residence')
    .refine((val) => val !== '', 'Please select a valid country'),

  beenToAfrica: z.enum(['yes', 'no'], {
    message: 'Please indicate if you have been to Africa before'
  }),

  travellerType: z.array(z.string())
    .min(1, 'Please select at least one traveller type')
    .max(3, 'Please select no more than 3 traveller types'),

  hearAbout: z.array(z.string())
    .min(1, 'Please select how you heard about us'),

  pioneeerTraveller: z.enum(['yes', 'maybe'], {
    message: 'Please indicate your preference for being featured'
  }),

  photo: z.string()
    .optional()
    .refine((val) => !val || val.startsWith('http'), {
      message: 'Photo URL must be valid'
    })
});

// Export types for use in components
export type TravellerVibesFormData = z.infer<typeof travellerVibesSchema>;