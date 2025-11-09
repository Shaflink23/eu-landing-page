import { FormSubmissionRequest, UgandaFormSuccessResponse, RegularFormSuccessResponse } from '../types';

const API_BASE_URL = 'https://lavenderblush-jellyfish-670937.hostingersite.com/api';
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

    const response = await fetch(`${API_BASE_URL}/upload-file`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      let errorData;
      try {
        errorData = await response.json();
      } catch {
        errorData = { message: response.statusText };
      }

      console.error('❌ File upload error:', errorData);
      throw new Error(errorData.message || 'Failed to upload file');
    }

    const result = await response.json();
    console.log('✅ File upload successful:', result);
    console.log('Full API response body:', JSON.stringify(result, null, 2));

    // Handle API response structure - extract data from wrapper if present
    const uploadData = result.data || result;

    return { success: true, data: uploadData };
  } catch (error) {
    console.error('❌ File upload error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to upload file'
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

    // Validate required fields and data types
    if (!payload.name || typeof payload.name !== 'string') {
      throw new Error('Invalid or missing name field');
    }
    if (!payload.email || typeof payload.email !== 'string') {
      throw new Error('Invalid or missing email field');
    }
    if (!payload.country_of_residence || typeof payload.country_of_residence !== 'string') {
      throw new Error('Invalid or missing country_of_residence field');
    }
    if (typeof payload.been_to_africa_before !== 'boolean') {
      throw new Error('Invalid been_to_africa_before field - must be boolean');
    }
    if (!Array.isArray(payload.travel_style)) {
      throw new Error('Invalid travel_style field - must be array');
    }
    if (!Array.isArray(payload.must_have_experiences) || payload.must_have_experiences.length !== 3) {
      throw new Error('Invalid must_have_experiences field - must be array of exactly 3 strings');
    }
    if (typeof payload.join_early_explorer !== 'boolean') {
      throw new Error('Invalid join_early_explorer field - must be boolean');
    }
    if (typeof payload.email_opt_in !== 'boolean') {
      throw new Error('Invalid email_opt_in field - must be boolean');
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
    let response;
    try {
      response = await fetch(`${API_BASE_URL}${FORM_ENDPOINT}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(payload),
      });
      
      // If first attempt fails with 404, try the alternate spelling
      if (response.status === 404) {
        console.log('⚠️ Trying alternate endpoint spelling...');
        response = await fetch(`${API_BASE_URL}/form-submissons`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
          body: JSON.stringify(payload),
        });
      }
    } catch (fetchError) {
      console.error('❌ Network error:', fetchError);
      throw new Error('Network error. Please check your connection and try again.');
    }

    // Handle response
    if (!response.ok) {
      let errorData;
      try {
        errorData = await response.json();
      } catch {
        errorData = { message: response.statusText };
      }
      
      console.error('❌ API Error Response:', errorData);
      console.error('❌ Response Status:', response.status);
      console.error('❌ Response Headers:', Object.fromEntries(response.headers.entries()));
      
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
      throw new Error(errorMessage);
    }

    const result = await response.json();
    console.log('✅ Form submission successful:', result);
    
    return { success: true, data: result };
    
  } catch (error) {
    console.error('❌ Form submission error:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Failed to submit form. Please try again.'
    };
  }
};

// Helper function to format travel style - must match backend enum exactly
function formatTravelStyle(travellerType: string): string {
  const mapping: { [key: string]: string } = {
    'adventurer': 'adventurer',
    'cultural': 'cultural_immerser',
    'luxe': 'luxury_seeker',
    'offgrid': 'nature_lover',
    'mix': 'budget_explorer',
  };
  return mapping[travellerType?.toLowerCase()] || 'adventurer';
}

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
