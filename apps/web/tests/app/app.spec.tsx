import { render } from '@testing-library/react';

import App from '../../src/app/app';

describe('App', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<App />);
    expect(baseElement).toBeTruthy();
  });

  it('should render the greeting', () => {
    const { getAllByText } = render(<App />);
    expect(
      getAllByText(new RegExp('Hello world', 'i')).length > 0,
    ).toBeTruthy();
  });
});
