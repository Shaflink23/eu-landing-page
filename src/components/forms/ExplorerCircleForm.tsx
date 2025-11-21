"use client"

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { submitFormData } from "../../utils/api";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";

interface ExplorerCircleFormProps {
  onBack: () => void;
  initialData: any;
  onClose: () => void;
  currentStep?: number;
  totalSteps?: number;
}

export const ExplorerCircleForm: React.FC<ExplorerCircleFormProps> = ({
  onBack, 
  initialData, 
  onClose, 
  currentStep = 3, 
  totalSteps = 3 
}) => {
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [isSubmitted, setIsSubmitted] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);
  const [submissionData, setSubmissionData] = React.useState<any>(null);

  const explorerCircleSchema = z.object({
    keepUpdated: z.boolean().default(true),
  });

  const form = useForm({
    resolver: zodResolver(explorerCircleSchema),
    defaultValues: {
      keepUpdated: true,
    },
  });

  const handleSubmit = async (data: z.infer<typeof explorerCircleSchema>) => {
    if (isSubmitting) return;
    
    setErrorMessage(null);
    setIsSubmitting(true);

    try {
      // Simplified data transformation
      const companion = initialData.companion;
      const isGroup = companion === 'friends' || companion === 'family';
      const groupSize = companion === 'couple' ? 2 : isGroup ? 4 : 1;

      const completeFormData = {
        name: initialData.name || "",
        email: initialData.email || "",
        phone: initialData.phone || "",
        country_of_residence: initialData.country || "Unknown",
        been_to_africa_before: initialData.beenToAfrica === 'yes',
        travel_style: (initialData.travellerType || ["adventurer"]).slice(0, 3),
        dream_escape_words: initialData.dreamWords || "",
        heard_about_us: initialData.hearAbout || 'other',
        feature_as_pioneer: initialData.pioneeerTraveller === 'yes' ? 'yes' : 'maybe_later',
        travel_photo_url: initialData.photo || null,
        travel_month: initialData.startDate ? new Date(initialData.startDate).getMonth() + 1 : new Date().getMonth() + 1,
        travel_year: initialData.startDate ? new Date(initialData.startDate).getFullYear() : new Date().getFullYear(),
        preferred_start_date: initialData.startDate || null,
        preferred_end_date: initialData.endDate || null,
        group_type: isGroup ? 'group' : companion || 'solo',
        group_size: groupSize,
        must_have_experiences: (initialData.experiences || ["gorilla_trekking", "safari_conservation", "spiritual_cultural"]).slice(0, 3),
        accessibility_dietary_preferences: initialData.preferences || "None",
        send_options: "both",
        join_early_explorer: true,
        email_opt_in: data.keepUpdated
      };

      const result = await submitFormData(completeFormData);

      if (result.success) {
        setSubmissionData(result.data);
        setIsSubmitted(true);
        toast.success("Form submitted successfully!");
      } else {
        setErrorMessage(result.error || 'Failed to submit form. Please try again.');
        toast.error('Form submission failed');
      }
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'An unexpected error occurred. Please try again or contact support.';
      setErrorMessage(errorMsg);
      toast.error(errorMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="w-full px-4 md:px-0">
        <div className="w-full max-w-4xl mx-auto">
          <div className="relative flex flex-col items-center justify-center min-h-[400px] p-4 md:p-8">
            <div className="mb-6">
              <svg className="w-16 h-16 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <h2 className="text-2xl font-semibold text-green-700 mb-3 text-center">🎉 Your Uganda Adventure Awaits!</h2>

            {submissionData && submissionData.data && (
              <div className="text-center mb-6 w-full max-w-2xl">
                <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
                  <p className="text-sm text-green-800 font-medium mb-2">
                    Reference: {submissionData.data.reference_number}
                  </p>
                  <p className="text-xs text-green-600">
                    Estimated response time: {submissionData.data.estimated_response_time}
                  </p>
                  <p className="text-xs text-green-600">
                    Email confirmation sent to: {initialData?.email}
                  </p>
                </div>

                <div className="text-left space-y-2">
                  <h3 className="font-semibold text-gray-800 mb-3 text-center md:text-left">What's Next:</h3>
                  {submissionData.data.next_steps && submissionData.data.next_steps.map((step: string, index: number) => (
                    <div key={index} className="flex items-start gap-2">
                      <div className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-white text-xs font-bold">{index + 1}</span>
                      </div>
                      <p className="text-sm text-gray-700">{step}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="text-center">
              <p className="text-base text-gray-700 mb-4 max-w-md">
                {submissionData?.message || "We will be in touch soon with your personalized journey options and a free digital guide."}
              </p>
              <Button
                onClick={onClose}
                className="mt-3 px-6 py-3 rounded bg-green-500 text-white text-base font-medium hover:scale-105 transition-all"
              >
                Close
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full px-4 md:px-0">
      <div className="w-full max-w-4xl mx-auto">
        <Card className="w-full">
        <CardHeader>
          <div className="flex items-center justify-between mb-3">
            <CardTitle className="text-sm font-medium">
              Step {currentStep} of {totalSteps}
            </CardTitle>
            <div className="text-sm text-gray-500">
              100% Complete
            </div>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2 md:h-3 overflow-hidden">
            <div className="h-full bg-gradient-to-r from-green-500 to-emerald-600 w-full" />
          </div>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
              <div className="text-center mb-8">
                <CardTitle className="text-xl md:text-3xl mb-3">
                  Explorer Circle
                </CardTitle>
                <CardDescription className="text-base md:text-lg mb-4">
                  🎉 You're almost done! Join our exclusive community for insider access to Uganda's hidden gems, special offers, and authentic travel stories.
                </CardDescription>
                <p className="text-center text-sm text-gray-600 max-w-2xl mx-auto">
                  Get the inside track on Uganda's best-kept secrets, special rates for community members, and inspiring stories from fellow travelers who've fallen in love with the Pearl of Africa.
                </p>
              </div>

              <div className="flex justify-center mb-12">
                <FormField
                  control={form.control}
                  name="keepUpdated"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                          Keep me updated with the latest Uganda travel stories and offers
                        </FormLabel>
                        <FormDescription className="text-xs text-gray-600">
                          Receive monthly newsletters with insider tips, hidden gem locations, and exclusive community member offers. Unsubscribe anytime.
                        </FormDescription>
                      </div>
                    </FormItem>
                  )}
                />
              </div>

              {errorMessage && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                  <div className="font-bold mb-2 text-red-800">Submission Error:</div>
                  <div className="whitespace-pre-wrap text-red-700">{errorMessage}</div>
                  <div className="mt-3 text-xs text-red-600">
                    Please check the browser console (F12) for more details, or contact support if the issue persists.
                  </div>
                </div>
              )}

              {/* Navigation Buttons */}
              <div className="flex flex-col md:flex-row justify-between gap-3 md:gap-0 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={onBack}
                    disabled={isSubmitting}
                    className="h-12 md:h-10 w-32 border-green-300 hover:border-green-400 focus:ring-green-500 focus:border-green-500 text-sm md:text-xs"
                  >
                    ← Back
                  </Button>
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="h-12 md:h-10 px-6 bg-green-600 hover:bg-green-700 text-white border-green-600 hover:border-green-700 text-sm md:text-xs font-medium"
                  >
                    {isSubmitting ? (
                      <>
                        <svg className="animate-spin h-4 w-4 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Submitting...
                      </>
                    ) : (
                      <>
                        Submit & Get My Guide →
                      </>
                    )}
                  </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>

      {/* Explorer Circle Success Card - This is the success state, layout is fine */}
      </div>
    </div>
  );
};