import { useState } from "react";
import { Input } from "../../components/ui/Input";
import { Button } from "../../components/ui/Button";
import { CheckCircle2, UserCheck, ShieldCheck, Mail, BookOpen, ArrowRight, ArrowLeft } from "lucide-react";
import toast from "react-hot-toast";

/**
 * Admission Flow View
 * Features a multi-step wizard for processing new student registrations.
 */
export const AdmissionForm = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const steps = [
    { id: 1, name: "Personal Information", icon: ShieldCheck },
    { id: 2, name: "Contact Details", icon: Mail },
    { id: 3, name: "Academic Pathway", icon: BookOpen },
  ];

  const handleNext = () => setCurrentStep(prev => Math.min(prev + 1, steps.length));
  const handleBack = () => setCurrentStep(prev => Math.max(prev - 1, 1));

  const handleRegister = (e) => {
    e.preventDefault();
    setIsSubmitted(true);
    toast.success("Admission application submitted successfully!");
  };

  if (isSubmitted) {
    return (
      <div className="max-w-2xl mx-auto mt-20 text-center space-y-6 animate-in slide-in-from-bottom-4 duration-500">
        <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto ring-8 ring-green-50">
          <CheckCircle2 size={40} />
        </div>
        <h2 className="text-3xl font-black text-gray-900 tracking-tight">Registration Complete</h2>
        <p className="text-gray-500 font-medium">The student record has been created and admission process initiated. A confirmation has been sent to the registered email.</p>
        <div className="pt-8">
          <Button onClick={() => { setIsSubmitted(false); setCurrentStep(1); }}>Start New Admission</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">New Admission</h1>
          <p className="text-gray-500 mt-1 font-medium italic">Step {currentStep} of {steps.length}: {steps[currentStep-1].name}</p>
        </div>
      </div>

      {/* Progress Tracker */}
      <div className="relative">
        <div className="absolute top-1/2 left-0 w-full h-0.5 bg-gray-100 -translate-y-1/2 z-0 hidden md:block"></div>
        <div className="relative z-10 flex justify-between items-center bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
          {steps.map((step, i) => (
            <div key={step.id} className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300 font-bold ${
                currentStep === step.id 
                ? "bg-blue-600 text-white shadow-lg shadow-blue-200 scale-110" 
                : currentStep > step.id 
                ? "bg-emerald-500 text-white" 
                : "bg-gray-50 text-gray-400"
              }`}>
                {currentStep > step.id ? <CheckCircle2 size={20} /> : step.id}
              </div>
              <div className="hidden sm:block">
                <p className={`text-xs font-bold uppercase tracking-wider ${currentStep === step.id ? "text-blue-600" : "text-gray-400"}`}>
                  {step.name}
                </p>
              </div>
              {i < steps.length - 1 && (
                <div className="mx-2 text-gray-200 hidden md:block">
                  <ArrowRight size={16} />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-3xl shadow-xl shadow-gray-200/50 border border-gray-100 overflow-hidden">
        <form onSubmit={handleRegister} className="p-8 md:p-10">
          {/* Step 1: Personal Information */}
          {currentStep === 1 && (
            <div className="space-y-8 animate-in slide-in-from-right-4 duration-300">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input label="Full Name" placeholder="Student's full name" required />
                <Input label="Date of Birth" type="date" required />
                <Input label="Gender" placeholder="Select Gender..." />
                <Input label="Nationality" placeholder="e.g. Indian" />
                <Input label="Blood Group" placeholder="e.g. O+" />
                <Input label="Religion" placeholder="e.g. Secular" />
              </div>
            </div>
          )}

          {/* Step 2: Contact Info */}
          {currentStep === 2 && (
            <div className="space-y-8 animate-in slide-in-from-right-4 duration-300">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input label="Student Email" type="email" placeholder="student@example.com" required />
                <Input label="Primary Phone" type="tel" placeholder="+91" required />
                <div className="md:col-span-2">
                  <Input label="Permanent Address" placeholder="Street, City, State, Pin Code" />
                </div>
                <Input label="City" placeholder="e.g. Kochi" />
                <Input label="State" placeholder="e.g. Kerala" />
              </div>
            </div>
          )}

          {/* Step 3: Academic Info */}
          {currentStep === 3 && (
            <div className="space-y-8 animate-in slide-in-from-right-4 duration-300">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input label="Admission Number" type="number" placeholder="Internal ID / Registration #" required />
                <Input label="Admission Date" type="date" required />
                
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700 ml-1">Admission Status</label>
                  <select className="block w-full rounded-xl border border-gray-200 bg-gray-50/50 shadow-sm focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 sm:text-sm p-3.5 transition-all outline-none">
                    <option value="Confirmed">Confirmed</option>
                    <option value="Pending Verification">Pending Verification</option>
                    <option value="Provisional">Provisional</option>
                  </select>
                </div>

                <div className="md:col-span-2 space-y-4 pt-4">
                  <label className="block text-sm font-semibold text-gray-700 ml-1">Documents Checklist</label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {['10th Marksheet', '12th Marksheet', 'Transfer Cert', 'Migration Cert', 'Aadhar Proof', 'Photos'].map(doc => (
                      <label key={doc} className="flex items-center gap-3 p-4 rounded-2xl border border-gray-100 bg-gray-50/30 hover:bg-white hover:border-blue-100 transition-all cursor-pointer group">
                        <input type="checkbox" className="rounded-lg text-blue-600 focus:ring-blue-500 h-5 w-5 border-gray-300 group-hover:border-blue-300 transition-colors" />
                        <span className="text-sm font-medium text-gray-600 group-hover:text-gray-900">{doc}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          <footer className="mt-12 pt-8 border-t border-gray-100 flex items-center justify-between">
            <Button 
              variant="secondary" 
              type="button" 
              onClick={handleBack} 
              disabled={currentStep === 1}
              className="flex items-center gap-2"
            >
              <ArrowLeft size={18} /> Previous
            </Button>
            
            {currentStep < steps.length ? (
              <Button 
                type="button" 
                onClick={handleNext}
                className="flex items-center gap-2"
              >
                Next <ArrowRight size={18} />
              </Button>
            ) : (
              <Button type="submit" className="bg-emerald-600 hover:bg-emerald-700 hover:shadow-emerald-500/30">
                Complete Admission
              </Button>
            )}
          </footer>
        </form>
      </div>
    </div>
  );
};
