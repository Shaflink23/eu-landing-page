import axios, { AxiosResponse } from 'axios';
import { FormSubmissionRequest, UgandaFormSuccessResponse, RegularFormSuccessResponse } from '../types';

const API_BASE_URL = 'http://api.everythinguganda.co.uk/api';
// Note: Backend URL endpoint might be 'form-submissons' (with typo) or 'form-submissions'
const FORM_ENDPOINT = '/form-submissions'; // Try this first, fallback to /form-submissons if needed

export const uploadFile = async (file: File, type: string = 'travel_photo'): Promise<
  | { success: true; data: { url: string; filename: string; path: string } }
  | { success: false; error: string }
> => {
  try {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', type);

    console.log('📤 Uploading file:', file.name, 'Type:', type);

    const response = await axios.post(`${API_BASE_URL}/upload-file`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    console.log('✅ File upload successful:', response.data);
    console.log('Full API response body:', JSON.stringify(response.data, null, 2));

    // Handle API response structure - extract data from wrapper if present
    const uploadData = response.data.data || response.data;

    return { success: true, data: uploadData };
  } catch (error: any) {
    console.error('❌ File upload error:', error);
    const errorMessage = error.response?.data?.message ||
                        error.response?.data?.error ||
                        error.message ||
                        'Failed to upload file';
    return {
      success: false,
      error: errorMessage
    };
  }
};

export const submitFormData = async (formData: any): Promise<
  | { success: true; data: UgandaFormSuccessResponse | RegularFormSuccessResponse }
  | { success: false; error: string }
> => {
  try {
    // Validate the payload against our expected schema before sending
    const payload: FormSubmissionRequest = formData;

    // Validate payload matches backend schema requirements
    if (!payload.name || typeof payload.name !== 'string') {
      throw new Error('Missing or invalid name field');
    }
    if (!payload.email || typeof payload.email !== 'string') {
      throw new Error('Missing or invalid email field');
    }
    if (!payload.country_of_residence || typeof payload.country_of_residence !== 'string') {
      throw new Error('Missing or invalid country_of_residence field');
    }
    if (typeof payload.been_to_africa_before !== 'boolean') {
      throw new Error('been_to_africa_before must be boolean');
    }
    if (!Array.isArray(payload.travel_style) || payload.travel_style.length === 0 || payload.travel_style.length > 3) {
      throw new Error('travel_style must be array of 1-3 valid travel style values');
    }
    if (!Array.isArray(payload.must_have_experiences) || payload.must_have_experiences.length !== 3) {
      throw new Error('must_have_experiences must be array of exactly 3 valid experience codes');
    }
    if (payload.travel_year && (typeof payload.travel_year !== 'number' || payload.travel_year < new Date().getFullYear())) {
      throw new Error('travel_year must be current year or later');
    }
    if (payload.group_type && !['solo', 'couple', 'group'].includes(payload.group_type)) {
      throw new Error('group_type must be one of: solo, couple, group');
    }
    if (payload.group_size && typeof payload.group_size !== 'number') {
      throw new Error('group_size must be number');
    }
    if (typeof payload.join_early_explorer !== 'boolean') {
      throw new Error('join_early_explorer must be boolean');
    }
    if (typeof payload.email_opt_in !== 'boolean') {
      throw new Error('email_opt_in must be boolean');
    }
    if (payload.send_options && !['bespoke_packages', 'sneak_peek', 'both'].includes(payload.send_options)) {
      throw new Error('send_options must be one of: bespoke_packages, sneak_peek, both');
    }

    console.log('📤 Submitting form data to API:');
    console.log('  ✓ Name:', payload.name);
    console.log('  ✓ Email:', payload.email);
    console.log('  ✓ Country:', payload.country_of_residence);
    console.log('  ✓ Been to Africa:', payload.been_to_africa_before);
    console.log('  ✓ Travel Styles:', payload.travel_style);
    console.log('  ✓ Heard About Us:', payload.heard_about_us);
    console.log('  ✓ Experiences:', payload.must_have_experiences);
    console.log('  ✓ Travel Date:', `${payload.travel_month}/${payload.travel_year}`);
    console.log('  ✓ Group:', `${payload.group_type} (${payload.group_size} people)`);
    console.log('🔗 API Endpoint:', `${API_BASE_URL}${FORM_ENDPOINT}`);

    // Make the API call - Try both possible endpoints (with and without typo)
    let response: AxiosResponse;
    try {
      response = await axios.post(`${API_BASE_URL}${FORM_ENDPOINT}`, payload, {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
      });
    } catch (firstError: any) {
      // If first attempt fails with 404, try the alternate spelling
      if (firstError.response?.status === 404) {
        console.log('⚠️ Trying alternate endpoint spelling...');
        try {
          response = await axios.post(`${API_BASE_URL}/form-submissons`, payload, {
            headers: {
              'Content-Type': 'application/json',
              'Accept': 'application/json',
            },
          });
        } catch (secondError: any) {
          console.error('❌ Network error on second attempt:', secondError);
          throw new Error('Network error. Please check your connection and try again.');
        }
      } else {
        console.error('❌ Network error on first attempt:', firstError);
        throw new Error('Network error. Please check your connection and try again.');
      }
    }

    // Handle response - Axios throws for non-2xx status codes
    console.log('✅ Form submission successful:', response.data);

    return { success: true, data: response.data };
    
  } catch (error: any) {
    console.error('❌ Form submission error:', error);

    // Handle Axios errors
    if (error.response) {
      // Server responded with error status
      const errorData = error.response.data;
      console.error('❌ API Error Response:', errorData);
      console.error('❌ Response Status:', error.response.status);

      // Extract error message from various possible formats (Laravel validation)
      let errorMessage = 'Failed to submit form';

      if (errorData.message) {
        errorMessage = errorData.message;

        // If there are validation errors, format them nicely
        if (errorData.errors && typeof errorData.errors === 'object') {
          const errorsList = Object.entries(errorData.errors)
            .map(([field, messages]) => {
              const msgArray = Array.isArray(messages) ? messages : [messages];
              return `• ${field}: ${msgArray.join(', ')}`;
            })
            .join('\n');
          errorMessage = `${errorData.message}\n\n${errorsList}`;
        }
      } else if (errorData.errors) {
        // Sometimes errors come without message
        const errorsList = Object.entries(errorData.errors)
          .map(([field, messages]) => {
            const msgArray = Array.isArray(messages) ? messages : [messages];
            return `• ${field}: ${msgArray.join(', ')}`;
          })
          .join('\n');
        errorMessage = `Validation Errors:\n${errorsList}`;
      } else if (errorData.error) {
        errorMessage = errorData.error;
      }

      console.error('❌ Formatted error message:', errorMessage);
      return {
        success: false,
        error: errorMessage
      };
    } else if (error.request) {
      // Network error
      return {
        success: false,
        error: 'Network error. Please check your connection and try again.'
      };
    } else {
      // Other error
      return {
        success: false,
        error: error.message || 'Failed to submit form. Please try again.'
      };
    }
  }
};

// Travel styles must match backend enum exactly - no transformation needed
// Values are already correct: adventurer, cultural_immerser, luxe_relaxer, off_the_grid, mix_of_all

// Helper function to format referral source
function formatReferralSource(sources: string[]): "tiktok" | "instagram" | "word_of_mouth" | "uk_travel_group" | "event_expo" | "other" {
  if (!sources || sources.length === 0) return 'other';

  const mapping: { [key: string]: "tiktok" | "instagram" | "word_of_mouth" | "uk_travel_group" | "event_expo" | "other" } = {
    'tiktok': 'tiktok',
    'instagram': 'instagram',
    'word-of-mouth': 'word_of_mouth',
    'events': 'event_expo',
    'other': 'other',
  };

  return mapping[sources[0]] || 'other';
}

// Helper function to calculate group size based on companion type
function calculateGroupSize(companion: string): number {
  if (!companion) return 1;
  
  const sizeMapping: { [key: string]: number } = {
    'solo': 1,
    'couple': 2,
    'friends': 4,
    'family': 4,
  };
  return sizeMapping[companion?.toLowerCase()] || 1;
}

// Helper function to format experiences - MUST match backend's accepted enum values exactly
function formatExperiences(experiences: string[]): string[] {
  if (!experiences || experiences.length === 0) {
    // Return default experiences that backend accepts
      return ['gorilla_trekking', 'safari_conservation', 'spiritual_cultural'];
  }
  
  // Direct mapping - form values are already the exact backend enum values
  const mapping: { [key: string]: string } = {
    'gorilla_trekking': 'gorilla_trekking',
    'homestays_villages': 'homestays_villages',
    'nile_adventure': 'nile_adventure',
    'food_nightlife': 'food_nightlife',
    'safari_conservation': 'safari_conservation',
    'spiritual_cultural': 'spiritual_cultural',
    'community_weaving': 'community_weaving',
    'birdlife_explorations': 'birdlife_explorations',
    'lakeside_luxe': 'lakeside_luxe',
  };
  
  const formatted = experiences.map(exp => {
    // Direct match from form value
    if (mapping[exp]) {
      return mapping[exp];
    }
    
    // Fallback to gorilla_trekking if not found
    return 'gorilla_trekking';
  });
  
  // Remove duplicates
  const unique = Array.from(new Set(formatted));
  
  // Ensure we have exactly 3 experiences - use ONLY backend accepted values
  const validDefaults = ['gorilla_trekking', 'safari_conservation', 'spiritual_cultural', 'homestays_villages', 'nile_adventure', 'food_nightlife', 'lakeside_luxe', 'birdlife_explorations', 'community_weaving'];
  
  while (unique.length < 3) {
    for (const def of validDefaults) {
      if (!unique.includes(def)) {
        unique.push(def);
        break;
      }
    }
    // Prevent infinite loop
    if (unique.length >= 3) break;
  }
  
  // Return only first 3
  return unique.slice(0, 3);
}

// Helper function to extract month number from date string (YYYY-MM-DD)
function extractMonthFromDateRange(dateStr: string): number {
  if (!dateStr) {
    const today = new Date();
    return today.getMonth() + 2; // Default to next month
  }
  
  try {
    const date = new Date(dateStr);
    return date.getMonth() + 1;
  } catch {
    return new Date().getMonth() + 2;
  }
}

// Helper function to extract year from date string (YYYY-MM-DD)
function extractYearFromDateRange(dateStr: string): number {
  if (!dateStr) {
    return new Date().getFullYear();
  }
  
  try {
    const date = new Date(dateStr);
    return date.getFullYear();
  } catch {
    return new Date().getFullYear();
  }
}
