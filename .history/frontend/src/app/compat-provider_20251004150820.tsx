'use client';

import { useEffect, type ReactNode } from 'react';

/**
 * Development-only suppression for Ant Design React 19 compatibility warning.
 * This does NOT affect production behavior and only filters the specific line
 * "[antd: compatible] antd v5 support React is 16 ~ 18..."
 */
export default function CompatProvider({ children }: { children: ReactNode }) {
  useEffect(() => {
    if (process.env.NODE_ENV !== 'development') {
      return;
    }
    const originalWarn = console.warn;

    console.warn = (...args: any[]) => {
      const first = args[0];
      if (typeof first === 'string' && first.includes('[antd: compatible] antd v5 support React is 16 ~ 18')) {
        // Suppress only this compatibility warning line
        return;
      }
      originalWarn(...args);
    };

    return () => {
      console.warn = originalWarn;
    };
  }, []);

  return <>{children}</>;
}