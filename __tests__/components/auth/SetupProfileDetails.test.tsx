import { fireEvent, screen, waitFor } from '@testing-library/react-native';

import { SetupProfileDetails } from '&/components/auth/SetupProfileDetails';
import { updateUserAccount } from '&/queries/user';

import { mockUser } from '&/__mocks__/zustand';
import { render } from '&/jest.setup';

jest.mock('&/queries/user', () => ({
  updateUserAccount: jest.fn(),
}));

describe('SetupProfileDetails', () => {
  beforeEach(() => {
    render(<SetupProfileDetails />);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should match the snapshot', () => {
    screen.toJSON();
    expect(screen).toMatchSnapshot();
  });

  it('should render all input fields', () => {
    const firstNameInput = screen.getByPlaceholderText(/First Name/i);
    const lastNameInput = screen.getByPlaceholderText(/Last Name/i);
    const locationInput = screen.getByPlaceholderText(/Location/i);
    const bioInput = screen.getByPlaceholderText(/Tell the world a bit about yourself/i);

    expect(firstNameInput).toBeDefined();
    expect(lastNameInput).toBeDefined();
    expect(locationInput).toBeDefined();
    expect(bioInput).toBeDefined();
  });

  it('should submit the form when all inputs are valid', async () => {
    fireEvent.changeText(screen.getByPlaceholderText(/First Name/i), 'John');
    fireEvent.changeText(screen.getByPlaceholderText(/Last Name/i), 'Doe');
    fireEvent.changeText(screen.getByPlaceholderText(/Location/i), 'New York');
    fireEvent.changeText(screen.getByPlaceholderText(/Tell the world a bit about yourself/i), 'Hello, world!');

    fireEvent.press(screen.getByRole('button', { name: /Finish/i }));

    await waitFor(() =>
      expect(updateUserAccount).toHaveBeenCalledWith(mockUser.id, {
        first_name: 'John',
        last_name: 'Doe',
        location: 'New York',
        bio: 'Hello, world!',
      }),
    );
  });
});
