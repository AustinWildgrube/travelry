import { AuthenticationScreen } from 'src/screens/authentication/AuthenticationScreen';
import { ProfileScreen } from 'src/screens/app/ProfileScreen';
import { CameraScreen } from 'src/screens/app/CameraScreen';
import { wrapRender } from '../jestSetupFile';

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
});
