import { useRecoilCallback, useRecoilState, useRecoilValue } from "recoil";
import displayTargetColumnSpaceIdState from "../recoils/atoms/displayTargetColumnSpaceIdState";
import selectedLeftMenuState from "../recoils/atoms/selectedLeftMenuState";
import specificColumnSpaceState from "../recoils/selectors/specificColumnSpaceState";

export const useMenuBarController = () => {
  const [selectedLeftMenu, setSelectedLeftMenu] = useRecoilState(selectedLeftMenuState);
  const displayTargetSelectedColumnSpaceId = useRecoilValue(displayTargetColumnSpaceIdState);
  const displayTargetSelectedColumnSpace = useRecoilValue(specificColumnSpaceState(displayTargetSelectedColumnSpaceId));

  const devTestFunction =  useRecoilCallback(({snapshot, set}) => async (event) => {
    console.log("開発用のメニュー発火")

    console.log(process.versions)
  }, []);

  return {
    // 状態類
    selectedLeftMenu,
    displayTargetSelectedColumnSpace,

    // コールバック類
    devTestFunction,
  }
}