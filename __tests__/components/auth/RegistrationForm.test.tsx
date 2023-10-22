import { fireEvent, screen, waitFor } from '@testing-library/react-native';

import { RegistrationForm } from '&/components/auth/RegistrationForm';

import { register, render } from '&/jest.setup';

describe('RegistrationForm', () => {
  beforeEach(() => {
    const bottomSheetRef = { current: null };
    render(<RegistrationForm bottomSheetRef={bottomSheetRef} />);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should match the snapshot', () => {
    screen.toJSON();
    expect(screen).toMatchSnapshot();
  });

  it('should render all input fields', () => {
    const usernameInput = screen.getByRole('text', { name: /Username/i });
    const emailInput = screen.getByRole('text', { name: /Email/i });
    const passwordInput = screen.getByRole('text', { name: /Password/i });
    const birthdayInput = screen.getByRole('text', { name: /Birthday/i });

    expect(usernameInput).toBeDefined();
    expect(emailInput).toBeDefined();
    expect(passwordInput).toBeDefined();
    expect(birthdayInput).toBeDefined();
  });

  it('should hide the date picker when the cancel button is clicked', async () => {
    const birthdayInput = screen.getByPlaceholderText(/Birthday/i);
    fireEvent(birthdayInput, 'pressOut');

    const datePicker = await screen.findByTestId('dateTimePicker');
    expect(datePicker).toBeDefined();

    const cancelButton = await screen.findByRole('button', { name: /Cancel/i });
    fireEvent.press(cancelButton);

    await waitFor(() => {
      const closedDatePicker = screen.queryByTestId('dateTimePicker');
      expect(closedDatePicker).toBeNull();
    });
  });

  it('should set the birthday input value when a date is selected', async () => {
    const birthdayInput = screen.getByPlaceholderText(/Birthday/i);
    fireEvent(birthdayInput, 'pressOut');

    const datePicker = await screen.findByTestId('dateTimePicker');
    expect(datePicker).toBeDefined();

    const confirmButton = await screen.findByRole('button', { name: /Confirm/i });
    fireEvent.press(confirmButton);

    expect(birthdayInput.props.value).toBe(new Date().toLocaleDateString());
  });

  it('should error when the user is under the age of 13', async () => {
    const usernameInput = screen.getByPlaceholderText(/Username/i);
    const emailInput = screen.getByPlaceholderText(/Email/i);
    const passwordInput = screen.getByPlaceholderText(/Password/i);
    const birthdayInput = screen.getByPlaceholderText(/Birthday/i);

    fireEvent.changeText(usernameInput, 'testuser');
    fireEvent.changeText(emailInput, 'test@mail.com');
    fireEvent.changeText(passwordInput, 'password');
    fireEvent.changeText(birthdayInput, new Date(`${new Date().getFullYear() - 12}-01-01`));

    const registerButton = screen.getByRole('button', { name: /Register/i });
    fireEvent.press(registerButton);

    expect(await screen.findByText(/You must be 13 years or older to register/i)).toBeDefined();
    expect(register).not.toHaveBeenCalled();
  });

  it('should show an error messages if inputs are invalid', async () => {
    const submitButton = screen.getByRole('button', { name: /Register/i });
    fireEvent.press(submitButton);

    expect(await screen.findByText(/A username is required/i)).toBeDefined();
    expect(await screen.findByText(/Your email is required/i)).toBeDefined();
    expect(await screen.findByText(/A password is required/i)).toBeDefined();
    expect(await screen.findByText(/Your birthday is required/i)).toBeDefined();

    await waitFor(() => {
      expect(register).not.toHaveBeenCalled();
    });
  });

  it('should cal the register function when the form is submitted', async () => {
    const usernameInput = screen.getByPlaceholderText(/Username/i);
    const emailInput = screen.getByPlaceholderText(/Email/i);
    const passwordInput = screen.getByPlaceholderText(/Password/i);
    const birthdayInput = screen.getByPlaceholderText(/Birthday/i);

    fireEvent.changeText(usernameInput, 'testuser');
    fireEvent.changeText(emailInput, 'test@mail.com');
    fireEvent.changeText(passwordInput, 'password');
    fireEvent.changeText(birthdayInput, new Date('06/26/1996'));

    const submitButton = screen.getByRole('button');
    fireEvent.press(submitButton);

    await waitFor(() => expect(register).toHaveBeenCalled());
  });
});
