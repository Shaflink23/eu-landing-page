// React Hook Form Types - Aligned with Backend API Format
import { z } from 'zod';

// Schema for TravellerVibesForm - aligns with API field names
export const travellerVibesSchema = z.object({
  name: z.string()
    .min(1, 'Name is required')
    .max(100, 'Name must be less than 100 characters'),

  email: z.string()
    .min(1, 'Email is required')
    .email('Please enter a valid email address')
    .max(255, 'Email must be less than 255 characters'),

  phone: z.string()
    .min(1, 'Phone number is required'),

  country_of_residence: z.string()
    .min(1, 'Please select your country of residence'),

  been_to_africa_before: z.boolean().optional(),

  travel_style: z.array(z.enum(['adventurer', 'cultural_immerser', 'luxe_relaxer', 'off_the_grid', 'mix_of_all']))
    .min(1, 'Please select at least one traveller type')
    .max(3, 'Please select no more than 3 traveller types'),

  heard_about_us: z.enum(['tiktok', 'instagram', 'word_of_mouth', 'uk_travel_group', 'event_expo', 'other']).optional(),

  feature_as_pioneer: z.enum(['yes', 'maybe_later']).optional(),

  travel_photo_url: z.union([z.string().url('Photo URL must be valid'), z.literal('')]).optional()
});

// Schema for DreamTripForm - aligns with API field names
export const dreamTripSchema = z.object({
  preferred_start_date: z.string()
    .min(1, 'Please select a start date')
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Please select a valid start date'),

  preferred_end_date: z.string()
    .min(1, 'Please select an end date')
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Please select a valid end date'),

  must_have_experiences: z.array(z.enum([
    'gorilla_trekking',
    'community_weaving',
    'lakeside_luxe',
    'food_nightlife',
    'spiritual_cultural',
    'safari_conservation',
    'nile_adventure',
    'homestays_villages',
    'birdlife_explorations'
  ]))
    .min(3, 'Please select exactly 3 dream experiences')
    .max(3, 'Please select exactly 3 experiences'),

  group_type: z.enum(['solo', 'couple', 'group']),

  group_size: z.number()
    .min(1, 'Please enter your group size')
    .max(50, 'Group size must be between 1 and 50 people'),

  dream_escape_words: z.string()
    .max(100, 'Description must be less than 100 characters')
    .optional()
}).refine((data) => {
  // Cross-field validation: end date must be after start date
  if (data.preferred_start_date && data.preferred_end_date) {
    const start = new Date(data.preferred_start_date);
    const end = new Date(data.preferred_end_date);
    return end > start;
  }
  return true;
}, {
  message: 'End date must be after start date',
  path: ['preferred_end_date']
}).refine((data) => {
  // Group type and size validation
  if (data.group_type === 'solo' && data.group_size !== 1) {
    return false;
  }
  if (data.group_type === 'couple' && data.group_size < 2) {
    return false;
  }
  if (data.group_type === 'group' && data.group_size < 3) {
    return false;
  }
  return true;
}, {
  message: 'Group size must match group type requirements',
  path: ['group_size']
});

// Schema for ExplorerCircleForm - aligns with API field names
export const explorerCircleSchema = z.object({
  send_options: z.enum(['bespoke_packages', 'sneak_peek', 'both']),
  accessibility_dietary_preferences: z.string().optional(),
  join_early_explorer: z.boolean().default(true),
  email_opt_in: z.boolean().default(true),
  keepUpdated: z.boolean().optional() // For backwards compatibility
});

// Export types for use in components
export type TravellerVibesFormData = z.infer<typeof travellerVibesSchema>;
export type DreamTripFormData = z.infer<typeof dreamTripSchema>;
export type ExplorerCircleFormData = z.infer<typeof explorerCircleSchema>;
