import { Image, StyleSheet, View } from 'react-native';

interface AvatarProps {
  accessibilityLabel?: string;
  size?: number;
  src: string | undefined;
}

export function Avatar({ accessibilityLabel, size = 96, src }: AvatarProps): JSX.Element {
  return (
    <View style={styles.avatarBorder}>
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
