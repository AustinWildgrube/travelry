import { useState, type Dispatch, type SetStateAction } from 'react';

import { type CameraCapturedPicture } from 'expo-camera';
import { SaveFormat } from 'expo-image-manipulator';
import { launchImageLibraryAsync, MediaTypeOptions, type ImagePickerAsset } from 'expo-image-picker';
import { User } from 'lucide-react-native';

import { Camera } from '&/components/camera/Camera';
import { Avatar, Button, Icon, Spinner, VStack } from '&/components/core';
import { LoadingIndicator } from '&/components/shared/LoadingIndicator';
import { uploadUserAvatar } from '&/queries/user';
import { useUserStore } from '&/stores/user';
import { makeStyles } from '&/utils/makeStyles';
import { transformImageType } from '&/utils/transformImageType';

type SetupProfileProps = {
  setStep: Dispatch<SetStateAction<number>>;
};

export function SetupProfileImage({ setStep }: SetupProfileProps): JSX.Element {
  const styles = useStyles();

  const [showCamera, setShowCamera] = useState(false);
  const [imageUploading, setImageUploading] = useState(false);
  const [imageUri, setImageUri] = useState<string | null>(null);

  const user = useUserStore(state => state.user);
  if (!user) return <LoadingIndicator />;

  const pickAvatarImage = async (): Promise<void> => {
    let result = await launchImageLibraryAsync({
      mediaTypes: MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
      exif: true,
    });

    if (!result.canceled) {
      onSuccess(result.assets[0]);
    }
  };

  const onSuccess = (image: CameraCapturedPicture | ImagePickerAsset): void => {
    setImageUploading(true);

    transformImageType(image.uri, SaveFormat.JPEG).then(async transformedImage => {
      setImageUri(transformedImage.uri);
      await uploadUserAvatar(user.id, transformedImage);
      setStep(1);
    });
  };

  return (
    <VStack space="lg" style={styles.setupProfile}>
      {imageUri ? (
        <Avatar style={styles.avatar}>
          <Avatar.Image source={{ uri: imageUri }} />
        </Avatar>
      ) : (
        <Avatar style={styles.avatar}>
          <Icon as={User} style={styles.avatarIcon} />
        </Avatar>
      )}

      <Button onPress={pickAvatarImage} isDisabled={imageUploading} size="xl">
        {imageUploading && <Spinner style={styles.buttonSpinner} />}
        <Button.Text>Upload an Image</Button.Text>
      </Button>

      <Button onPress={() => setShowCamera(true)} isDisabled={imageUploading} size="xl" variant="outline">
        {imageUploading && <Spinner style={styles.buttonSpinner} />}
        <Button.Text>Take an Image</Button.Text>
      </Button>

      {showCamera && <Camera onSuccess={onSuccess} setIsShown={setShowCamera} />}
    </VStack>
  );
}

const useStyles = makeStyles(theme => ({
  setupProfile: {
    flex: 1,
    justifyContent: 'center',
  },
  avatar: {
    borderRadius: theme.radii['full'],
    height: theme.space['56'],
    width: theme.space['56'],
  },
  avatarIcon: {
    color: theme.colors['white'],
    height: theme.space['56'],
    width: theme.space['56'],
  },
  buttonSpinner: {
    color: theme.colors['white'],
    marginRight: theme.space['1'],
  },
}));
