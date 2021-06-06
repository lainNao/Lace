import { atom, selector, selectorFamily } from 'recoil';
import columnSpacesState from '../atoms/columnSpacesState';

const specificColumnSpaceState = selectorFamily({
  key: 'specificColumnSpaceState',
  get: (columnSpaceId) => ({get}) => {
    if (!columnSpaceId) return null;
    const rootColumnSpaces = get(columnSpacesState);
    return rootColumnSpaces?.findDescendantColumnSpace(String(columnSpaceId));
  }
});

export default specificColumnSpaceState;
