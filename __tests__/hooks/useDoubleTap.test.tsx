import { Pressable } from 'react-native';

import { act, renderHook } from '@testing-library/react-hooks';
import { fireEvent, screen, waitFor } from '@testing-library/react-native';

import { useDoubleTap } from '&/hooks/useDoubleTap';

import { render } from '&/jest.setup';

describe('useDoubleTap', () => {
  it('should call the single tap callback when single tap is detected', async () => {
    const singleTapCallback = jest.fn();
    const { result } = renderHook(() => useDoubleTap(jest.fn(), { onSingleTap: singleTapCallback }));
    const { onPress } = result.current as { onPress: () => void };

    act(() => {
      onPress();
    });

    await waitFor(() => {
      expect(singleTapCallback).toHaveBeenCalledTimes(1);
    });
  });

  it('should call the double tap callback when double tap is detected', () => {
    const doubleTapCallback = jest.fn();
    const { result } = renderHook(() => useDoubleTap(doubleTapCallback));
    const { onPress } = result.current as { onPress: () => void };

    act(() => {
      onPress();
      onPress();
    });

    expect(doubleTapCallback).toHaveBeenCalledTimes(1);
  });

  it('should not call any callbacks if no tap is detected', () => {
    const singleTapCallback = jest.fn();
    const doubleTapCallback = jest.fn();
    const { result } = renderHook(() => useDoubleTap(doubleTapCallback, { onSingleTap: singleTapCallback }));
    const { onPress } = result.current as { onPress: () => void };

    expect(singleTapCallback).not.toHaveBeenCalled();
    expect(doubleTapCallback).not.toHaveBeenCalled();

    act(() => {
      // simulating a long delay to prevent a double tap from occurring
      jest.useFakeTimers();
      onPress();
      jest.advanceTimersByTime(500);
      jest.useRealTimers();
    });

    expect(singleTapCallback).toHaveBeenCalledTimes(1);
    expect(doubleTapCallback).not.toHaveBeenCalled();
  });

  it('should return an empty object if no callbacks are provided', () => {
    const { result } = renderHook(() => useDoubleTap(null));
    expect(result.current).toEqual({});
  });

  it('should render the component with the onPress handler', async () => {
    const onPressHandler = jest.fn();
    const { result } = renderHook(() => useDoubleTap(jest.fn(), { onSingleTap: onPressHandler }));
    render(<Pressable testID="pressable" {...result.current} />);

    fireEvent.press(screen.getByTestId('pressable'));

    await waitFor(() => expect(onPressHandler).toHaveBeenCalled());
  });
});
