import axios from 'axios';
import { FormSubmissionRequest, UgandaFormSuccessResponse, RegularFormSuccessResponse } from '../types';
import { TravellerVibesFormData, DreamTripFormData } from '../types';

// Form data union type for unified submission
export type FormData = TravellerVibesFormData | DreamTripFormData | FormSubmissionRequest;

const API_BASE_URL = 'https://api.everythinguganda.co.uk/api';
const FORM_ENDPOINT = '/form-submissions';

export const uploadFile = async (file: File, type: string = 'travel_photo'): Promise<
  | { success: true; data: { url: string; filename: string; path: string } }
  | { success: false; error: string }
> => {
  try {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', type);

    const response = await axios.post(`${API_BASE_URL}/upload-file`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    const uploadData = response.data.data || response.data;
    return { success: true, data: uploadData };
  } catch (error: any) {
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

export const submitFormData = async (formData: FormData): Promise<
  | { success: true; data: UgandaFormSuccessResponse | RegularFormSuccessResponse }
  | { success: false; error: string }
> => {
  try {
    const payload: FormSubmissionRequest = formData as FormSubmissionRequest;

    // Enhanced validation for Uganda form detection
    const ugandaFields = [
      'country_of_residence',
      'travel_style',
      'heard_about_us',
      'travel_month',
      'travel_year',
      'group_type',
      'group_size',
      'must_have_experiences',
      'send_options'
    ];

    const presentUgandaFields = ugandaFields.filter(field => {
      const value = payload[field as keyof FormSubmissionRequest];
      return value !== undefined && value !== null && value !== '';
    });

    // Basic required fields validation
    if (!payload.name || !payload.email) {
      throw new Error('Missing required fields: name, email');
    }

    // For Uganda forms, ensure critical fields are present
    if (presentUgandaFields.length >= 5) {
      if (!payload.country_of_residence || !payload.travel_style || !payload.heard_about_us) {
        throw new Error('For Uganda travel inquiry, country_of_residence, travel_style, and heard_about_us are required');
      }
    }

    // Ensure arrays are properly formatted
    if (payload.travel_style && !Array.isArray(payload.travel_style)) {
      throw new Error('travel_style must be an array');
    }
    
    if (payload.must_have_experiences && !Array.isArray(payload.must_have_experiences)) {
      throw new Error('must_have_experiences must be an array');
    }

    // Validate travel dates if present
    if (payload.preferred_start_date && payload.preferred_end_date) {
      const startDate = new Date(payload.preferred_start_date);
      const endDate = new Date(payload.preferred_end_date);
      if (endDate <= startDate) {
        throw new Error('preferred_end_date must be after preferred_start_date');
      }
    }

    // Ensure numeric fields are numbers
    if (payload.group_size && typeof payload.group_size !== 'number') {
      payload.group_size = parseInt(String(payload.group_size)) || 1;
    }

    if (payload.travel_month && typeof payload.travel_month !== 'number') {
      payload.travel_month = parseInt(String(payload.travel_month));
    }

    if (payload.travel_year && typeof payload.travel_year !== 'number') {
      payload.travel_year = parseInt(String(payload.travel_year));
    }

    // Ensure enums are valid
    if (payload.group_type && !['solo', 'couple', 'group'].includes(payload.group_type)) {
      throw new Error('group_type must be solo, couple, or group');
    }

    if (payload.send_options && !['bespoke_packages', 'sneak_peek', 'both'].includes(payload.send_options)) {
      throw new Error('send_options must be bespoke_packages, sneak_peek, or both');
    }

    if (payload.feature_as_pioneer && !['yes', 'maybe_later'].includes(payload.feature_as_pioneer)) {
      throw new Error('feature_as_pioneer must be yes or maybe_later');
    }

    const response = await axios.post(`${API_BASE_URL}${FORM_ENDPOINT}`, payload, {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    });

    return { success: true, data: response.data };
    
  } catch (error: any) {
    let errorMessage = 'Failed to submit form';

    if (error.response) {
      const errorData = error.response.data;
      
      if (errorData.message) {
        errorMessage = errorData.message;
        
        // Format validation errors if present
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
    } else if (error.request) {
      errorMessage = 'Network error. Please check your connection and try again.';
    } else {
      errorMessage = error.message || 'Failed to submit form. Please try again.';
    }

    return {
      success: false,
      error: errorMessage
    };
  }
};
