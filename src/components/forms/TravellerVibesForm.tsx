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
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  RadioGroup,
  RadioGroupItem,
} from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";

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

  const form = useForm<TravellerVibesFormData>({
    resolver: zodResolver(travellerVibesSchema),
    mode: 'onChange', // Enable real-time validation
    defaultValues: {
      name: initialData.name || '',
      email: initialData.email || '',
      phone: initialData.phone || '',
      country: initialData.country || '',
      beenToAfrica: initialData.beenToAfrica || '',
      travellerType: initialData.travellerType || [],
      hearAbout: initialData.hearAbout || '',
      pioneeerTraveller: initialData.pioneeerTraveller || '',
      photo: initialData.photo || '',
    },
  });

  // Real-time validation monitoring
  // Console logging removed for production - validation works automatically
  React.useEffect(() => {
    // Form validation is handled automatically by React Hook Form
    // No need for console logs in production
  }, [form.formState.isValid]);

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
        form.setValue('photo', uploadedUrl);
        
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
    <div className="grid md:grid-cols-3 gap-6 px-4 md:px-0">
      {/* Main Form Container */}
      <div className="md:col-span-2">
        <Card className="max-w-2xl md:max-w-none">
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
            <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-green-500 to-emerald-600 transition-all duration-300"
                style={{ width: `${(currentStep / totalSteps) * 100}%` }}
              />
            </div>
            <CardTitle className="text-2xl">Traveller Vibes</CardTitle>
            <CardDescription>
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
                        <FormControl>
                          <Input
                            placeholder="Enter your name"
                            {...field}
                            className="max-w-[270px]"
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
                        <FormControl>
                          <Input
                            type="email"
                            placeholder="your.email@example.com"
                            {...field}
                            className="max-w-[270px]"
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
                      <FormControl>
                        <PhoneInput
                          {...field}
                          placeholder="Enter phone number"
                          className="w-3/4"
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
                    name="country"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Country of Residence</FormLabel>
                        <FormControl>
                          <div ref={countryDropdownRef} className="relative" style={{ maxWidth: '270px' }}>
                            <Button
                              type="button"
                              variant="outline"
                              onClick={() => setIsCountryDropdownOpen(!isCountryDropdownOpen)}
                              className={`w-full justify-between ${field.value ? 'text-gray-900' : 'text-gray-500'}`}
                              style={{ height: '40px' }}
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
                    name="beenToAfrica"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Have you been to Africa before?</FormLabel>
                        <FormControl>
                          <RadioGroup
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                            className="flex gap-6 pt-2"
                          >
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="yes" id="africa-yes" />
                              <FormLabel htmlFor="africa-yes" className="font-normal">Yes</FormLabel>
                            </div>
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="no" id="africa-no" />
                              <FormLabel htmlFor="africa-no" className="font-normal">No</FormLabel>
                            </div>
                          </RadioGroup>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Traveller Type */}
                <FormField
                  control={form.control}
                  name="travellerType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>What kind of traveller are you? (Select all that apply) *</FormLabel>
                      <FormControl>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {travellerTypes.map((type) => {
                            const currentValue = field.value || [];
                            const isSelected = currentValue.includes(type.value);
                            
                            return (
                              <Button
                                key={type.value}
                                type="button"
                                variant="outline"
                                onClick={() => {
                                  const newValue = isSelected
                                    ? currentValue.filter((value) => value !== type.value)
                                    : [...currentValue, type.value];
                                  field.onChange(newValue);
                                }}
                                className={`justify-start h-10 max-w-[270px] border-green-300 hover:border-green-400 focus:ring-green-500 focus:border-green-500 ${
                                  isSelected
                                    ? 'border-green-500 bg-green-50 text-green-700'
                                    : 'border-gray-300 hover:border-green-300 hover:bg-gray-50'
                                }`}
                              >
                                <span className="text-2xl mr-3">{type.emoji}</span>
                                {type.label}
                                {isSelected && (
                                  <svg
                                    className="w-4 h-4 ml-auto"
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
                  name="hearAbout"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>How did you hear about us? (Select one)</FormLabel>
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          value={field.value}
                          className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2"
                        >
                          {hearAboutOptions.map((option) => (
                            <div key={option.value} className="flex items-center space-x-2">
                              <RadioGroupItem value={option.value} id={`hear-about-${option.value}`} />
                              <FormLabel htmlFor={`hear-about-${option.value}`} className="flex items-center gap-3 font-normal cursor-pointer p-2 rounded-md hover:bg-gray-50">
                                <span className="text-xl">{option.emoji}</span>
                                <span className="font-medium">{option.label}</span>
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
                  name="pioneeerTraveller"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Would you like to be featured as a pioneer traveller?</FormLabel>
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          value={field.value || ''}
                          className="flex gap-6 pt-2"
                        >
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="yes" id="pioneer-yes" />
                            <FormLabel htmlFor="pioneer-yes" className="font-normal">Yes, I'd love to be featured!</FormLabel>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="maybe" id="pioneer-maybe" />
                            <FormLabel htmlFor="pioneer-maybe" className="font-normal">Maybe, let me think about it</FormLabel>
                          </div>
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Submit Button */}
                <Button
                  type="submit"
                  className="w-full bg-green-600 hover:bg-green-700 text-white border-green-600 hover:border-green-700"
                  disabled={!form.formState.isValid}
                >
                  Next Step →
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>

      {/* Quote Container */}
      <div className="md:col-span-1 flex justify-center">
        <Card className="sticky top-8 hidden md:block max-w-sm">
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
                      <svg
                        width="12"
                        height="12"
                        viewBox="0 0 24 24"
                        fill="none"
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
                    <p className="text-sm text-gray-600">Explore Uganda's vibrant culture and stunning landscapes</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 bg-green-600">
                      <svg
                        width="12"
                        height="12"
                        viewBox="0 0 24 24"
                        fill="none"
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
                    <p className="text-sm text-gray-600">Experience the Pearl of Africa like never before!</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 bg-green-600">
                      <svg
                        width="12"
                        height="12"
                        viewBox="0 0 24 24"
                        fill="none"
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
                    <p className="text-sm text-gray-600">Are You Ready to meet the Mountain Gorillas?</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};