import useSetupColumnSpaces from '../../hooks/useSetupColumnSpaces';

export const useHomeController = () => {
  const [columnSpaces, setColumnSpaces] = useSetupColumnSpaces();

  return {
    columnSpaces
  }
}