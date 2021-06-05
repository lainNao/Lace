import useSetupDB from "../../hooks/useSetupDB";


export const useSettingsController = () => {
  const hasInitialized = useSetupDB();

  return {
    // データ
    hasInitialized,
  }
}