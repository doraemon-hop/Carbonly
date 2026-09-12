import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  X, 
  Upload, 
  CheckCircle2, 
  ShieldCheck, 
  Sparkles, 
  Camera, 
  FileText, 
  MapPin, 
  ArrowRight,
  RefreshCw,
  Clock
} from 'lucide-react';

export const VerificationModal = () => {
  const { activeVerification, closeVerificationModal, submitVerification } = useApp();
  const [step, setStep] = useState(1); // 1: Details, 2: Upload Proof, 3: Verifying, 4: Success
  const [notes, setNotes] = useState('');
  const [facility, setFacility] = useState('');
  const [proofImage, setProofImage] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  if (!activeVerification) return null;

  const { action, category } = activeVerification;

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProofImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleQuickUploadPreset = (presetType) => {
    const presets = {
      receipt: 'https://images.unsplash.com/photo-1550009158-9ebf69173e03?auto=format&fit=crop&q=80&w=400',
      dropoff: 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?auto=format&fit=crop&q=80&w=400',
      repair: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&q=80&w=400',
      ticket: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&q=80&w=400'
    };
    setImagePreview(presets[presetType] || presets.receipt);
  };

  const handleStartVerification = async () => {
    setIsProcessing(true);
    setStep(3);

    // Realistic smart verification simulation steps
    setTimeout(async () => {
      try {
        await submitVerification({
          type: category || 'repair',
          title: action.title,
          carbonSaved: action.carbonSaved,
          ecoPoints: action.ecoPoints,
          facility: facility || action.provider || 'Ahmedabad Certified Hub',
          proofUrl: imagePreview || 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&q=80&w=400',
          notes: notes || 'Verified circular action completed according to standards.',
        });
        setStep(4);
      } catch (err) {
        setIsProcessing(false);
      }
    }, 1800);
  };

  const getCategoryBadgeColor = (cat) => {
    switch (cat?.toLowerCase()) {
      case 'repair': return 'bg-amber-100 text-amber-800 border-amber-300';
      case 'reuse': return 'bg-teal-100 text-teal-800 border-teal-300';
      case 'recycle': return 'bg-sky-100 text-sky-800 border-sky-300';
      case 'offset': return 'bg-emerald-100 text-emerald-800 border-emerald-300';
      default: return 'bg-emerald-100 text-emerald-800 border-emerald-300';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/80">
          <div className="flex items-center gap-2">
            <span className={`px-2.5 py-0.5 text-xs font-semibold rounded-full border uppercase tracking-wider ${getCategoryBadgeColor(category)}`}>
              {category} Action
            </span>
            <span className="text-xs text-slate-500 font-medium">Step {step} of 3</span>
          </div>
          <button
            onClick={closeVerificationModal}
            className="text-slate-400 hover:text-slate-700 p-1.5 rounded-lg hover:bg-slate-200/60 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto flex-1">
          {step === 1 && (
            <div className="space-y-5">
              <div>
                <h3 className="text-xl font-bold text-slate-900">{action.title}</h3>
                <p className="text-sm text-slate-500 mt-1">
                  Complete this action to divert material from incinerators/landfills and earn verified EcoPoints.
                </p>
              </div>

              {/* Action Metric Cards */}
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200">
                  <div className="text-xs font-medium text-emerald-700">Carbon Offset Potential</div>
                  <div className="text-2xl font-bold text-emerald-900 mt-0.5">
                    +{action.carbonSaved} <span className="text-sm font-normal text-emerald-700">kg CO₂e</span>
                  </div>
                </div>
                <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200">
                  <div className="text-xs font-medium text-amber-700">EcoPoints Reward</div>
                  <div className="text-2xl font-bold text-amber-900 mt-0.5">
                    +{action.ecoPoints} <span className="text-sm font-normal text-amber-700">pts</span>
                  </div>
                </div>
              </div>

              {/* Provider / Guidelines */}
              <div className="space-y-2.5 p-4 rounded-xl bg-slate-50 border border-slate-200 text-sm">
                <div className="flex items-center gap-2 text-slate-700 font-medium">
                  <MapPin className="w-4 h-4 text-emerald-600" />
                  <span>Recommended Provider / Location:</span>
                </div>
                <div className="text-slate-600 pl-6">
                  {action.provider || 'Any certified recycling center or authorized local workshop'}
                </div>

                <div className="flex items-center gap-2 text-slate-700 font-medium pt-1">
                  <Clock className="w-4 h-4 text-emerald-600" />
                  <span>Estimated Time:</span>
                </div>
                <div className="text-slate-600 pl-6">
                  {action.timeEstimate || '15 - 45 minutes'}
                </div>
              </div>

              <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl flex items-start gap-2.5 text-xs text-blue-800">
                <ShieldCheck className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                <span>
                  Carbonly uses AI geotagging and receipt matching to ensure all claimed carbon reductions are legitimate and tamper-proof.
                </span>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-bold text-slate-900">Upload Proof of Action</h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Upload a photo of your receipt, recycling bin drop-off slip, before/after repair, or ticket.
                </p>
              </div>

              {/* Upload Dropzone */}
              <div className="border-2 border-dashed border-slate-300 hover:border-emerald-500 rounded-2xl p-4 text-center transition-all bg-slate-50/50">
                {imagePreview ? (
                  <div className="relative">
                    <img
                      src={imagePreview}
                      alt="Proof preview"
                      className="w-full h-44 object-cover rounded-xl border border-slate-200"
                    />
                    <button
                      onClick={() => { setImagePreview(''); setProofImage(null); }}
                      className="absolute top-2 right-2 bg-slate-900/80 text-white p-1 rounded-full hover:bg-slate-900"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <div className="py-6 flex flex-col items-center">
                    <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mb-3">
                      <Camera className="w-6 h-6" />
                    </div>
                    <label className="cursor-pointer">
                      <span className="px-4 py-2 bg-emerald-600 text-white text-xs font-semibold rounded-lg hover:bg-emerald-700 shadow-sm transition">
                        Select Photo / File
                      </span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleImageChange}
                      />
                    </label>
                    <p className="text-xs text-slate-400 mt-2">PNG, JPG or WEBP up to 10MB</p>
                  </div>
                )}
              </div>

              {/* Quick Preset Buttons for rapid testing */}
              <div>
                <div className="text-xs font-medium text-slate-500 mb-1.5 flex items-center justify-between">
                  <span>⚡ Quick Demo Photo Presets:</span>
                  <span className="text-[10px] text-emerald-600 font-semibold">1-Click Test</span>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => handleQuickUploadPreset('receipt')}
                    className="text-xs py-1.5 px-2 bg-slate-100 hover:bg-emerald-50 hover:text-emerald-700 rounded-lg border border-slate-200 text-slate-700 transition"
                  >
                    🧾 Store Receipt
                  </button>
                  <button
                    type="button"
                    onClick={() => handleQuickUploadPreset('dropoff')}
                    className="text-xs py-1.5 px-2 bg-slate-100 hover:bg-emerald-50 hover:text-emerald-700 rounded-lg border border-slate-200 text-slate-700 transition"
                  >
                    ♻️ Drop-off Bin
                  </button>
                  <button
                    type="button"
                    onClick={() => handleQuickUploadPreset('ticket')}
                    className="text-xs py-1.5 px-2 bg-slate-100 hover:bg-emerald-50 hover:text-emerald-700 rounded-lg border border-slate-200 text-slate-700 transition"
                  >
                    🚇 Metro Ticket
                  </button>
                </div>
              </div>

              {/* Notes & Facility */}
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Facility or Vendor Name (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. GreenCycle Navrangpura or Local Cobbler"
                    value={facility}
                    onChange={(e) => setFacility(e.target.value)}
                    className="w-full text-xs px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Action Notes or Weight/Units
                  </label>
                  <textarea
                    rows={2}
                    placeholder="e.g. Dropped off 2 laptop chargers and 1 old broken power bank."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="w-full text-xs px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                  />
                </div>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="py-12 flex flex-col items-center text-center space-y-4">
              <div className="relative">
                <div className="w-16 h-16 rounded-full border-4 border-emerald-200 border-t-emerald-600 animate-spin flex items-center justify-center"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <Sparkles className="w-6 h-6 text-emerald-600 animate-pulse" />
                </div>
              </div>
              <div>
                <h4 className="text-base font-bold text-slate-900">Verifying Carbon Savings</h4>
                <p className="text-xs text-slate-500 mt-1 max-w-xs">
                  Running automated receipt analysis, geotag validation, and emission factor calculation...
                </p>
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="py-8 flex flex-col items-center text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center border-4 border-emerald-50">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <div>
                <h4 className="text-xl font-bold text-slate-900">Action Verified!</h4>
                <p className="text-sm text-slate-500 mt-1">
                  You successfully diverted emissions and earned your rewards.
                </p>
              </div>
              <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 w-full max-w-xs">
                <div className="text-xs text-emerald-700 font-medium">Credited to Green Wallet</div>
                <div className="text-3xl font-extrabold text-emerald-800 mt-1">
                  +{action.ecoPoints} <span className="text-sm font-semibold">EcoPoints</span>
                </div>
                <div className="text-xs text-emerald-600 mt-1">
                  Avoided: +{action.carbonSaved} kg CO₂e
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 border-t border-slate-100 bg-slate-50 flex items-center justify-between">
          {step === 1 && (
            <>
              <button
                type="button"
                onClick={closeVerificationModal}
                className="text-xs font-semibold text-slate-600 hover:text-slate-800 px-4 py-2 rounded-lg"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => setStep(2)}
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-xl shadow-md transition"
              >
                <span>Proceed to Verify</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </>
          )}

          {step === 2 && (
            <>
              <button
                type="button"
                onClick={() => setStep(1)}
                className="text-xs font-semibold text-slate-600 hover:text-slate-800 px-4 py-2 rounded-lg"
              >
                Back
              </button>
              <button
                type="button"
                onClick={handleStartVerification}
                className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-xl shadow-md hover:shadow-lg transition"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>Submit & Earn Points</span>
              </button>
            </>
          )}

          {step === 4 && (
            <button
              type="button"
              onClick={closeVerificationModal}
              className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-xl shadow-md transition"
            >
              Done & Return to App
            </button>
          )}
        </div>

      </div>
    </div>
  );
};
