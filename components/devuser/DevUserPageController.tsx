'use client';

import { useEffect } from 'react';

export function DevUserPageController() {
  useEffect(() => {
    document.body.setAttribute('data-devuser', 'true');
    return () => {
      document.body.removeAttribute('data-devuser');
    };
  }, []);

  return null;
}
