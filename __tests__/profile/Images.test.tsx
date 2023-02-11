import { screen, waitFor } from '@testing-library/react-native';

import { Images } from '&/components/profile';
import * as PostModule from '&/queries/posts';

import { currentUser, currentUserPosts, wrapRender } from '../../jestSetupFile';

const postSpy = jest.spyOn(PostModule, 'getPostsByAccountId').mockResolvedValue(currentUserPosts);
let props: any;

describe('profile images', () => {
  it('should retrieve the users images ', async () => {
    wrapRender(<Images user={currentUser} {...props} />);

    await waitFor(() => expect(postSpy).toHaveBeenCalled());
    const spyReturnValue = await postSpy.mock.results[0].value;
    expect(spyReturnValue).toEqual([
      {
        caption: 'The dreadful Castle Black.',
        location: 'Castle Black',
        created_at: '2021-12-24T00:00:00',
        account: currentUser,
        post_media: [
          {
            id: 'b81ad645-7155-45f6-bd2e-ca56786dd331',
            file_url: '0.21339742357972857.jpg',
          },
        ],
      },
      {
        caption: 'Why does Catelyn Stark hate me?',
        location: 'Winterfell',
        created_at: '2021-12-24T00:00:00',
        account: currentUser,
        post_media: [
          {
            id: '76cb79cf-be8a-4416-9d15-b1356b38259a',
            file_url: '0.37365145619157225.jpg',
          },
        ],
      },
    ]);
  });

  it('should show an image album per location', async () => {
    wrapRender(<Images user={currentUser} {...props} />);

    const imageAlbum = await screen.findByLabelText('Castle Black album cover photo');
    expect(imageAlbum).toBeTruthy();
    expect(imageAlbum.props.accessibilityLabel).toBe('Castle Black album cover photo');
    expect(imageAlbum.props.source.uri).toContain(
      '.supabase.co/storage/v1/object/public/posts/0.21339742357972857.jpg',
    );

    const imageAlbumTwo = await screen.findByLabelText('Winterfell album cover photo');
    expect(imageAlbumTwo).toBeTruthy();
    expect(imageAlbumTwo.props.accessibilityLabel).toBe('Winterfell album cover photo');
    expect(imageAlbumTwo.props.source.uri).toContain(
      '.supabase.co/storage/v1/object/public/posts/0.37365145619157225.jpg',
    );
  });
});
