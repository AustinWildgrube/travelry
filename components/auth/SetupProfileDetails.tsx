import { KeyboardAvoidingView, ScrollView } from 'react-native';

import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'expo-router';
import { Controller, useForm } from 'react-hook-form';
import Animated, { FadeInRight } from 'react-native-reanimated';
import { z } from 'zod';

import { Button, FormControl, Icon, Input, Textarea } from '&/components/core';
import { WarningIcon } from '&/components/core/Icons/Icons/Warning';
import { LoadingIndicator } from '&/components/shared/LoadingIndicator';
import { updateUserAccount } from '&/queries/user';
import { useUserStore } from '&/stores/user';
import { makeStyles } from '&/utils/makeStyles';

const SetupFormSchema = z.object({
  first_name: z.string().optional(),
  last_name: z.string().optional(),
  location: z.string().optional(),
  bio: z.string().optional(),
});

type SetupForm = z.infer<typeof SetupFormSchema>;

export function SetupProfileDetails(): JSX.Element {
  const styles = useStyles();
  const router = useRouter();

  const user = useUserStore(state => state.user);
  if (!user) return <LoadingIndicator />;

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<SetupForm>({
    resolver: zodResolver(SetupFormSchema),
  });

  const submitSetupForm = async (data: SetupForm): Promise<void> => {
    await updateUserAccount(user.id, data);
    router.replace('/(tabs)/feed');
  };

  return (
    <Animated.View entering={FadeInRight.duration(500)} style={styles.profileDetails}>
      <ScrollView>
        <KeyboardAvoidingView behavior="position">
          <Controller
            name="first_name"
            control={control}
            render={({ field: { onChange, onBlur, value } }) => (
              <FormControl isInvalid={!!errors.first_name} style={styles.formControl}>
                <FormControl.Label>
                  <FormControl.Label.Text>First Name</FormControl.Label.Text>
                </FormControl.Label>

                <Input>
                  <Input.Input placeholder="First Name" onChangeText={onChange} onBlur={onBlur} value={value} />
                </Input>

                <FormControl.Error>
                  <FormControl.Error.Icon>
                    <Icon as={WarningIcon} style={styles.formControlIcon} />
                  </FormControl.Error.Icon>

                  <FormControl.Error.Text>{errors.first_name?.message}</FormControl.Error.Text>
                </FormControl.Error>
              </FormControl>
            )}
          />

          <Controller
            name="last_name"
            control={control}
            render={({ field: { onChange, onBlur, value } }) => (
              <FormControl isInvalid={!!errors.last_name} style={styles.formControl}>
                <FormControl.Label>
                  <FormControl.Label.Text>Last Name</FormControl.Label.Text>
                </FormControl.Label>

                <Input>
                  <Input.Input placeholder="Last Name" onChangeText={onChange} onBlur={onBlur} value={value} />
                </Input>

                <FormControl.Error>
                  <FormControl.Error.Icon>
                    <Icon as={WarningIcon} style={styles.formControlIcon} />
                  </FormControl.Error.Icon>

                  <FormControl.Error.Text>{errors.last_name?.message}</FormControl.Error.Text>
                </FormControl.Error>
              </FormControl>
            )}
          />

          <Controller
            name="location"
            control={control}
            render={({ field: { onChange, onBlur, value } }) => (
              <FormControl isInvalid={!!errors.location} style={styles.formControl}>
                <FormControl.Label>
                  <FormControl.Label.Text>Location</FormControl.Label.Text>
                </FormControl.Label>

                <Input>
                  <Input.Input placeholder="Location" onChangeText={onChange} onBlur={onBlur} value={value} />
                </Input>

                <FormControl.Error>
                  <FormControl.Error.Icon>
                    <Icon as={WarningIcon} style={styles.formControlIcon} />
                  </FormControl.Error.Icon>

                  <FormControl.Error.Text>{errors.location?.message}</FormControl.Error.Text>
                </FormControl.Error>
              </FormControl>
            )}
          />

          <Controller
            name="bio"
            control={control}
            render={({ field: { onChange, onBlur, value } }) => (
              <FormControl isInvalid={!!errors.bio} style={styles.formControl}>
                <FormControl.Label>
                  <FormControl.Label.Text>Bio</FormControl.Label.Text>
                </FormControl.Label>

                <Textarea>
                  <Textarea.Input placeholder="Tell the world a little bit about yourself" onChangeText={onChange} onBlur={onBlur} value={value} />
                </Textarea>

                <FormControl.Error>
                  <FormControl.Error.Icon>
                    <Icon as={WarningIcon} style={styles.formControlIcon} />
                  </FormControl.Error.Icon>

                  <FormControl.Error.Text>{errors.bio?.message}</FormControl.Error.Text>
                </FormControl.Error>
              </FormControl>
            )}
          />
        </KeyboardAvoidingView>
      </ScrollView>

      <Button onPress={handleSubmit(submitSetupForm)} style={styles.submitButton}>
        <Button.Text>Finish</Button.Text>
      </Button>
    </Animated.View>
  );
}

const useStyles = makeStyles(theme => ({
  profileDetails: {
    flex: 1,
    justifyContent: 'center',
  },
  formControl: {
    marginBottom: theme.space['4'],
  },
  formControlIcon: {
    color: theme.colors['red500'],
    height: theme.space['3'],
    width: theme.space['3'],
  },
  submitButton: {
    marginTop: theme.space['8'],
  },
}));
