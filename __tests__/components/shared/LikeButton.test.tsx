import { fireEvent, screen } from '@testing-library/react-native';
import { ImpactFeedbackStyle, impactAsync } from 'expo-haptics';

import { MemoizedLikeButton } from '&/components/shared/LikeButton';

import { render } from '&/jest.setup';

describe('LikeButton', () => {
  it('should render the like count', () => {
    render(<MemoizedLikeButton isLiked={false} likeCount={10} likeAction={() => {}} />);
    expect(screen.getByText('10')).toBeDefined();
  });

  it('should render the heart icon when liked', () => {
    render(<MemoizedLikeButton isLiked={true} likeCount={5} likeAction={() => {}} />);

    const heartIcon = screen.getByTestId('heart');
    expect(heartIcon).toBeDefined();
  });

  it('should render the empty heart icon when not liked', () => {
    render(<MemoizedLikeButton isLiked={false} likeCount={2} likeAction={() => {}} />);
    const emptyHeartIcon = screen.getByTestId('heart-o');
    expect(emptyHeartIcon).toBeDefined();
  });

  it('should call the likeAction function when pressed', () => {
    const likeActionMock = jest.fn();
    render(<MemoizedLikeButton isLiked={false} likeCount={0} likeAction={likeActionMock} />);
    const likeButton = screen.getByTestId('heart-o');

    fireEvent.press(likeButton);

    expect(likeActionMock).toHaveBeenCalled();
  });

  it('performs the animation and haptic feedback when pressed', () => {
    render(<MemoizedLikeButton isLiked={false} likeCount={0} likeAction={() => {}} />);
    const likeButton = screen.getByTestId('heart-o');

    fireEvent.press(likeButton);

    expect(impactAsync).toHaveBeenCalledWith(ImpactFeedbackStyle.Medium);
  });
});
