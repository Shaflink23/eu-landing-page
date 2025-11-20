"use client"

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { dreamTripSchema, DreamTripFormData } from "@/types/rhf-dream-trip";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
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

interface DreamTripFormProps {
  onNext: (data: any) => void;
  onBack: () => void;
  initialData: any;
  currentStep?: number;
  totalSteps?: number;
  onClose?: () => void;
}

export const DreamTripFormRH: React.FC<DreamTripFormProps> = ({
  onNext,
  onBack,
  initialData,
  currentStep = 2,
  totalSteps = 3,
  onClose
}) => {
  const [hoveredExperience, setHoveredExperience] = React.useState<string | null>(null);

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
      label: 'Birdlife & Wildlife Explorations', 
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
  const selectedCompanion = form.watch('companion');

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
            <CardTitle className="text-2xl">Now, let us build your perfect Ugandan escape.</CardTitle>
            <CardDescription>
              Customize your dream adventure with the experiences and companions that matter most to you.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                {/* Date Range Selection */}
                <div>
                  <FormLabel className="text-sm">When are you planning to travel? *</FormLabel>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                    <FormField
                      control={form.control}
                      name="startDate"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-xs">Start Date</FormLabel>
                          <FormControl>
                            <Input 
                              type="date"
                              {...field}
                              min={getMinDate()}
                              className="h-10"
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
                          <FormControl>
                            <Input 
                              type="date"
                              {...field}
                              min={form.getValues('startDate') || getMinDate()}
                              className="h-10"
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
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex items-center justify-between mb-3">
                        <FormLabel>Select Your Top 3 Dream Experiences (Choose exactly 3)</FormLabel>
                        <span className="text-green-600 font-semibold text-sm">
                          {selectedExperiences.length}/3 selected
                        </span>
                      </div>
                      <FormControl>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {experiences.map((exp, index) => {
                            const isSelected = selectedExperiences.includes(exp.value);
                            const canSelect = selectedExperiences.length < 3 || isSelected;

                            return (
                              <div key={exp.value} className="relative">
                                <Button
                                  type="button"
                                  variant="outline"
                                  onClick={() => canSelect && handleExperienceToggle(exp.value)}
                                  onMouseEnter={() => setHoveredExperience(exp.value)}
                                  onMouseLeave={() => setHoveredExperience(null)}
                                  disabled={!canSelect}
                                  className={`flex items-center gap-3 p-3 h-10 max-w-[270px] ${
                                    isSelected
                                      ? 'border-green-500 bg-green-50 text-green-700'
                                      : canSelect
                                      ? 'border-gray-300 hover:border-green-300 hover:bg-gray-50'
                                      : 'border-gray-200 opacity-50 cursor-not-allowed'
                                  }`}
                                >
                                  <span className="text-sm">{exp.emoji}</span>
                                  <span className="text-sm truncate">{exp.label}</span>
                                  {isSelected && (
                                    <svg
                                      width="14"
                                      height="14"
                                      viewBox="0 0 24 24"
                                      fill="none"
                                      className="ml-auto"
                                    >
                                      <path
                                        d="M20 6L9 17L4 12"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                      />
                                    </svg>
                                  )}
                                </Button>
                                
                                {/* Hover Tooltip */}
                                {hoveredExperience === exp.value && (
                                  <div className="absolute z-50 mt-2 p-4 rounded-lg shadow-xl border border-gray-200 w-80 bg-white">
                                    <div className="flex items-start gap-3 mb-2">
                                      <span className="text-xl">{exp.emoji}</span>
                                      <h4 className="font-semibold text-gray-900 text-sm">{exp.label}</h4>
                                    </div>
                                    <p className="text-gray-600 text-xs leading-relaxed">{exp.description}</p>
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Companion Selection */}
                <FormField
                  control={form.control}
                  name="companion"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Who's coming with you?</FormLabel>
                      <FormControl>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                          {companionOptions.map((option) => (
                            <div key={option.value} className="flex flex-col items-center">
                              <Button
                                type="button"
                                variant="outline"
                                onClick={() => field.onChange(option.value)}
                                className={`flex flex-col items-center justify-center p-2 h-24 w-full ${
                                  field.value === option.value
                                    ? 'border-green-500 bg-green-50 text-green-700'
                                    : 'border-gray-300 hover:border-green-300 hover:bg-gray-50'
                                }`}
                              >
                                <span className="text-xl mb-1">{option.emoji}</span>
                                <div className="text-center">
                                  <span className="block font-medium text-xs">{option.label}</span>
                                  <span className="text-gray-500 text-xs">{option.subtitle}</span>
                                </div>
                              </Button>
                              
                              {/* Number Input for Friends or Family */}
                              {field.value === option.value && (option.value === 'friends' || option.value === 'family') && (
                                <div className="mt-2 w-full">
                                  <Input
                                    type="number"
                                    min="2"
                                    value={form.getValues('companionCount') || ''}
                                    onChange={(e) => form.setValue('companionCount', e.target.value)}
                                    placeholder="Number"
                                    className="h-8 text-xs text-center"
                                  />
                                  <p className="text-gray-500 text-center mt-1 text-xs">How many?</p>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Dream Description */}
                <FormField
                  control={form.control}
                  name="dreamWords"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Describe your dream Ugandan escape in three words (Optional)</FormLabel>
                      <FormControl>
                        <Input 
                          {...field}
                          placeholder="e.g., Adventure, Connection, Discovery"
                          className="max-w-[270px] h-10"
                          maxLength={100}
                        />
                      </FormControl>
                      <p className="text-gray-600 text-xs mt-1">
                        💭 Don't overthink it – let your heart speak
                      </p>
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
                    className="h-10 w-32"
                  >
                    ← Previous
                  </Button>
                  <Button 
                    type="submit" 
                    className="h-10 w-32"
                    disabled={!form.formState.isValid}
                  >
                    Next Step →
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>

      {/* Testimonial Card */}
      <div className="md:col-span-1">
        <Card className="sticky top-8 bg-gradient-to-br from-amber-50 to-orange-50 border-amber-200 min-h-[200px] flex flex-col justify-center text-xs hidden md:block">
          <CardContent className="text-center p-6">
            <div className="text-4xl mb-4">💡</div>
            <p className="text-lg text-gray-800 italic mb-4 leading-relaxed">
              "It's like Uganda handpicked me back."
            </p>
            <p className="text-sm text-gray-600 font-semibold">
              Ethan, Bristol
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};