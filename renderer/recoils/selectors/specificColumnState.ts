import { selectorFamily } from 'recoil';
import columnSpacesState from '../atoms/columnSpacesState';

const specificColumnState = selectorFamily({
  key: 'specificColumnState',
  get: (columnId) => ({get}) => {
    const rootColumnSpaces = get(columnSpacesState);
    return rootColumnSpaces?.findDescendantColumn(String(columnId));
  }
});

export default specificColumnState;
