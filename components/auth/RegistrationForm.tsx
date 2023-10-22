import { useCallback, useMemo, useRef, useState, type MutableRefObject, type Ref } from 'react';
import { Keyboard, KeyboardAvoidingView, type TextInput, type TextInputProps } from 'react-native';

import BottomSheet, { BottomSheetBackdrop, BottomSheetScrollView } from '@gorhom/bottom-sheet';
import { type BottomSheetDefaultBackdropProps } from '@gorhom/bottom-sheet/lib/typescript/components/bottomSheetBackdrop/types';
import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { SafeAreaView } from 'react-native-safe-area-context';
import { z } from 'zod';

import { Button, Center, FormControl, Heading, Icon, Input, Text } from '&/components/core';
import { WarningIcon } from '&/components/core/Icons/Icons/Warning';
import { useAuth } from '&/contexts/Authentication';
import { makeStyles } from '&/utils/makeStyles';

type RegisterProps = {
  bottomSheetRef: MutableRefObject<BottomSheet | null>;
};

const RegistrationFormSchema = z.object({
  username: z
    .string()
    .refine(val => val.trim().length > 0, {
      message: 'A username is required',
    })
    .refine(val => !/\s/.test(val), {
      message: 'Your username cannot contain spaces',
    }),
  email: z
    .string()
    .email()
    .refine(val => val.trim().length > 0, {
      message: 'Your email is required',
    }),
  password: z.string().min(8, {
    message: 'Your password must be at least 8 characters long',
  }),
  birthdate: z.date().refine(val => {
    const today = new Date();
    const thirteenYearsAgo = new Date(today.getFullYear() - 13, today.getMonth(), today.getDate());
    return val <= thirteenYearsAgo;
  }, 'You must be 13 years or older to register'),
});

type RegistrationForm = z.infer<typeof RegistrationFormSchema>;

export function RegistrationForm({ bottomSheetRef }: RegisterProps): JSX.Element {
  const styles = useStyles();
  const { register } = useAuth();

  const snapPoints = useMemo(() => ['90%'], []);
  const birthdayInput = useRef<TextInput | null>(null);

  const [isDatePickerVisible, setIsDatePickerVisible] = useState(false);

  const {
    control,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm<RegistrationForm>({
    resolver: zodResolver(RegistrationFormSchema),
  });

  const renderBackdrop = useCallback(
    (props: BottomSheetDefaultBackdropProps) => <BottomSheetBackdrop {...props} disappearsOnIndex={-1} appearsOnIndex={0} />,
    [],
  );

  const handleSheetChanges = (index: number): void => {
    if (index === -1 || 1) Keyboard.dismiss();
  };

  const showDatePicker = (): void => {
    setIsDatePickerVisible(true);
  };

  const hideDatePicker = (): void => {
    setIsDatePickerVisible(false);
  };

  const handleDateChange = (date: Date): void => {
    setValue('birthdate', date);
    birthdayInput.current?.setNativeProps({ value: date.toLocaleDateString() });
    hideDatePicker();
  };

  const submitRegistrationForm = (data: RegistrationForm): void => {
    const { email, password, username, birthdate } = data;
    register(email, password, username, birthdate);
  };

  return (
    <BottomSheet
      onChange={handleSheetChanges}
      backdropComponent={renderBackdrop}
      backgroundStyle={styles.bottomSheetBackground}
      handleIndicatorStyle={styles.bottomSheetHandle}
      snapPoints={snapPoints}
      ref={bottomSheetRef}
      index={-1}
      enablePanDownToClose>
      <SafeAreaView edges={['bottom', 'left', 'right']} style={styles.bottomSheetScroll}>
        <BottomSheetScrollView keyboardDismissMode="on-drag" showsVerticalScrollIndicator={true} style={styles.bottomSheetScroll}>
          <KeyboardAvoidingView behavior="position" keyboardVerticalOffset={20} style={styles.registrationForm}>
            <Heading size="2xl" style={styles.registrationHeader}>
              It’s Nice To Meet You
            </Heading>

            <Text style={styles.registrationSubHeader}>We're looking forward to seeing the memories you'll make and share!</Text>

            <Controller
              name="username"
              control={control}
              rules={{ required: true }}
              render={({ field: { onChange, onBlur, value } }) => (
                <FormControl isInvalid={!!errors.username} isRequired={true} style={styles.formControl}>
                  <FormControl.Label>
                    <FormControl.Label.Text>Username</FormControl.Label.Text>
                  </FormControl.Label>

                  <Input>
                    <Input.Input placeholder="Username" autoCapitalize="none" onChangeText={onChange} onBlur={onBlur} value={value} />
                  </Input>

                  <FormControl.Error>
                    <FormControl.Error.Icon>
                      <Icon as={WarningIcon} style={styles.formControlIcon} />
                    </FormControl.Error.Icon>

                    <FormControl.Error.Text>{errors.username?.message}</FormControl.Error.Text>
                  </FormControl.Error>
                </FormControl>
              )}
            />

            <Controller
              name="email"
              control={control}
              rules={{ required: true }}
              render={({ field: { onChange, onBlur, value } }) => (
                <FormControl isInvalid={!!errors.email} isRequired={true} style={styles.formControl}>
                  <FormControl.Label>
                    <FormControl.Label.Text>Email</FormControl.Label.Text>
                  </FormControl.Label>

                  <Input>
                    <Input.Input placeholder="Email" autoCapitalize="none" inputMode="email" onChangeText={onChange} onBlur={onBlur} value={value} />
                  </Input>

                  <FormControl.Error>
                    <FormControl.Error.Icon>
                      <Icon as={WarningIcon} style={styles.formControlIcon} />
                    </FormControl.Error.Icon>

                    <FormControl.Error.Text>{errors.email?.message}</FormControl.Error.Text>
                  </FormControl.Error>
                </FormControl>
              )}
            />

            <Controller
              name="password"
              control={control}
              rules={{ required: true }}
              render={({ field: { onChange, onBlur, value } }) => (
                <FormControl isInvalid={!!errors.password} isRequired={true} style={styles.formControl}>
                  <FormControl.Label>
                    <FormControl.Label.Text>Password</FormControl.Label.Text>
                  </FormControl.Label>

                  <Input>
                    <Input.Input placeholder="Password" autoCapitalize="none" type="password" onChangeText={onChange} onBlur={onBlur} value={value} />
                  </Input>

                  <FormControl.Error>
                    <FormControl.Error.Icon>
                      <Icon as={WarningIcon} style={styles.formControlIcon} />
                    </FormControl.Error.Icon>

                    <FormControl.Error.Text>{errors.password?.message}</FormControl.Error.Text>
                  </FormControl.Error>
                </FormControl>
              )}
            />

            <Controller
              name="birthdate"
              control={control}
              rules={{ required: true }}
              render={({ field: { onChange, onBlur, value } }) => (
                <FormControl isInvalid={!!errors.birthdate} isReadOnly={true} isRequired={true} style={styles.formControl}>
                  <FormControl.Label>
                    <FormControl.Label.Text>Birthday</FormControl.Label.Text>
                  </FormControl.Label>

                  <Input>
                    <Input.Input
                      placeholder="Birthday"
                      onPressOut={showDatePicker}
                      onChangeText={onChange}
                      onBlur={onBlur}
                      value={value ? value.toLocaleDateString('en-US') : ''}
                      ref={birthdayInput as Ref<TextInputProps> | undefined}
                    />
                  </Input>

                  <FormControl.Helper>
                    <FormControl.Helper.Text>Your birthday will not be shown publicly.</FormControl.Helper.Text>
                  </FormControl.Helper>

                  <FormControl.Error>
                    <FormControl.Error.Icon>
                      <Icon as={WarningIcon} style={styles.formControlIcon} />
                    </FormControl.Error.Icon>

                    <FormControl.Error.Text>{errors.birthdate?.message}</FormControl.Error.Text>
                  </FormControl.Error>
                </FormControl>
              )}
            />

            <Button onPress={handleSubmit(submitRegistrationForm)}>
              <Button.Text>Register</Button.Text>
            </Button>
          </KeyboardAvoidingView>
        </BottomSheetScrollView>

        <Center style={styles.legalWrapper}>
          <Text size="sm" style={styles.legalText}>
            By registering an account, you confirm that you agree to our Terms of Use and our Privacy Policy.
          </Text>
        </Center>

        <DateTimePickerModal
          mode="date"
          isVisible={isDatePickerVisible}
          onConfirm={handleDateChange}
          onCancel={hideDatePicker}
          testID="dateTimePicker"
        />
      </SafeAreaView>
    </BottomSheet>
  );
}

const useStyles = makeStyles(theme => ({
  bottomSheetBackground: {
    backgroundColor: theme.colors['white'],
  },
  bottomSheetHandle: {
    backgroundColor: theme.colors['dark50'],
  },
  bottomSheetScroll: {
    flex: 1,
  },
  registrationForm: {
    flex: 1,
    paddingHorizontal: theme.space['6'],
  },
  registrationHeader: {
    textAlign: 'center',
  },
  registrationSubHeader: {
    marginBottom: theme.space['8'],
    marginHorizontal: theme.space['4'],
    textAlign: 'center',
  },
  formControl: {
    marginBottom: theme.space['4'],
  },
  formControlIcon: {
    color: theme.colors['red500'],
    height: theme.space['3'],
    width: theme.space['3'],
  },
  legalWrapper: {
    marginHorizontal: theme.space['6'],
  },
  legalText: {
    textAlign: 'center',
  },
}));
