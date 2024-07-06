import React, { useEffect, useState } from 'react';
import { useAuth0 } from "@auth0/auth0-react";
import { useAuthToken } from "../AuthTokenContext";
import axios from 'axios';
import '../styles/authDebugger.css';

export default function AuthDebugger() {
  const { user, getAccessTokenSilently } = useAuth0();
  const { accessToken, setAccessToken } = useAuthToken();
  const [userInfo, setUserInfo] = useState(null);

  useEffect(() => {
    const fetchAccessToken = async () => {
      try {
        const token = await getAccessTokenSilently();
        setAccessToken(token);
        console.log('Access token fetched:', token);
      } catch (e) {
        console.error('Error fetching access token:', e);
      }
    };

    fetchAccessToken();
  }, [getAccessTokenSilently, setAccessToken]);

  useEffect(() => {
    const fetchUserInfo = async () => {
      if (!accessToken) return;

      try {
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/profile`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        setUserInfo(res.data);
        console.log('User info fetched:', res.data);
      } catch (error) {
        console.error("Failed to fetch user info:", error);
      }
    };

    fetchUserInfo();
  }, [accessToken]);

  return (
    <div className="auth-debugger-container">
      <h1>Auth Debugger</h1>
      <div>
        <p>Access Token:</p>
        <pre>{JSON.stringify(accessToken, null, 2)}</pre>
      </div>
      <div>
        <p>User Info:</p>
        <pre>{JSON.stringify(userInfo || user, null, 2)}</pre>
      </div>
    </div>
  );
}
