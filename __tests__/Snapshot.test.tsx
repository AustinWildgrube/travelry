import { CameraScreen } from '&/screens/app/CameraScreen';
import { ProfileScreen } from '&/screens/app/ProfileScreen';
import { AuthenticationScreen } from '&/screens/authentication/AuthenticationScreen';

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
