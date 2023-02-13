import { useNavigation } from '@react-navigation/core';
import { fireEvent, screen } from '@testing-library/react-native';

import { PostImages } from '&/components/post';
import { AppNavProps } from '&/navigators/root-navigator';

import { currentUserPosts, wrapRender } from '../../jestSetupFile';

const mockedNavigate = jest.fn();
jest.mock('@react-navigation/core', () => {
  const actualNav = jest.requireActual('@react-navigation/core');
  return {
    ...actualNav,
    useNavigation: () => ({
      goBack: mockedNavigate,
    }),
  };
});

let props: any;

describe('post images', () => {
  it('should show the posts images', () => {
    wrapRender(<PostImages post={currentUserPosts[0]} startIndex={0} {...props} />);
    const image = screen.getByLabelText('Post image');

    expect(image).toBeOnTheScreen();
    expect(image.props.accessibilityLabel).toBe('Post image');
    expect(image.props.source.uri).toContain('.supabase.co/storage/v1/object/public/posts/0.21339742357972857.jpg');
  });

  it('should navigate back when the back button is pressed', async () => {
    const navigation = useNavigation<AppNavProps<'Post'>>();
    wrapRender(<PostImages post={currentUserPosts[0]} startIndex={0} navigation={navigation} />);

    const backButton = screen.getByLabelText(/go back/i);
    expect(backButton).toBeOnTheScreen();

    fireEvent.press(backButton);
    expect(mockedNavigate).toHaveBeenCalled();
  });
});
