import { fireEvent, screen } from '@testing-library/react-native';
import { MediaTypeOptions, launchImageLibraryAsync } from 'expo-image-picker';

import { SetupProfileImage } from '&/components/auth/SetupProfileImage';
import { uploadUserAvatar } from '&/queries/user';
import { transformImageType } from '&/utils/transformImageType';

import { mockUser } from '&/__mocks__/zustand';
import { render } from '&/jest.setup';

jest.mock('&/utils/transformImageType', () => ({
  transformImageType: jest.fn().mockResolvedValue({ uri: 'transformedImageUri' }),
}));

jest.mock('&/queries/user', () => ({
  uploadUserAvatar: jest.fn().mockResolvedValue({}),
}));

const setStepMock = jest.fn();

describe('SetupProfileImage', () => {
  beforeEach(() => {
    render(<SetupProfileImage setStep={setStepMock} />);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should match the snapshot', () => {
    screen.toJSON();
    expect(screen).toMatchSnapshot();
  });

  it('should render both buttons', () => {
    expect(screen.getByRole('button', { name: /Upload an Image/i })).toBeDefined();
    expect(screen.getByRole('button', { name: /Take an Image/i })).toBeDefined();
  });

  it('should allow an image to be uploaded from the users library', async () => {
    fireEvent.press(screen.getByRole('button', { name: /Upload an Image/i }));

    expect(launchImageLibraryAsync).toHaveBeenCalledWith({
      mediaTypes: MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
      exif: true,
    });

    expect(await screen.findByRole('button', { name: /Upload an Image/i })).toBeDisabled();
    expect(transformImageType).toHaveBeenCalledWith('file://test-uri', 'jpeg');
    expect(uploadUserAvatar).toHaveBeenCalledWith(mockUser.id, { uri: 'transformedImageUri' });
    expect(setStepMock).toHaveBeenCalledWith(1);
  });

  it('should allow an image to be taken with the phone camera', async () => {
    fireEvent.press(screen.getByRole('button', { name: /Take an Image/i }));
    expect(await screen.findByTestId('camera')).toBeDefined();

    // TODO: figure out why onPictureSaved is not being called
  });
});
