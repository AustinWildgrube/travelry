import { fireEvent, screen, waitFor } from '@testing-library/react-native';
import { Camera as ExpoCamera, PermissionStatus } from 'expo-camera';

import { Camera } from '&/components/camera/Camera';

import { wrapRender } from '../../jestSetupFile';

jest.spyOn(ExpoCamera.prototype, 'takePictureAsync').mockImplementation(() => {
  return Promise.resolve({
    uri: '9283671919211780.jpg',
    width: 250,
    height: 300,
  });
});

jest.spyOn(ExpoCamera, 'requestCameraPermissionsAsync').mockResolvedValue({
  status: PermissionStatus.DENIED,
  expires: 'never',
  granted: false,
  canAskAgain: true,
});

let props: any;

describe('camera', () => {
  it('should take an image when the capture button is pressed', async () => {
    wrapRender(<Camera {...props} />);
    const captureButton = screen.getByLabelText(/capture image/i);
    expect(captureButton).toBeOnTheScreen();

    fireEvent.press(captureButton);
    await waitFor(() => {
      expect(ExpoCamera.prototype.takePictureAsync).toHaveBeenCalled();
    });
  });

  it('should show a message with a settings button when permission is denied', async () => {
    wrapRender(<Camera {...props} />);
    expect(screen.findByText(/'travelry needs access to your camera/i)).toBeDefined();
    expect(screen.findByText(/Click the button below enable it/i)).toBeDefined();
  });
});
