import axios from 'axios';
import { FormSubmissionRequest, UgandaFormSuccessResponse, RegularFormSuccessResponse } from '../types';

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

export const submitFormData = async (formData: any): Promise<
  | { success: true; data: UgandaFormSuccessResponse | RegularFormSuccessResponse }
  | { success: false; error: string }
> => {
  try {
    const payload: FormSubmissionRequest = formData;

    // Basic validation
    if (!payload.name || !payload.email || !payload.country_of_residence) {
      throw new Error('Missing required fields: name, email, country_of_residence');
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
