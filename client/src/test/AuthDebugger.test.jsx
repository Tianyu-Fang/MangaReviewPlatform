import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import AuthDebugger from '../components/AuthDebugger';
import { useAuth0 } from '@auth0/auth0-react';
import { useAuthToken } from '../AuthTokenContext';
import axios from 'axios';

jest.mock('@auth0/auth0-react');
jest.mock('../AuthTokenContext');
jest.mock('axios');

describe('AuthDebugger', () => {
  const user = { name: 'Test User', email: 'test@example.com' };
  const accessToken = 'test-access-token';

  beforeEach(() => {
    useAuth0.mockReturnValue({
      user,
      getAccessTokenSilently: jest.fn().mockResolvedValue(accessToken),
    });
    useAuthToken.mockReturnValue({
      accessToken,
      setAccessToken: jest.fn(),
    });
    axios.get.mockResolvedValue({ data: user });
  });

  it('fetches and displays the access token and user info', async () => {
    render(<AuthDebugger />);

    expect(screen.getByText('Auth Debugger')).toBeInTheDocument();
    expect(screen.getByText('Access Token:')).toBeInTheDocument();
    expect(screen.getByText('User Info:')).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText(JSON.stringify(accessToken, null, 2))).toBeInTheDocument();
    });
  });

  it('displays an error if fetching the access token fails', async () => {
    const errorMessage = 'Error fetching access token';
    useAuth0.mockReturnValue({
      user,
      getAccessTokenSilently: jest.fn().mockRejectedValue(new Error(errorMessage)),
    });

    render(<AuthDebugger />);

    await waitFor(() => {
      expect(screen.queryByText(JSON.stringify(accessToken, null, 2))).not.toBeInTheDocument();
    });
  });

  it('displays an error if fetching the user info fails', async () => {
    const errorMessage = 'Failed to fetch user info';
    axios.get.mockRejectedValue(new Error(errorMessage));

    render(<AuthDebugger />);

    await waitFor(() => {
      expect(screen.queryByText(JSON.stringify(user, null, 2))).not.toBeInTheDocument();
    });
  });
});
