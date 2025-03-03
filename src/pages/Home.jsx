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
  const [miles, setMiles] = useState(5);
  const [radiusKm, setRadiusKm] = useState(5 * 1.609);
  const [loading, setLoading] = useState(false);
  const [sort, setSort] = useState('userCount');
  useEffect(() => {
    if (!token) {
      navigate('/login');
      return;
    }

    const fetchNearbyRooms = async () => {
      try {
        setLoading(true);
        navigator.geolocation.getCurrentPosition(async (position) => {
          const { latitude, longitude } = position.coords;

          const { data } = await API.get('/rooms', {
            params: { latitude, longitude, radiusKm, sort },
            headers: { Authorization: `Bearer ${token}` },
          });

          setRooms(data);
        });
      } catch (err) {
        console.error(
          'Failed to fetch nearby rooms:',
          err.response?.data?.error
        );
      } finally {
        setLoading(false);
      }
    };

    fetchNearbyRooms();
  }, [navigate, token, radiusKm, sort]);

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

  const handleMileChange = (event) => {
    if (event.target.value === 'all') {
      setRadiusKm('all');
      setMiles('all');
    } else {
      setMiles(Number(event.target.value));
      setRadiusKm(Number(event.target.value) * 1.609);
    }
  };

  const handleSortChange = (event) => {
    setSort(event.target.value);
  };

  return (
    <div>
      <div>
        Chizmiz within{' '}
        <select value={miles} onChange={handleMileChange}>
          <option value={1}>1</option>
          <option value={5}>5</option>
          <option value={10}>10</option>
          <option value={20}>20</option>
          <option value={50}>50</option>
          <option value="all">All</option>
        </select>{' '}
        miles{' '}
        <select
          name="sortBy"
          id="sortBy"
          value={sort}
          onChange={handleSortChange}
        >
          <option value="userCount">Popular</option>
          <option value="newest">Newest</option>
        </select>
      </div>
      <button onClick={() => setShowModal(true)}>+ Create Room</button>

      {loading ? (
        <div className={`defaultSpinner`}></div>
      ) : (
        <ul>
          {rooms.map((room) => (
            <li key={room.id}>
              {room.name}
              <button onClick={() => handleJoinRoom(room.id)}>Join</button>
            </li>
          ))}
        </ul>
      )}

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
