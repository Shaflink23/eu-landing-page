import * as React from "react";
import { useNavigate } from "react-router-dom";
import { FormPageHeader } from "../components/layout/FormPageHeader";
import { SmallUgBanner } from "../components/common/SmallUgBanner";
import { SmallerHero } from "../components/common/SmallerHero";
import { TravellerVibesForm } from "../components/forms/TravellerVibesForm";
import { DreamTripForm } from "../components/forms/DreamTripForm";
import { ExplorerCircleForm } from "../components/forms/ExplorerCircleForm";
import { motion, AnimatePresence } from "framer-motion";

export const FormPage = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = React.useState(1);
  const [formData, setFormData] = React.useState<any>({});

  const totalSteps = 3;

  const handleNext = (stepData: any) => {
    setFormData({ ...formData, ...stepData });
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
      // Scroll to top when moving to next step
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleClose = () => {
    setCurrentStep(1);
    setFormData({});
    navigate('/');
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <TravellerVibesForm onNext={handleNext} initialData={formData} currentStep={currentStep} totalSteps={totalSteps} onClose={handleClose} />;
      case 2:
        return <DreamTripForm onNext={handleNext} onBack={handleBack} initialData={formData} currentStep={currentStep} totalSteps={totalSteps} onClose={handleClose} />;
      case 3:
        return <ExplorerCircleForm onBack={handleBack} initialData={formData} onClose={handleClose} currentStep={currentStep} totalSteps={totalSteps} />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <FormPageHeader />

      {/* Small Uganda Banner */}
      <SmallUgBanner />

      {/* Smaller Hero Section */}
      <SmallerHero />

      {/* Form Content */}
      <div className="flex-1 py-8 md:py-12 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="bg-white rounded-2xl shadow-lg p-6 md:p-10">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                {renderStep()}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
};
