import { Image } from 'expo-image';

import { styled } from '../../styled';

export default styled(
  Image,
  {
    w: '100%',
    h: '100%',
    borderRadius: '$full',
    position: 'absolute',
  },
  {},
);
