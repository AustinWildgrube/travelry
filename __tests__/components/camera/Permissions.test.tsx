import { Linking } from 'react-native';

import { fireEvent, screen } from '@testing-library/react-native';

import { Permissions } from '&/components/camera/Permissions';

import { render } from '&/jest.setup';

describe('Camera Permissions', () => {
  beforeEach(() => {
    render(<Permissions />);
  });

  it('should match the snapshot', () => {
    screen.toJSON();
    expect(screen).toMatchSnapshot();
  });

  it('should render the component correctly', () => {
    expect(screen.getByText(/Travelry needs access to your camera/i)).toBeDefined();
    expect(screen.getByText(/Click the button below enable it/i)).toBeDefined();
    expect(screen.getByRole('button', { name: /Open Settings/i })).toBeDefined();
  });

  it('should open the app settings when "Open Settings" button is pressed', () => {
    const openSettingsButton = screen.getByRole('button', { name: /Open Settings/i });
    fireEvent.press(openSettingsButton);

    expect(Linking.openURL).toHaveBeenCalled();
  });
});
