import { fireEvent, screen, waitFor } from '@testing-library/react-native';

import { CommentList } from '&/components/post/CommentList';
import { createComment } from '&/queries/comment';

import { render } from '&/jest.setup';

const mockFetchNextPage = jest.fn();
jest.mock('@tanstack/react-query', () => ({
  ...jest.requireActual('@tanstack/react-query'),
  useInfiniteQuery: jest.fn(() => ({
    data: {
      pages: [
        {
          count: 2,
          cursor: 1,
          data: [
            {
              id: 1,
              text: 'Comment 1',
              post_id: '1',
              reply_origin_comment_id: null,
              in_reply_to_comment_id: null,
              account: {
                id: '1',
                first_name: 'John',
                last_name: 'Doe',
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
            },
            {
              id: 2,
              text: 'Comment 2',
              post_id: '2',
              reply_origin_comment_id: null,
              in_reply_to_comment_id: null,
              account: {
                id: '2',
                first_name: 'John',
                last_name: 'Snow',
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
            },
          ],
        },
      ],
    },
    isLoading: false,
    fetchNextPage: mockFetchNextPage,
  })),
}));

jest.mock('&/queries/comment', () => ({
  createComment: jest.fn(),
}));

describe('CommentList', () => {
  beforeEach(() => {
    const bottomSheetRef = { current: null };
    render(<CommentList bottomSheetRef={bottomSheetRef} postId="123" />);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should render comments correctly', () => {
    expect(screen.getByText(/Comment 1/i)).toBeTruthy();
    expect(screen.getByText(/Comment 2/i)).toBeTruthy();
  });

  it('should load more comments when reaching the end of the list', async () => {
    const flatList = screen.getByText('Comment 1');
    fireEvent.scroll(flatList, { nativeEvent: { contentOffset: { y: 100 }, contentSize: { height: 200 }, layoutMeasurement: { height: 100 } } });

    await waitFor(() => expect(mockFetchNextPage).toHaveBeenCalled());
  });

  it('should add a new comment', async () => {
    const input = screen.getByPlaceholderText(/Comment/i);
    const submitButton = screen.getByTestId(/sendComment/i);
    fireEvent.changeText(input, 'New comment');
    fireEvent.press(submitButton);

    await waitFor(() => expect(createComment).toHaveBeenCalledWith('1', '123', 'New comment', false, undefined, undefined));
  });
});
