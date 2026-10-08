import { useRef, useState } from "react";
import { StyleSheet, View } from "react-native";
import PagerView from "react-native-pager-view";
import { BottomNav, type BottomNavTab } from "../../components/bottom-nav";
import { MainPagerProvider } from "../../components/main-pager-context";
import Accessibility from "./accessibility";
import Camera from "./camera";
import History from "./history";
import Home from "./home";
import UserProfile from "./user_profile";

const tabs: BottomNavTab[] = ["home", "camera", "history", "accessibility", "profile"];

export default function Main() {
  const pagerRef = useRef<PagerView>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const activeTab = tabs[activeIndex] ?? "home";

  const navigate = (tab: BottomNavTab) => {
    const index = tabs.indexOf(tab);
    if (index >= 0) pagerRef.current?.setPageWithoutAnimation(index);
  };

  return (
    <MainPagerProvider value={{ activeTab, navigate }}>
      <View style={styles.container}>
        <PagerView
          ref={pagerRef}
          style={styles.pager}
          initialPage={0}
          offscreenPageLimit={1}
          overScrollMode="never"
          onPageSelected={(event) => setActiveIndex(event.nativeEvent.position)}
        >
          <View key="home" style={styles.page}><Home /></View>
          <View key="camera" style={styles.page}><Camera /></View>
          <View key="history" style={styles.page}><History /></View>
          <View key="accessibility" style={styles.page}><Accessibility /></View>
          <View key="profile" style={styles.page}><UserProfile /></View>
        </PagerView>
        <BottomNav active={activeTab} renderInPager onNavigate={navigate} />
      </View>
    </MainPagerProvider>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  pager: { flex: 1 },
  page: { flex: 1 },
});
