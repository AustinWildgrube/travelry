import { Animated } from 'react-native';

export const HeartbeatAnimation = (value: Animated.Value, minValue: number, maxValue: number): Animated.CompositeAnimation =>
  Animated.sequence([
    Animated.timing(value, {
      useNativeDriver: true,
      toValue: minValue,
      duration: 100,
    }),
    Animated.timing(value, {
      useNativeDriver: true,
      toValue: maxValue,
      duration: 100,
    }),
  ]);
