// Authentication hook
import { useState, useEffect } from 'react';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  sendPasswordResetEmail,
  updateProfile as firebaseUpdateProfile,
  updatePassword as firebaseUpdatePassword,
  reauthenticateWithCredential,
  EmailAuthProvider,
  User 
} from 'firebase/auth';
import { auth } from '@/lib/firebase';

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Listen for auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  // Sign up with email and password
  const signUp = async (email: string, password: string) => {
    setLoading(true);
    setError(null);
    try {
      await createUserWithEmailAndPassword(auth, email, password);
    } catch (err) {
      setError((err as Error).message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Sign in with email and password
  const signIn = async (email: string, password: string) => {
    setLoading(true);
    setError(null);
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (err) {
      setError((err as Error).message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Sign out
  const signOut = async () => {
    setLoading(true);
    setError(null);
    try {
      await firebaseSignOut(auth);
    } catch (err) {
      setError((err as Error).message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Reset password
  const resetPassword = async (email: string) => {
    setLoading(true);
    setError(null);
    try {
      await sendPasswordResetEmail(auth, email);
    } catch (err) {
      setError((err as Error).message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Update display name
  const updateProfile = async (displayName: string) => {
    if (!user) {
      console.log("updateProfile: No user logged in");
      return;
    }
    
    console.log("updateProfile: Starting update for user", user.email, "New displayName:", displayName);
    setLoading(true);
    setError(null);
    try {
      console.log("updateProfile: Calling Firebase updateProfile");
      
      // Update profile in Firebase
      await firebaseUpdateProfile(user, { 
        displayName: displayName 
      });
      
      console.log("updateProfile: Firebase update successful");
      
      // Update local user state
      // In some cases Firebase doesn't update the local user object immediately
      // so we do this manually to immediately display the updates in the UI
      setUser(prevUser => {
        if (!prevUser) return null;
        return { ...prevUser, displayName };
      });
      
      console.log("updateProfile: Local user state updated", { displayName });
      
      return true;
    } catch (err) {
      console.error("updateProfile: Error updating profile", err);
      setError((err as Error).message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Update password with reauthentication
  const updatePassword = async (currentPassword: string, newPassword: string) => {
    if (!user || !user.email) return;
    
    setLoading(true);
    setError(null);
    try {
      // Reauthenticate first
      const credential = EmailAuthProvider.credential(user.email, currentPassword);
      await reauthenticateWithCredential(user, credential);
      
      // Then update password
      await firebaseUpdatePassword(user, newPassword);
    } catch (err) {
      setError((err as Error).message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    user,
    loading,
    error,
    signIn,
    signUp,
    signOut,
    resetPassword,
    updateProfile,
    updatePassword,
  };
} 