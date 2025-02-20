import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api';

const Home = () => {
  const [rooms, setRooms] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');

    if (!token) {
      navigate('/login'); // Redirect to Login if no token
      return;
    }

    const fetchNearbyRooms = async () => {
      try {
        // Example: Get user's location
        navigator.geolocation.getCurrentPosition(async (position) => {
          const { latitude, longitude } = position.coords;

          const { data } = await API.post(
            '/rooms/nearby',
            { latitude, longitude, radiusKm: 5 }, // Example radius
            { headers: { Authorization: `Bearer ${token}` } }
          );

          setRooms(data);
        });
      } catch (err) {
        console.error(
          'Failed to fetch nearby rooms:',
          err.response?.data?.error
        );
      }
    };

    fetchNearbyRooms();
  }, [navigate]);

  return (
    <div>
      <h2>Nearby Rooms</h2>
      <ul>
        {rooms.map((room) => (
          <li key={room.id}>
            {room.name}
            <button onClick={() => navigate(`/chat/${room.id}`)}>Join</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Home;
