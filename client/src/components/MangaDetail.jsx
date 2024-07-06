import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { useAuthToken } from '../AuthTokenContext';
import cover1 from '../image/cover/c_thumb00.jpg';
import cover2 from '../image/cover/c_thumb01.jpg';
import cover3 from '../image/cover/c_thumb02.jpg';
import cover4 from '../image/cover/c_thumb03.jpg';
import '../styles/mangaDetail.css';

const MangaDetail = () => {
  const { id } = useParams();
  const { accessToken } = useAuthToken();
  const [manga, setManga] = useState(null);
  const [reviews, setReviews] = useState([]);

  const covers = {
    'c_thumb00.jpg': cover1,
    'c_thumb01.jpg': cover2,
    'c_thumb02.jpg': cover3,
    'c_thumb03.jpg': cover4,
  };

  useEffect(() => {
    const fetchMangaDetails = async () => {
      try {
        const mangaRes = await axios.get(`${process.env.REACT_APP_API_URL}/manga/${id}`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        setManga(mangaRes.data);

        const reviewsRes = await axios.get(`${process.env.REACT_APP_API_URL}/manga/${id}/reviews`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        setReviews(reviewsRes.data);
      } catch (error) {
        console.error("Failed to fetch manga details or reviews", error);
      }
    };

    fetchMangaDetails();
  }, [id, accessToken]);

  if (!manga) {
    return <div>Loading...</div>;
  }

  return (
    <div className="manga-detail-container">
      <div className="manga-detail-header">
        <h1 className="manga-detail-title">{manga.title}</h1>
        <img src={covers[manga.cover_image]} alt={manga.title} className="manga-detail-cover" />
        <div className="manga-detail-dates">
          <p><strong>Created At:</strong> {new Date(manga.created_at).toLocaleDateString()}</p>
          <p><strong>Updated At:</strong> {new Date(manga.updated_at).toLocaleDateString()}</p>
        </div>
      </div>
      <div className="manga-detail-content">
        <h2>Reviews</h2>
        <div className="reviews-list">
          {reviews.map(review => (
            <div key={review.id} className="review-item">
              <p><strong>Rating:</strong> {review.rating}</p>
              <p>{review.comment}</p>
              <p><strong>Reviewed by:</strong> {review.user.name}</p>
              <p><strong>Reviewed at:</strong> {new Date(review.created_at).toLocaleDateString()}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MangaDetail;
