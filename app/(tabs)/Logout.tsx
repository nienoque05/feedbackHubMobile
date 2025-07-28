import { auth } from '@/services/firebaseConnection';
import { useRouter } from 'expo-router';
import { signOut } from 'firebase/auth';
import { useEffect } from 'react';

export default function Logout() {
  const router = useRouter();

  useEffect(() => {
    const doLogout = async () => {
      await signOut(auth);
      router.replace('/'); 
    };

    doLogout();
  }, []);

  return null;
}
