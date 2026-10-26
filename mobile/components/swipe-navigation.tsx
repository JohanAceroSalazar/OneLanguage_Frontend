import type { ReactNode } from "react";
import { useRouter } from "expo-router";
import { StyleSheet } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import type { BottomNavTab } from "./bottom-nav";
import { useMainPager } from "./main-pager-context";

type SwipeNavigationProps = {
  active: BottomNavTab;
  children: ReactNode;
};

const tabs: { name: BottomNavTab; route: "/(auth)/home" | "/(auth)/camera" | "/(auth)/history" | "/(auth)/accessibility" | "/(auth)/user_profile" }[] = [
  { name: "home", route: "/(auth)/home" },
  { name: "camera", route: "/(auth)/camera" },
  { name: "history", route: "/(auth)/history" },
  { name: "accessibility", route: "/(auth)/accessibility" },
  { name: "profile", route: "/(auth)/user_profile" },
];

const SWIPE_DISTANCE = 68;
const SWIPE_VELOCITY = 700;

export function SwipeNavigation({ active, children }: SwipeNavigationProps) {
  const router = useRouter();
  const mainPager = useMainPager();
  const translateX = useSharedValue(0);
  const navigationTriggered = useSharedValue(false);
  const currentIndex = tabs.findIndex((tab) => tab.name === active);

  const navigate = (direction: number) => {
    const nextIndex = currentIndex + direction;
    const destination = tabs[nextIndex];
    if (destination) router.replace(destination.route);
  };

  const swipeGesture = Gesture.Pan()
    .activeOffsetX([-24, 24])
    .failOffsetY([-24, 24])
    .onBegin(() => {
      navigationTriggered.value = false;
    })
    .onUpdate((event) => {
      const tryingToLeaveFirstTab = currentIndex === 0 && event.translationX > 0;
      const tryingToLeaveLastTab = currentIndex === tabs.length - 1 && event.translationX < 0;
      translateX.value = tryingToLeaveFirstTab || tryingToLeaveLastTab ? event.translationX * 0.18 : event.translationX;

      const direction = event.translationX < 0 ? 1 : -1;
      const destinationExists = Boolean(tabs[currentIndex + direction]);
      if (destinationExists && !navigationTriggered.value && Math.abs(event.translationX) >= SWIPE_DISTANCE) {
        navigationTriggered.value = true;
        runOnJS(navigate)(direction);
      }
    })
    .onEnd((event) => {
      if (navigationTriggered.value) return;

      const hasEnoughDistance = Math.abs(event.translationX) >= SWIPE_DISTANCE;
      const hasEnoughVelocity = Math.abs(event.velocityX) >= SWIPE_VELOCITY;
      const direction = event.translationX < 0 ? 1 : -1;
      const destinationExists = Boolean(tabs[currentIndex + direction]);

      if (!destinationExists || (!hasEnoughDistance && !hasEnoughVelocity)) {
        translateX.value = withSpring(0, { damping: 18, stiffness: 220 });
        return;
      }

      navigationTriggered.value = true;
      runOnJS(navigate)(direction);
    });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  if (mainPager) return <>{children}</>;

  return (
    <GestureDetector gesture={swipeGesture}>
      <Animated.View style={[styles.container, animatedStyle]}>{children}</Animated.View>
    </GestureDetector>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
});
