import * as React from 'react';

import { Header } from '&/components/profile';

import { wrapRender } from '../../jestSetupFile';

describe('profile header', () => {
  it('should display the users avatar image', () => {
    const { getByLabelText } = wrapRender(<Header />);
    const avatar = getByLabelText(`John Snow's profile image`);

    expect(avatar).toBeTruthy();
    expect(avatar.props.accessibilityLabel).toBe(`John Snow's profile image`);
    expect(avatar.props.source.uri).toContain('.supabase.co/storage/v1/object/public/avatars/998.jpg');
  });

  it('should display the users full name', () => {
    const { getByText } = wrapRender(<Header />);
    expect(getByText('John Snow')).toBeTruthy();
  });

  it('should display the users bio', () => {});
  const { getByText } = wrapRender(<Header />);
  expect(getByText('I know nothing.')).toBeTruthy();

  it('should display the users followers, following, and trip counts', () => {
    const { getByText } = wrapRender(<Header />);

    // followers
    expect(getByText('1000000')).toBeTruthy();

    // following
    expect(getByText('1')).toBeTruthy();

    // trips
    expect(getByText('2')).toBeTruthy();
  });
});
