const API_BASE_URL = 'https://lavenderblush-jellyfish-670937.hostingersite.com/api';
// Note: Backend URL endpoint might be 'form-submissons' (with typo) or 'form-submissions'
const FORM_ENDPOINT = '/form-submissions'; // Try this first, fallback to /form-submissons if needed

interface FormSubmissionPayload {
  name: string;
  email: string;
  country_of_residence: string;
  been_to_africa_before: boolean;
  travel_style: string[]; // Changed to array
  dream_escape_words: string;
  heard_about_us: string;
  feature_as_pioneer: string;
  travel_photo_url: string;
  travel_month: number;
  travel_year: number;
  group_type: string;
  group_size: number;
  must_have_experiences: string[];
  accessibility_dietary_preferences: string;
  send_options: string;
  join_early_explorer: boolean;
  email_opt_in: boolean;
}

export const submitFormData = async (formData: any): Promise<{ success: boolean; data?: any; error?: string }> => {
  try {
    console.log('📋 Raw form data received:', formData);
    
    // Transform form data to match API schema with proper defaults
    const payload: FormSubmissionPayload = {
      // From TravellerVibesForm (Step 1)
      name: formData.name || 'Guest User',
      email: formData.email || 'guest@example.com',
      country_of_residence: formData.country || 'Unknown',
      been_to_africa_before: formData.beenToAfrica === 'yes',
      
      // Travel style - MUST BE AN ARRAY (backend expects array, max 3 selections)
      travel_style: Array.isArray(formData.travellerType) && formData.travellerType.length > 0
        ? formData.travellerType.slice(0, 3).map((type: string) => formatTravelStyle(type))
        : ['adventurer'],
      
      // Heard about us from Step 1
      heard_about_us: formatReferralSource(formData.hearAbout || []),
      
      // Pioneer traveller from Step 1 - Backend expects specific values
      feature_as_pioneer: formData.pioneeerTraveller === 'yes' ? 'yes' : 'maybe_later',
      
      // Travel photo from Step 1 - provide valid default URL
      travel_photo_url: formData.photo || 'https://example.com/travel-photo.jpg',
      
      // From DreamTripForm (Step 2)
      dream_escape_words: formData.dreamWords || 'adventure, culture, nature',
      
      // Travel dates from Step 2
      travel_month: extractMonthFromDateRange(formData.startDate),
      travel_year: extractYearFromDateRange(formData.startDate),
      
      // Group info from Step 2
      group_type: formData.companion?.toLowerCase() || 'solo',
      group_size: calculateGroupSize(formData.companion),
      
      // Experiences from Step 2 - MUST BE EXACTLY 3 VALID EXPERIENCES
      must_have_experiences: formatExperiences(formData.experiences || []),
      
      // Accessibility/dietary preferences
      accessibility_dietary_preferences: formData.preferences || 'None',
      
      // Send options
      send_options: 'both',
      
      // From ExplorerCircleForm (Step 3)
      join_early_explorer: formData.keepUpdated === true,
      email_opt_in: formData.keepUpdated === true,
    };

    console.log('📤 Submitting form data to API:');
    console.log('  ✓ Name:', payload.name);
    console.log('  ✓ Email:', payload.email);
    console.log('  ✓ Country:', payload.country_of_residence);
    console.log('  ✓ Been to Africa:', payload.been_to_africa_before);
    console.log('  ✓ Travel Styles (array):', payload.travel_style);
    console.log('  ✓ Heard About Us:', payload.heard_about_us);
    console.log('  ✓ Experiences (array):', payload.must_have_experiences);
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
function formatReferralSource(sources: string[]): string {
  if (!sources || sources.length === 0) return 'other';
  
  const mapping: { [key: string]: string } = {
    'tiktok': 'tiktok',
    'instagram': 'instagram',
    'word-of-mouth': 'word_of_mouth',
    'events': 'events',
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
    return ['gorilla_trekking', 'wildlife_safaris', 'cultural_immersion'];
  }
  
  // Map form values to ONLY backend accepted enum values
  const mapping: { [key: string]: string } = {
    // From DreamTripForm experience values - map to backend accepted values
    'gorilla': 'gorilla_trekking',
    'village': 'cultural_immersion',
    'nile': 'adventure_activities',
    'food': 'cultural_immersion',
    'safari': 'wildlife_safaris',
    'spiritual': 'spiritual_cultural',
    'coffee': 'cultural_immersion',
    'music': 'cultural_immersion',
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
  
  // Ensure we have exactly 3 experiences
  const validDefaults = ['gorilla_trekking', 'wildlife_safaris', 'cultural_immersion', 'spiritual_cultural', 'adventure_activities'];
  
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
