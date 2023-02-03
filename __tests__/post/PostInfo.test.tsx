import { screen } from '@testing-library/react-native';

import { PostInfo } from '&/components/post';

import { currentUser, currentUserPosts, wrapRender } from '../../jestSetupFile';

describe('post info', () => {
  it('should display the posters avatar image', () => {
    wrapRender(<PostInfo account={currentUser} post={currentUserPosts[0]} />);
    const avatar = screen.getByLabelText(/profile image/i);

    expect(avatar).toBeOnTheScreen();
    expect(avatar.props.accessibilityLabel).toBe("John Snow's profile image");
    expect(avatar.props.source.uri).toContain('.supabase.co/storage/v1/object/public/avatars/998.jpg');
  });

  it('should display the posters full name', () => {
    wrapRender(<PostInfo account={currentUser} post={currentUserPosts[0]} />);
    expect(screen.getByText('John Snow')).toBeOnTheScreen();
  });

  it('should display the posts description', () => {
    wrapRender(<PostInfo account={currentUser} post={currentUserPosts[0]} />);
    expect(screen.getByText('The dreadful Castle Black.')).toBeOnTheScreen();
  });

  it('should display the posts relative time', () => {
    wrapRender(<PostInfo account={currentUser} post={currentUserPosts[0]} />);
    expect(screen.getByText(/Posted (.*) • 44 likes/i)).toBeOnTheScreen();
  });
});
