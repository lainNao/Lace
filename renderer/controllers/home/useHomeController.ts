import { useRecoilState } from "recoil";
import useSetupDB from "../../hooks/useSetupDB";
import selectedLeftMenuState from "../../recoils/atoms/selectedLeftMenuState";


export const useHomeController = () => {
  const [selectedLeftMenu, setSelectedLeftMenu] = useRecoilState(selectedLeftMenuState);

  return {
    selectedLeftMenu,
    setSelectedLeftMenu,
  }
}