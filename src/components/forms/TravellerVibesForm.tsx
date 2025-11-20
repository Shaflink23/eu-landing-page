import * as React from "react";
import { motion } from "framer-motion";
import { uploadFile } from "../../utils/api";
import { useFormValidation, travellerVibesSchema } from "../../types";
import { PhoneInput } from "@/components/ui/phone-input";

interface TravellerVibesFormProps {
  onNext: (data: any) => void;
  initialData: any;
  currentStep?: number;
  totalSteps?: number;
  onClose?: () => void;
}

export const TravellerVibesForm: React.FC<TravellerVibesFormProps> = ({
  onNext,
  initialData,
  currentStep = 1,
  totalSteps = 3,
  onClose
}) => {
  // Initialize form validation with Zod
  const {
    data: formData,
    setFieldValue,
    setFieldTouched,
    getFieldError,
    hasFieldError
  } = useFormValidation(travellerVibesSchema, {
    name: initialData.name || '',
    email: initialData.email || '',
    phone: initialData.phone || '',
    country: initialData.country || '',
    beenToAfrica: initialData.beenToAfrica || '',
    travellerType: initialData.travellerType || [],
    hearAbout: initialData.hearAbout || [],
    pioneeerTraveller: initialData.pioneeerTraveller || '',
    photo: initialData.photo || null,
  });

  const [uploadState, setUploadState] = React.useState<{
    isUploading: boolean;
    error: string | null;
    uploadedUrl: string | null;
  }>({
    isUploading: false,
    error: null,
    uploadedUrl: null,
  });

  const [countrySearch, setCountrySearch] = React.useState('');
  const [isCountryDropdownOpen, setIsCountryDropdownOpen] = React.useState(false);
  const countryDropdownRef = React.useRef<HTMLDivElement>(null);

  // Top countries to display
  const topCountries = [
    'United Kingdom',
    'United States',
    'Canada',
    'United Arab Emirates',
    'Saudi Arabia',
    'Australia',
    'Germany',
    'Uganda'
  ];

  // Comprehensive list of all countries
  const allCountries = [
    'Afghanistan', 'Albania', 'Algeria', 'Andorra', 'Angola', 'Antigua and Barbuda', 'Argentina', 'Armenia', 'Australia', 'Austria',
    'Azerbaijan', 'Bahamas', 'Bahrain', 'Bangladesh', 'Barbados', 'Belarus', 'Belgium', 'Belize', 'Benin', 'Bhutan',
    'Bolivia', 'Bosnia and Herzegovina', 'Botswana', 'Brazil', 'Brunei', 'Bulgaria', 'Burkina Faso', 'Burundi', 'Cabo Verde', 'Cambodia',
    'Cameroon', 'Canada', 'Central African Republic', 'Chad', 'Chile', 'China', 'Colombia', 'Comoros', 'Congo', 'Costa Rica',
    'Croatia', 'Cuba', 'Cyprus', 'Czech Republic', 'Denmark', 'Djibouti', 'Dominica', 'Dominican Republic', 'East Timor', 'Ecuador',
    'Egypt', 'El Salvador', 'Equatorial Guinea', 'Eritrea', 'Estonia', 'Eswatini', 'Ethiopia', 'Fiji', 'Finland', 'France',
    'Gabon', 'Gambia', 'Georgia', 'Germany', 'Ghana', 'Greece', 'Grenada', 'Guatemala', 'Guinea', 'Guinea-Bissau',
    'Guyana', 'Haiti', 'Honduras', 'Hungary', 'Iceland', 'India', 'Indonesia', 'Iran', 'Iraq', 'Ireland',
    'Israel', 'Italy', 'Ivory Coast', 'Jamaica', 'Japan', 'Jordan', 'Kazakhstan', 'Kenya', 'Kiribati', 'Kosovo',
    'Kuwait', 'Kyrgyzstan', 'Laos', 'Latvia', 'Lebanon', 'Lesotho', 'Liberia', 'Libya', 'Liechtenstein', 'Lithuania',
    'Luxembourg', 'Madagascar', 'Malawi', 'Malaysia', 'Maldives', 'Mali', 'Malta', 'Marshall Islands', 'Mauritania', 'Mauritius',
    'Mexico', 'Micronesia', 'Moldova', 'Monaco', 'Mongolia', 'Montenegro', 'Morocco', 'Mozambique', 'Myanmar', 'Namibia',
    'Nauru', 'Nepal', 'Netherlands', 'New Zealand', 'Nicaragua', 'Niger', 'Nigeria', 'North Korea', 'North Macedonia', 'Norway',
    'Oman', 'Pakistan', 'Palau', 'Palestine', 'Panama', 'Papua New Guinea', 'Paraguay', 'Peru', 'Philippines', 'Poland',
    'Portugal', 'Qatar', 'Romania', 'Russia', 'Rwanda', 'Saint Kitts and Nevis', 'Saint Lucia', 'Saint Vincent and the Grenadines', 'Samoa', 'San Marino',
    'Sao Tome and Principe', 'Saudi Arabia', 'Senegal', 'Serbia', 'Seychelles', 'Sierra Leone', 'Singapore', 'Slovakia', 'Slovenia', 'Solomon Islands',
    'Somalia', 'South Africa', 'South Korea', 'South Sudan', 'Spain', 'Sri Lanka', 'Sudan', 'Suriname', 'Sweden', 'Switzerland',
    'Syria', 'Taiwan', 'Tajikistan', 'Tanzania', 'Thailand', 'Togo', 'Tonga', 'Trinidad and Tobago', 'Tunisia', 'Turkey',
    'Turkmenistan', 'Tuvalu', 'Uganda', 'Ukraine', 'United Arab Emirates', 'United Kingdom', 'United States', 'Uruguay', 'Uzbekistan', 'Vanuatu',
    'Vatican City', 'Venezuela', 'Vietnam', 'Yemen', 'Zambia', 'Zimbabwe'
  ];

  // Filter countries based on search
  const filteredCountries = React.useMemo(() => {
    if (!countrySearch) {
      return topCountries;
    }
    return allCountries.filter(country =>
      country.toLowerCase().includes(countrySearch.toLowerCase())
    );
  }, [countrySearch]);

  // Close dropdown when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (countryDropdownRef.current && !countryDropdownRef.current.contains(event.target as Node)) {
        setIsCountryDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const travellerTypes = [
    { value: 'adventurer', label: 'Adventurer', emoji: '🏔️' },
    { value: 'cultural_immerser', label: 'Cultural Immerser', emoji: '🎭' },
    { value: 'luxe_relaxer', label: 'Luxe Relaxer', emoji: '✨' },
    { value: 'off_the_grid', label: 'Off-the-Grid Explorer', emoji: '🌍' },
    { value: 'mix_of_all', label: 'A Mix of All', emoji: '🎨' },
  ];

  const hearAboutOptions = [
    { value: 'tiktok', label: 'TikTok', emoji: '📱' },
    { value: 'instagram', label: 'Instagram', emoji: '📷' },
    { value: 'word_of_mouth', label: 'Word of Mouth', emoji: '💬' },
    { value: 'uk_travel_group', label: 'Travel Group', emoji: '🌍' },
    { value: 'event_expo', label: 'Event/Expo', emoji: '🎪' },
    { value: 'other', label: 'Other', emoji: '⭐' },
  ];

  const handleTravellerTypeToggle = (type: string) => {
    const currentTypes = formData.travellerType || [];
    const newTypes = currentTypes.includes(type)
      ? currentTypes.filter((t: string) => t !== type)
      : [...currentTypes, type];
    setFieldValue('travellerType', newTypes);
  };

  const handleHearAboutToggle = (option: string) => {
    const currentOptions = formData.hearAbout || [];
    const newOptions = currentOptions.includes(option)
      ? currentOptions.filter((h: string) => h !== option)
      : [...currentOptions, option];
    setFieldValue('hearAbout', newOptions);
  };

  const handleFileUpload = async (file: File) => {
    setUploadState({ isUploading: true, error: null, uploadedUrl: null });

    try {
      const result = await uploadFile(file, 'travel_photo');

      if (result.success) {
        console.log('🚀 Upload result from API:', result);
        console.log('🚀 result.data:', result.data);
        const uploadedUrl = result.data?.url;

        if (!uploadedUrl) {
          console.error('❌ No URL found in upload response:', result.data);
        }

        setUploadState({
          isUploading: false,
          error: null,
          uploadedUrl: uploadedUrl || null
        });
        // Store the uploaded URL in form data
        setFieldValue('photo', uploadedUrl || null);
        console.log('✅ Photo uploaded successfully:', uploadedUrl);
      } else {
        setUploadState({
          isUploading: false,
          error: result.error,
          uploadedUrl: null
        });
        console.error('❌ Photo upload failed:', result.error);
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Upload failed';
      setUploadState({
        isUploading: false,
        error: errorMessage,
        uploadedUrl: null
      });
      console.error('💥 Photo upload error:', error);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileUpload(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onNext(formData);
  };

  const isFormValid = formData.name && formData.email && formData.country && formData.country !== '' && formData.beenToAfrica && (formData.travellerType?.length || 0) > 0;

  return (
    <div className="grid md:grid-cols-3 gap-6 px-4 md:px-0">
      {/* Main Form Container */}
      <div className="md:col-span-2">
        <div className="bg-white rounded-lg border border-gray-200 p-4 md:p-6 mx-auto max-w-2xl md:max-w-none">
          {/* Progress Bar */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm font-medium text-gray-700" style={{ fontFamily: 'Roboto, sans-serif', fontWeight: 400 }}>
                Step {currentStep} of {totalSteps}
              </p>
              {onClose && (
                <button
                  onClick={onClose}
                  className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
                  style={{ fontFamily: 'Roboto, sans-serif', fontWeight: 400 }}
                >
                  Cancel & Return Home
                </button>
              )}
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-green-500 to-emerald-600"
                initial={{ width: 0 }}
                animate={{ width: `${(currentStep / totalSteps) * 100}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <h2 
              className="text-gray-900 mb-2"
              style={{ 
                fontSize: '30px', 
                fontFamily: 'Roboto, sans-serif', 
                fontWeight: 400 
              }}
            >
              Traveller Vibes
            </h2>
            <p 
              className="text-gray-600 mb-6"
              style={{ 
                fontSize: '16px', 
                fontFamily: 'Roboto, sans-serif', 
                fontWeight: 400 
              }}
            >
              Let us get to know your travel soul and create your perfect African adventure.
            </p>
          </motion.div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name and Email Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label
                  className="block text-gray-700 mb-2"
                  style={{
                    fontSize: '14px',
                    fontFamily: 'Roboto, sans-serif',
                    fontWeight: 400
                  }}
                >
                  Your Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.name || ''}
                  onChange={(e) => setFieldValue('name', e.target.value)}
                  onBlur={() => setFieldTouched('name')}
                  className={`w-full px-3 border rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all ${
                    hasFieldError('name') ? 'border-red-500 bg-red-50' : 'border-gray-300'
                  }`}
                  style={{
                    height: '40px',
                    fontSize: '14px',
                    fontFamily: 'Roboto, sans-serif',
                    fontWeight: 400,
                    maxWidth: '270px'
                  }}
                  placeholder="Enter your name"
                  required
                />
                {getFieldError('name') && (
                  <p className="text-red-600 text-sm mt-1">{getFieldError('name')}</p>
                )}
              </div>

              <div>
                <label
                  className="block text-gray-700 mb-2"
                  style={{
                    fontSize: '14px',
                    fontFamily: 'Roboto, sans-serif',
                    fontWeight: 400
                  }}
                >
                  Email Address <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  value={formData.email || ''}
                  onChange={(e) => setFieldValue('email', e.target.value)}
                  onBlur={() => setFieldTouched('email')}
                  className={`w-full px-3 border rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all ${
                    hasFieldError('email') ? 'border-red-500 bg-red-50' : 'border-gray-300'
                  }`}
                  style={{
                    height: '40px',
                    fontSize: '14px',
                    fontFamily: 'Roboto, sans-serif',
                    fontWeight: 400,
                    maxWidth: '270px'
                  }}
                  placeholder="your.email@example.com"
                  required
                />
                {getFieldError('email') && (
                  <p className="text-red-600 text-sm mt-1">{getFieldError('email')}</p>
                )}
              </div>
            </div>

            {/* Phone Number */}
            <div>
              <label
                className="block text-gray-700 mb-2"
                style={{
                  fontSize: '14px',
                  fontFamily: 'Roboto, sans-serif',
                  fontWeight: 400
                }}
              >
                Phone Number <span className="text-red-500">*</span>
              </label>
              <PhoneInput
                value={formData.phone || ''}
                onChange={(value) => setFieldValue('phone', value)}
                onBlur={() => setFieldTouched('phone')}
                error={hasFieldError('phone')}
                required
                placeholder="Enter phone number"
                className=" w-3/4"
              />
              {getFieldError('phone') && (
                <p className="text-red-600 text-sm mt-1">{getFieldError('phone')}</p>
              )}
            </div>

            {/* Country and Africa Experience Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label
                  className="block text-gray-700 mb-2"
                  style={{
                    fontSize: '14px',
                    fontFamily: 'Roboto, sans-serif',
                    fontWeight: 400
                  }}
                >
                  Country of Residence
                </label>
                
                {/* Custom Searchable Dropdown */}
                <div ref={countryDropdownRef} className="relative" style={{ maxWidth: '270px' }}>
                  <button
                    type="button"
                    onClick={() => setIsCountryDropdownOpen(!isCountryDropdownOpen)}
                    onBlur={() => setFieldTouched('country')}
                    className={`w-full px-3 border rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all text-left flex items-center justify-between ${
                      hasFieldError('country') ? 'border-red-500 bg-red-50' : 'border-gray-300 bg-white'
                    }`}
                    style={{
                      height: '40px',
                      fontSize: '14px',
                      fontFamily: 'Roboto, sans-serif',
                      fontWeight: 400,
                    }}
                  >
                    <span className={formData.country ? 'text-gray-900' : 'text-gray-500'}>
                      {formData.country || 'Select your country'}
                    </span>
                    <svg
                      className={`w-5 h-5 transition-transform ${isCountryDropdownOpen ? 'transform rotate-180' : ''}`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>

                  {/* Dropdown Menu */}
                  {isCountryDropdownOpen && (
                    <div
                      className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg"
                      style={{ maxHeight: '300px' }}
                    >
                      {/* Search Input */}
                      <div className="p-2 border-b border-gray-200 sticky top-0" style={{ backgroundColor: '#e7f8ee' }}>
                        <input
                          type="text"
                          value={countrySearch}
                          onChange={(e) => setCountrySearch(e.target.value)}
                          placeholder="Search your country"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                          style={{
                            fontSize: '14px',
                            fontFamily: 'Roboto, sans-serif',
                            fontWeight: 400,
                          }}
                          onClick={(e) => e.stopPropagation()}
                        />
                      </div>

                      {/* Country List */}
                      <div className="overflow-y-auto" style={{ maxHeight: '240px' }}>
                        {filteredCountries.length > 0 ? (
                          filteredCountries.map((country) => (
                            <button
                              key={country}
                              type="button"
                              onClick={() => {
                                setFieldValue('country', country);
                                setIsCountryDropdownOpen(false);
                                setCountrySearch('');
                              }}
                              className={`w-full px-3 py-2 text-left hover:bg-gray-100 transition-colors ${
                                formData.country === country ? 'bg-green-50 text-green-700 font-medium' : 'text-gray-900'
                              }`}
                              style={{
                                fontSize: '14px',
                                fontFamily: 'Roboto, sans-serif',
                                fontWeight: formData.country === country ? 500 : 400,
                              }}
                            >
                              {country}
                            </button>
                          ))
                        ) : (
                          <div className="px-3 py-4 text-center text-gray-500" style={{ fontSize: '14px' }}>
                            No countries found
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div>
                <label
                  className="block text-gray-700 mb-2"
                  style={{
                    fontSize: '14px',
                    fontFamily: 'Roboto, sans-serif',
                    fontWeight: 400
                  }}
                >
                  Have you been to Africa before?
                </label>
                <div className="flex gap-6 items-center pt-2">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="beenToAfrica"
                      value="yes"
                      checked={formData.beenToAfrica === 'yes'}
                      onChange={(e) => setFieldValue('beenToAfrica', e.target.value)}
                      className="w-4 h-4 text-green-600 border-gray-300 focus:ring-green-500"
                    />
                    <span
                      style={{
                        fontSize: '14px',
                        fontFamily: 'Roboto, sans-serif',
                        fontWeight: 400
                      }}
                    >
                      Yes
                    </span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="beenToAfrica"
                      value="no"
                      checked={formData.beenToAfrica === 'no'}
                      onChange={(e) => setFieldValue('beenToAfrica', e.target.value)}
                      className="w-4 h-4 text-green-600 border-gray-300 focus:ring-green-500"
                    />
                    <span
                      style={{
                        fontSize: '14px',
                        fontFamily: 'Roboto, sans-serif',
                        fontWeight: 400
                      }}
                    >
                      No
                    </span>
                  </label>
                </div>
              </div>
            </div>

            {/* Traveller Type */}
            <div>
              <label
                className="block text-gray-700 mb-3"
                style={{
                  fontSize: '14px',
                  fontFamily: 'Roboto, sans-serif',
                  fontWeight: 400
                }}
              >
                What kind of traveller are you? (Select all that apply)
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {travellerTypes.map((type) => (
                  <button
                    key={type.value}
                    type="button"
                    onClick={() => handleTravellerTypeToggle(type.value)}
                    className={`flex items-center gap-3 p-3 rounded-lg border transition-all text-left w-full ${
                      (formData.travellerType || []).includes(type.value)
                        ? 'border-green-500 bg-green-50 text-green-700'
                        : 'border-gray-300 hover:border-green-300 hover:bg-gray-50'
                    }`}
                    style={{
                      height: '40px',
                      maxWidth: '270px'
                    }}
                  >
                    <span className="text-2xl">{type.emoji}</span>
                    <span
                      style={{
                        fontSize: '14px',
                        fontFamily: 'Roboto, sans-serif',
                        fontWeight: 400
                      }}
                    >
                      {type.label}
                    </span>
                    {(formData.travellerType || []).includes(type.value) && (
                      <div className="ml-auto w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                        <svg
                          width="14"
                          height="14"
                          viewBox="0 0 24 24"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M20 6L9 17L4 12"
                            stroke="white"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Where did you hear about us */}
            <div>
              <label
                className="block text-gray-700 mb-3"
                style={{
                  fontSize: '14px',
                  fontFamily: 'Roboto, sans-serif',
                  fontWeight: 400
                }}
              >
                Where did you hear about us? (Select all that apply)
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {hearAboutOptions.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => handleHearAboutToggle(option.value)}
                    className={`flex items-center gap-3 p-3 rounded-lg border transition-all text-left w-full ${
                      (formData.hearAbout || []).includes(option.value)
                        ? 'border-green-500 bg-green-50 text-green-700'
                        : 'border-gray-300 hover:border-green-300 hover:bg-gray-50'
                    }`}
                    style={{
                      height: '40px',
                      maxWidth: '270px'
                    }}
                  >
                    <span className="text-xl">{option.emoji}</span>
                    <span
                      style={{
                        fontSize: '14px',
                        fontFamily: 'Roboto, sans-serif',
                        fontWeight: 400
                      }}
                    >
                      {option.label}
                    </span>
                    {(formData.hearAbout || []).includes(option.value) && (
                      <div className="ml-auto w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                        <svg
                          width="14"
                          height="14"
                          viewBox="0 0 24 24"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M20 6L9 17L4 12"
                            stroke="white"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Pioneer Traveller */}
            <div>
              <label
                className="block text-gray-700 mb-3"
                style={{
                  fontSize: '14px',
                  fontFamily: 'Roboto, sans-serif',
                  fontWeight: 400
                }}
              >
                Would you like to be featured as a Pioneer Traveller?
              </label>
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  type="button"
                  onClick={() => setFieldValue('pioneeerTraveller', 'yes')}
                  className={`flex items-center justify-center gap-3 p-3 rounded-lg border transition-all text-center flex-1 min-h-[48px] ${
                    formData.pioneeerTraveller === 'yes'
                      ? 'border-green-500 bg-green-50 text-green-700'
                      : 'border-gray-300 hover:border-green-300 hover:bg-gray-50'
                  }`}
                >
                  <span className="text-xl">😊</span>
                  <span
                    className="whitespace-nowrap"
                    style={{
                      fontSize: '14px',
                      fontFamily: 'Roboto, sans-serif',
                      fontWeight: 400
                    }}
                  >
                    Yes! Feature me.
                  </span>
                </button>
                <button
                  type="button"
                  onClick={() => setFieldValue('pioneeerTraveller', 'maybe')}
                  className={`flex items-center justify-center gap-3 p-3 rounded-lg border transition-all text-center flex-1 min-h-[48px] ${
                    formData.pioneeerTraveller === 'maybe'
                      ? 'border-green-500 bg-green-50 text-green-700'
                      : 'border-gray-300 hover:border-green-300 hover:bg-gray-50'
                  }`}
                >
                  <span className="text-xl">🤔</span>
                  <span
                    className="whitespace-nowrap"
                    style={{
                      fontSize: '14px',
                      fontFamily: 'Roboto, sans-serif',
                      fontWeight: 400
                    }}
                  >
                    Maybe later.
                  </span>
                </button>
              </div>
            </div>

            {/* Upload Photo */}
            <div>
              <label
                className="block text-gray-700 mb-2"
                style={{
                  fontSize: '14px',
                  fontFamily: 'Roboto, sans-serif',
                  fontWeight: 400
                }}
              >
                Upload a photo
              </label>

              {/* Image Preview */}
              {uploadState.uploadedUrl && (
                <div className="mb-4">
                  <div className="relative inline-block">
                    <img
                      src={uploadState.uploadedUrl}
                      alt="Uploaded travel photo"
                      className="w-32 h-32 object-cover rounded-lg border-2 border-green-400 shadow-md"
                    />
                    <div className="absolute -top-2 -right-2 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                      <svg
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M5 13l4 4L19 7"
                          stroke="white"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </div>
                  </div>
                </div>
              )}

              <div className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                uploadState.uploadedUrl
                  ? 'border-green-400 bg-green-50'
                  : uploadState.error
                  ? 'border-red-400 bg-red-50'
                  : 'border-gray-300 hover:border-green-400'
              }`}>
                <div className="flex flex-col items-center">
                  {/* Upload Status Icon */}
                  {uploadState.isUploading ? (
                    <svg className="animate-spin h-12 w-12 text-green-600 mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  ) : uploadState.uploadedUrl ? (
                    <svg
                      width="48"
                      height="48"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      className="mb-4 text-green-600"
                    >
                      <path
                        d="M5 13l4 4L19 7"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  ) : (
                    <svg
                      width="48"
                      height="48"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      className="mb-4 text-gray-400"
                    >
                      <path
                        d="M14 2H6C4.89543 2 4 2.89543 4 4V20C4 21.1046 4.89543 22 6 22H18C19.1046 22 20 21.1046 20 20V8L14 2Z"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M14 2V8H20"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M12 11V17"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M9 14L12 11L15 14"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  )}

                  {/* Status Message */}
                  <div className="mb-4">
                    {uploadState.isUploading && (
                      <p className="text-green-700 font-medium">Uploading photo...</p>
                    )}
                    {uploadState.uploadedUrl && (
                      <p className="text-green-700 font-medium">Photo uploaded successfully!</p>
                    )}
                    {uploadState.error && (
                      <p className="text-red-700 font-medium">Upload failed: {uploadState.error}</p>
                    )}
                    {!uploadState.isUploading && !uploadState.uploadedUrl && !uploadState.error && (
                      <div className="flex items-center gap-2 mb-2">
                        <svg
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                          className="text-gray-500"
                        >
                          <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2"/>
                          <path d="M9 2L7.17 4H4C2.9 4 2 4.9 2 6V18C2 19.1 2.9 20 4 20H20C21.1 20 22 19.1 22 18V6C22 4.9 21.1 4 20 4H16.83L15 2H9Z" stroke="currentColor" strokeWidth="2"/>
                        </svg>
                        <p
                          className="text-gray-600"
                          style={{
                            fontSize: '14px',
                            fontFamily: 'Roboto, sans-serif',
                            fontWeight: 400
                          }}
                        >
                          "Show us your travel spirit, it might just end up in our launch reel."
                        </p>
                      </div>
                    )}
                  </div>

                  {/* File Input */}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                    id="photo-upload"
                    disabled={uploadState.isUploading}
                  />
                  <label
                    htmlFor="photo-upload"
                    className={`cursor-pointer ${
                      uploadState.isUploading
                        ? 'text-gray-400 cursor-not-allowed'
                        : uploadState.uploadedUrl
                        ? 'text-green-700 hover:text-green-800'
                        : 'text-green-600 hover:text-green-700'
                    }`}
                    style={{
                      fontSize: '14px',
                      fontFamily: 'Roboto, sans-serif',
                      fontWeight: 400
                    }}
                  >
                    {uploadState.isUploading
                      ? 'Uploading...'
                      : uploadState.uploadedUrl
                      ? 'Change photo'
                      : 'Click to upload or drag and drop'
                    }
                  </label>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <motion.button
              type="submit"
              disabled={!isFormValid}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2 }}
              className={`w-full rounded-lg font-semibold text-white transition-all ${
                isFormValid
                  ? 'bg-gradient-to-r from-green-600 to-emerald-600 hover:shadow-lg hover:scale-105'
                  : 'bg-gray-400 cursor-not-allowed'
              }`}
              style={{ 
                height: '40px',
                fontSize: '14px', 
                fontFamily: 'Roboto, sans-serif', 
                fontWeight: 400 
              }}
            >
              Next Step →
            </motion.button>
          </form>
        </div>
      </div>

      {/* Quote Container */}
      <div className="md:col-span-1 flex justify-center">
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
          className="sticky top-8 hidden md:block"
          style={{
            // height and width should grow proportionally based on design
            height: '500px',
            width: '350px',
            borderRadius: '10px',
            padding: '23px',
            backdropFilter: 'blur(10px)',
            WebkitBackdropFilter: 'blur(10px)',
            background: 'linear-gradient(135deg, rgba(34, 197, 94, 0.1) 0%, rgba(16, 185, 129, 0.15) 100%)',
            border: '1px solid rgba(34, 197, 94, 0.2)',
            boxShadow: '0 8px 32px rgba(34, 197, 94, 0.1)'
          }}
        >
          <div className="flex flex-col items-center h-full">
            {/* Quote Icon Circle */}
            <div 
              className="bg-black rounded-full p-3 flex items-center justify-center mb-6"
              style={{ width: '60px', height: '60px' }}
            >
              <svg 
                width="24" 
                height="24" 
                viewBox="0 0 24 24" 
                fill="none" 
                xmlns="http://www.w3.org/2000/svg"
                className="text-white"
              >
                <path 
                  d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h4v10h-10z" 
                  fill="currentColor"
                />
              </svg>
            </div>

            {/* Quote Text */}
            <div className="text-center mb-8 flex-1 flex flex-col justify-start">
              <p className="text-lg text-gray-700 italic leading-relaxed mb-6">
                "There is no wrong answer, Uganda has a version of magic for every mood."
              </p>
              
              <div className="space-y-3 text-left">
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0" style={{ backgroundColor: '#000000' }}>
                    <svg 
                      width="12" 
                      height="12" 
                      viewBox="0 0 24 24" 
                      fill="none" 
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path 
                        d="M20 6L9 17L4 12" 
                        stroke="#ffffff" 
                        strokeWidth="2.5" 
                        strokeLinecap="round" 
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                  <p className="text-sm text-gray-600">Explore Uganda's vibrant culture and stunning landscapes" </p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0" style={{ backgroundColor: '#000000' }}>
                    <svg 
                      width="12" 
                      height="12" 
                      viewBox="0 0 24 24" 
                      fill="none" 
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path 
                        d="M20 6L9 17L4 12" 
                        stroke="#ffffff" 
                        strokeWidth="2.5" 
                        strokeLinecap="round" 
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                  <p className="text-sm text-gray-600">Experience the Pearl of Africa like never before! </p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0" style={{ backgroundColor: '#000000' }}>
                    <svg 
                      width="12" 
                      height="12" 
                      viewBox="0 0 24 24" 
                      fill="none" 
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path 
                        d="M20 6L9 17L4 12" 
                        stroke="#ffffff" 
                        strokeWidth="2.5" 
                        strokeLinecap="round" 
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                  <p className="text-sm text-gray-600">Are You Ready to meet the Mountain Gorillas? </p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};
