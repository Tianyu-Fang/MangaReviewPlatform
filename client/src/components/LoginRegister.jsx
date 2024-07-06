import '../styles/loginRegister.css'
import React, { useEffect } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { useNavigate } from 'react-router-dom';
import { useAuthToken } from '../AuthTokenContext';

export default function LoginRegister() {
  const navigate = useNavigate();
  const { isAuthenticated, loginWithRedirect, getAccessTokenSilently } = useAuth0();
  const { setAccessToken } = useAuthToken();

  useEffect(() => {
    const fetchAccessToken = async () => {
      try {
        const token = await getAccessTokenSilently();
        setAccessToken(token);
        navigate("/");
      } catch (e) {
        console.error(e);
      }
    };

    if (isAuthenticated) {
      fetchAccessToken();
    }
  }, [isAuthenticated, getAccessTokenSilently, navigate, setAccessToken]);

  const signUp = () => loginWithRedirect({ screen_hint: "signup" });

  return (
    <div className="login-register-container">
      <h1>Welcome to Manga Review App</h1>
      <div>
        {!isAuthenticated ? (
          <button className="btn-primary" onClick={loginWithRedirect}>
            Login
          </button>
        ) : (
          <button className="btn-primary" onClick={() => navigate("/app")}>
            Enter App
          </button>
        )}
      </div>
      <div>
        <button className="btn-secondary" onClick={signUp}>
          Create Account
        </button>
      </div>
    </div>
  );
}