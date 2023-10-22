import { screen } from '@testing-library/react-native';

import { Header } from '&/components/shared/Header';

import { render } from '&/jest.setup';

describe('Header', () => {
  beforeEach(() => {
    render(<Header />);
  });

  it('should match the snapshot', () => {
    screen.toJSON();
    expect(screen).toMatchSnapshot();
  });

  it('should render a black logo when the color scheme is set to light', () => {
    jest.mock('react-native', () => ({
      ...jest.requireActual('react-native'),
      useColorScheme: jest.fn().mockReturnValueOnce('light'),
    }));

    const image = screen.getByTestId('image');
    expect(image.props.source).toEqual(require('&/assets/logos/logo_black.png'));
  });

  it('should render a white logo when the color is set to dark', () => {
    jest.mock('react-native', () => ({
      ...jest.requireActual('react-native'),
      useColorScheme: jest.fn().mockReturnValueOnce('dark'),
    }));

    const image = screen.getByTestId('image');
    expect(image.props.source).toEqual(require('&/assets/logos/logo.png'));
  });
});
