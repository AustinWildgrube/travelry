import { Pressable } from 'react-native';

import * as ImagePicker from 'expo-image-picker';
import { useNavigation } from '@react-navigation/core';

import { AppNavProps } from '../../navigators/AppNavigator';
import { Feather } from '@expo/vector-icons';

export function ImageLibrary(): JSX.Element {
  const navigation = useNavigation<AppNavProps<'Profile'>>();

  const pickImage = async (): Promise<void> => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: false,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      navigation.navigate('Profile', { image: result.assets[0].uri });
    }
  };

  return (
    <Pressable onPress={pickImage} style={{ position: 'absolute', left: 0 }}>
      <Feather name="image" size={80} color="white" />
    </Pressable>
  );
}
