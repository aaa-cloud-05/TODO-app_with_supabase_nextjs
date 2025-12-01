'use client'

import { useAuthStore } from '@/stores/useAuthStore';
import { useEffect } from 'react'

const AuthInitializer = () => {
  const initialize = useAuthStore((state) => state.initialize);
  useEffect(() => {
    initialize();
  }, [initialize]);
  
  return null;
}

export default AuthInitializer