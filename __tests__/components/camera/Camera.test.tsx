import React from 'react';

import { fireEvent, screen } from '@testing-library/react-native';
import { CameraType, Camera as ExpoCamera } from 'expo-camera';
import { MediaTypeOptions, launchImageLibraryAsync } from 'expo-image-picker';

import { Camera } from '&/components/camera/Camera';

import { render } from '&/jest.setup';

const useStateSpy = jest.spyOn(React, 'useState').mockImplementationOnce(() => [false, jest.fn()]);
const useCameraPermissionsSpy = jest.fn().mockImplementation(() => [false, jest.fn()]);
const mockSetIsShown = jest.fn();
const mockOnSuccess = jest.fn();
const takePictureSpy = jest.fn();

ExpoCamera.prototype.takePictureAsync = takePictureSpy;
ExpoCamera.useCameraPermissions = useCameraPermissionsSpy;

describe('Camera', () => {
  beforeEach(() => {
    render(<Camera onSuccess={mockOnSuccess} setIsShown={mockSetIsShown} />);
  });

  it('should match the snapshot', () => {
    screen.toJSON();
    expect(screen).toMatchSnapshot();
  });

  it('should render the camera', async () => {
    expect(await screen.findByTestId(/camera/i)).toBeDefined();
  });

  it('should show the permissions component if the user has not granted camera permissions', async () => {
    expect(await screen.findByText(/Travelry needs access to your camera/i)).toBeDefined();
    expect(screen.getByText(/Click the button below enable it/i)).toBeDefined();
    expect(screen.getByRole('button', { name: /Open Settings/i })).toBeDefined();
  });

  it('should take an image when the capture button is clicked', async () => {
    fireEvent.press(screen.getByLabelText(/Capture image/i));
    expect(takePictureSpy).toHaveBeenCalled();
  });

  it('should hide the camera when the close button is pressed', async () => {
    fireEvent.press(screen.getByLabelText(/Close camera/i));
    expect(mockSetIsShown).toHaveBeenCalledWith(false);
  });

  it('should flip the camera when the flip button is pressed', async () => {
    fireEvent.press(screen.getByLabelText(/Flip camera/i));
    expect(useStateSpy).toHaveBeenCalledWith(CameraType.front);
  });

  it('should allow an image to be chosen from the users library', async () => {
    fireEvent.press(screen.getByLabelText(/Go to library/i));

    expect(launchImageLibraryAsync).toHaveBeenCalledWith({
      mediaTypes: MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
      exif: true,
    });
  });
});
