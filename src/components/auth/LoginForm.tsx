'use client';

import { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { motion } from 'framer-motion';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Apple, Loader2 } from 'lucide-react';
import PasswordInput from './PasswordInput';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { firebaseAuth } from '@/lib/firebaseAuth';

interface LoginFormProps {
  onSwitchMode: () => void;
  onLoginSuccess?: () => void;
}

export default function LoginForm({ onSwitchMode, onLoginSuccess }: LoginFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const result = await firebaseAuth.signIn(formData.email, formData.password);

      if (result.user) {
        toast.success('Successfully logged in!');
        
        if (onLoginSuccess) {
          onLoginSuccess();
        }
        
        setTimeout(() => {
          router.push('/dashboard');
        }, 100);
      } else {
        toast.info('Login successful, but session not immediately available. Please wait or refresh.');
      }
    } catch (error: any) {
      console.error('Login error:', error);
      
      // Handle specific Firebase errors
      let errorMessage = 'Invalid login credentials. Please try again.';
      if (error.code === 'auth/user-not-found') {
        errorMessage = 'No account found with this email address.';
      } else if (error.code === 'auth/wrong-password') {
        errorMessage = 'Incorrect password. Please try again.';
      } else if (error.code === 'auth/invalid-email') {
        errorMessage = 'Invalid email address format.';
      } else if (error.code === 'auth/user-disabled') {
        errorMessage = 'This account has been disabled.';
      } else if (error.code === 'auth/too-many-requests') {
        errorMessage = 'Too many failed attempts. Please try again later.';
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = useCallback(async () => {
    console.log('[LoginForm] handleGoogleLogin triggered');
    setIsLoading(true);
    
    try {
      const origin = window.location.origin;
      console.log('[LoginForm] Origin for redirect:', origin);

      // Get the current URL params to preserve redirectedFrom
      const currentParams = new URLSearchParams(window.location.search);
      const redirectedFrom = currentParams.get('redirectedFrom') || '/dashboard';

      console.log('[LoginForm] Attempting Firebase Google sign-in...');
      const result = await firebaseAuth.signInWithGoogle();
      
      console.log('[LoginForm] Google sign-in successful:', result.user?.email);
      
      if (result.user) {
        toast.success('Successfully signed in with Google!');
        
        if (onLoginSuccess) {
          onLoginSuccess();
        }
        
        // Redirect to the intended destination
        setTimeout(() => {
          router.push(decodeURIComponent(redirectedFrom));
        }, 100);
      }

    } catch (error: any) {
      console.error('Google OAuth Error:', error.message, error);
      
      // Handle specific Firebase Google auth errors
      let errorMessage = 'Google Sign-In failed. Please try again.';
      if (error.code === 'auth/popup-closed-by-user') {
        errorMessage = 'Google Sign-In was cancelled.';
      } else if (error.code === 'auth/popup-blocked') {
        errorMessage = 'Popup was blocked. Please allow popups and try again.';
      } else if (error.code === 'auth/cancelled-popup-request') {
        errorMessage = 'Google Sign-In was cancelled.';
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [router, onLoginSuccess]);

  const handleAppleLogin = useCallback(async () => {
    toast.error('Apple Sign-In is currently being configured.');
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-6"
    >
      <div className="space-y-2 text-center">
        <h1 className="text-2xl font-semibold tracking-tight">Log In</h1>
        <p className="text-sm text-muted-foreground">Enter your credentials to access your account.</p>
      </div>

      <div className="grid grid-cols-1 gap-4">
        <Button
          variant="outline"
          className="bg-transparent border-gray-800 hover:bg-gray-900 flex gap-2"
          onClick={handleGoogleLogin}
          disabled={isLoading}
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" className="mr-2">
            <path fill="#EA4335" d="M12.0002 5.37842C13.1736 5.37842 14.2881 5.82111 15.297 6.69568L18.0248 3.9761C16.3137 2.40813 14.2106 1.53357 12.0002 1.53357C8.60782 1.53357 5.57584 3.40745 4 6.19979L7.11022 8.55914C7.8942 6.69568 9.79705 5.37842 12.0002 5.37842Z"></path>
            <path fill="#4285F4" d="M23.49 12.2744C23.49 11.4761 23.4315 10.677 23.3061 9.90028H12V14.0936H18.4696C18.1611 15.5112 17.3294 16.7029 16.1061 17.4928V20.3971H19.9599C22.2278 18.3431 23.49 15.5687 23.49 12.2744Z"></path>
            <path fill="#34A853" d="M12.0002 24.0008C15.2365 24.0008 17.956 22.939 19.9684 20.3978L16.1146 17.4935C15.0586 18.2166 13.6894 18.6343 12.0002 18.6343C9.79184 18.6343 7.8934 17.3178 7.11483 15.4277L3.17383 18.2326C4.77014 21.676 8.20424 24.0008 12.0002 24.0008Z"></path>
            <path fill="#FBBC05" d="M7.11483 15.4269C6.83636 14.6621 6.68183 13.8406 6.68183 12.9999C6.68183 12.1591 6.83636 11.3376 7.11483 10.5729L3.17383 7.76697C2.26791 9.34538 1.75757 11.1204 1.75757 12.9999C1.75757 14.8793 2.26791 16.6544 3.17383 18.2328L7.11483 15.4269Z"></path>
          </svg>
          {isLoading ? 'Signing in...' : 'Mit Google anmelden'}
        </Button>
        <Button
          variant="outline"
          className="bg-transparent border-gray-800 hover:bg-gray-900 flex gap-2"
          onClick={handleAppleLogin}
          disabled={isLoading}
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" className="mr-2">
            <path fill="currentColor" d="M17.0625 12.2518C17.0841 14.1565 18.1454 15.8574 19.8222 16.715C19.1895 18.1653 17.8207 20.1588 16.0926 20.1857C14.3926 20.2119 13.7854 19.0336 11.8982 19.0336C10.0111 19.0336 9.3523 20.1588 7.77259 20.2119C6.09383 20.2649 4.40886 17.9011 3.77057 16.4515C2.50208 13.6 3.4524 9.07606 5.87516 6.61411C7.06594 5.42224 8.71329 4.72458 10.2667 4.72458C12.0292 4.72458 13.1762 5.93446 14.6594 5.93446C16.1172 5.93446 17.0186 4.72458 19.0194 4.72458C20.3967 4.72458 21.8042 5.30164 22.9252 6.35175C21.2274 7.39512 20.1325 9.0975 20.11 11.0021C20.1148 11.4077 20.1629 11.8111 20.2534 12.2042C20.2534 12.2201 20.2534 12.236 20.2533 12.252C20.2521 12.2518 17.1484 12.2518 17.0625 12.2518Z"></path>
            <path fill="currentColor" d="M15.1341 3.54435C15.9408 2.51762 16.401 1.24282 16.3341 0C15.0683 0.0606477 13.8333 0.706496 12.9358 1.50468C12.0492 2.30778 11.5399 3.40793 11.5288 4.56468C12.7396 4.58619 14.3274 4.07109 15.1341 3.54435Z"></path>
          </svg>
          Mit Apple anmelden
        </Button>
      </div>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <Separator className="w-full border-gray-800" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-black px-2 text-muted-foreground">Or</span>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            name="email"
            type="email"
            placeholder="eg. johnwick@bullet.com"
            className="bg-gray-900 border-gray-800 text-white focus:border-purple-500"
            required
            value={formData.email}
            onChange={handleChange}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <PasswordInput 
            id="password" 
            name="password" 
            value={formData.password} 
            onChange={handleChange} 
            required 
          />
        </div>

        <Button type="submit" className="w-full bg-white text-black hover:bg-gray-200" disabled={isLoading}>
          {isLoading ? 'Logging in...' : 'Log In'}
        </Button>
      </form>

      <div className="text-center text-sm">
        Don't have an account?{' '}
        <Button
          variant="link"
          className="text-purple-400 hover:text-purple-300 font-medium p-0 h-auto"
          onClick={onSwitchMode}
        >
          Sign Up
        </Button>
      </div>
    </motion.div>
  );
}
