import useSetupDB from "../../hooks/useSetupDB";


export const useHomeController = () => {
  const hasInitialized = useSetupDB();

  return {
    // データ
    hasInitialized,
  }
}