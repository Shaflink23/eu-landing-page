"use client"

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { uploadFile } from "../../utils/api";
import { PhoneInput } from "@/components/ui/phone-input";
import { travellerVibesSchema, TravellerVibesFormData } from "@/types/rhf";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  RadioGroup,
  RadioGroupItem,
} from "@/components/ui/radio-group";

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
  const [countrySearch, setCountrySearch] = React.useState('');
  const [isCountryDropdownOpen, setIsCountryDropdownOpen] = React.useState(false);
  const countryDropdownRef = React.useRef<HTMLDivElement>(null);
  
  const [uploadState, setUploadState] = React.useState<{
    isUploading: boolean;
    error: string | null;
    uploadedUrl: string | null;
  }>({
    isUploading: false,
    error: null,
    uploadedUrl: null,
  });

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

  const form = useForm<TravellerVibesFormData>({
    resolver: zodResolver(travellerVibesSchema),
    mode: 'onSubmit', // Validate only on submit to avoid conflicts
    defaultValues: {
      name: initialData.name || '',
      email: initialData.email || '',
      phone: initialData.phone || '',
      country_of_residence: initialData.country_of_residence || initialData.country || '',
      been_to_africa_before: initialData.been_to_africa_before ?? (initialData.beenToAfrica === 'yes'),
      travel_style: (initialData.travel_style || initialData.travellerType || []).filter((style: string): style is "adventurer" | "cultural_immerser" | "luxe_relaxer" | "off_the_grid" | "mix_of_all" => 
        ['adventurer', 'cultural_immerser', 'luxe_relaxer', 'off_the_grid', 'mix_of_all'].includes(style as any)
      ),
      heard_about_us: initialData.heard_about_us || initialData.hearAbout || '',
      feature_as_pioneer: initialData.feature_as_pioneer || initialData.pioneeerTraveller === 'yes' ? 'yes' : 'maybe_later',
      travel_photo_url: initialData.travel_photo_url || initialData.photo || '',
    },
  });

  // Submit validation monitoring
  React.useEffect(() => {
    //console.log('🔍 FORM WATCH VALUES:', form.watch());
    //console.log('✅ FORM IS VALID:', form.formState.isValid);
    //console.log('❌ FORM ERRORS:', form.formState.errors);
    //console.log('📊 FORM TOUCHED FIELDS:', form.formState.touchedFields);
    //console.log('🔄 FORM DIRTY FIELDS:', form.formState.dirtyFields);
    //console.log('===================');
  }, [form.formState.isValid, form.formState.errors]); // Validate on submit instead of watch

  // Debug button click
  const handleDebugSubmit = () => {
    //console.log('🚀 NEXT STEP BUTTON CLICKED');
    //console.log('FORM DATA:', form.getValues());
    //console.log('FORM STATE:', form.formState);
    //console.log('IS VALID?', form.formState.isValid);
    //console.log('===================');
  };

  const handleFileUpload = async (file: File) => {
    setUploadState({ isUploading: true, error: null, uploadedUrl: null });

    try {
      const result = await uploadFile(file, 'travel_photo');

      if (result.success) {
        const uploadedUrl = result.data?.url;

        if (!uploadedUrl) {
          throw new Error('No URL found in upload response');
        }

        setUploadState({
          isUploading: false,
          error: null,
          uploadedUrl: uploadedUrl
        });
        
        // Update form with photo URL
        form.setValue('travel_photo_url', uploadedUrl);
        
        toast.success('Photo uploaded successfully!');
      } else {
        throw new Error(result.error || 'Upload failed');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Upload failed';
      setUploadState({
        isUploading: false,
        error: errorMessage,
        uploadedUrl: null
      });
      toast.error(errorMessage);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileUpload(file);
    }
  };

  function onSubmit(data: TravellerVibesFormData) {
    // Form submission handled automatically
    onNext(data);
  }

  return (
    <div className="w-full ">
      {/* Main Container - Responsive grid layout */}
      <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Form - Takes up 3 columns on large screens */}
          <div className="lg:col-span-3">
            <div className="space-y-6">
              <Card className="w-full">
                <CardHeader>
                  <div className="flex items-center justify-between mb-3">
                    <CardTitle className="text-sm font-medium">
                      Step {currentStep} of {totalSteps}
                    </CardTitle>
                    {onClose && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={onClose}
                        className="text-sm text-gray-500 hover:text-gray-700"
                      >
                        Cancel & Return Home
                      </Button>
                    )}
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2 md:h-3 overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-green-500 to-emerald-600 transition-all duration-300"
                      style={{ width: `${(currentStep / totalSteps) * 100}%` }}
                    />
                  </div>
                  <CardTitle className="text-xl md:text-2xl">Traveller Vibes</CardTitle>
                  <CardDescription className="text-sm md:text-base">
                    Let us get to know your travel soul and create your perfect African adventure.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                      {/* Name and Email Row */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="name"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Your Name *</FormLabel>
                              <FormDescription>
                                Please enter your full name as it appears on your passport
                              </FormDescription>
                              <FormControl>
                                <Input
                                  placeholder="Enter your name"
                                  {...field}
                                  className="w-full h-12 md:h-10"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="email"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Email Address *</FormLabel>
                              <FormDescription>
                                We'll send your Uganda travel guide and personalized recommendations to this email
                              </FormDescription>
                              <FormControl>
                                <Input
                                  type="email"
                                  placeholder="your.email@example.com"
                                  {...field}
                                  className="w-full h-12 md:h-10"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      {/* Phone Number */}
                      <FormField
                        control={form.control}
                        name="phone"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Phone Number *</FormLabel>
                            <FormDescription>
                              Include country code for WhatsApp updates about your Uganda adventure
                            </FormDescription>
                            <FormControl>
                              <PhoneInput
                                {...field}
                                placeholder="Enter phone number"
                                className="w-full h-12 md:h-10"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      {/* Country and Africa Experience Row */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="country_of_residence"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Country of Residence</FormLabel>
                              <FormControl>
                                <div ref={countryDropdownRef} className="relative w-full">
                                  <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => setIsCountryDropdownOpen(!isCountryDropdownOpen)}
                                    className={`w-full justify-between h-12 md:h-10 ${field.value ? 'text-gray-900' : 'text-gray-500'}`}
                                  >
                                    {field.value || 'Select your country'}
                                    <svg
                                      className={`w-5 h-5 transition-transform ${isCountryDropdownOpen ? 'transform rotate-180' : ''}`}
                                      fill="none"
                                      stroke="currentColor"
                                      viewBox="0 0 24 24"
                                    >
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                    </svg>
                                  </Button>

                                  {isCountryDropdownOpen && (
                                    <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg" style={{ maxHeight: '300px' }}>
                                      <div className="p-2 border-b border-gray-200 sticky top-0" style={{ backgroundColor: '#e7f8ee' }}>
                                        <Input
                                          type="text"
                                          value={countrySearch}
                                          onChange={(e) => setCountrySearch(e.target.value)}
                                          placeholder="Search your country"
                                          onClick={(e) => e.stopPropagation()}
                                          className="w-full"
                                        />
                                      </div>
                                      <div className="overflow-y-auto" style={{ maxHeight: '240px' }}>
                                        {filteredCountries.length > 0 ? (
                                          filteredCountries.map((country) => (
                                            <Button
                                              key={country}
                                              type="button"
                                              variant="ghost"
                                              onClick={() => {
                                                field.onChange(country);
                                                setIsCountryDropdownOpen(false);
                                                setCountrySearch('');
                                              }}
                                              className={`w-full justify-start ${
                                                field.value === country ? 'bg-green-50 text-green-700 font-medium' : 'text-gray-900'
                                              }`}
                                              style={{ fontSize: '14px' }}
                                            >
                                              {country}
                                            </Button>
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
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="been_to_africa_before"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Have you been to Africa before?</FormLabel>
                              <FormDescription>
                                This helps us tailor recommendations based on your African travel experience
                              </FormDescription>
                              <FormControl>
                                <RadioGroup
                                  onValueChange={(value) => field.onChange(value === 'yes')}
                                  value={field.value ? 'yes' : 'no'}
                                  className="flex gap-6 pt-2"
                                >
                                  <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="yes" id="africa-yes" />
                                    <FormLabel htmlFor="africa-yes" className="font-normal text-sm md:text-base min-h-[44px] flex items-center">Yes</FormLabel>
                                  </div>
                                  <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="no" id="africa-no" />
                                    <FormLabel htmlFor="africa-no" className="font-normal text-sm md:text-base min-h-[44px] flex items-center">No</FormLabel>
                                  </div>
                                </RadioGroup>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      {/* Traveller Type */}
                      {/* Divider after Personal Info to create a short-form illusion */}
                      <div className="my-4 flex items-center" aria-hidden>
                        <div className="flex-1 h-px bg-gray-200" />
                        <div className="mx-3 inline-flex items-center gap-2 text-xs text-gray-600">
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" className="text-green-600">
                            <path d="M20 6L9 17l-5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                          <span className="font-medium text-xs text-gray-700">Personal info complete</span>
                        </div>
                        <div className="flex-1 h-px bg-gray-200" />
                      </div>
                      <FormField
                        control={form.control}
                        name="travel_style"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>What kind of traveller are you? (Select all that apply) *</FormLabel>
                            <FormDescription>
                              Choose up to 3 styles that best match your travel personality
                            </FormDescription>
                            <FormControl>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                {travellerTypes.map((type) => {
                                  const currentValue = field.value || [];
                                  const isSelected = currentValue.includes(type.value as "adventurer" | "cultural_immerser" | "luxe_relaxer" | "off_the_grid" | "mix_of_all");
                                  
                                  return (
                                    <Button
                                      key={type.value}
                                      type="button"
                                      variant="outline"
                                      onClick={() => {
                                        const newValue = isSelected
                                          ? currentValue.filter((value) => value !== type.value)
                                          : [...currentValue, type.value as "adventurer" | "cultural_immerser" | "luxe_relaxer" | "off_the_grid" | "mix_of_all"];
                                        field.onChange(newValue);
                                      }}
                                      className={`justify-start h-12 md:h-10 w-full border-green-300 hover:border-green-400 focus:ring-green-500 focus:border-green-500 ${
                                        isSelected
                                          ? 'border-green-500 bg-green-50 text-green-700'
                                          : 'border-gray-300 hover:border-green-300 hover:bg-gray-50'
                                      }`}
                                    >
                                      <span className="text-xl md:text-2xl mr-3">{type.emoji}</span>
                                      <span className="text-sm md:text-base">{type.label}</span>
                                      {isSelected && (
                                        <svg
                                          className="w-5 h-5 ml-auto"
                                          fill="none"
                                          stroke="currentColor"
                                          viewBox="0 0 24 24"
                                        >
                                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                      )}
                                    </Button>
                                  );
                                })}
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      {/* Hear About Us */}
                      <FormField
                        control={form.control}
                        name="heard_about_us"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>How did you hear about us? (Select one)</FormLabel>
                            <FormDescription>
                              This helps us understand which channels work best for fellow travelers like you
                            </FormDescription>
                            <FormControl>
                              <RadioGroup
                                onValueChange={field.onChange}
                                value={field.value}
                                className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2"
                              >
                                {hearAboutOptions.map((option) => (
                                  <div key={option.value} className="flex items-center space-x-2">
                                    <RadioGroupItem value={option.value} id={`hear-about-${option.value}`} />
                                    <FormLabel htmlFor={`hear-about-${option.value}`} className="flex items-center gap-3 font-normal cursor-pointer p-3 md:p-2 w-full rounded-md hover:bg-gray-50 min-h-[44px] md:min-h-[32px]">
                                      <span className="text-lg md:text-xl">{option.emoji}</span>
                                      <span className="font-medium text-sm md:text-base">{option.label}</span>
                                    </FormLabel>
                                  </div>
                                ))}
                              </RadioGroup>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      {/* Pioneer Traveller */}
                      <FormField
                        control={form.control}
                        name="feature_as_pioneer"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Would you like to be featured as a pioneer traveller?</FormLabel>
                            <FormDescription>
                              Share your Uganda story and inspire others (optional - we respect your privacy)
                            </FormDescription>
                            <FormControl>
                              <RadioGroup
                                onValueChange={field.onChange}
                                value={field.value || ''}
                                className="flex gap-6 pt-2"
                              >
                                <div className="flex items-center space-x-2">
                                  <RadioGroupItem value="yes" id="pioneer-yes" />
                                  <FormLabel htmlFor="pioneer-yes" className="font-normal text-sm md:text-base min-h-[44px] flex items-center">Yes, I'd love to be featured!</FormLabel>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <RadioGroupItem value="maybe_later" id="pioneer-maybe" />
                                  <FormLabel htmlFor="pioneer-maybe" className="font-normal text-sm md:text-base min-h-[44px] flex items-center">Maybe, let me think about it</FormLabel>
                                </div>
                              </RadioGroup>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      {/* Photo Upload */}
                      <FormField
                        control={form.control}
                        name="travel_photo_url"
                        render={() => (
                          <FormItem>
                            <FormLabel>Upload a travel photo (Optional)</FormLabel>
                            <FormDescription>
                              Share your best travel photo to inspire others on their Uganda journey
                            </FormDescription>
                            <FormControl>
                              <div className="space-y-3">
                                <Input
                                  type="file"
                                  accept="image/*"
                                  onChange={handleFileChange}
                                  disabled={uploadState.isUploading}
                                  className="cursor-pointer"
                                />
                                
                                {/* Upload Status */}
                                {uploadState.isUploading && (
                                  <div className="flex items-center gap-2 text-sm text-blue-600">
                                    <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Uploading photo...
                                  </div>
                                )}
                                
                                {/* Upload Error */}
                                {uploadState.error && (
                                  <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded p-2">
                                    {uploadState.error}
                                  </div>
                                )}
                                
                                {/* Upload Success & Preview */}
                                {uploadState.uploadedUrl && (
                                  <div className="space-y-2">
                                    <div className="text-sm text-green-600 font-medium">
                                      ✓ Photo uploaded successfully!
                                    </div>
                                    <img
                                      src={uploadState.uploadedUrl}
                                      alt="Uploaded travel photo"
                                      className="w-32 h-32 object-cover rounded-lg border"
                                    />
                                  </div>
                                )}
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      {/* Submit Button */}
                      <Button
                        type="submit"
                        onClick={handleDebugSubmit}
                        className="w-full h-12 md:h-10 bg-green-600 hover:bg-green-700 text-white border-green-600 hover:border-green-700 text-base md:text-sm font-medium"
        disabled={uploadState.isUploading}
                      >
                        Next Step →
                      </Button>
                    </form>
                  </Form>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Desktop Sidebar - Takes up 1 column on large screens */}
          <div className="hidden lg:block">
            <div className="space-y-6">
              <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
                <CardContent className="p-6">
                  <div className="flex flex-col items-center h-full">
                    <div className="bg-green-600 rounded-full p-3 flex items-center justify-center mb-6">
                      <svg
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        className="text-white"
                      >
                        <path
                          d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h4v10h-10z"
                          fill="currentColor"
                        />
                      </svg>
                    </div>
                    <div className="text-center mb-8 flex-1 flex flex-col justify-start">
                      <p className="text-lg text-gray-700 italic leading-relaxed mb-6">
                        "There is no wrong answer, Uganda has a version of magic for every mood."
                      </p>
                      <div className="space-y-3 text-left">
                        <div className="flex items-center gap-3">
                          <div className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 bg-green-600">
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                              <path d="M20 6L9 17L4 12" stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                          </div>
                          <p className="text-sm text-gray-600">Explore Uganda's vibrant culture and stunning landscapes</p>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 bg-green-600">
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                              <path d="M20 6L9 17L4 12" stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                          </div>
                          <p className="text-sm text-gray-600">Experience the Pearl of Africa like never before!</p>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 bg-green-600">
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                              <path d="M20 6L9 17L4 12" stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                          </div>
                          <p className="text-sm text-gray-600">Are You Ready to meet the Mountain Gorillas?</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

        {/* Mobile-friendly Quote Section - Only visible on mobile */}
        <div className="lg:hidden mt-8">
          <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
            <CardContent className="p-6 text-center">
              <div className="bg-green-600 rounded-full p-3 flex items-center justify-center mb-4 mx-auto w-fit">
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  className="text-white"
                >
                  <path
                    d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h4v10h-10z"
                    fill="currentColor"
                  />
                </svg>
              </div>
              <p className="text-base text-gray-700 italic leading-relaxed mb-4">
                "There is no wrong answer, Uganda has a version of magic for every mood."
              </p>
              <div className="space-y-2 text-left">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0 bg-green-600">
                    <svg width="8" height="8" viewBox="0 0 24 24" fill="none">
                      <path d="M20 6L9 17L4 12" stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  <p className="text-xs text-gray-600">Explore Uganda's vibrant culture</p>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0 bg-green-600">
                    <svg width="8" height="8" viewBox="0 0 24 24" fill="none">
                      <path d="M20 6L9 17L4 12" stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  <p className="text-xs text-gray-600">Experience the Pearl of Africa</p>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0 bg-green-600">
                    <svg width="8" height="8" viewBox="0 0 24 24" fill="none">
                      <path d="M20 6L9 17L4 12" stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  <p className="text-xs text-gray-600">Meet the Mountain Gorillas</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
