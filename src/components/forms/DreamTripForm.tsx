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
    defaultValues: {
      startDate: initialData.startDate || '',
      endDate: initialData.endDate || '',
      experiences: initialData.experiences || [],
      companion: initialData.companion || '',
      companionCount: initialData.companionCount || '',
      dreamWords: initialData.dreamWords || '',
    },
  });

  const selectedExperiences = form.watch('experiences') || [];

  // Calculate minimum date (20 days from today)
  const getMinDate = () => {
    const today = new Date();
    const minDate = new Date(today);
    minDate.setDate(today.getDate() + 20);
    return minDate.toISOString().split('T')[0];
  };

  const formatDateRange = () => {
    if (!form.getValues('startDate')) return '';
    if (!form.getValues('endDate')) {
      return new Date(form.getValues('startDate')).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    }

    const start = new Date(form.getValues('startDate'));
    const end = new Date(form.getValues('endDate'));

    return `${start.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${end.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`;
  };

  const experiences = [
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
    { value: 'solo', label: 'Solo', subtitle: 'Just me', emoji: '👤' },
    { value: 'couple', label: 'Couple', subtitle: 'Two travelers', emoji: '👫' },
    { value: 'friends', label: 'Friends', subtitle: 'Specify number', emoji: '👥' },
    { value: 'family', label: 'Family', subtitle: 'Specify number', emoji: '👩‍👧‍👦' },
  ];

  // Handle scroll to update current index
  React.useEffect(() => {
    const handleScroll = () => {
      if (carouselRef.current) {
        const scrollLeft = carouselRef.current.scrollLeft;
        const cardWidth = window.innerWidth < 768 ? 280 : 320;
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

  const handleExperienceToggle = (experience: string) => {
    const current = selectedExperiences;
    const newExperiences = current.includes(experience)
      ? current.filter((e: string) => e !== experience)
      : current.length < 3
      ? [...current, experience]
      : current;
    
    form.setValue('experiences', newExperiences);
  };

  function onSubmit(data: DreamTripFormData) {
    onNext(data);
  }

  return (
    <div className="w-full px-4 md:px-0">
      {/* Main Form Container - Full width on mobile, 2/3 on desktop */}
      <div className="w-full max-w-4xl mx-auto">
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
                      name="startDate"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-xs">Start Date</FormLabel>
                          <FormDescription className="text-xs">
                            Must be at least 20 days from today
                          </FormDescription>
                          <FormControl>
                            <Input
                              type="date"
                              {...field}
                              min={getMinDate()}
                              className="w-full h-12 md:h-10"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="endDate"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-xs">End Date</FormLabel>
                          <FormDescription className="text-xs">
                            End date must be after start date
                          </FormDescription>
                          <FormControl>
                            <Input
                              type="date"
                              {...field}
                              min={form.getValues('startDate') || getMinDate()}
                              className="w-full h-12 md:h-10"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* Date Range Display */}
                  {form.getValues('startDate') && form.getValues('endDate') && (
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
                  name="experiences"
                  render={() => (
                    <FormItem>
                      <div className="flex items-center justify-between mb-3">
                        <FormLabel>Select Your Top 3 Dream Experiences (Choose exactly 3)</FormLabel>
                        <span className="text-green-600 font-semibold text-sm">
                          {selectedExperiences.length}/3 selected
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
                            className="flex overflow-x-auto scrollbar-hide snap-x snap-mandatory gap-4 pb-4"
                            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                          >
                            {experiences.map((exp, index) => {
                              const isSelected = selectedExperiences.includes(exp.value);
                              const canSelect = selectedExperiences.length < 3 || isSelected;

                              return (
                                <div
                                  key={exp.value}
                                  className="flex-none w-[280px] md:w-[320px] snap-start"
                                >
                                  {/* Experience Card */}
                                  <div
                                    className={`h-[400px] p-5 rounded-xl border-2 cursor-pointer transition-all duration-300 transform hover:scale-[1.02] ${
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
                                    <div className="text-center mb-4">
                                      <div className="text-4xl mb-3">{exp.emoji}</div>
                                      <h4 className={`font-bold text-lg leading-tight ${
                                        isSelected ? 'text-green-700' : 'text-gray-900'
                                      }`}>
                                        {exp.label}
                                      </h4>
                                    </div>
                                    
                                    {/* Card Content */}
                                    <div className="flex-1 flex flex-col justify-between">
                                      <p className="text-gray-600 text-sm leading-relaxed mb-4">
                                        {exp.description}
                                      </p>
                                      
                                      {/* Selection Indicator */}
                                      <div className="flex items-center justify-between mt-auto">
                                        <div className="text-xs text-gray-500">
                                          {index + 1} of {experiences.length}
                                        </div>
                                        
                                        {isSelected && (
                                          <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                                            <svg
                                              width="16"
                                              height="16"
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
                                    left: index * (window.innerWidth < 768 ? 280 : 320),
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
                                  left: newIndex * (window.innerWidth < 768 ? 280 : 320),
                                  behavior: 'smooth'
                                });
                              }}
                              disabled={currentIndex === 0}
                              className="border-green-300 hover:border-green-400"
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
                                  left: newIndex * (window.innerWidth < 768 ? 280 : 320),
                                  behavior: 'smooth'
                                });
                              }}
                              disabled={currentIndex === experiences.length - 1}
                              className="border-green-300 hover:border-green-400"
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
                <div>
                  <FormField
                    control={form.control}
                    name="companion"
                    render={({ field }) => (
                      <FormItem>
                        <div>
                          <FormLabel>Who's coming with you?</FormLabel>
                          <FormDescription>
                            Let us know your group size so we can recommend the best accommodations and activities
                          </FormDescription>
                        </div>
                        <FormControl>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                            {companionOptions.map((option) => (
                              <div key={option.value} className="flex flex-col items-center">
                                <Button
                                  type="button"
                                  variant="outline"
                                  onClick={() => field.onChange(option.value)}
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
                                
                                {/* Number Input for Friends or Family */}
                                {field.value === option.value && (option.value === 'friends' || option.value === 'family') && (
                                  <FormField
                                    control={form.control}
                                    name="companionCount"
                                    render={({ field: countField }) => (
                                      <div className="mt-3 md:mt-2 w-full">
                                        <Input
                                          type="number"
                                          min="2"
                                          max="20"
                                          step="1"
                                          {...countField}
                                          placeholder="Number"
                                          className="h-10 md:h-8 text-sm md:text-xs text-center"
                                        />
                                        <div className="text-xs text-gray-500 text-center mt-1">
                                          Minimum 2 people
                                        </div>
                                      </div>
                                    )}
                                  />
                                )}
                              </div>
                            ))}
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Dream Description */}
                <FormField
                  control={form.control}
                  name="dreamWords"
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
                  <Button
                    type="button"
                    variant="outline"
                    onClick={onBack}
                    className="h-12 md:h-10 w-32 border-green-300 hover:border-green-400 focus:ring-green-500 focus:border-green-500 text-sm md:text-xs"
                  >
                    ← Previous
                  </Button>
                  <Button
                    type="submit"
                    className="h-12 md:h-10 w-32 bg-green-600 hover:bg-green-700 text-white border-green-600 hover:border-green-700 text-sm md:text-xs font-medium"
                    disabled={!form.formState.isValid}
                  >
                    Next Step →
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>

        {/* Mobile-friendly Testimonial - Below form on mobile, sidebar on desktop */}
        <div className="mt-8 md:mt-0 md:hidden">
          <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
            <CardContent className="p-6 text-center">
              <div className="text-3xl mb-3">🌿</div>
              <p className="text-base text-gray-800 italic mb-3 leading-relaxed">
                "It's like Uganda handpicked me back."
              </p>
              <p className="text-sm text-green-700 font-semibold">
                Ethan, Bristol
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Desktop Sidebar */}
        <div className="hidden md:block absolute right-4 top-8 w-80">
          <Card className="sticky top-8 bg-gradient-to-br from-green-50 to-emerald-50 border-green-200 min-h-[200px] flex flex-col justify-center text-xs">
            <CardContent className="text-center p-6">
              <div className="text-4xl mb-4">🌿</div>
              <p className="text-lg text-gray-800 italic mb-4 leading-relaxed">
                "It's like Uganda handpicked me back."
              </p>
              <p className="text-sm text-green-700 font-semibold">
                Ethan, Bristol
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};