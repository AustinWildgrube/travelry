import { Image, StyleSheet, View, ViewStyle } from 'react-native';

interface AvatarProps {
  accessibilityLabel?: string;
  borderStyle?: 'story' | 'none';
  size?: number;
  src: string | undefined;
  style?: ViewStyle;
}

export function Avatar({ accessibilityLabel, borderStyle, size = 96, src, style }: AvatarProps): JSX.Element {
  return (
    <View style={[borderStyle ? styles.avatarBorder : null, style]}>
      <Image
        source={{ uri: src }}
        accessibilityLabel={accessibilityLabel}
        style={[styles.avatarImage, { height: size, width: size }]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  avatarBorder: {
    borderColor: '#e3e3e3',
    borderRadius: 50,
    borderStyle: 'solid',
    borderWidth: 2,
    padding: 1,
  },
  avatarImage: {
    borderRadius: 50,
  },
});
