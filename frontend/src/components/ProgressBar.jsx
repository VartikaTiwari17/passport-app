const ProgressBar = ({ currentStep, totalSteps, steps }) => {
  return (
    <div className="w-full max-w-2xl mx-auto mb-8">
      <div className="flex items-start justify-between mb-3">
        {steps.map((step, index) => (
          <div key={index} className="flex flex-col items-center flex-1">
            <div className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold transition-all
              ${index + 1 < currentStep ? 'bg-green-500 text-white' : index + 1 === currentStep ? 'bg-blue-900 text-white ring-4 ring-blue-200' : 'bg-gray-200 text-gray-500'}`}>
              {index + 1 < currentStep ? '✓' : index + 1}
            </div>
            <span className={`text-xs mt-1 text-center hidden md:block ${index + 1 === currentStep ? 'text-blue-900 font-semibold' : 'text-gray-400'}`}>
              {step}
            </span>
          </div>
        ))}
      </div>
      <div className="relative h-2 bg-gray-200 rounded-full mt-1">
        <div className="absolute top-0 left-0 h-2 bg-blue-900 rounded-full transition-all duration-500"
          style={{ width: `${((currentStep - 1) / (totalSteps - 1)) * 100}%` }} />
      </div>
      <p className="text-xs text-center text-gray-400 mt-2">Step {currentStep} of {totalSteps}</p>
    </div>
  );
};

export default ProgressBar;