import React, { useState, useEffect } from 'react';
import { useAuth0 } from "@auth0/auth0-react";
import axios from 'axios';
import { useAuthToken } from '../AuthTokenContext';
import '../styles/review.css';

const Review = () => {
  const [newReview, setNewReview] = useState({ mangaId: '', rating: 1, comment: '' });
  const [userReviews, setUserReviews] = useState([]);
  const [mangaList, setMangaList] = useState([]);
  const { user, getAccessTokenSilently } = useAuth0();
  const { accessToken, setAccessToken } = useAuthToken();

  useEffect(() => {
    const fetchAccessToken = async () => {
      try {
        const token = await getAccessTokenSilently();
        setAccessToken(token);
      } catch (e) {
        console.error(e);
      }
    };

    fetchAccessToken();
  }, [getAccessTokenSilently, setAccessToken]);

  useEffect(() => {
    const fetchUserReviews = async () => {
      try {
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/reviews/user/${user.sub}`, {
          headers: {
            Authorization: `Bearer ${accessToken}`
          }
        });
        setUserReviews(res.data);
      } catch (error) {
        console.error("Failed to fetch user reviews", error);
      }
    };

    if (user && accessToken) {
      fetchUserReviews();
    }
  }, [user, accessToken]);

  useEffect(() => {
    const fetchMangaList = async () => {
      try {
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/manga`, {
          headers: {
            Authorization: `Bearer ${accessToken}`
          }
        });
        setMangaList(res.data);
      } catch (error) {
        console.error("Failed to fetch manga list", error);
      }
    };

    fetchMangaList();
  }, [accessToken]);

  const insertReview = async (review) => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/reviews`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(review),
      });
      if (response.ok) {
        const newReview = await response.json();
        return newReview;
      } else {
        return null;
      }
    } catch (error) {
      console.error("Failed to submit review", error);
      return null;
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    const reviewData = {
      user_id: user.sub,
      manga_id: newReview.mangaId,
      rating: newReview.rating,
      comment: newReview.comment,
    };

    const newReviewData = await insertReview(reviewData);
    if (newReviewData) {
      setUserReviews([...userReviews, newReviewData]);
      setNewReview({ mangaId: '', rating: 1, comment: '' });
    }
  };

  const deleteReview = async (id) => {
    try {
      await axios.delete(`${process.env.REACT_APP_API_URL}/reviews/${id}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      setUserReviews(userReviews.filter((review) => review.id !== id));
    } catch (error) {
      console.error(`Failed to delete review ${id}:`, error);
    }
  };

  return (
    <div className="review-container">
      <h1>My Reviews</h1>
      <ul className="user-reviews-list">
        {userReviews.map(review => (
          <li key={review.id}>
            <strong>{review.manga?.title || 'Unknown Manga'}</strong> {review.comment} (Rating: {review.rating})
            <button onClick={() => deleteReview(review.id)}>Delete</button>
          </li>
        ))}
      </ul>

      <form className="review-form" onSubmit={handleFormSubmit}>
        <div className="input-group">
          <select value={newReview.mangaId} onChange={(e) => setNewReview({ ...newReview, mangaId: e.target.value })} required>
            <option value="">Select Manga</option>
            {mangaList.map(manga => (
              <option key={manga.id} value={manga.id}>{manga.title}</option>
            ))}
          </select>
          <input type="number" value={newReview.rating} onChange={(e) => setNewReview({ ...newReview, rating: e.target.value })} min="1" max="5" required />
        </div>
        <textarea value={newReview.comment} onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })} placeholder="Leave a review" required></textarea>
        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default Review;
