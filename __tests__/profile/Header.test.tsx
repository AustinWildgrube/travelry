import { screen } from '@testing-library/react-native';

import { Header } from '&/components/profile';

import { wrapRender } from '../../jestSetupFile';

describe('profile header', () => {
  it('should display the users avatar image', () => {
    wrapRender(<Header />);
    const avatar = screen.getByLabelText(`John Snow's profile image`);

    expect(avatar).toBeOnTheScreen();
    expect(avatar.props.accessibilityLabel).toBe(`John Snow's profile image`);
    expect(avatar.props.source.uri).toContain('.supabase.co/storage/v1/object/public/avatars/998.jpg');
  });

  it('should display the users full name', () => {
    wrapRender(<Header />);
    expect(screen.getByText('John Snow')).toBeOnTheScreen();
  });

  it('should display the users bio', () => {});
  wrapRender(<Header />);
  expect(screen.getByText('I know nothing.')).toBeOnTheScreen();

  it('should display the users followers, following, and trip counts', () => {
    wrapRender(<Header />);

    // followers
    expect(screen.getByText('1000000')).toBeOnTheScreen();

    // following
    expect(screen.getByText('1')).toBeOnTheScreen();

    // trips
    expect(screen.getByText('2')).toBeOnTheScreen();
  });
});
