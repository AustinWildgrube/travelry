import { RouteProp } from '@react-navigation/native';

import { ProfileStackParamList } from '&/navigators/profile-navigator';
import { AppStackParamList } from '&/navigators/root-navigator';
import { AlbumScreen } from '&/screens/app/AlbumScreen';
import { CameraScreen } from '&/screens/app/CameraScreen';
import { EditScreen } from '&/screens/app/EditScreen';
import { FeedScreen } from '&/screens/app/FeedScreen';
import { PostScreen } from '&/screens/app/PostScreen';
import { ProfileScreen } from '&/screens/app/ProfileScreen';
import { AuthenticationScreen } from '&/screens/authentication/AuthenticationScreen';

import { currentUser, currentUserPosts, wrapRender } from '../jestSetupFile';

describe('snapshot tests', () => {
  it('should properly display the album screen', () => {
    const albumRouter: RouteProp<ProfileStackParamList, 'Album'> = {
      key: '',
      name: 'Album',
      params: {
        albumId: '',
      },
    };

    const tree = wrapRender(<AlbumScreen route={albumRouter} />);
    expect(tree).toMatchSnapshot();
  });

  it('should properly display the authentication screen', () => {
    const tree = wrapRender(<AuthenticationScreen />);
    expect(tree).toMatchSnapshot();
  });

  it('should properly display the camera screen', () => {
    const tree = wrapRender(<CameraScreen />);
    expect(tree).toMatchSnapshot();
  });

  it('should properly display the camera screen', () => {
    const editRouter: RouteProp<AppStackParamList, 'Edit'> = {
      key: '',
      name: 'Edit',
      params: {
        image: '',
      },
    };

    const tree = wrapRender(<EditScreen route={editRouter} />);
    expect(tree).toMatchSnapshot();
  });

  it('should properly display the feed screen', () => {
    const tree = wrapRender(<FeedScreen />);
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

  it('should properly display the profile screen', () => {
    const tree = wrapRender(<ProfileScreen />);
    expect(tree).toMatchSnapshot();
  });
});
