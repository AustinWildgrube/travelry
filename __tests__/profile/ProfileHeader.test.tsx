import { screen, waitFor } from '@testing-library/react-native';

import { ProfileHeader } from '&/components/profile';

import { currentUser, wrapRender } from '../../jestSetupFile';

describe('profile header', () => {
  it('should display the users avatar image', async () => {
    wrapRender(<ProfileHeader user={currentUser} />);
    const avatar = await screen.findByLabelText(`John Snow's profile image`);

    // wait for react query to fetch image
    await waitFor(() => {
      expect(avatar).toBeOnTheScreen();
      expect(avatar.props.accessibilityLabel).toBe(`John Snow's profile image`);
      expect(avatar.props.source.uri).toContain('.supabase.co/storage/v1/object/public/avatars/998.jpg');
    });
  });

  it('should display the users full name', () => {
    wrapRender(<ProfileHeader user={currentUser} />);
    expect(screen.getByText('John Snow')).toBeOnTheScreen();
  });

  it('should display the users bio', () => {});
  wrapRender(<ProfileHeader user={currentUser} />);
  expect(screen.getByText('I know nothing.')).toBeOnTheScreen();

  it('should display the users followers, following, and trip counts', () => {
    wrapRender(<ProfileHeader user={currentUser} />);

    // followers
    expect(screen.getByText('1000000')).toBeOnTheScreen();

    // following
    expect(screen.getByText('1')).toBeOnTheScreen();

    // trips
    expect(screen.getByText('2')).toBeOnTheScreen();
  });
});
