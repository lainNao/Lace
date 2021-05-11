import { useEffect, useState } from "react";

export default function useSetupSettings() {

  const [expandedColumnSpaces, setExpandedColumnSpaces] = useState<string[]>([]);

  useEffect(() => {
    //TODO 無いIDが入ってる可能性を考慮
    const expandedColumnSpaces = localStorage.getItem("expandedColumnSpaces")
    setExpandedColumnSpaces((expandedColumnSpaces) ? JSON.parse(expandedColumnSpaces): [])
  }, [])

  useEffect(() => {
    console.debug("expandedColumnSpacesをlocalStorageに保存");
    localStorage.setItem("expandedColumnSpaces", JSON.stringify(expandedColumnSpaces));
  }, [expandedColumnSpaces]);

  return [expandedColumnSpaces, setExpandedColumnSpaces] as const;

}