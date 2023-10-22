import { fireEvent, screen, waitFor } from '@testing-library/react-native';
import { render } from 'jest.setup';

import { MemoizedPost } from '&/components/feed/Post';
import { unlikePost } from '&/queries/like';
import { getPublicImageUrl } from '&/utils/getPublicImageUrl';

jest.mock('&/utils/getPublicImageUrl', () => ({
  getPublicImageUrl: jest.fn().mockResolvedValue('mocked_image_url'),
}));

jest.mock('&/queries/like', () => ({
  unlikePost: jest.fn(),
}));

describe('MemoizedPost', () => {
  beforeEach(() => {
    const post = {
      id: '1',
      caption: 'caption',
      created_at: 'string',
      location: 'New York',
      account: {
        id: '0',
        username: 'john_doe',
        first_name: 'John',
        last_name: 'Doe',
        avatar_url: '783217837.jpg',
        avatar_placeholder: '783217837.jpg',
      },
      post_media: [
        {
          id: '0',
          file_url: '898932324.jpg',
          file_placeholder: '898932324.jpg',
        },
      ],
      post_stat: {
        id: '0',
        likes_count: 2,
      },
      post_like: {
        id: '0',
        account_id: '0',
        post_id: '0',
      },
    };

    render(<MemoizedPost post={post} />);
  });

  it('should render a post', async () => {
    const postImage = await screen.findByTestId('image');
    const accountName = screen.getByText(/John Doe/i);
    const postLocation = screen.getByText(/New York/i);

    // once for the avatar and once for the post image
    await waitFor(() => expect(getPublicImageUrl).toHaveBeenCalledTimes(2));

    expect(postImage.props.source).toEqual({ uri: 'mocked_image_url' });
    expect(accountName).toBeTruthy();
    expect(postLocation).toBeTruthy();
  });

  // it('should go to the post page when clicked', async () => {
  //   const postImage = await screen.findByTestId('image');
  //   fireEvent.press(postImage);
  //
  //   TODO: expect route to be post & viewed post to be the post
  //   expect(...);
  // });

  // it('should go to the profile page when clicked', async () => {
  //   const accountName = await screen.findByText(/John Doe/i);
  //   fireEvent.press(accountName);
  //
  //   TODO: expect route to be profile
  //   expect(...);
  // });

  it('should like the post when double clicked', async () => {
    const postImage = await screen.findByTestId('image');
    fireEvent.press(postImage);
    fireEvent.press(postImage);

    // we already start with the post liked
    await waitFor(() => expect(unlikePost).toHaveBeenCalled());
  });
});
