import { useEffect, useRef, useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { Feather } from '@expo/vector-icons';
import { CameraType, Camera as ExpoCamera } from 'expo-camera';
import { FlipType, manipulateAsync } from 'expo-image-manipulator';
import { MediaTypeOptions, launchImageLibraryAsync } from 'expo-image-picker';
import { useRouter } from 'expo-router';

import { Permissions } from '&/components/camera/Permissions';
import { usePostStore } from '&/stores/post';

export function Camera(): JSX.Element {
  const router = useRouter();
  const cameraRef = useRef<ExpoCamera>(null);
  const setImageUploadUri = usePostStore(state => state.setImageUploadUri);
  const [type, setType] = useState<CameraType>(CameraType.front);
  const [hasCameraPermission, setHasCameraPermission] = useState<boolean>(false);

  const pickImage = async (): Promise<void> => {
    let result = await launchImageLibraryAsync({
      mediaTypes: MediaTypeOptions.All,
      allowsEditing: false,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImageUploadUri(result.assets[0].uri);
      // TODO: put the image uri in the router params once fixed
      // router.push({ pathname: '/edit', params: { image: result.assets[0].uri } });
      router.push('/edit');
    }
  };

  const takePicture = async (): Promise<void> => {
    if (cameraRef && cameraRef.current) {
      await cameraRef.current.takePictureAsync({ onPictureSaved: onPictureSaved, isImageMirror: false });
    }
  };

  const onPictureSaved = async (photo: any): Promise<void> => {
    if (type === CameraType.front) {
      photo = await manipulateAsync(photo.localUri || photo.uri, [{ rotate: 180 }, { flip: FlipType.Vertical }], {
        compress: 1,
      });

      setImageUploadUri(photo.uri);
      // TODO: put the image uri in the router params once fixed
      // router.push({ pathname: '/edit', params: { image: photo.uri } });
      router.push('/edit');
    }
  };

  useEffect(() => {
    const requestCameraPermission = async () => {
      const cameraPermission = await ExpoCamera.requestCameraPermissionsAsync();
      setHasCameraPermission(cameraPermission.status === 'granted');
    };

    requestCameraPermission();
  }, []);

  return (
    <View style={styles.container}>
      <ExpoCamera style={styles.camera} type={type} ref={cameraRef}>
        <View style={styles.buttonContainer}>
          <Pressable onPress={() => router.back()}>
            <Feather name="x" size={24} color="white" />
          </Pressable>

          <Pressable
            accessibilityLabel="Flip camera"
            onPress={() => {
              setType(type === CameraType.back ? CameraType.front : CameraType.back);
            }}>
            <Feather name="refresh-cw" size={21} color="white" />
          </Pressable>
        </View>

        <View style={styles.actionContainer}>
          <Pressable onPress={pickImage} style={styles.libraryButton}>
            <Feather name="image" size={32} color="white" />
          </Pressable>

          <Pressable onPress={takePicture} accessibilityLabel="Capture image" style={styles.cameraButton}>
            <View style={styles.cameraRing}></View>
          </Pressable>
        </View>

        {!hasCameraPermission && <Permissions />}
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
  libraryButton: {
    left: 0,
    position: 'absolute',
  },
  cameraButton: {
    borderColor: '#fff',
    borderRadius: 50,
    borderWidth: 3,
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
