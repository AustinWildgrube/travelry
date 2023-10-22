import { useCallback, useRef } from 'react';
import { type GestureResponderEvent } from 'react-native';

import { DOUBLE_TAP_DELAY } from '&/utils/constants';

export type CallbackFunction<Target = Element> = (event: GestureResponderEvent) => void;

export type DoubleTapCallback<Target = Element> = CallbackFunction<Target> | null;

export type DoubleTapOptions<Target = Element> = {
  onSingleTap?: CallbackFunction<Target>;
};

export function useDoubleTap<T = Element, Callback extends DoubleTapCallback<T> = DoubleTapCallback<T>>(
  callback: Callback,
  options: DoubleTapOptions<T> = {},
): { onPress: (event: GestureResponderEvent) => void } | {} {
  const timer = useRef<NodeJS.Timeout | null>(null);

  const handler = useCallback<CallbackFunction<T>>(
    (event: GestureResponderEvent) => {
      if (!timer.current) {
        timer.current = setTimeout(() => {
          if (options.onSingleTap) {
            options.onSingleTap(event);
          }

          timer.current = null;
        }, DOUBLE_TAP_DELAY);
      } else {
        clearTimeout(timer.current);
        timer.current = null;

        callback && callback(event);
      }
    },
    [callback, options.onSingleTap],
  );

  return callback ? { onPress: handler } : {};
}
