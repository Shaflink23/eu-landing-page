import * as React from "react";
import { motion } from "framer-motion";
import { submitFormData } from "../../utils/api";

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
  const [keepUpdated, setKeepUpdated] = React.useState(false);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [isSubmitted, setIsSubmitted] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);
  const [submissionData, setSubmissionData] = React.useState<any>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isSubmitting) return;
    
    // Clear previous errors
    setErrorMessage(null);
    
    setIsSubmitting(true);

    try {
      // Transform the data to match the exact payload structure
      const completeFormData = {
        name: initialData.name || "",
        email: initialData.email || "",
        phone: initialData.phone || "",
        country_of_residence: initialData.country || "Unknown",
        been_to_africa_before: initialData.beenToAfrica === 'yes',
        travel_style: Array.isArray(initialData.travellerType) ? initialData.travellerType : (initialData.travellerType ? [initialData.travellerType] : ["adventurer"]),
        dream_escape_words: initialData.dreamWords || "",
        heard_about_us: Array.isArray(initialData.hearAbout) && initialData.hearAbout.length > 0 ? initialData.hearAbout[0] : "other",
        feature_as_pioneer: initialData.pioneeerTraveller === 'yes' ? 'yes' : 'maybe_later',
        travel_photo_url: initialData.photo || null,
        travel_month: initialData.startDate ? new Date(initialData.startDate).getMonth() + 1 : new Date().getMonth() + 1,
        travel_year: initialData.startDate ? new Date(initialData.startDate).getFullYear() : new Date().getFullYear(),
        preferred_start_date: initialData.startDate || null,
        preferred_end_date: initialData.endDate || null,
        group_type: initialData.companion || "solo",
        group_size: initialData.companion ? (initialData.companion === 'friends' || initialData.companion === 'family' ? 4 : initialData.companion === 'couple' ? 2 : 1) : 1,
        must_have_experiences: Array.isArray(initialData.experiences) && initialData.experiences.length > 0 ? initialData.experiences : ["gorilla_trekking", "safari_conservation", "spiritual_cultural"],
        accessibility_dietary_preferences: initialData.preferences || "None",
        send_options: "both",
        join_early_explorer: true, // Always true for Explorer Circle
        email_opt_in: keepUpdated // Use the checkbox state
      };

      // Submit to backend API

      // Submit to backend API
      const result = await submitFormData(completeFormData);

      console.log('📬 API Result:', result);

      if (result.success) {
        console.log('🎉 Submission successful!', result.data);
        // Store the API response data for display
        setSubmissionData(result.data);
        setIsSubmitted(true);
      } else {
        console.error('❌ Submission failed:', result.error);
        const detailedError = result.error || 'Failed to submit form. Please try again.';
        console.error('❌ Detailed error:', detailedError);
        setErrorMessage(detailedError);
      }
    } catch (error) {
      console.error('💥 Unexpected error:', error);
      const errorMsg = error instanceof Error ? error.message : 'An unexpected error occurred. Please try again or contact support.';
      console.error('💥 Error message:', errorMsg);
      setErrorMessage(errorMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <>
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="relative flex flex-col items-center justify-center min-h-[400px] p-8"
        >
          {/* Only the main cancel button remains */}
          <div className="mb-6">
            <svg className="w-16 h-16 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <motion.path
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 1 }}
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <h2 className="text-2xl font-semibold text-green-700 mb-3">🎉 Your Uganda Adventure Awaits!</h2>

          {submissionData && (
            <div className="text-center mb-6">
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
                <p className="text-sm text-green-800 font-medium mb-2">
                  Reference: {submissionData.reference_number}
                </p>
                <p className="text-xs text-green-600">
                  Estimated response time: {submissionData.estimated_response_time}
                </p>
              </div>

              <div className="text-left space-y-2">
                <h3 className="font-semibold text-gray-800 mb-3">What's Next:</h3>
                {submissionData.next_steps && submissionData.next_steps.map((step: string, index: number) => (
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
            <p className="text-base text-gray-700 mb-4">
              {submissionData?.message || "We'll be in touch soon with your personalized journey options and a free digital guide."}
            </p>
            <button
              onClick={onClose}
              className="mt-3 px-6 py-3 rounded bg-green-500 text-white text-base font-medium shadow hover:scale-105 transition-all"
            >
              Close
            </button>
          </div>
        </motion.div>
      </>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 md:px-0">
      <div className="bg-white rounded-lg border border-gray-200 p-4 md:p-6">
        {/* Progress Bar */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm font-medium text-gray-700" style={{ fontFamily: 'Roboto, sans-serif', fontWeight: 400 }}>
              Step {currentStep} of {totalSteps}
            </p>
            <div className="text-sm text-gray-500" style={{ fontFamily: 'Roboto, sans-serif', fontWeight: 400 }}>
              100% Complete
            </div>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-green-500 to-emerald-600"
              initial={{ width: 0 }}
              animate={{ width: '100%' }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-center mb-8"
          >
            <h2 
              className="text-gray-900 mb-3"
              style={{ 
                fontSize: '48px', 
                fontFamily: 'Roboto, sans-serif', 
                fontWeight: 400 
              }}
            >
              Explorer Circle
            </h2>
            <p 
              className="text-gray-600"
              style={{ 
                fontSize: '18px', 
                fontFamily: 'Roboto, sans-serif', 
                fontWeight: 400 
              }}
            >
              You're almost done! Join the circle for exclusive benefits and updates.
            </p>
          </motion.div>

          <div className="flex justify-center mb-12">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={keepUpdated}
                onChange={() => setKeepUpdated(!keepUpdated)}
                className="w-5 h-5 text-green-600 border-gray-300 rounded focus:ring-green-500"
              />
              <span 
                className="text-gray-700"
                style={{ 
                  fontSize: '16px', 
                  fontFamily: 'Roboto, sans-serif', 
                  fontWeight: 400 
                }}
              >
                Keep me updated with the latest Uganda travel stories and offers
              </span>
            </label>
          </div>

          {errorMessage && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm"
            >
              <div className="font-bold mb-2">Submission Error:</div>
              <div className="whitespace-pre-wrap">{errorMessage}</div>
              <div className="mt-3 text-xs text-red-600">
                Please check the browser console (F12) for more details, or contact support if the issue persists.
              </div>
            </motion.div>
          )}

          {/* Navigation Buttons */}
          <div className="flex flex-col md:flex-row justify-between gap-3 md:gap-0 pt-4">
            <motion.button
              type="button"
              onClick={onBack}
              disabled={isSubmitting}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400 transition-all rounded-lg flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ 
                height: '40px',
                width: '130px',
                fontSize: '14px', 
                fontFamily: 'Roboto, sans-serif', 
                fontWeight: 400
              }}
            >
              <svg 
                width="16" 
                height="16" 
                viewBox="0 0 24 24" 
                fill="none" 
                xmlns="http://www.w3.org/2000/svg"
                className="text-gray-600"
              >
                <path 
                  d="M19 12H5M12 19L5 12L12 5" 
                  stroke="currentColor" 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                />
              </svg>
              Back
            </motion.button>
            <motion.button
              type="submit"
              disabled={isSubmitting}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9 }}
              className={`rounded-lg transition-all flex items-center justify-center gap-2 ${
                !isSubmitting
                  ? 'bg-gradient-to-r from-green-500 to-green-600 text-white hover:from-green-600 hover:to-green-700 hover:shadow-lg'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
              style={{ 
                height: '40px',
                fontSize: '14px', 
                fontFamily: 'Roboto, sans-serif', 
                fontWeight: 400,
                paddingLeft: '20px',
                paddingRight: '20px'
              }}
            >
              {isSubmitting ? (
                <>
                  <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Submitting...
                </>
              ) : (
                <>
                  Finish & Get My Guide
                  <svg 
                    width="16" 
                    height="16" 
                    viewBox="0 0 24 24" 
                    fill="none" 
                    xmlns="http://www.w3.org/2000/svg"
                    className="text-white"
                  >
                    <path 
                      d="M5 12H19M12 5L19 12L12 19" 
                      stroke="currentColor" 
                      strokeWidth="2" 
                      strokeLinecap="round" 
                      strokeLinejoin="round"
                    />
                  </svg>
                </>
              )}
            </motion.button>
          </div>
        </form>
      </div>
    </div>
  );
};
