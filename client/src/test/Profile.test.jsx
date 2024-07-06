import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import Profile from '../components/Profile';
import { useAuth0 } from '@auth0/auth0-react';
import { useAuthToken } from '../AuthTokenContext';
import { useUserProfile } from '../UserProfileContext';
// import axios from 'axios';

// Mock the dependencies
jest.mock('@auth0/auth0-react');
jest.mock('../AuthTokenContext');
jest.mock('../UserProfileContext');
// jest.mock('axios');

describe('Profile Component', () => {
  beforeEach(() => {
    useAuth0.mockReturnValue({
      user: { name: 'John Doe', email: 'john.doe@example.com', sub: 'auth0|12345', email_verified: true },
      getAccessTokenSilently: jest.fn().mockResolvedValue('mockedAccessToken'),
    });

    useAuthToken.mockReturnValue({
      accessToken: 'mockedAccessToken',
      setAccessToken: jest.fn(),
    });

    useUserProfile.mockReturnValue({
      profile: { picture: 'avatar1.png' },
      setProfile: jest.fn(),
    });


  });

  test('renders profile information correctly', () => {
    render(<Profile />);

    expect(screen.getByText('Profile')).toBeInTheDocument();
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('📧 Email: john.doe@example.com')).toBeInTheDocument();
    expect(screen.getByText('🔑 Auth0Id: auth0|12345')).toBeInTheDocument();
    expect(screen.getByText('✅ Email verified: true')).toBeInTheDocument();
    expect(screen.getByAltText('profile avatar')).toBeInTheDocument();
  });

  test('opens avatar selection when edit button is clicked', () => {
    render(<Profile />);

    fireEvent.click(screen.getByText('Edit Avatar'));

    expect(screen.getByText('Save Changes')).toBeInTheDocument();
    expect(screen.getAllByAltText(/avatar \d/)).toHaveLength(4);
  });

  test('changes avatar and submits form', async () => {
    render(<Profile />);

    fireEvent.click(screen.getByText('Edit Avatar'));
    fireEvent.click(screen.getAllByAltText(/avatar \d/)[1]); // Select second avatar
    fireEvent.click(screen.getByText('Save Changes'));

    expect(await screen.findByText('Profile updated successfully')).toBeInTheDocument();
  });
});
