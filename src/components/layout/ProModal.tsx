import { X, Check } from 'lucide-react';
import { useRazorpay } from '../../hooks/useRazorpay';

interface ProModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ProModal({ isOpen, onClose }: ProModalProps) {
  const { upgradeToPro, isProcessing } = useRazorpay();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-[#252526] border border-[#3c3c3c] rounded-xl w-full max-w-md overflow-hidden shadow-2xl">
        <div className="flex justify-between items-center p-4 border-b border-[#3c3c3c]">
          <h2 className="text-lg font-semibold text-white">Upgrade to Pro</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
            <X size={20} />
          </button>
        </div>
        
        <div className="p-6">
          <div className="text-center mb-6">
            <div className="text-3xl font-bold text-white mb-2">₹499<span className="text-sm text-gray-400 font-normal">/month</span></div>
            <p className="text-sm text-gray-400">Unlock unlimited AI generation and premium features.</p>
          </div>
          
          <ul className="space-y-3 mb-8">
            {[
              'Unlimited Cloud AI requests',
              'Access to premium models (Gemini Pro)',
              'Priority support',
              'Advanced code refactoring tools',
              'Cloud project sync'
            ].map((feature, i) => (
              <li key={i} className="flex items-center gap-3 text-sm text-gray-300">
                <div className="bg-blue-500/20 p-1 rounded-full text-blue-400">
                  <Check size={14} />
                </div>
                {feature}
              </li>
            ))}
          </ul>
          
          <button
            onClick={upgradeToPro}
            disabled={isProcessing}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 rounded-lg transition-colors disabled:opacity-50 flex justify-center items-center"
          >
            {isProcessing ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              'Subscribe with Razorpay'
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
