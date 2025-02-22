import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api';
import CreateRoomForm from '../components/CreateRoomForm';
import { useAuth } from '../context/AuthContext';

const Home = () => {
  const [rooms, setRooms] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();
  const { token } = useAuth();
  useEffect(() => {
    if (!token) {
      navigate('/login');
      return;
    }

    const fetchNearbyRooms = async () => {
      try {
        navigator.geolocation.getCurrentPosition(async (position) => {
          const { latitude, longitude } = position.coords;

          const { data } = await API.get('/rooms', {
            params: { latitude, longitude, radiusKm: 5 },
            headers: { Authorization: `Bearer ${token}` },
          });

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
  }, [navigate, token]);

  const handleCreateRoom = async (formData) => {
    setShowModal(false);
    const { name, startsAt, expiresAt, location } = formData;
    const { data } = await API.post(
      '/rooms',
      { name, startsAt, expiresAt, location },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    navigate(`/room/${data.id}`);
  };

  const handleJoinRoom = async (roomId) => {
    try {
      navigate(`/room/${roomId}`);
    } catch (error) {
      console.error(
        'Failed to join room:',
        error.response?.data?.error || error.message
      );
      alert('Failed to join room. Please try again.');
    }
  };

  return (
    <div>
      <h2>Nearby Rooms</h2>
      <button onClick={() => setShowModal(true)}>+ Create Room</button>

      <ul>
        {rooms.map((room) => (
          <li key={room.id}>
            {room.name}
            <button onClick={() => handleJoinRoom(room.id)}>Join</button>
          </li>
        ))}
      </ul>

      {showModal && (
        <div>
          <div>
            <CreateRoomForm
              onClose={() => setShowModal(false)}
              onSubmit={handleCreateRoom}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
