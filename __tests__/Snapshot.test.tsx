import { RouteProp } from '@react-navigation/native';

import { AppStackParamList } from '&/navigators/root-navigator';
import { CameraScreen } from '&/screens/app/CameraScreen';
import { PostScreen } from '&/screens/app/PostScreen';
import { ProfileScreen } from '&/screens/app/ProfileScreen';
import { AuthenticationScreen } from '&/screens/authentication/AuthenticationScreen';

import { currentUser, currentUserPosts, wrapRender } from '../jestSetupFile';

describe('snapshot test', () => {
  it('should properly display the authentication screen', () => {
    const tree = wrapRender(<AuthenticationScreen />);
    expect(tree).toMatchSnapshot();
  });

  it('should properly display the profile screen', () => {
    const tree = wrapRender(<ProfileScreen />);
    expect(tree).toMatchSnapshot();
  });

  it('should properly display the camera screen', () => {
    const tree = wrapRender(<CameraScreen />);
    expect(tree).toMatchSnapshot();
  });

  it('should properly display the post screen', () => {
    const postRouter: RouteProp<AppStackParamList, 'Post'> = {
      key: '',
      name: 'Post',
      params: {
        startIndex: 0,
        post: currentUserPosts[0],
        account: currentUser,
      },
    };

    const tree = wrapRender(<PostScreen route={postRouter} />);
    expect(tree).toMatchSnapshot();
  });
});
