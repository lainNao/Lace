import { useRecoilState } from "recoil";
import selectedLeftMenuState from "../../recoils/atoms/selectedLeftMenuState";


export const useHomeController = () => {
  const [selectedLeftMenu, setSelectedLeftMenu] = useRecoilState(selectedLeftMenuState);

  return {
    selectedLeftMenu,
    setSelectedLeftMenu,
  }
}