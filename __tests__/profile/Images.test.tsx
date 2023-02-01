import { waitFor } from '@testing-library/react-native';

import { Images } from '&/components/profile';
import * as PostModule from '&/queries/posts';

import { currentUserPosts, wrapRender } from '../../jestSetupFile';

const postSpy = jest.spyOn(PostModule, 'getPosts').mockResolvedValue(currentUserPosts);

describe('profile images', () => {
  it('should retrieve the users images ', async () => {
    wrapRender(<Images />);

    await waitFor(async () => {
      expect(postSpy).toHaveBeenCalled();

      const spyReturnValue = await postSpy.mock.results[0].value;
      expect(spyReturnValue).toEqual([
        {
          caption: 'The dreadful Castle Black',
          location: 'Castle Black',
          created_at: '2022-11-22 17:41:27+00',
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
          created_at: '2022-12-22 17:41:27+00',
          post_media: [
            {
              id: '76cb79cf-be8a-4416-9d15-b1356b38259a',
              file_url: '0.37365145619157225.jpg',
            },
          ],
        },
      ]);
    });
  });

  it('should show an image album per location', async () => {
    const { getByLabelText } = wrapRender(<Images />);

    await waitFor(() => {
      const imageAlbum = getByLabelText('Castle Black album cover photo');
      expect(imageAlbum).toBeTruthy();
      expect(imageAlbum.props.accessibilityLabel).toBe('Castle Black album cover photo');
      expect(imageAlbum.props.source.uri).toContain(
        '.supabase.co/storage/v1/object/public/posts/0.21339742357972857.jpg',
      );

      const imageAlbumTwo = getByLabelText('Winterfell album cover photo');
      expect(imageAlbumTwo).toBeTruthy();
      expect(imageAlbumTwo.props.accessibilityLabel).toBe('Winterfell album cover photo');
      expect(imageAlbumTwo.props.source.uri).toContain(
        '.supabase.co/storage/v1/object/public/posts/0.37365145619157225.jpg',
      );
    });
  });
});
