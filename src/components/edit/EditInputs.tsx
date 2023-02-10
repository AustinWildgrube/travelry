import {
  Dimensions,
  Image,
  Keyboard,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';

import { Controller, useForm } from 'react-hook-form';

import { Input } from '&/components/atoms';
import { useCurrentUser } from '&/contexts/AuthProvider';
import { AppNavProps } from '&/navigators/app-navigator';
import { createPost, createPostMedia } from '&/queries/posts';

interface EditInputProps {
  image: string;
  navigation: AppNavProps<'Profile'>;
}

export function EditInputs({ image, navigation }: EditInputProps): JSX.Element {
  const user = useCurrentUser();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      caption: '',
      location: '',
    },
  });

  const startUpload = async ({ caption, location }: { caption: string; location: string }): Promise<void> => {
    const postId = await createPost(user.id, caption, location);
    await createPostMedia(user.id, postId, image);
    navigation.navigate('Profile');
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View>
        <Image source={{ uri: image }} style={styles.image} />

        <Controller
          name="caption"
          control={control}
          rules={{ required: true }}
          render={({ field: { onChange } }) => (
            <Input onChangeText={onChange} placeholder="I want to live here!" label="Caption" lines={2} />
          )}
        />

        {errors.caption && <Text>Caption Required</Text>}

        <Controller
          name="location"
          control={control}
          rules={{ required: true }}
          render={({ field: { onChange } }) => (
            <Input onChangeText={onChange} placeholder="Paris, France" label="Location" />
          )}
        />

        {errors.location && <Text>Location Required</Text>}

        <TouchableOpacity onPress={handleSubmit(startUpload)} style={styles.button}>
          <Text style={styles.buttonText}>Post Image</Text>
        </TouchableOpacity>
      </View>
    </TouchableWithoutFeedback>
  );
}

const dimensions = Dimensions.get('window');
const width = Math.round(dimensions.width - 24);

const styles = StyleSheet.create({
  image: {
    aspectRatio: 1,
    marginBottom: 21,
    resizeMode: 'cover',
    width: width,
  },
  button: {
    alignItems: 'center',
    backgroundColor: '#000',
    borderRadius: 4,
    justifyContent: 'center',
    paddingHorizontal: 12,
    paddingVertical: 18,
    textAlign: 'center',
    width: '100%',
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
  },
});
