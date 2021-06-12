import { useToast } from "@chakra-ui/react"
import useSetupDB from '../hooks/useSetupDB';
import { useRecoilCallback, useRecoilState, useRecoilValue } from 'recoil';
import { initializeApplicationUsecase } from '../usecases/initializeApplicationUsecase';
import columnSpacesState from '../recoils/atoms/columnSpacesState';
import relatedCellsState from '../recoils/atoms/relatedCellsState';
import displaySettingsState from '../recoils/atoms/displaySettingsState';
import globalSettingsState from '../recoils/atoms/globalSettingsState';
import { LocalStorageKeys } from '../resources/enums/app';
import selectedLeftMenuState from '../recoils/atoms/selectedLeftMenuState';
import selectedColumnSpaceIdState from '../recoils/atoms/selectedColumnSpaceIdState';
import specificColumnSpaceState from '../recoils/selectors/specificColumnSpaceState';

export const useHomeController = () => {
  const [hasLoaded, hasError, setHasLoaded, setHasError] = useSetupDB();
  const [selectedLeftMenu, setSelectedLeftMenu] = useRecoilState(selectedLeftMenuState);
  const currentSelectedColumnSpaceId = useRecoilValue(selectedColumnSpaceIdState);
  const currentSelectedColumnSpace = useRecoilValue(specificColumnSpaceState(currentSelectedColumnSpaceId));
  const toast = useToast();

  const devTestFunction =  useRecoilCallback(({snapshot, set}) => async (event) => {
    console.log("開発用のメニュー発火")

    console.log(process.versions)
  }, []);

  const handleClickSetup = useRecoilCallback(({snapshot, set}) => async (event) => {
    try {
      const [newColumnSpaces, newRelatedCells, newDisplaySettings, newGlobalSettings] = await initializeApplicationUsecase();
      set(columnSpacesState, newColumnSpaces);
      set(relatedCellsState, newRelatedCells);
      set(displaySettingsState, newDisplaySettings);
      set(globalSettingsState, newGlobalSettings);
      setHasLoaded(true);
      setHasError(false);

      //NOTE: 1度でも初期化したことあるというフラグを立てる。基本的にこれが立ってれば、あとはもうここが呼ばれることは無いはず。（ただし最初期化機能作った時はまた呼ばれる）
      localStorage.setItem(LocalStorageKeys.HAS_ONCE_INITIALIZED, "true");
    } catch (e) {
      toast({ title: e.message, status: "error", position: "bottom-right", isClosable: true, duration: 10000,})
    }
  }, []);

  return {
    // 状態類
    hasLoaded,
    hasError,
    selectedLeftMenu,
    setSelectedLeftMenu,
    currentSelectedColumnSpace,

    // コールバック類
    handleClickSetup,
    devTestFunction,
  }

}