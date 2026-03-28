import { useState } from 'react';
import { useUserStore } from '../store/userStore';

export function useRazorpay() {
  const { user, setUser } = useUserStore();
  const [isProcessing, setIsProcessing] = useState(false);

  const upgradeToPro = async () => {
    if (!user) return;
    
    setIsProcessing(true);
    
    try {
      // In a real app, this would call your backend to create a Razorpay order
      // and then open the Razorpay checkout modal.
      // For this demo, we'll simulate a successful payment after a short delay.
      
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Update user state locally (in a real app, backend webhook updates Firestore)
      setUser({
        ...user,
        isPro: true,
        credits: 999999 // Unlimited
      });
      
      alert('Payment successful! You are now a Pro user.');
    } catch (error) {
      console.error('Payment failed:', error);
      alert('Payment failed. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  return { upgradeToPro, isProcessing };
}
