'use client';

import { Button } from '@/components/ui/button';
import { useFirebaseAuth } from '@/context/FirebaseAuthContext';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

export function LogoutButton() {
  const router = useRouter();
  const { signOut } = useFirebaseAuth();

  const handleLogout = async () => {
    try {
      await signOut();
      toast.success('Logged out successfully!');
      router.push('/'); // Redirect to homepage
    } catch (error: any) {
      console.error('Logout error:', error.message);
      toast.error(`Logout failed: ${error.message}`);
    }
  };

  return (
    <Button 
      variant="default" 
      onClick={handleLogout}
      className="bg-purple-600 hover:bg-purple-700 text-white"
    >
      Logout
    </Button>
  );
}
