import { fireEvent, screen, waitFor } from '@testing-library/react-native';

import { MemoizedComment } from '&/components/post/Comment';
import { getRepliesByCommentId } from '&/queries/comment';
import { likeComment, unlikeComment } from '&/queries/like';
import { type Comment } from '&/types/types';

import { render } from '&/jest.setup';

const mockSetInReplyTo = jest.fn();

jest.mock('&/queries/like', () => ({
  likeComment: jest.fn(),
  unlikeComment: jest.fn(),
}));

jest.mock('&/queries/comment', () => ({
  deleteCommentById: jest.fn(),
  getRepliesByCommentId: jest.fn().mockResolvedValue({
    data: [
      {
        id: 173,
        text: '123',
        post_id: '5696c81a-b2c8-4e71-bd9b-6924cb0a8388',
        reply_origin_comment_id: 172,
        comment_like: [
          {
            id: 228,
            comment_id: 173,
            account_id: 'dadee07d-8db7-4429-9432-b43c8fdbb9c9',
          },
        ],
        account: {
          id: 'dadee07d-8db7-4429-9432-b43c8fdbb9c9',
          first_name: 'Cameron',
          last_name: 'Greer',
          avatar_url: '39fe83a0ce5ec6771060b1de25ea55017b55724e2ecf3160bef0b7ec25b99e8f.jpg',
        },
        comment_stat: {
          id: 142,
          likes_count: 1,
          replies_count: 0,
        },
        in_reply_to_comment_id: {
          id: 172,
          account: {
            id: 'dadee07d-8db7-4429-9432-b43c8fdbb9c9',
            first_name: 'Cameron',
            last_name: 'Greer',
          },
        },
      },
      {
        id: 174,
        text: 'Reply',
        post_id: '5696c81a-b2c8-4e71-bd9b-6924cb0a8388',
        reply_origin_comment_id: 172,
        comment_like: [],
        account: {
          id: 'dadee07d-8db7-4429-9432-b43c8fdbb9c9',
          first_name: 'Cameron',
          last_name: 'Greer',
          avatar_url: '39fe83a0ce5ec6771060b1de25ea55017b55724e2ecf3160bef0b7ec25b99e8f.jpg',
        },
        comment_stat: {
          id: 143,
          likes_count: 0,
          replies_count: 0,
        },
        in_reply_to_comment_id: {
          id: 172,
          account: {
            id: 'dadee07d-8db7-4429-9432-b43c8fdbb9c9',
            first_name: 'Cameron',
            last_name: 'Greer',
          },
        },
      },
      {
        id: 175,
        text: 'Yeah',
        post_id: '5696c81a-b2c8-4e71-bd9b-6924cb0a8388',
        reply_origin_comment_id: 172,
        comment_like: [],
        account: {
          id: 'dadee07d-8db7-4429-9432-b43c8fdbb9c9',
          first_name: 'Cameron',
          last_name: 'Greer',
          avatar_url: '39fe83a0ce5ec6771060b1de25ea55017b55724e2ecf3160bef0b7ec25b99e8f.jpg',
        },
        comment_stat: {
          id: 144,
          likes_count: 0,
          replies_count: 0,
        },
        in_reply_to_comment_id: {
          id: 172,
          account: {
            id: 'dadee07d-8db7-4429-9432-b43c8fdbb9c9',
            first_name: 'Cameron',
            last_name: 'Greer',
          },
        },
      },
    ],
    count: 14,
    cursor: 2,
  }),
}));

describe('Comment', () => {
  beforeEach(() => {
    const comment: Comment = {
      id: 1,
      text: 'Test comment',
      post_id: '1',
      reply_origin_comment_id: null,
      in_reply_to_comment_id: {
        id: 1,
        account: {
          id: '1',
          first_name: 'Rob',
          last_name: 'Stark',
        },
      },
      account: {
        id: '1',
        username: 'jdoe4',
        first_name: 'John',
        last_name: 'Doe',
        avatar_url: 'avatar.jpg',
        avatar_placeholder: 'avatar.jpg',
      },
      comment_like: {
        id: 0,
        account_id: '',
        comment_id: 0,
      },
      comment_stat: {
        id: 0,
        likes_count: 0,
        replies_count: 1,
      },
    };

    render(<MemoizedComment comment={comment} setInReplyTo={mockSetInReplyTo} />);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should match the snapshot', () => {
    screen.toJSON();
    expect(screen).toMatchSnapshot();
  });

  it('should render the Comment component correctly', () => {
    expect(screen.getByText(/Test comment/)).toBeTruthy();
    expect(screen.getByText(/John Doe/i)).toBeTruthy();
    expect(screen.getByText(/Rob Stark/i)).toBeTruthy(); // in reply to
  });

  // it('should show action menu on long press', async () => {
  //   fireEvent(screen.getByText(/Test comment/), 'onLongPress');
  //
  //   expect(await screen.findByText(/Copy Comment/)).toBeTruthy();
  //   expect(await screen.findByText(/Cancel/)).toBeTruthy();
  // });

  // it('should call deleteCommentById and update the query data when deleting the comment', () => {
  //   fireEvent(screen.getByText(/Test comment/), 'onLongPress');
  //   fireEvent.press(screen.getByText(/Delete Comment/i));
  //
  //   expect(deleteCommentById).toHaveBeenCalledTimes(1);
  //   expect(deleteCommentById).toHaveBeenCalledWith(1);
  //
  //   expect(useQueryClient().setQueryData).toHaveBeenCalledTimes(1);
  //   expect(useQueryClient().setQueryData).toHaveBeenCalledWith(['comments', 1], expect.any(Function));
  // });

  it('should like and unlike the post when the like button is clicked', async () => {
    fireEvent.press(screen.getByTestId('heart'));
    await waitFor(() => expect(unlikeComment).toHaveBeenCalled());

    fireEvent.press(screen.getByTestId('heart-o'));
    await waitFor(() => expect(likeComment).toHaveBeenCalled());
  });

  it('should like the comment when double clicked', async () => {
    const comment = screen.getByText(/Test comment/);
    fireEvent.press(comment);
    fireEvent.press(comment);

    // we already start with the comment liked
    await waitFor(() => expect(unlikeComment).toHaveBeenCalled());
  });

  // it('should go to the users profile when clicking their name', () => {
  //   fireEvent.press(screen.getByText(/John Doe/i));
  //
  //   TODO: test if /profile/ is the current route
  //   expect(screen.getByText(/John Doe/i)).toBeTruthy();
  // });

  it('should call setInReplyTo when clicking the reply button', () => {
    fireEvent.press(screen.getByRole('button', { name: 'Reply' }));

    expect(mockSetInReplyTo).toHaveBeenCalledTimes(1);
    expect(mockSetInReplyTo).toHaveBeenCalledWith({
      id: 1,
      text: 'Test comment',
      origin: 1,
    });
  });

  it('should call refetchReply when clicking the "View x Replies" button', async () => {
    fireEvent.press(screen.getByText('View 1 Reply'));
    await waitFor(() => expect(getRepliesByCommentId).toHaveBeenCalled());
  });

  it('should call hideReplies when clicking the "Hide Replies" button', async () => {
    fireEvent.press(screen.getByText(/View 1 Reply/));
    fireEvent.press(await screen.findByText(/Hide Replies/i));

    expect(screen.queryByText(/Hide Replies/i)).toBeNull();
  });
});
