import { useState } from 'react';

export function useForceUpdate(){
  const [value, setValue] = useState(0); // integer state
  return () => setValue(val => val + 1); // update the state to force render
}