'use client';

import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Youtube, Shield, CheckCircle, ExternalLink, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { useFirebaseAuth } from '@/context/FirebaseAuthContext';

interface YouTubeConnectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function YouTubeConnectionModal({ isOpen, onClose, onSuccess }: YouTubeConnectionModalProps) {
  const [isConnecting, setIsConnecting] = useState(false);
  const [currentStep, setCurrentStep] = useState<'explanation' | 'connecting' | 'success'>('explanation');
  const { updateYouTubeConnection } = useFirebaseAuth();

  const handleConnectYouTube = async () => {
    setIsConnecting(true);
    setCurrentStep('connecting');
    
    try {
      // For Firebase, we'll redirect to a special YouTube OAuth flow
      // that handles the additional YouTube scopes
      const youtubeOAuthUrl = `/api/auth/youtube-oauth?returnTo=${encodeURIComponent('/dashboard/settings')}`;
      
      console.log('[YouTubeModal] Redirecting to YouTube OAuth URL:', youtubeOAuthUrl);
      window.location.href = youtubeOAuthUrl;
      
    } catch (error: any) {
      console.error("Unexpected error in YouTube connection:", error);
      toast.error('An unexpected error occurred. Please try again.');
      setIsConnecting(false);
      setCurrentStep('explanation');
    }
  };

  const handleClose = () => {
    if (!isConnecting) {
      onClose();
      setCurrentStep('explanation');
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
            <Youtube className="h-6 w-6 text-red-600" />
          </div>
          <DialogTitle className="text-xl font-semibold">
            {currentStep === 'explanation' && 'Connect Your YouTube Channel'}
            {currentStep === 'connecting' && 'Connecting to YouTube...'}
            {currentStep === 'success' && 'Successfully Connected!'}
          </DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground">
            {currentStep === 'explanation' && 'Access your YouTube analytics and enhance your content strategy'}
            {currentStep === 'connecting' && 'Please complete the authorization in the popup window'}
            {currentStep === 'success' && 'Your YouTube channel is now connected to TrueViral.ai'}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {currentStep === 'explanation' && (
            <>
              <div className="space-y-3">
                <div className="rounded-lg bg-red-50 p-4 border border-red-200">
                  <h4 className="font-medium text-red-900 mb-2">What you'll get access to:</h4>
                  <ul className="space-y-1 text-sm text-red-800">
                    <li className="flex items-center">
                      <CheckCircle className="h-3 w-3 mr-2 text-red-600" />
                      Channel analytics and insights
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="h-3 w-3 mr-2 text-red-600" />
                      Video performance metrics
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="h-3 w-3 mr-2 text-red-600" />
                      Audience demographics
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="h-3 w-3 mr-2 text-red-600" />
                      AI-powered content recommendations
                    </li>
                  </ul>
                </div>

                <div className="rounded-lg bg-blue-50 p-4 border border-blue-200">
                  <div className="flex items-start">
                    <Shield className="h-4 w-4 text-blue-600 mr-2 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-blue-900 text-sm">Secure Connection</h4>
                      <p className="text-xs text-blue-800 mt-1">
                        Since YouTube is owned by Google, you'll securely authenticate through Google's system. 
                        We only access your YouTube data - no other Google services.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-2">
                <Button
                  onClick={handleConnectYouTube}
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white"
                  disabled={isConnecting}
                >
                  {isConnecting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Connecting...
                    </>
                  ) : (
                    <>
                      <Youtube className="mr-2 h-4 w-4" />
                      Connect YouTube Channel
                    </>
                  )}
                </Button>
                <Button variant="outline" onClick={handleClose} disabled={isConnecting}>
                  Cancel
                </Button>
              </div>
            </>
          )}

          {currentStep === 'connecting' && (
            <div className="text-center py-6">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
                <Loader2 className="h-8 w-8 text-red-600 animate-spin" />
              </div>
              <p className="text-sm text-muted-foreground mb-4">
                A popup window should have opened for YouTube authorization.
                <br />
                If you don't see it, please check your popup blocker.
              </p>
              <Button variant="outline" size="sm" onClick={() => window.focus()}>
                <ExternalLink className="mr-2 h-3 w-3" />
                Bring popup to front
              </Button>
            </div>
          )}

          {currentStep === 'success' && (
            <div className="text-center py-6">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
              <p className="text-sm text-muted-foreground mb-4">
                Your YouTube channel has been successfully connected!
                You can now access enhanced analytics and insights.
              </p>
              <Button onClick={() => { onSuccess(); onClose(); }} className="w-full">
                Continue to Dashboard
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
