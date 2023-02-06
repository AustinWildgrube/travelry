import { ReactNode } from 'react';
import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';

interface CardProps {
  children: ReactNode;
  style: StyleProp<ViewStyle>;
}

export function Card({ children, style }: CardProps): JSX.Element {
  return <View style={[styles.card, style]}>{children}</View>;
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 4,
    color: '#000',
    elevation: 5,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
});
