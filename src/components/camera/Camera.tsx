import { useEffect, useRef, useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { Feather } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/core';
import { CameraType, Camera as ExpoCamera } from 'expo-camera';
import { Text } from 'tamagui';

import { ImageLibrary } from '&/components/camera/ImageLibrary';
import { AppNavProps } from '&/navigators/app-navigator';

export function Camera(): JSX.Element {
  const navigation = useNavigation<AppNavProps<'Profile'>>();
  const cameraRef = useRef<ExpoCamera>(null);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [type, setType] = useState<CameraType>(CameraType.back);

  const takePicture = async (): Promise<void> => {
    if (cameraRef && cameraRef.current) {
      await cameraRef.current.takePictureAsync({ onPictureSaved: onPictureSaved, isImageMirror: false });
    }
  };

  const onPictureSaved = async (photo: any): Promise<void> => {
    navigation.navigate('Profile', { image: photo.uri });
  };

  useEffect(() => {
    (async () => {
      if (hasPermission === null) {
        return <View />;
      }

      if (!hasPermission) {
        return <Text>No access to camera</Text>;
      }

      const { status } = await ExpoCamera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  return (
    <View style={styles.container}>
      <ExpoCamera style={styles.camera} type={type} ref={cameraRef}>
        <View style={styles.buttonContainer}>
          <Pressable onPress={() => navigation.goBack()}>
            <Feather name="x" size={24} color="white" />
          </Pressable>

          <Pressable
            onPress={() => {
              setType(type === CameraType.back ? CameraType.front : CameraType.back);
            }}
          >
            <Feather name="refresh-cw" size={21} color="white" />
          </Pressable>
        </View>

        <View style={styles.actionContainer}>
          <ImageLibrary />

          <Pressable style={styles.cameraButton} onPress={takePicture}>
            <View style={styles.cameraRing}></View>
          </Pressable>
        </View>
      </ExpoCamera>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  camera: {
    flex: 1,
  },
  buttonContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 20,
    marginTop: 60,
  },
  actionContainer: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 40,
    marginHorizontal: 20,
  },
  cameraButton: {
    borderRadius: 50,
    height: 86,
    justifyContent: 'center',
    width: 86,
  },
  cameraRing: {
    alignSelf: 'center',
    backgroundColor: '#fff',
    borderColor: '#000',
    borderRadius: 50,
    borderStyle: 'solid',
    borderWidth: 3,
    height: 80,
    justifyContent: 'center',
    width: 80,
  },
});
