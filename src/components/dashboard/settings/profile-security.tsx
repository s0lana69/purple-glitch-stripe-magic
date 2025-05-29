'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import { useAuth } from '@/context/FirebaseAuthContext';
import { LogOut } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export function ProfileSecurity() {
  const { signOut } = useAuth();

  const handleManagePreferences = () => {
    toast.info('Notification preferences feature is coming soon!');
  };

  const handleChangePassword = () => {
    toast.info('Password change functionality will be available shortly. For now, please manage your password via your Supabase account settings if you used email/password signup.');
  };

  const handleTwoFactorAuth = () => {
    toast.info('Two-Factor Authentication (2FA) setup is under development and will be available soon.');
  };

  const handleDeleteAccount = () => {
    toast.warning('Account deletion initiated (Simulated). In a real application, this would require further confirmation and backend processing.');
  };

  const handleLogout = async () => {
    try {
      await signOut();
      toast.success('Successfully logged out');
    } catch (error) {
      toast.error('Failed to logout');
      console.error('Logout error:', error);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Profile & Security</CardTitle>
        <CardDescription>Manage your personal information and account security settings for TrueViral.ai.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <h3 className="text-lg font-medium text-foreground">Account Management</h3>
          <p className="text-sm text-muted-foreground">Sign out of your account securely.</p>
          <Button variant="outline" onClick={handleLogout} className="flex items-center gap-2">
            <LogOut className="h-4 w-4" />
            Sign Out
          </Button>
        </div>
        <Separator />
        <div className="space-y-2">
          <h3 className="text-lg font-medium text-foreground">Notification Preferences</h3>
          <p className="text-sm text-muted-foreground">Choose what updates and alerts you want to receive from TrueViral.ai.</p>
          <Button variant="outline" onClick={handleManagePreferences}>
            Manage Notifications
          </Button>
        </div>
        <Separator />
        <div className="space-y-2">
          <h3 className="text-lg font-medium text-foreground">Account Security</h3>
          <p className="text-sm text-muted-foreground">Update your password and enhance account security with two-factor authentication.</p>
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" onClick={handleChangePassword}>
              Change Password
            </Button>
            <Button variant="outline" onClick={handleTwoFactorAuth}>
              Set Up 2FA
            </Button>
          </div>
        </div>
        <Separator />
        <div className="space-y-2">
          <h3 className="text-lg font-medium text-destructive">Delete Account</h3>
          <p className="text-sm text-muted-foreground">Permanently delete your TrueViral.ai account and all associated data. This action cannot be undone.</p>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive">Delete My Account</Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete your
                  account and remove all your content analysis data, API keys, and personal settings from our servers.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleDeleteAccount} className="bg-destructive hover:bg-destructive/90 text-destructive-foreground">
                  Yes, delete my account
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </CardContent>
    </Card>
  );
}
