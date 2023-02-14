import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { fireEvent, render, screen, waitFor } from '@testing-library/react-native';

import { ProfileFollowButton } from '&/components/profile';

import { currentUser, otherUser } from '../../jestSetupFile';

jest.mock('@tanstack/react-query', () => ({
  useMutation: jest.fn().mockReturnValue({ mutate: jest.fn() }),
  useQuery: jest.fn().mockReturnValue({ data: 0 }),
  useQueryClient: jest.fn().mockReturnValue({ setQueryData: jest.fn() }),
}));

describe('ProfileFollowButton', () => {
  const setViewedUser = jest.fn();
  const mutate = jest.fn();

  it('renders correctly when logged in user is different from viewed user', () => {
    render(<ProfileFollowButton loggedInUser={currentUser} setViewedUser={setViewedUser} viewedUser={otherUser} />);
    expect(screen.getByText('Follow')).toBeOnTheScreen();
  });

  it('does not render when logged in user is the same as viewed user', () => {
    render(<ProfileFollowButton loggedInUser={currentUser} setViewedUser={setViewedUser} viewedUser={currentUser} />);
    expect(screen.queryByText('Follow')).not.toBeOnTheScreen();
  });

  it('toggles the follow status when pressed', async () => {
    (useQuery as jest.Mock).mockReturnValueOnce({ data: 1 });
    (useMutation as jest.Mock).mockReturnValueOnce({ mutate });
    (useQueryClient as jest.Mock).mockImplementation(() => {
      return {
        setQueryData: jest.fn(),
      };
    });

    render(<ProfileFollowButton loggedInUser={currentUser} setViewedUser={setViewedUser} viewedUser={otherUser} />);

    fireEvent.press(screen.getByText(/follow/i));
    await waitFor(() => expect(mutate).toHaveBeenCalled());
    expect(await screen.findByText(/unfollow/i)).toBeOnTheScreen();

    fireEvent.press(screen.getByText(/unfollow/i));
    expect(await screen.findByText(/follow/i)).toBeOnTheScreen();
  });
});
