import useSetupColumnSpaces from '../../hooks/useSetupColumnSpaces';
import useSetupRelatedCells from '../../hooks/useSetupRelatedCells';

export const useHomeController = () => {
  const [columnSpaces, setColumnSpaces] = useSetupColumnSpaces();
  const [relatedCells, setRelatedCells] = useSetupRelatedCells();

  return {
    columnSpaces
  }
}