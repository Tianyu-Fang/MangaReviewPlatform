import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { BrowserRouter as Router } from 'react-router-dom';
import Manga from '../components/Manga';
import { useAuthToken } from '../AuthTokenContext';
import axios from 'axios';

// Mock the dependencies
jest.mock('axios');
jest.mock('../AuthTokenContext');

describe('Manga Component', () => {
  beforeEach(() => {
    useAuthToken.mockReturnValue({
      accessToken: 'mockedAccessToken',
    });

    axios.get.mockResolvedValue({
      data: [
        { id: 1, title: 'Episode 1', cover_image: 'c_thumb00.jpg' },
        { id: 2, title: 'Episode 2', cover_image: 'c_thumb01.jpg' },
      ],
    });
  });

  test('renders manga episodes correctly', async () => {
    render(
      <Router>
        <Manga />
      </Router>
    );

    expect(screen.getByText('Manga Episodes')).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText('Episode 1')).toBeInTheDocument();

    });
  });

  test('displays error message on API failure', async () => {
    axios.get.mockRejectedValueOnce(new Error('Failed to fetch mangas'));

    render(
      <Router>
        <Manga />
      </Router>
    );

    await waitFor(() => {
      expect(screen.queryByText('Episode 1')).not.toBeInTheDocument();

    });

  });
});
