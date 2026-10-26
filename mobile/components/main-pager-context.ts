import { createContext, useContext } from "react";
import type { BottomNavTab } from "./bottom-nav";

type MainPagerController = {
  activeTab: BottomNavTab;
  navigate: (tab: BottomNavTab) => void;
};

const MainPagerContext = createContext<MainPagerController | null>(null);

export const MainPagerProvider = MainPagerContext.Provider;

export function useMainPager() {
  return useContext(MainPagerContext);
}
