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
    setFieldValue,
    setFieldTouched,
    getFieldError,
    hasFieldError
  } = useFormValidation(dreamTripSchema, {
    travelDate: initialData.travelDate || '',
    startDate: initialData.startDate || '',
    endDate: initialData.endDate || '',
    experiences: initialData.experiences || [],
    companion: initialData.companion || '',
    dreamWords: initialData.dreamWords || '',
  });

  // Calculate minimum date (next month)
  const getMinDate = () => {
    const today = new Date();
    const nextMonth = new Date(today.getFullYear(), today.getMonth() + 1, 1);
    return nextMonth.toISOString().split('T')[0];
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

  const experiences = [
    { value: 'gorilla', label: 'Gorilla Trekking & Forest Lodges', emoji: '🦍', color: 'from-green-500 to-emerald-600' },
    { value: 'village', label: 'Village Homestays & Cultural Weaving', emoji: '🏡', color: 'from-orange-500 to-amber-600' },
    { value: 'nile', label: 'Nile Adventures & Lakeside Glamping', emoji: '🛶', color: 'from-blue-500 to-cyan-600' },
    { value: 'food', label: 'Food, Coffee & Kampala Nights', emoji: '🍛', color: 'from-red-500 to-pink-600' },
    { value: 'safari', label: 'Safari & Conservation Trails', emoji: '🦓', color: 'from-yellow-500 to-orange-600' },
    { value: 'spiritual', label: 'Spiritual Journeys & Hidden Temples', emoji: '🕯️', color: 'from-purple-500 to-indigo-600' },
    { value: 'coffee', label: 'Local Coffee & Artisan Markets', emoji: '☕', color: 'from-amber-600 to-yellow-600' },
    { value: 'music', label: 'Music, Story Circles & Dance', emoji: '🎶', color: 'from-pink-500 to-rose-600' },
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

  console.log('🎯 DreamTripForm validation:', {
    travelDate: formData.travelDate,
    startDate: formData.startDate,
    endDate: formData.endDate,
    experiences: formData.experiences?.length,
    companion: formData.companion,
    experiencesSelected: formData.experiences?.length === 3,
    startDateSelected: !!formData.startDate,
    endDateSelected: !!formData.endDate,
    travelDateSelected: !!formData.travelDate
  });

  const isFormValid = formData.travelDate && formData.startDate && formData.endDate && (formData.experiences?.length === 3);

  const companionOptions = [
    { value: 'solo', label: 'Solo', subtitle: 'Just me', emoji: '👤' },
    { value: 'couple', label: 'Couple', subtitle: 'Two travelers', emoji: '👫' },
    { value: 'friends', label: 'Friends', subtitle: 'Specify number', emoji: '👥' },
    { value: 'family', label: 'Family', subtitle: 'Specify number', emoji: '👨‍👩‍👧‍👦' },
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
              Craft Your Dream Trip
            </h2>
            <p 
              className="text-gray-600 mb-6"
              style={{ 
                fontSize: '16px', 
                fontFamily: 'Roboto, sans-serif', 
                fontWeight: 400 
              }}
            >
              Now, let us build your perfect Ugandan escape.
            </p>
          </motion.div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Travel Date Selection */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <label 
                className="block text-gray-700 mb-2"
                style={{ 
                  fontSize: '14px', 
                  fontFamily: 'Roboto, sans-serif', 
                  fontWeight: 400 
                }}
              >
                When are you planning to travel? *
              </label>
              <select
                value={formData.travelDate}
                onChange={(e) => {
                  setFieldValue('travelDate', e.target.value);
                  setFieldValue('startDate', '');
                  setFieldValue('endDate', '');
                  setShowCalendar(true);
                }}
                className="px-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                style={{ 
                  width: '270px', 
                  height: '40px',
                  fontSize: '14px', 
                  fontFamily: 'Roboto, sans-serif', 
                  fontWeight: 400 
                }}
                required
              >
                <option value="">Select travel date</option>
                {dateOptions.map((option) => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>

              {/* Date Range Display */}
              {formData.startDate && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-3 p-3 bg-green-50 border border-green-200 rounded-lg"
                >
                  <p 
                    className="font-medium text-green-800"
                    style={{ 
                      fontSize: '14px', 
                      fontFamily: 'Roboto, sans-serif', 
                      fontWeight: 400 
                    }}
                  >
                    Selected dates: {formatDateRange()}
                  </p>
                </motion.div>
              )}

              {/* Calendar Picker */}
              {showCalendar && formData.travelDate && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="mt-4 p-4 bg-white border-2 border-green-200 rounded-lg"
                >
                  <div className="flex justify-between items-center mb-3">
                    <h3 
                      className="font-semibold text-gray-800"
                      style={{ 
                        fontSize: '14px', 
                        fontFamily: 'Roboto, sans-serif', 
                        fontWeight: 500 
                      }}
                    >
                      Select your travel dates
                    </h3>
                    <button
                      type="button"
                      onClick={() => setShowCalendar(false)}
                      className="text-gray-500 hover:text-gray-700 text-xl font-bold"
                    >
                      ×
                    </button>
                  </div>
                  
                  <div className="text-center mb-4">
                    <h4 
                      className="font-medium text-gray-700"
                      style={{ 
                        fontSize: '14px', 
                        fontFamily: 'Roboto, sans-serif', 
                        fontWeight: 400 
                      }}
                    >
                      {formData.travelDate}
                    </h4>
                  </div>

                  {/* Calendar Grid */}
                  <div className="grid grid-cols-7 gap-1 text-center">
                    {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                      <div 
                        key={day} 
                        className="p-2 text-gray-600 font-semibold"
                        style={{ 
                          fontSize: '12px', 
                          fontFamily: 'Roboto, sans-serif', 
                          fontWeight: 500 
                        }}
                      >
                        {day}
                      </div>
                    ))}
                    
                    {generateCalendarDays().map((dayObj, index) => (
                      <button
                        key={index}
                        type="button"
                        disabled={!dayObj.date}
                        onClick={() => handleDateClick(dayObj.date)}
                        className={`p-2 text-center rounded-md transition-all ${
                          !dayObj.date 
                            ? 'invisible' 
                            : isDateInRange(dayObj.date!) 
                            ? 'bg-green-500 text-white' 
                            : 'hover:bg-green-100 text-gray-700'
                        }`}
                        style={{ 
                          fontSize: '12px', 
                          fontFamily: 'Roboto, sans-serif', 
                          fontWeight: 400 
                        }}
                      >
                        {dayObj.day}
                      </button>
                    ))}
                  </div>

                  <div className="mt-3 text-center">
                    <p 
                      className="text-gray-600"
                      style={{ 
                        fontSize: '12px', 
                        fontFamily: 'Roboto, sans-serif', 
                        fontWeight: 400 
                      }}
                    >
                      {!formData.startDate 
                        ? 'Click a date to start selecting your travel period'
                        : !formData.endDate 
                        ? 'Click another date to complete your travel period'
                        : 'Travel dates selected! Click anywhere to modify.'
                      }
                    </p>
                  </div>
                </motion.div>
              )}
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
                    <motion.button
                      key={exp.value}
                      type="button"
                      onClick={() => canSelect && handleExperienceToggle(exp.value)}
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
                  <motion.button
                    key={option.value}
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