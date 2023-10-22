import { useMemo } from 'react';
import { StyleSheet } from 'react-native';

import { config } from '&/gluestack-ui.config';

export const makeStyles =
  <T extends StyleSheet.NamedStyles<T> | StyleSheet.NamedStyles<any>, V>(styles: T | ((theme: typeof config.theme.tokens, props: V) => T)) =>
  (props: V = {} as any): T => {
    return useMemo(() => {
      const css = typeof styles === 'function' ? styles(config.theme.tokens, props) : styles;
      return StyleSheet.create(css);
    }, [props, config]);
  };
