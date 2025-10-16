import { useState, useEffect, useCallback } from 'react';
import { 
  readLock, 
  isLocked, 
  remainingMs, 
  formatTimeRemaining, 
  type Lockout 
} from '@/lib/authLockout';

export function useAuthLockout() {
  const [lockout, setLockout] = useState<Lockout>(readLock());
  const [isDisabled, setIsDisabled] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [formattedTime, setFormattedTime] = useState('');

  // Update lockout state
  const updateLockoutState = useCallback(() => {
    const currentLockout = readLock();
    setLockout(currentLockout);
    
    const locked = isLocked(currentLockout);
    setIsDisabled(locked);
    
    const remaining = remainingMs(currentLockout);
    setTimeRemaining(remaining);
    setFormattedTime(formatTimeRemaining(remaining));
  }, []);

  // Initial state setup
  useEffect(() => {
    updateLockoutState();
  }, [updateLockoutState]);

  // Countdown timer
  useEffect(() => {
    if (timeRemaining > 0) {
      const timer = setTimeout(() => {
        updateLockoutState();
      }, 1000);
      return () => clearTimeout(timer);
    } else if (isDisabled) {
      // Auto-unlock when time expires
      updateLockoutState();
    }
  }, [timeRemaining, isDisabled, updateLockoutState]);

  // Cross-tab synchronization
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'auth_lockout_v1') {
        updateLockoutState();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [updateLockoutState]);

  return {
    lockout,
    isDisabled,
    timeRemaining,
    formattedTime,
    updateLockoutState
  };
}
