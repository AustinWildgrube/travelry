import { useEffect, useRef, useState, type Dispatch, type SetStateAction } from 'react';
import { StyleSheet, View } from 'react-native';

import { Feather } from '@expo/vector-icons';
import { CameraType, Camera as ExpoCamera } from 'expo-camera';
import { type CameraCapturedPicture } from 'expo-camera/src/Camera.types';
import { FlipType, manipulateAsync } from 'expo-image-manipulator';
import { MediaTypeOptions, launchImageLibraryAsync, type ImagePickerAsset } from 'expo-image-picker';
import Animated, { SlideInDown, SlideOutUp } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Permissions } from '&/components/camera/Permissions';
import { HStack, Pressable } from '&/components/core';
import { makeStyles } from '&/utils/makeStyles';

type CameraProps = {
  onSuccess: (imageUri: CameraCapturedPicture | ImagePickerAsset) => void;
  setIsShown: Dispatch<SetStateAction<boolean>>;
};

// TODO: figure out how to make full screen
export function Camera({ onSuccess, setIsShown }: CameraProps): JSX.Element {
  const styles = useStyles();
  const cameraRef = useRef<ExpoCamera | null>(null);

  const [hasCameraPermissions, requestCameraPermissions] = ExpoCamera.useCameraPermissions();
  const [type, setType] = useState(CameraType.front);

  const hideCamera = (): void => {
    setIsShown(false);
  };

  const flipCamera = (): void => {
    setType(type === CameraType.back ? CameraType.front : CameraType.back);
  };

  const pickImage = async (): Promise<void> => {
    let result = await launchImageLibraryAsync({
      mediaTypes: MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
      exif: true,
    });

    if (!result.canceled) {
      onSuccess(result.assets[0]);
    }
  };

  const takePicture = async (): Promise<void> => {
    if (cameraRef && cameraRef.current instanceof ExpoCamera) {
      await cameraRef.current.takePictureAsync({ onPictureSaved: onPictureSaved, isImageMirror: false });
    }
  };

  const onPictureSaved = async (photo: CameraCapturedPicture): Promise<void> => {
    if (type === CameraType.front) {
      photo = await manipulateAsync(photo.uri, [{ rotate: 180 }, { flip: FlipType.Vertical }], {
        compress: 1,
      });
    }

    setIsShown(false);
    onSuccess(photo);
  };

  const requestCameraPermission = async (): Promise<void> => {
    if (!hasCameraPermissions) {
      await requestCameraPermissions();
    }
  };

  useEffect(() => {
    requestCameraPermission();
  }, []);

  return (
    <Animated.View entering={SlideInDown.duration(500)} exiting={SlideOutUp.duration(500)} style={styles.camera}>
      <ExpoCamera type={type} ref={cameraRef} style={styles.cameraContainer} testID="camera">
        <SafeAreaView style={styles.cameraSafeArea}>
          <HStack style={styles.cameraActionsTop}>
            <Pressable onPress={hideCamera} accessibilityLabel="Close camera">
              <Feather name="x" size={24} color="white" />
            </Pressable>

            <Pressable onPress={flipCamera} accessibilityLabel="Flip camera">
              <Feather name="refresh-cw" size={21} color="white" />
            </Pressable>
          </HStack>

          <HStack style={styles.cameraActionsBottom}>
            <Pressable onPress={pickImage} accessibilityLabel="Go to library" style={styles.cameraRollButton}>
              <Feather name="image" size={32} color="white" />
            </Pressable>

            <Pressable onPress={takePicture} accessibilityLabel="Capture image" style={styles.cameraCaptureRing}>
              <View style={styles.cameraCaptureButton} />
            </Pressable>
          </HStack>

          {!hasCameraPermissions && <Permissions />}
        </SafeAreaView>
      </ExpoCamera>
    </Animated.View>
  );
}

const useStyles = makeStyles(theme => ({
  camera: {
    ...StyleSheet.absoluteFillObject,
  },
  cameraContainer: {
    flex: 1,
  },
  cameraSafeArea: {
    flex: 1,
    marginBottom: theme.space['16'],
    marginHorizontal: theme.space['5'],
    marginTop: theme.space['5'],
  },
  cameraActionsTop: {
    flex: 1,
    justifyContent: 'space-between',
  },
  cameraActionsBottom: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  cameraRollButton: {
    left: theme.space['0'],
    position: 'absolute',
  },
  cameraCaptureRing: {
    borderColor: theme.colors['white'],
    borderRadius: theme.radii['full'],
    borderWidth: theme.borderWidths['4'],
  },
  cameraCaptureButton: {
    backgroundColor: theme.colors['white'],
    borderRadius: theme.radii['full'],
    height: theme.space['20'],
    margin: theme.space['0.5'],
    width: theme.space['20'],
  },
}));
