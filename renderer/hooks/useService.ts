import React, { useState, useEffect } from 'react';

export function useService<T>(service: T) : [T] {
  const [loadedService, setService] = useState<T>(null);

  useEffect(() => {
    setService(service);
  }, []);

  return [loadedService];
}