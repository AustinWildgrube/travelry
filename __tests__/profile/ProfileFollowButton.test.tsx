import { fireEvent, screen } from '@testing-library/react-native';

import { ProfileFollowButton } from '&/components/profile';
import * as users from '&/queries/users';

import { currentUser, otherUser, wrapRender } from '../../jestSetupFile';

describe('profile follow button', () => {
  it('should create the follow button component', () => {
    wrapRender(<ProfileFollowButton loggedInUser={currentUser} viewedUser={otherUser} />);
    expect(screen.getByText('Follow')).toBeOnTheScreen();
  });

  it('should trigger the follow/unfollow function when clicked', async () => {
    wrapRender(<ProfileFollowButton loggedInUser={currentUser} viewedUser={otherUser} />);

    const followUserMock = jest.spyOn(users, 'followUser').mockImplementation();
    fireEvent.press(await screen.findByText(/follow/i));
    expect(followUserMock).toHaveBeenCalledWith(currentUser.id, otherUser.id);

    const unfollowUserMock = jest.spyOn(users, 'unfollowUser').mockImplementation();
    const unfollowButton = await screen.findByText(/unfollow/i);

    expect(unfollowButton).toBeOnTheScreen();
    fireEvent.press(unfollowButton);

    expect(unfollowUserMock).toHaveBeenCalledWith(currentUser.id, otherUser.id);
    expect(await screen.findByText(/follow/i)).toBeOnTheScreen();
  });

  it('should not display the follow button when viewing own profile', () => {
    wrapRender(<ProfileFollowButton loggedInUser={currentUser} viewedUser={currentUser} />);
    expect(screen.queryByText('Follow')).not.toBeOnTheScreen();
  });
});
