"use client"

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { dreamTripSchema, DreamTripFormData } from "@/types/rhf";

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
import { FormDatePicker } from "@/components/ui/date-picker";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface DreamTripFormProps {
  onNext: (data: any) => void;
  onBack: () => void;
  initialData: any;
  currentStep?: number;
  totalSteps?: number;
  onClose?: () => void;
}

export const DreamTripForm: React.FC<DreamTripFormProps> = ({
  onNext,
  onBack,
  initialData,
  currentStep = 2,
  totalSteps = 3,
  onClose
}) => {
  const [currentIndex, setCurrentIndex] = React.useState(0);
  const carouselRef = React.useRef<HTMLDivElement>(null);

  const form = useForm<DreamTripFormData>({
    resolver: zodResolver(dreamTripSchema),
    mode: 'onChange', // Real-time validation for better UX
    defaultValues: {
      preferred_start_date: initialData.preferred_start_date || initialData.startDate || '',
      preferred_end_date: initialData.preferred_end_date || initialData.endDate || '',
      must_have_experiences: Array.isArray(initialData.must_have_experiences || initialData.experiences)
        ? (initialData.must_have_experiences || initialData.experiences).filter((exp: string) =>
            ['gorilla_trekking', 'community_weaving', 'lakeside_luxe', 'food_nightlife', 'spiritual_cultural', 'safari_conservation', 'nile_adventure', 'homestays_villages', 'birdlife_explorations'].includes(exp as any)
          ).slice(0, 3) as ("gorilla_trekking" | "community_weaving" | "lakeside_luxe" | "food_nightlife" | "spiritual_cultural" | "safari_conservation" | "nile_adventure" | "homestays_villages" | "birdlife_explorations")[]
        : [],
      group_type: (['solo', 'couple', 'group'].includes(initialData.group_type || initialData.companion)
        ? (initialData.group_type || initialData.companion)
        : 'solo') as "solo" | "couple" | "group",
      group_size: parseInt(initialData.group_size || initialData.companionCount || '1') || 1, // Default to 1 for solo
      dream_escape_words: initialData.dream_escape_words || initialData.dreamWords || '',
    },
  });

  // Convert string dates to Date objects for FormDatePicker and back to strings for form submission
  const getDateFromString = (dateString: string) => {
    if (!dateString) return undefined;
    // Ensure we create a date at midnight to avoid timezone issues
    const date = new Date(dateString + 'T00:00:00');
    return isNaN(date.getTime()) ? undefined : date;
  };

  const getStringFromDate = (date: Date | undefined) => {
    if (!date) return '';
    // Format as YYYY-MM-DD
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const selectedExperiences = form.watch('must_have_experiences') || [];

  // Calculate minimum date (20 days from today)
  const getMinDate = () => {
    const today = new Date();
    const minDate = new Date(today);
    minDate.setDate(today.getDate() + 20);
    return minDate;
  };
  
  // Calculate minimum end date (day after start date or 20 days from today, whichever is later)
  const getMinEndDate = () => {
    const startDateString = form.getValues('preferred_start_date');
    if (startDateString) {
      const startDate = getDateFromString(startDateString);
      if (startDate) {
        const minEndDate = new Date(startDate);
        minEndDate.setDate(startDate.getDate() + 1); // Day after start date
        return minEndDate;
      }
    }
    return getMinDate(); // Default to 20 days from today
  };
  
  const getMinDateString = () => {
    const minDate = getMinDate();
    const year = minDate.getFullYear();
    const month = String(minDate.getMonth() + 1).padStart(2, '0');
    const day = String(minDate.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const formatDateRange = () => {
    const startDate = form.getValues('preferred_start_date');
    const endDate = form.getValues('preferred_end_date');
    
    if (!startDate) return '';
    
    const start = getDateFromString(startDate);
    if (!start) return '';
    
    if (!endDate) {
      return start.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    }

    const end = getDateFromString(endDate);
    if (!end) return '';

    return `${start.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${end.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`;
  };

  const experiences: Array<{
    value: "gorilla_trekking" | "community_weaving" | "lakeside_luxe" | "food_nightlife" | "spiritual_cultural" | "safari_conservation" | "nile_adventure" | "homestays_villages" | "birdlife_explorations";
    label: string;
    emoji: string;
    description: string;
  }> = [
    { 
      value: 'gorilla_trekking', 
      label: 'Wildlife, Safari & Forest Expeditions', 
      emoji: '🦍', 
      description: "Track gorillas through misty jungles, spot lions and elephants at sunrise, and unwind in eco-lodges deep in Uganda's ancient wilderness."
    },
    { 
      value: 'homestays_villages', 
      label: 'Culture, Villages & Local Living', 
      emoji: '🏡', 
      description: "Cook with grandmothers, learn ancestral weaving, and share fireside stories in villages where culture, kindness, and heritage thrive."
    },
    { 
      value: 'nile_adventure', 
      label: 'Nile Adventures & Island Escapes ', 
      emoji: '🛶', 
      description: "Follow the Nile to its source — raft raging rapids, kayak past lush shores, then drift to serene islands and lakeside glampsites kissed by sunset."
    },
    { 
      value: 'food_nightlife', 
      label: 'Flavours, Coffee & Night Life', 
      emoji: '🍛', 
      description: "Taste Uganda's creative spirit — from street food and skyline cocktails to highland coffee farms and artisan markets buzzing with life."
    },
    { 
      value: 'safari_conservation', 
      label: 'Safari & Conservation Trails', 
      emoji: '🦓', 
      description: "Walk alongside rangers and conservationists, witness endangered species in protected habitats, and contribute to wildlife preservation that safeguards Africa's future."
    },
    { 
      value: 'spiritual_cultural', 
      label: 'Wellness, Rhythm & Renewal', 
      emoji: '🕯️', 
      description: "Breathe in the hills, stretch with sunrise yoga, dance barefoot at drum circles, and find peace where joy and nature flow as one."
    },
    { 
      value: 'community_weaving', 
      label: 'Local Artisan Markets & Weaving', 
      emoji: '🧵', 
      description: "Discover vibrant markets where skilled artisans craft baskets, textiles, and jewelry — each piece woven with tradition, passion, and centuries-old technique."
    },
    { 
      value: 'birdlife_explorations', 
      label: 'Birdlife Explorations', 
      emoji: '🐦', 
      description: "Journey through wetlands and forests teeming with over 1,000 bird species — from the rare Shoebill to colorful sunbirds painting the canopy with song."
    },
    { 
      value: 'lakeside_luxe', 
      label: 'Luxe Horizons & Hidden Retreats ', 
      emoji: '🏖️', 
      description: "Soar over savannas and islands to private lodges and spas. Every stay blends first-class comfort with wild landscapes and quiet indulgence."
    },
  ];

  const companionOptions = [
    { value: 'solo' as const, label: 'Solo', subtitle: 'Just me', emoji: '👤' },
    { value: 'couple' as const, label: 'Couple', subtitle: 'Two travelers', emoji: '👫' },
    { value: 'group' as const, label: 'Group', subtitle: 'Friends & family', emoji: '👨‍👩‍👧‍👦' },
  ];

  // Calculate responsive card width
  const getCardWidth = () => {
    const screenWidth = window.innerWidth;
    if (screenWidth < 640) return 240; // Mobile: 240px (smaller)
    if (screenWidth < 1024) return 320; // Tablet: 320px
    return 360; // Desktop: 360px
  };

  // Handle scroll to update current index
  React.useEffect(() => {
    const handleScroll = () => {
      if (carouselRef.current) {
        const scrollLeft = carouselRef.current.scrollLeft;
        const cardWidth = getCardWidth();
        const newIndex = Math.round(scrollLeft / cardWidth);
        setCurrentIndex(Math.max(0, Math.min(newIndex, experiences.length - 1)));
      }
    };

    const carousel = carouselRef.current;
    if (carousel) {
      carousel.addEventListener('scroll', handleScroll, { passive: true });
      return () => carousel.removeEventListener('scroll', handleScroll);
    }
  }, [experiences.length]);

  const handleExperienceToggle = (experience: "gorilla_trekking" | "community_weaving" | "lakeside_luxe" | "food_nightlife" | "spiritual_cultural" | "safari_conservation" | "nile_adventure" | "homestays_villages" | "birdlife_explorations") => {
    const current = selectedExperiences;
    const newExperiences = current.includes(experience)
      ? current.filter((e) => e !== experience)
      : current.length < 3
      ? [...current, experience]
      : current;
    
    form.setValue('must_have_experiences', newExperiences);
  };

  // Form validation monitoring (matching TravellerVibesForm pattern)
  React.useEffect(() => {
    // Monitor form validation state for debugging
    console.log('🔍 DreamTripForm validation state:', {
      isValid: form.formState.isValid,
      errors: form.formState.errors,
      touchedFields: form.formState.touchedFields,
      dirtyFields: form.formState.dirtyFields,
      values: form.getValues(),
      groupType: form.getValues('group_type'),
      groupSize: form.getValues('group_size')
    });
  }, [form.formState.isValid, form.formState.errors, form.formState.touchedFields]);

  function onSubmit(data: DreamTripFormData) {
    // Debug logging for form submission
    console.log('🚀 DreamTripForm onSubmit called with data:', data);
    console.log('Form is valid:', form.formState.isValid);
    console.log('Form errors:', form.formState.errors);
    
    // Ensure we have all required data before proceeding
    if (!data.preferred_start_date || !data.preferred_end_date || !data.must_have_experiences?.length) {
      console.log('❌ Missing required fields');
      return;
    }
    
    console.log('✅ Form validation passed, proceeding to next step');
    // Form submission handled automatically - matches TravellerVibesForm pattern
    onNext(data);
  }

  return (
    <div className="w-full">
      {/* Main Container - Responsive grid layout matching TravellerVibesForm */}
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
                  <CardTitle className="text-xl md:text-2xl">Now, let us build your perfect Ugandan escape.</CardTitle>
                  <CardDescription className="text-sm md:text-base">
                    Customize your dream adventure with the experiences and companions that matter most to you.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                      {/* Date Range Selection */}
                      <div>
                        <p className="text-sm font-medium">When are you planning to travel? *</p>
                        <p className="text-sm text-gray-600 mb-3">
                          Select your preferred travel dates - we'll suggest the best times to visit Uganda based on weather and wildlife patterns
                        </p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                          <FormField
                            control={form.control}
                            name="preferred_start_date"
                            render={({ field }) => {
                              // Convert string to Date for the date picker
                              const dateValue = getDateFromString(field.value);
                              
                              return (
                                <FormItem>
                                  <FormLabel className="text-xs">Start Date</FormLabel>
                                  <FormDescription className="text-xs">
                                    Must be at least 20 days from today
                                  </FormDescription>
                                  <FormControl>
                                    <FormDatePicker
                                      field={{
                                        ...field,
                                        value: dateValue,
                                        onChange: (date) => {
                                          // Convert Date back to string for form submission
                                          field.onChange(getStringFromDate(date));
                                        }
                                      }}
                                      placeholder="Select start date"
                                      minDate={getMinDate()}
                                      className="w-full"
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              );
                            }}
                          />

                          <FormField
                            control={form.control}
                            name="preferred_end_date"
                            render={({ field }) => {
                              // Convert string to Date for the date picker
                              const dateValue = getDateFromString(field.value);
                              
                              return (
                                <FormItem>
                                  <FormLabel className="text-xs">End Date</FormLabel>
                                  <FormDescription className="text-xs">
                                    End date must be after start date
                                  </FormDescription>
                                  <FormControl>
                                    <FormDatePicker
                                      field={{
                                        ...field,
                                        value: dateValue,
                                        onChange: (date) => {
                                          // Convert Date back to string for form submission
                                          field.onChange(getStringFromDate(date));
                                        }
                                      }}
                                      placeholder="Select end date"
                                      minDate={getMinEndDate()}
                                      className="w-full"
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              );
                            }}
                          />
                        </div>

                        {/* Date Range Display */}
                        {form.getValues('preferred_start_date') && form.getValues('preferred_end_date') && (
                          <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                            <p className="font-medium text-green-800 text-center text-sm">
                              🗓️ Your trip: {formatDateRange()}
                            </p>
                          </div>
                        )}

                        <p className="text-gray-600 text-xs mt-2">
                          💡 Select your preferred start and end dates for the Uganda adventure
                        </p>
                      </div>

                      {/* Dream Experiences */}
                      <FormField
                        control={form.control}
                        name="must_have_experiences"
                        render={() => (
                          <FormItem>
                            <div className="flex items-center justify-between mb-3">
                              <FormLabel>Select Your Top 3 Dream Experiences (Choose exactly 3) </FormLabel>
                              <span className={`font-semibold text-sm ${selectedExperiences.length === 3 ? 'text-green-600' : 'text-orange-600'}`}>
                                {selectedExperiences.length}/3 selected {selectedExperiences.length === 3 ? '✓' : '(required)'}
                              </span>
                            </div>
                            <FormDescription>
                              Browse the experiences below and select exactly 3 that excite you most. Each experience includes detailed descriptions to help you choose.
                            </FormDescription>
                            <FormControl>
                              {/* Swipeable Carousel */}
                              <div className="relative">
                                {/* Carousel Container */}
                                <div
                                  ref={carouselRef}
                                  className="flex overflow-x-auto scrollbar-hide snap-x snap-mandatory gap-3 md:gap-4 pb-4 px-1"
                                  style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                                >
                                  {experiences.map((exp, index) => {
                                    const isSelected = selectedExperiences.includes(exp.value);
                                    const canSelect = selectedExperiences.length < 3 || isSelected;

                                    return (
                                      <div
                                        key={exp.value}
                                        className="flex-none snap-start"
                                        style={{ width: `${getCardWidth()}px` }}
                                      >
                                        {/* Experience Card */}
                                        <div
                                          className={`h-[320px] md:h-[400px] p-3 md:p-5 rounded-xl border-2 cursor-pointer transition-all duration-300 transform hover:scale-[1.02] ${
                                            isSelected
                                              ? 'border-green-500 bg-gradient-to-br from-green-50 to-emerald-50 shadow-lg'
                                              : canSelect
                                              ? 'border-gray-200 hover:border-green-300 hover:shadow-md'
                                              : 'border-gray-200 opacity-60 cursor-not-allowed'
                                          }`}
                                          onClick={() => {
                                            if (canSelect) {
                                              handleExperienceToggle(exp.value);
                                            }
                                          }}
                                        >
                                          {/* Card Header */}
                                          <div className="text-center mb-3 md:mb-4">
                                            <div className="text-3xl md:text-4xl mb-2 md:mb-3">{exp.emoji}</div>
                                            <h4 className={`font-bold text-base md:text-lg leading-tight ${
                                              isSelected ? 'text-green-700' : 'text-gray-900'
                                            }`}>
                                              {exp.label}
                                            </h4>
                                          </div>
                                          
                                          {/* Card Content */}
                                          <div className="flex-1 flex flex-col justify-between">
                                            <p className="text-gray-600 text-xs md:text-sm leading-relaxed mb-3 md:mb-4">
                                              {exp.description}
                                            </p>
                                            
                                            {/* Tap to Select Hint */}
                                            {!isSelected && (
                                              <div className="text-center mb-2">
                                                <span className="text-xs text-green-600 font-medium">
                                                  📱 Tap to select
                                                </span>
                                              </div>
                                            )}
                                            
                                            {/* Selection Indicator */}
                                            <div className="flex items-center justify-between mt-auto">
                                              <div className="text-xs text-gray-500">
                                                {index + 1} of {experiences.length}
                                              </div>
                                              
                                              {isSelected && (
                                                <div className="w-6 h-6 md:w-8 md:h-8 bg-green-500 rounded-full flex items-center justify-center">
                                                  <svg
                                                    width="12"
                                                    height="12"
                                                    viewBox="0 0 24 24"
                                                    fill="none"
                                                    className="text-white"
                                                  >
                                                    <path
                                                      d="M20 6L9 17L4 12"
                                                      stroke="currentColor"
                                                      strokeWidth="2"
                                                      strokeLinecap="round"
                                                      strokeLinejoin="round"
                                                    />
                                                  </svg>
                                                </div>
                                              )}
                                              
                                              {!isSelected && !canSelect && (
                                                <div className="text-xs text-gray-400">Max selected</div>
                                              )}
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    );
                                  })}
                                </div>
                                
                                {/* Navigation Dots */}
                                <div className="flex justify-center gap-2 mt-4">
                                  {experiences.map((_, index) => (
                                    <button
                                      key={index}
                                      onClick={() => {
                                        setCurrentIndex(index);
                                        carouselRef.current?.scrollTo({
                                          left: index * getCardWidth(),
                                          behavior: 'smooth'
                                        });
                                      }}
                                      className={`w-2 h-2 rounded-full transition-all duration-200 ${
                                        index === currentIndex
                                          ? 'bg-green-500 w-6'
                                          : 'bg-gray-300 hover:bg-gray-400'
                                      }`}
                                    />
                                  ))}
                                </div>
                                
                                {/* Navigation Arrows */}
                                <div className="flex justify-between items-center mt-4">
                                  <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={() => {
                                      const newIndex = Math.max(0, currentIndex - 1);
                                      setCurrentIndex(newIndex);
                                      carouselRef.current?.scrollTo({
                                        left: newIndex * getCardWidth(),
                                        behavior: 'smooth'
                                      });
                                    }}
                                    disabled={currentIndex === 0}
                                    className="border-green-300 hover:border-green-400 text-xs md:text-sm"
                                  >
                                    ← Previous
                                  </Button>
                                  
                                  <div className="text-sm text-gray-600 font-medium">
                                    {selectedExperiences.length}/3 selected
                                  </div>
                                  
                                  <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={() => {
                                      const newIndex = Math.min(experiences.length - 1, currentIndex + 1);
                                      setCurrentIndex(newIndex);
                                      carouselRef.current?.scrollTo({
                                        left: newIndex * getCardWidth(),
                                        behavior: 'smooth'
                                      });
                                    }}
                                    disabled={currentIndex === experiences.length - 1}
                                    className="border-green-300 hover:border-green-400 text-xs md:text-sm"
                                  >
                                    Next →
                                  </Button>
                                </div>
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      {/* Companion Selection */}
                      <div className="space-y-4">
                        <FormField
                          control={form.control}
                          name="group_type"
                          render={({ field }) => (
                            <FormItem>
                              <div>
                                <FormLabel>Who's coming with you?</FormLabel>
                                <FormDescription>
                                  Let us know your group type so we can recommend the best accommodations and activities
                                </FormDescription>
                              </div>
                              <FormControl>
                                <div className="grid grid-cols-3 gap-2">
                                  {companionOptions.map((option) => (
                                    <Button
                                      key={option.value}
                                      type="button"
                                      variant="outline"
                                      onClick={() => {
                                        field.onChange(option.value);
                                        // Clear group size when switching away from group
                                        if (option.value === 'solo') {
                                          form.setValue('group_size', 1);
                                        } else if (option.value === 'couple') {
                                          form.setValue('group_size', 2);
                                        } else {
                                          form.setValue('group_size', 3);
                                        }
                                        // Trigger validation immediately after group type change
                                        form.trigger(['group_type', 'group_size']);
                                      }}
                                      className={`flex flex-col items-center justify-center p-3 md:p-2 h-20 md:h-24 w-full border-green-300 hover:border-green-400 focus:ring-green-500 focus:border-green-500 ${
                                        field.value === option.value
                                          ? 'border-green-500 bg-green-50 text-green-700'
                                          : 'border-gray-300 hover:border-green-300 hover:bg-gray-50'
                                      }`}
                                    >
                                      <span className="text-lg md:text-xl mb-1">{option.emoji}</span>
                                      <div className="text-center">
                                        <span className="block font-medium text-sm md:text-xs">{option.label}</span>
                                        <span className="text-gray-500 text-xs">{option.subtitle}</span>
                                      </div>
                                    </Button>
                                  ))}
                                </div>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        {/* Group Size Input - Only shown when group is selected */}
                        {form.watch('group_type') === 'group' && (
                          <FormField
                            control={form.control}
                            name="group_size"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>How many people in your group?</FormLabel>
                                <FormDescription>
                                  For group bookings, we can accommodate 3 to 50 people
                                </FormDescription>
                                <FormControl>
                                  <Input
                                    type="number"
                                    min="3"
                                    max="50"
                                    step="1"
                                    value={field.value || ''}
                                    onChange={(e) => {
                                      const value = e.target.value;
                                      if (value === '') {
                                        field.onChange('');
                                      } else {
                                        field.onChange(parseInt(value) || '');
                                      }
                                    }}
                                    placeholder="Enter number of people"
                                    className="w-full h-12 md:h-10"
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        )}
                      </div>

                      {/* Dream Description */}
                      <FormField
                        control={form.control}
                        name="dream_escape_words"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Describe your dream Ugandan escape in three words (Optional)</FormLabel>
                            <FormDescription>
                              💭 Don't overthink it – let your heart speak. This helps us understand your travel vision.
                            </FormDescription>
                            <FormControl>
                              <Input
                                {...field}
                                placeholder="e.g., Adventure, Connection, Discovery"
                                className="w-full h-12 md:h-10"
                                maxLength={100}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      {/* Navigation Buttons */}
                      <div className="flex flex-col md:flex-row justify-between gap-3 md:gap-0 pt-4">
                        <div className="space-y-2">
                          <Button
                            type="button"
                            variant="outline"
                            onClick={onBack}
                            className="h-12 md:h-10 w-32 border-green-300 hover:border-green-400 focus:ring-green-500 focus:border-green-500 text-sm md:text-xs"
                          >
                            ← Previous
                          </Button>
                          {/* Debug validation status */}
                          {process.env.NODE_ENV === 'development' && (
                            <div className="text-xs text-gray-500">
                              Valid: {form.formState.isValid ? '✅' : '❌'} |
                              Experiences: {selectedExperiences.length}/3 |
                              Start: {form.getValues('preferred_start_date') ? '✅' : '❌'} |
                              End: {form.getValues('preferred_end_date') ? '✅' : '❌'}
                            </div>
                          )}
                        </div>
                        <Button
                          type="submit"
                          disabled={!form.formState.isValid || selectedExperiences.length < 3}
                          className="h-12 md:h-10 w-32 bg-green-600 hover:bg-green-700 text-white border-green-600 hover:border-green-700 text-sm md:text-xs font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          Next Step →
                        </Button>
                      </div>
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
                        "It's like Uganda handpicked me back."
                      </p>
                      <div className="space-y-3 text-left">
                        <div className="flex items-center gap-3">
                          <div className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 bg-green-600">
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                              <path d="M20 6L9 17L4 12" stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                          </div>
                          <p className="text-sm text-gray-600">Build your perfect Ugandan adventure</p>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 bg-green-600">
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                              <path d="M20 6L9 17L4 12" stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                          </div>
                          <p className="text-sm text-gray-600">Choose from 9 unique experiences</p>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 bg-green-600">
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                              <path d="M20 6L9 17L4 12" stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                          </div>
                          <p className="text-sm text-gray-600">Perfect for solo, couple, or group travel</p>
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
                "It's like Uganda handpicked me back."
              </p>
              <div className="space-y-2 text-left">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0 bg-green-600">
                    <svg width="8" height="8" viewBox="0 0 24 24" fill="none">
                      <path d="M20 6L9 17L4 12" stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  <p className="text-xs text-gray-600">Build your perfect adventure</p>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0 bg-green-600">
                    <svg width="8" height="8" viewBox="0 0 24 24" fill="none">
                      <path d="M20 6L9 17L4 12" stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  <p className="text-xs text-gray-600">Choose from 9 unique experiences</p>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0 bg-green-600">
                    <svg width="8" height="8" viewBox="0 0 24 24" fill="none">
                      <path d="M20 6L9 17L4 12" stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  <p className="text-xs text-gray-600">Perfect for any group size</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
