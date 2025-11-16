import * as React from "react";
import { motion } from "framer-motion";
import { useFormValidation, dreamTripSchema } from "../../types";

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
  // Initialize form validation with Zod
  const {
    data: formData,
    setFieldValue
  } = useFormValidation(dreamTripSchema, {
    startDate: initialData.startDate || '',
    endDate: initialData.endDate || '',
    experiences: initialData.experiences || [],
    companion: initialData.companion || '',
    companionCount: initialData.companionCount || '',
    dreamWords: initialData.dreamWords || '',
  });

  // Calculate minimum date (20 days from today)
  const getMinDate = () => {
    const today = new Date();
    const minDate = new Date(today);
    minDate.setDate(today.getDate() + 20);
    return minDate.toISOString().split('T')[0];
  };

  const formatDateRange = () => {
    if (!formData.startDate) return '';
    if (!formData.endDate) return new Date(formData.startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

    const start = new Date(formData.startDate);
    const end = new Date(formData.endDate);

    return `${start.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${end.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`;
  };

  const handleStartDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const startDate = e.target.value;
    setFieldValue('startDate', startDate);

    // If end date exists and is before new start date, clear it
    if (formData.endDate && new Date(formData.endDate) <= new Date(startDate)) {
      setFieldValue('endDate', '');
    }
  };

  const handleEndDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const endDate = e.target.value;
    setFieldValue('endDate', endDate);
  };

  const [hoveredExperience, setHoveredExperience] = React.useState<string | null>(null);

  const experiences = [
    { 
      value: 'gorilla_trekking', 
      label: 'Wildlife, Safari & Forest Expeditions', 
      emoji: '🦍', 
      color: 'from-green-500 to-emerald-600',
      description: "Track gorillas through misty jungles, spot lions and elephants at sunrise, and unwind in eco-lodges deep in Uganda's ancient wilderness."
    },
    { 
      value: 'homestays_villages', 
      label: 'Culture, Villages & Local Living', 
      emoji: '🏡', 
      color: 'from-orange-500 to-amber-600',
      description: "Cook with grandmothers, learn ancestral weaving, and share fireside stories in villages where culture, kindness, and heritage thrive."
    },
    { 
      value: 'nile_adventure', 
      label: 'Nile Adventures & Island Escapes ', 
      emoji: '🛶', 
      color: 'from-blue-500 to-cyan-600',
      description: "Follow the Nile to its source — raft raging rapids, kayak past lush shores, then drift to serene islands and lakeside glampsites kissed by sunset."
    },
    { 
      value: 'food_nightlife', 
      label: 'Flavours, Coffee & Night Life', 
      emoji: '🍛', 
      color: 'from-red-500 to-pink-600',
      description: "Taste Uganda's creative spirit — from street food and skyline cocktails to highland coffee farms and artisan markets buzzing with life."
    },
    { 
      value: 'safari_conservation', 
      label: 'Safari & Conservation Trails', 
      emoji: '🦓', 
      color: 'from-yellow-500 to-orange-600',
      description: "Walk alongside rangers and conservationists, witness endangered species in protected habitats, and contribute to wildlife preservation that safeguards Africa's future."
    },
    { 
      value: 'spiritual_cultural', 
      label: 'Wellness, Rhythm & Renewal', 
      emoji: '🕯️', 
      color: 'from-purple-500 to-indigo-600',
      description: "Breathe in the hills, stretch with sunrise yoga, dance barefoot at drum circles, and find peace where joy and nature flow as one."
    },
    { 
      value: 'community_weaving', 
      label: 'Local Artisan Markets & Weaving', 
      emoji: '🧵', 
      color: 'from-amber-600 to-yellow-600',
      description: "Discover vibrant markets where skilled artisans craft baskets, textiles, and jewelry — each piece woven with tradition, passion, and centuries-old technique."
    },
    { 
      value: 'birdlife_explorations', 
      label: 'Birdlife & Wildlife Explorations', 
      emoji: '🐦', 
      color: 'from-pink-500 to-rose-600',
      description: "Journey through wetlands and forests teeming with over 1,000 bird species — from the rare Shoebill to colorful sunbirds painting the canopy with song."
    },
    { 
      value: 'lakeside_luxe', 
      label: 'Luxe Horizons & Hidden Retreats ', 
      emoji: '🏖️', 
      color: 'from-cyan-500 to-blue-600',
      description: "Soar over savannas and islands to private lodges and spas. Every stay blends first-class comfort with wild landscapes and quiet indulgence."
    },
  ];

  const handleExperienceToggle = (experience: string) => {
    const current = formData.experiences || [];
    if (current.includes(experience)) {
      setFieldValue('experiences', current.filter((e: string) => e !== experience));
    } else if (current.length < 3) {
      setFieldValue('experiences', [...current, experience]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onNext(formData);
  };

  // Validation check

  const isFormValid = formData.startDate && formData.endDate && (formData.experiences?.length === 3);

  const companionOptions = [
    { value: 'solo', label: 'Solo', subtitle: 'Just me', emoji: '👤' },
    { value: 'couple', label: 'Couple', subtitle: 'Two travelers', emoji: '👫' },
    { value: 'friends', label: 'Friends', subtitle: 'Specify number', emoji: '👥' },
    { value: 'family', label: 'Family', subtitle: 'Specify number', emoji: '👩‍👧‍👦' },
  ];

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
                fontSize: '24px', 
                fontFamily: 'Roboto, sans-serif', 
                fontWeight: 400 
              }}
            >
              Now, let us build your perfect Ugandan escape.
            </h2>
            {/* <p 
              className="text-gray-600 mb-6"
              style={{ 
                fontSize: '16px', 
                fontFamily: 'Roboto, sans-serif', 
                fontWeight: 400 
              }}
            >
              Now, let us build your perfect Ugandan escape.
            </p> */}
          </motion.div>

          <form onSubmit={handleSubmit} className="space-y-6">
           {/* Date Range Selection */}
           <motion.div
             initial={{ opacity: 0, x: -20 }}
             animate={{ opacity: 1, x: 0 }}
             transition={{ delay: 0.2 }}
           >
             <label
               className="block text-gray-700 mb-4"
               style={{
                 fontSize: '14px',
                 fontFamily: 'Roboto, sans-serif',
                 fontWeight: 400
               }}
             >
               When are you planning to travel? *
             </label>

             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
               {/* Start Date */}
               <div>
                 <label
                   className="block text-gray-600 mb-2 text-sm"
                   style={{
                     fontSize: '12px',
                     fontFamily: 'Roboto, sans-serif',
                     fontWeight: 400
                   }}
                 >
                   Start Date
                 </label>
                 <input
                   type="date"
                   value={formData.startDate || ''}
                   onChange={handleStartDateChange}
                   min={getMinDate()}
                   className="w-full px-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                   style={{
                     height: '40px',
                     fontSize: '14px',
                     fontFamily: 'Roboto, sans-serif',
                     fontWeight: 400
                   }}
                   required
                 />
               </div>

               {/* End Date */}
               <div>
                 <label
                   className="block text-gray-600 mb-2 text-sm"
                   style={{
                     fontSize: '12px',
                     fontFamily: 'Roboto, sans-serif',
                     fontWeight: 400
                   }}
                 >
                   End Date
                 </label>
                 <input
                   type="date"
                   value={formData.endDate || ''}
                   onChange={handleEndDateChange}
                   min={formData.startDate || getMinDate()}
                   className="w-full px-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                   style={{
                     height: '40px',
                     fontSize: '14px',
                     fontFamily: 'Roboto, sans-serif',
                     fontWeight: 400
                   }}
                   required
                 />
               </div>
             </div>

             {/* Date Range Display */}
             {formData.startDate && formData.endDate && (
               <motion.div
                 initial={{ opacity: 0, y: -10 }}
                 animate={{ opacity: 1, y: 0 }}
                 className="mt-3 p-3 bg-green-50 border border-green-200 rounded-lg"
               >
                 <p
                   className="font-medium text-green-800 text-center"
                   style={{
                     fontSize: '14px',
                     fontFamily: 'Roboto, sans-serif',
                     fontWeight: 400
                   }}
                 >
                   🗓️ Your trip: {formatDateRange()}
                 </p>
               </motion.div>
             )}

             {/* Helper Text */}
             <div className="mt-2">
               <p
                 className="text-gray-600"
                 style={{
                   fontSize: '12px',
                   fontFamily: 'Roboto, sans-serif',
                   fontWeight: 400
                 }}
               >
                 💡 Select your preferred start and end dates for the Uganda adventure
               </p>
             </div>
           </motion.div>

            {/* Dream Experiences */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <div className="flex items-center justify-between mb-3">
                <label 
                  className="block text-gray-700"
                  style={{ 
                    fontSize: '14px', 
                    fontFamily: 'Roboto, sans-serif', 
                    fontWeight: 400 
                  }}
                >
                  Select Your Top 3 Dream Experiences (Choose exactly 3)
                </label>
                <span
                  className="text-green-600 font-semibold"
                  style={{
                    fontSize: '14px',
                    fontFamily: 'Roboto, sans-serif',
                    fontWeight: 400
                  }}
                >
                  {(formData.experiences?.length || 0)}/3 selected
                </span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {experiences.map((exp, index) => {
                  const isSelected = (formData.experiences || []).includes(exp.value);
                  const canSelect = (formData.experiences || []).length < 3 || isSelected;

                  return (
                    <div key={exp.value} className="relative">
                      <motion.button
                        type="button"
                        onClick={() => canSelect && handleExperienceToggle(exp.value)}
                        onMouseEnter={() => setHoveredExperience(exp.value)}
                        onMouseLeave={() => setHoveredExperience(null)}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.4 + index * 0.1 }}
                        disabled={!canSelect}
                        className={`flex items-center gap-3 p-3 rounded-lg border-2 transition-all text-left ${
                          isSelected
                            ? 'border-green-500 bg-green-50 text-green-700'
                            : canSelect
                            ? 'border-gray-300 hover:border-green-300 hover:bg-gray-50'
                            : 'border-gray-200 opacity-50 cursor-not-allowed'
                        }`}
                        style={{ 
                          width: '270px', 
                          height: '40px'
                        }}
                      >
                        <span style={{ fontSize: '16px' }}>{exp.emoji}</span>
                        <span 
                          style={{ 
                            fontSize: '14px', 
                            fontFamily: 'Roboto, sans-serif', 
                            fontWeight: 400 
                          }}
                        >
                          {exp.label}
                        </span>
                        {isSelected && (
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
                      </motion.button>
                      
                      {/* Hover Tooltip */}
                      {hoveredExperience === exp.value && (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 10 }}
                          transition={{ duration: 0.2 }}
                          className="absolute z-50 mt-2 p-4 rounded-lg shadow-xl border border-gray-200 w-80"
                          style={{ 
                            fontFamily: 'Roboto, sans-serif',
                            backgroundColor: '#e6f8ee'
                          }}
                        >
                          <div className="flex items-start gap-3 mb-2">
                            <span style={{ fontSize: '24px' }}>{exp.emoji}</span>
                            <h4 
                              className="font-semibold text-gray-900"
                              style={{ 
                                fontSize: '14px',
                                fontWeight: 500
                              }}
                            >
                              {exp.label}
                            </h4>
                          </div>
                          <p 
                            className="text-gray-600 leading-relaxed"
                            style={{ 
                              fontSize: '13px',
                              fontWeight: 400,
                              lineHeight: '1.6'
                            }}
                          >
                            {exp.description}
                          </p>
                        </motion.div>
                      )}
                    </div>
                  );
                })}
              </div>
            </motion.div>

            {/* Who's coming with you */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                  <svg 
                    width="14" 
                    height="14" 
                    viewBox="0 0 24 24" 
                    fill="none" 
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path 
                      d="M16 7C16 9.20914 14.2091 11 12 11C9.79086 11 8 9.20914 8 7C8 4.79086 9.79086 3 12 3C14.2091 3 16 4.79086 16 7Z" 
                      stroke="white" 
                      strokeWidth="2" 
                      strokeLinecap="round" 
                      strokeLinejoin="round"
                    />
                    <path 
                      d="M12 14C16.4183 14 20 17.5817 20 22H4C4 17.5817 7.58172 14 12 14Z" 
                      stroke="white" 
                      strokeWidth="2" 
                      strokeLinecap="round" 
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
                <label 
                  className="text-gray-700"
                  style={{ 
                    fontSize: '14px', 
                    fontFamily: 'Roboto, sans-serif', 
                    fontWeight: 400 
                  }}
                >
                  Who's coming with you?
                </label>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {companionOptions.map((option, index) => (
                  <div key={option.value} className="flex flex-col items-center">
                    <motion.button
                      type="button"
                      onClick={() => setFieldValue('companion', option.value)}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.6 + index * 0.1 }}
                      className={`flex flex-col items-center justify-center p-2 rounded-lg border-2 transition-all w-full ${
                        formData.companion === option.value
                          ? 'border-green-500 bg-green-50 text-green-700'
                          : 'border-gray-300 hover:border-green-300 hover:bg-gray-50'
                      }`}
                      style={{ 
                        maxWidth: '128px', 
                        height: '96px',
                        margin: '0 auto'
                      }}
                    >
                      <span style={{ fontSize: '24px' }} className="mb-1">{option.emoji}</span>
                      <div className="text-center">
                        <span 
                          className="block font-medium"
                          style={{ 
                            fontSize: '13px', 
                            fontFamily: 'Roboto, sans-serif', 
                            fontWeight: 500 
                          }}
                        >
                          {option.label}
                        </span>
                        <span 
                          className="text-gray-500 text-xs leading-tight"
                          style={{ 
                            fontSize: '11px', 
                            fontFamily: 'Roboto, sans-serif', 
                            fontWeight: 400 
                          }}
                        >
                          {option.subtitle}
                        </span>
                      </div>
                    </motion.button>
                    
                    {/* Number Input for Friends or Family */}
                    {formData.companion === option.value && (option.value === 'friends' || option.value === 'family') && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                        className="mt-2 w-full"
                        style={{ maxWidth: '128px' }}
                      >
                        <input
                          type="number"
                          min="2"
                          value={formData.companionCount || ''}
                          onChange={(e) => setFieldValue('companionCount', e.target.value)}
                          placeholder="Number"
                          className="w-full px-2 py-1 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all text-center"
                          style={{
                            fontSize: '12px',
                            fontFamily: 'Roboto, sans-serif',
                            fontWeight: 400,
                            height: '32px'
                          }}
                        />
                        <p 
                          className="text-gray-500 text-center mt-1"
                          style={{ 
                            fontSize: '10px', 
                            fontFamily: 'Roboto, sans-serif', 
                            fontWeight: 400 
                          }}
                        >
                          How many?
                        </p>
                      </motion.div>
                    )}
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Dream Description */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.7 }}
            >
              <label 
                className="block text-gray-700 mb-2"
                style={{ 
                  fontSize: '14px', 
                  fontFamily: 'Roboto, sans-serif', 
                  fontWeight: 400 
                }}
              >
                Describe your dream Ugandan escape in three words (Optional)
              </label>
              <input
                type="text"
                value={formData.dreamWords}
                onChange={(e) => setFieldValue('dreamWords', e.target.value)}
                className="px-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                style={{ 
                  width: '270px', 
                  height: '40px',
                  fontSize: '14px', 
                  fontFamily: 'Roboto, sans-serif', 
                  fontWeight: 400 
                }}
                placeholder="e.g., Adventure, Connection, Discovery"
                maxLength={100}
              />
              <p 
                className="text-gray-600 mt-1"
                style={{ 
                  fontSize: '12px', 
                  fontFamily: 'Roboto, sans-serif', 
                  fontWeight: 400 
                }}
              >
                💭 Don't overthink it – let your heart speak
              </p>
            </motion.div>

            {/* Navigation Buttons */}
            <div className="flex flex-col md:flex-row justify-between gap-3 md:gap-0 pt-4">
              <motion.button
                type="button"
                onClick={onBack}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
                className="bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400 transition-all rounded-lg flex items-center justify-center gap-2"
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
                Previous
              </motion.button>
              <motion.button
                type="submit"
                disabled={!isFormValid}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9 }}
                className={`rounded-lg transition-all flex items-center justify-center gap-2 ${
                  isFormValid
                    ? 'bg-gradient-to-r from-green-500 to-green-600 text-white hover:from-green-600 hover:to-green-700 hover:shadow-lg'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
                style={{ 
                  height: '40px',
                  width: '130px',
                  fontSize: '14px', 
                  fontFamily: 'Roboto, sans-serif', 
                  fontWeight: 400
                }}
              >
                Next Step
                <svg 
                  width="16" 
                  height="16" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  xmlns="http://www.w3.org/2000/svg"
                  className={isFormValid ? 'text-white' : 'text-gray-400'}
                >
                  <path 
                    d="M5 12H19M12 5L19 12L12 19" 
                    stroke="currentColor" 
                    strokeWidth="2" 
                    strokeLinecap="round" 
                    strokeLinejoin="round"
                  />
                </svg>
              </motion.button>
            </div>
          </form>
        </div>
      </div>

      {/* Testimonial Card */}
      <div className="md:col-span-1">
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
          className="sticky top-8 bg-gradient-to-br from-amber-50 to-orange-50 p-2 rounded-2xl border border-amber-200 min-h-[200px] flex flex-col justify-center text-xs hidden md:flex"
        >
          <div className="text-4xl mb-4">💡</div>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <p className="text-lg text-gray-800 italic mb-4 leading-relaxed">
              "It's like Uganda handpicked me back."
            </p>
            <p className="text-sm text-gray-600 font-semibold">
              Ethan, Bristol
            </p>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};