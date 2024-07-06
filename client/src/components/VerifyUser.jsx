import "../styles/verifyUser.css";

import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthToken } from '../AuthTokenContext';

export default function VerifyUser() {
  const navigate = useNavigate();
  const { accessToken } = useAuthToken();

  useEffect(() => {
    async function verifyUser() {
      // make a call to our API to verify the user in our database, if it doesn't exist we'll insert it into our database
      // finally we'll redirect the user to the /app route
      try {
        const data = await fetch(`${process.env.REACT_APP_API_URL}/verify-user`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
        });
        const user = await data.json();

        if (user.auth0Id) {
          navigate("/app");
        }
      } catch (error) {
        console.error("Failed to verify user", error);
      }
    }

    if (accessToken) {
      verifyUser();
    }
  }, [accessToken, navigate]);

  return <div className="loading">Loading...</div>;
}
