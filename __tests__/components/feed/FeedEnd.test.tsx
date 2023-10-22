import { Alert } from 'react-native';

import { fireEvent, screen } from '@testing-library/react-native';

import { FeedEnd } from '&/components/feed/FeedEnd';

import { render } from '&/jest.setup';

jest.spyOn(Alert, 'alert');

describe('FeedEnd', () => {
  beforeEach(() => {
    render(<FeedEnd />);
  });

  it('should match the snapshot', () => {
    screen.toJSON();
    expect(screen).toMatchSnapshot();
  });

  it('should render the button correctly', () => {
    const endOfContentText = screen.getByText(/You've reached the end./i);
    const button = screen.getByRole('button', { name: /Wonder why you're seeing this?/i });

    expect(endOfContentText).toBeTruthy();
    expect(button).toBeTruthy();
  });

  it('shows alert when button is pressed', () => {
    const button = screen.getByRole('button', { name: /Wonder why you're seeing this?/i });
    fireEvent.press(button);

    expect(Alert.alert).toHaveBeenCalledWith(
      'Why am I seeing this?',
      "As our community is just getting started, we've reached the end of our current content. But don't worry, there's still plenty of " +
        "room for you to help us grow! We encourage you to start sharing your own travel experiences and inspire others to do the same. Let's " +
        'build our community together!',
    );
  });
});
