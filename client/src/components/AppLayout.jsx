import "../styles/appLayout.css";
import React, { useEffect, useState } from 'react';
import { Outlet, Link } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';
import axios from 'axios';
import { useAuthToken } from '../AuthTokenContext';
import { useUserProfile } from '../UserProfileContext';
import avatar1 from '../image/avatar/avatar1.png';
import avatar2 from '../image/avatar/avatar2.png';
import avatar3 from '../image/avatar/avatar3.png';
import avatar4 from '../image/avatar/avatar4.png';

const avatars = {
  'avatar1.png': avatar1,
  'avatar2.png': avatar2,
  'avatar3.png': avatar3,
  'avatar4.png': avatar4,
};

export default function AppLayout() {
  const { isLoading, logout, getAccessTokenSilently } = useAuth0();
  const { accessToken, setAccessToken } = useAuthToken();
  const { profile, setProfile } = useUserProfile();
  const [weather, setWeather] = useState(null);

  useEffect(() => {
    const fetchAccessToken = async () => {
      try {
        const token = await getAccessTokenSilently();
        setAccessToken(token);
        console.log('Access token fetched:', token);
      } catch (e) {
        console.error(e);
      }
    };

    fetchAccessToken();
  }, [getAccessTokenSilently, setAccessToken]);

  useEffect(() => {
    const fetchUserDetails = async () => {
      console.log('Fetching user details with access token:', accessToken);
      try {
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/profile`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        const userData = res.data;
        console.log('User details fetched:', userData);
        setProfile(userData);
      } catch (error) {
        console.error("Failed to fetch user details", error);
      }
    };

    if (accessToken) {
      fetchUserDetails();
    }
  }, [accessToken, setProfile]);

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const response = await axios.get('https://weatherbit-v1-mashape.p.rapidapi.com/current', {
          params: { lon: '-123.1207', lat: '49.2827' }, // Coordinates for Vancouver, Canada
          headers: {
            'X-RapidAPI-Key': process.env.REACT_APP_RAPIDAPI_KEY,
            'X-RapidAPI-Host': 'weatherbit-v1-mashape.p.rapidapi.com'
          }
        });
        setWeather(response.data.data[0]);
      } catch (error) {
        console.error('Failed to fetch weather data', error);
      }
    };

    fetchWeather();
  }, []);

  if (isLoading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="app">
      <div className="title">
        <h1>Manga Review App</h1>
      </div>
      <div className="header">
        <nav className="menu">
          <ul className="menu-list">
            <li>
              <Link to="/app">Review</Link>
            </li>
            <li>
              <Link to="/app/profile">Profile</Link>
            </li>
            <li>
              <Link to="/app/manga">Manga</Link>
            </li>
            <li>
              <Link to="/app/debugger">AuthDebugger</Link>
            </li>
          </ul>
        </nav>
        <div className="weather-logout-container">
          {weather && (
            <div className="weather-info">
              <p>Weather in {weather.city_name}</p>
              <p>Temperature: {weather.temp}°C</p>
              <p>Condition: {weather.weather.description}</p>
            </div>
          )}
          <div className="user-info">
            {profile.picture && (
              <img src={avatars[profile.picture]} alt="User Avatar" className="user-avatar" />
            )}
            <button
              className="exit-button"
              onClick={() => logout({ returnTo: window.location.origin })}
            >
              LogOut
            </button>
          </div>
        </div>
      </div>
      <div className="content">
        <Outlet />
      </div>
    </div>
  );
}
