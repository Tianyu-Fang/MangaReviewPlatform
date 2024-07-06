import React, { useState, useEffect } from 'react';
import { useAuth0 } from "@auth0/auth0-react";
import axios from 'axios';
import { useAuthToken } from '../AuthTokenContext';
import { useUserProfile } from '../UserProfileContext';
import avatar1 from '../image/avatar/avatar1.png';
import avatar2 from '../image/avatar/avatar2.png';
import avatar3 from '../image/avatar/avatar3.png';
import avatar4 from '../image/avatar/avatar4.png';
import '../styles/profile.css';

const Profile = () => {
  const { user, getAccessTokenSilently } = useAuth0();
  const { accessToken, setAccessToken } = useAuthToken();
  const { profile, setProfile } = useUserProfile();
  const [editAvatar, setEditAvatar] = useState('');
  const [showAvatarSelection, setShowAvatarSelection] = useState(false);
  const avatars = {
    'avatar1.png': avatar1,
    'avatar2.png': avatar2,
    'avatar3.png': avatar3,
    'avatar4.png': avatar4,
  };

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
        setEditAvatar(userData.picture);
        setProfile(userData);
      } catch (error) {
        console.error("Failed to fetch user details", error);
      }
    };

    if (accessToken) {
      fetchUserDetails();
    }
  }, [accessToken, setProfile]);

  const handleAvatarChange = (avatarKey) => {
    setEditAvatar(avatarKey); // Store the relative path
    console.log('Avatar changed to:', avatarKey);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    console.log('Submitting form with avatar:', editAvatar);
    try {
      const res = await axios.put(
        `${process.env.REACT_APP_API_URL}/profile`,
        { picture: editAvatar },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      alert('Profile updated successfully');
      setShowAvatarSelection(false);
      const userData = res.data;
      setProfile(userData); // Update the profile context with new data
      setEditAvatar(userData.picture);
      console.log('User details refetched:', userData);
    } catch (error) {
      console.error('Failed to update profile', error);
      alert('Failed to update profile');
    }
  };

  return (
    <div className="profile-container">
      <h1>Profile</h1>
      <div className="profile-info">
        <div className="avatar-section">
          <img src={avatars[profile.picture]} width="70" alt="profile avatar" />
          <button onClick={() => setShowAvatarSelection(true)}>Edit Avatar</button>
        </div>
        <p>Name: {user.name}</p>
        <p>📧 Email: {user.email}</p>
        <p>🔑 Auth0Id: {user.sub}</p>
        <p>✅ Email verified: {user.email_verified?.toString()}</p>
      </div>
      {showAvatarSelection && (
        <form onSubmit={handleFormSubmit} className="avatar-selection-form">
          <div className="avatar-selection">
            {Object.keys(avatars).map((avatarKey, index) => (
              <img
                key={index}
                src={avatars[avatarKey]}
                width="70"
                alt={`avatar ${index + 1}`}
                className={editAvatar === avatarKey ? 'selected-avatar' : ''}
                onClick={() => handleAvatarChange(avatarKey)}
              />
            ))}
          </div>
          <button type="submit">Save Changes</button>
        </form>
      )}
    </div>
  );
};

export default Profile;
