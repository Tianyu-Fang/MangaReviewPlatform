import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useAuthToken } from '../AuthTokenContext';
import cover1 from '../image/cover/c_thumb00.jpg';
import cover2 from '../image/cover/c_thumb01.jpg';
import cover3 from '../image/cover/c_thumb02.jpg';
import cover4 from '../image/cover/c_thumb03.jpg';
import '../styles/manga.css';

const Manga = () => {
  const [mangas, setMangas] = useState([]);
  const { accessToken } = useAuthToken();

  const covers = {
    'c_thumb00.jpg': cover1,
    'c_thumb01.jpg': cover2,
    'c_thumb02.jpg': cover3,
    'c_thumb03.jpg': cover4,
  };

  useEffect(() => {
    const fetchMangas = async () => {
      try {
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/manga`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        setMangas(res.data);
      } catch (error) {
        console.error("Failed to fetch mangas", error);
      }
    };

    fetchMangas();
  }, [accessToken]);

  return (
    <div className="manga-container">
      <h1>Manga Episodes</h1>
      <div className="manga-list">
        {mangas.map(manga => (
          <div key={manga.id} className="manga-item">
            <Link to={`/app/manga/${manga.id}`}>
              <img src={covers[manga.cover_image]} alt={manga.title} className="manga-cover" />
            </Link>
            <p>{manga.title}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Manga;
