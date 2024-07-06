import '../styles/home.css'; 
import React, { useState, useEffect } from 'react';
import { useAuth0 } from "@auth0/auth0-react";
import axios from 'axios';
import cover1 from '../image/cover/c_thumb00.jpg';
import cover2 from '../image/cover/c_thumb01.jpg';
import cover3 from '../image/cover/c_thumb02.jpg';
import cover4 from '../image/cover/c_thumb03.jpg';

const coverImages = {
  'c_thumb00.jpg': cover1,
  'c_thumb01.jpg': cover2,
  'c_thumb02.jpg': cover3,
  'c_thumb03.jpg': cover4,
};

const Home = () => {
  const [reviews, setReviews] = useState([]);
  const [mangas, setMangas] = useState([]);
  const { isAuthenticated, loginWithRedirect } = useAuth0();

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/reviews/latest?limit=5`);
        setReviews(res.data);
      } catch (error) {
        console.error("Failed to fetch reviews", error);
      }
    };

    fetchReviews();
  }, []);

  useEffect(() => {
    const fetchMangas = async () => {
      try {
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/manga`);
        setMangas(res.data);
      } catch (error) {
        console.error("Failed to fetch mangas", error);
      }
    };

    fetchMangas();
  }, []);

  const signUp = () => loginWithRedirect({ screen_hint: "signup" });

  return (
    <div className="home-container">
      <h1>Latest Reviews</h1>
      <ul className="reviews-list">
        {reviews.map(review => (
          <li key={review.id}>
            <div className="review-date">{new Date(review.created_at).toISOString().split('T')[0]}</div>
            <div className="review-comment">
              {review.comment} - {review.user.name}
            </div>
          </li>
        ))}
      </ul>
      
      <h2>Available Manga</h2>
      <ul className="mangas-list">
        {mangas.map(manga => (
          <li key={manga.id}>
            <img src={coverImages[manga.cover_image]} alt={manga.title} />
            <p>{manga.title}</p>
          </li>
        ))}
      </ul>

      {!isAuthenticated && (
        <div className="auth-buttons">
          <h1>Want to leave your own comment?</h1>
          <button className="btn-primary" onClick={loginWithRedirect}>
            Login
          </button>
          <button className="btn-secondary" onClick={signUp}>
            Create Account
          </button>
        </div>
      )}
    </div>
  );
};

export default Home;
