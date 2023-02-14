import { fireEvent, screen, waitFor } from '@testing-library/react-native';

import { ProfileAlbums } from '&/components/profile';
import * as AlbumModule from '&/queries/albums';

import { currentUser, currentUserAlbums, wrapRender } from '../../jestSetupFile';

let props: any;

const albumSpy = jest.spyOn(AlbumModule, 'getAlbumsByAccountId').mockResolvedValue(currentUserAlbums);

const mockSetViewedAlbum = jest.fn();
const navigation = { navigate: jest.fn() };

describe('profile albums', () => {
  it('should retrieve the users albums ', async () => {
    wrapRender(<ProfileAlbums user={currentUser} {...props} />);

    await waitFor(() => expect(albumSpy).toHaveBeenCalled());
    const spyReturnValue = await albumSpy.mock.results[0].value;
    expect(spyReturnValue).toEqual([
      {
        id: '0',
        name: 'Beyond The Wall',
        cover: {
          file_url: '0.37365142347572250.jpg',
        },
      },
    ]);
  });

  it('should show an image album per location', async () => {
    wrapRender(<ProfileAlbums user={currentUser} {...props} />);

    const imageAlbum = await screen.findByLabelText('Beyond The Wall album cover photo');
    expect(imageAlbum).toBeTruthy();
    expect(imageAlbum.props.accessibilityLabel).toBe('Beyond The Wall album cover photo');
    expect(imageAlbum.props.source.uri).toContain(
      '.supabase.co/storage/v1/object/public/posts/0.37365142347572250.jpg',
    );
  });

  it('should navigate to the album images screen when an album is clicked on', async () => {
    wrapRender(<ProfileAlbums user={currentUser} setViewedAlbum={mockSetViewedAlbum} navigation={navigation as any} />);

    const imageAlbum = await screen.findByLabelText('Beyond The Wall album cover photo');
    expect(imageAlbum).toBeTruthy();

    fireEvent.press(imageAlbum);
    expect(navigation.navigate).toHaveBeenCalledWith('Tabs', {
      screen: 'ProfileTab',
      params: {
        screen: 'Album',
        params: {
          albumId: '0',
        },
      },
    });
  });
});
