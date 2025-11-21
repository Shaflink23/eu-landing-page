export interface Package {
  id: string;
  name: string;
  image: string;
  tier: string;
  shortDescription: string;
  duration: string;
  targetAudience: string;
  features: string[];
  price: number;
}

// ========== FORM SUBMISSION API TYPES ========== //

export interface FormSubmissionRequest {
  // ========== BASIC CONTACT INFO ========== //
  /** The person's full name (required for all submissions) */
  name: string;

  /** Email address for communication (required for all submissions) */
  email: string;

  /** Optional phone number (only used for some form types) */
  phone?: string;

  // ========== UGANDA TRAVEL FORM FIELDS ========== //
  // (Include these fields to trigger Uganda form processing)

  /**
   * Country where the traveler lives
   * Example: "Uganda", "United Kingdom", "Canada"
   */
  country_of_residence?: string;

  /**
   * Has this person visited Africa before?
   * true = yes, they've been to Africa
   * false = no, first time in Africa
   */
  been_to_africa_before?: boolean;

  /**
   * What kind of traveler are they? (can pick 1-3 styles)
   * Choose from: adventurer, cultural_immerser, luxe_relaxer, off_the_grid, mix_of_all
   */
  travel_style?: ("adventurer" | "cultural_immerser" | "luxe_relaxer" | "off_the_grid" | "mix_of_all")[];

  /**
   * Optional 3 words describing their dream trip
   * Example: "serene, indulgent, sun-kissed"
   */
  dream_escape_words?: string;

  /**
   * How did they find out about Everything Uganda?
   * Options: tiktok, instagram, word_of_mouth, uk_travel_group, event_expo, other
   */
  heard_about_us?: "tiktok" | "instagram" | "word_of_mouth" | "uk_travel_group" | "event_expo" | "other";

  /**
   * Do they want to be featured as a "Pioneer Traveller"?
   * yes = they want their story/photo featured in marketing
   * maybe_later = not interested right now
   */
  feature_as_pioneer?: "yes" | "maybe_later";

  /**
   * Optional URL to their best travel photo
   * Example: "https://example.com/my-travel-photo.jpg"
   */
  travel_photo_url?: string;

  /**
   * What month do they want to travel?
   * Number from 1-12 (1 = January, 12 = December)
   */
  travel_month?: number;

  /**
   * What year do they want to travel?
   * Must be current year or later
   */
  travel_year?: number;

  /**
   * Preferred start date in YYYY-MM-DD format
   */
  preferred_start_date?: string;

  /**
   * Preferred end date in YYYY-MM-DD format
   */
  preferred_end_date?: string;

  /**
   * Are they traveling alone, with partner, or in a group?
   * solo = 1 person
   * couple = 2 people
   * group = 3+ people
   */
  group_type?: "solo" | "couple" | "group";

  /**
   * How many people total are traveling?
   * - If solo: must be exactly 1
   * - If couple: must be 2 or more
   * - If group: must be 3 or more
   */
  group_size?: number;

  /**
   * What are their must-have experiences? (pick 1-3)
   * Choose from: gorilla_trekking, community_weaving, lakeside_luxe, food_nightlife,
   * spiritual_cultural, safari_conservation, nile_adventure, homestays_villages,
   * birdlife_explorations
   */
  must_have_experiences?: ("gorilla_trekking" | "community_weaving" | "lakeside_luxe" | "food_nightlife" | "spiritual_cultural" | "safari_conservation" | "nile_adventure" | "homestays_villages" | "birdlife_explorations")[];

  /**
   * Any special requirements or preferences?
   * Example: "Vegetarian food only", "Need wheelchair access", "Allergic to nuts"
   */
  accessibility_dietary_preferences?: string;

  /**
   * What kind of information do they want from us?
   * bespoke_packages = just customized trip packages
   * sneak_peek = just info about hidden gems
   * both = packages AND hidden gems info
   */
  send_options?: "bespoke_packages" | "sneak_peek" | "both";

  /**
   * Do they want to join our special traveler community?
   * true = yes, sign me up for exclusive offers
   * false = no thanks, not interested
   */
  join_early_explorer?: boolean;

  /**
   * Do they want to receive emails from us?
   * true = yes, send me travel stories and deals
   * false = no, don't send me marketing emails
   */
  email_opt_in?: boolean;
}

// ========== RESPONSE TYPES ========== //

export interface RegularFormSuccessResponse {
  message: string; // "Form submission created successfully"
  data: {
    id: number;
    name: string;
    email: string;
    created_at: string;
    updated_at: string;
    // ... other form submission fields
  };
}

export interface UgandaFormSuccessResponse {
  success: true;
  message: string; // "Your Uganda travel inquiry has been submitted successfully!"
  data: {
    submission_id: number;           // Database ID
    reference_number: string;        // Format: UG20251103XXXX
    estimated_response_time: string; // "24-48 hours"
    next_steps: string[];            // What happens next
  };
}

export interface FormValidationErrorResponse {
  message: string; // "Validation failed" or "Please correct the following errors:"
  errors: {
    [fieldName: string]: string[]; // Array of error messages per field
  };
}

export interface FormServerErrorResponse {
  message: string; // "Failed to create form submission" or error description
  error: string;   // Technical error details
}

// ========== DETECTION LOGIC ========== //
/**
 * HOW THE API DETECTS UGANDA FORMS:
 * The API checks if the request contains at least 5 of these Uganda-specific fields:
 * - country_of_residence
 * - travel_style
 * - heard_about_us
 * - travel_month
 * - travel_year
 * - group_type
 * - group_size
 * - must_have_experiences
 * - send_options
 *
 * If it finds enough Uganda fields, it processes it as a Uganda inquiry.
 * Otherwise, it treats it as a regular form submission.
 */

// ========== TYPE GUARDS ========== //

export function isUgandaResponse(response: any): response is UgandaFormSuccessResponse {
  return response && typeof response === 'object' && response.success === true;
}

export function isRegularFormResponse(response: any): response is RegularFormSuccessResponse {
  return response && typeof response === 'object' && response.message && response.data && !response.success;
}

export function isValidationError(response: any): response is FormValidationErrorResponse {
  return response && typeof response === 'object' && response.errors && typeof response.errors === 'object';
}

export function isServerError(response: any): response is FormServerErrorResponse {
  return response && typeof response === 'object' && response.error && !response.errors;
}

// ========== FILE UPLOAD TYPES ========== //

export interface FileUploadSuccessResponse {
  success: true;
  data: {
    url: string;
    path: string;
    filename: string;
    size: number;
    mime_type: string;
  };
}

export interface FileUploadErrorResponse {
  success: false;
  message: string;
  error?: string;
}

export type FileUploadResponse = FileUploadSuccessResponse | FileUploadErrorResponse;

// ========== ZOD VALIDATION SCHEMAS ========== //

import { z } from 'zod';

// Traveller Vibes Form Schema
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

  hearAbout: z.string()
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

// Dream Trip Form Schema
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

// Explorer Circle Form Schema
export const explorerCircleSchema = z.object({
  keepUpdated: z.boolean()
});

// Complete Form Schema (combination of all steps)
export const completeFormSchema = travellerVibesSchema
  .merge(dreamTripSchema)
  .merge(explorerCircleSchema);

// Type inference from schemas
export type TravellerVibesFormData = z.infer<typeof travellerVibesSchema>;
export type DreamTripFormData = z.infer<typeof dreamTripSchema>;
export type ExplorerCircleFormData = z.infer<typeof explorerCircleSchema>;
export type CompleteFormData = z.infer<typeof completeFormSchema>;

// ========== VALIDATION HOOKS ========== //

export interface ValidationResult<T> {
  data: T | null;
  errors: Record<string, string>;
  isValid: boolean;
}

// This hook is defined in a separate file to avoid module-level React hooks
// src/hooks/useFormValidation.ts
