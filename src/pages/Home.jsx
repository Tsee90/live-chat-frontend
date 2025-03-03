import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api';
import CreateRoomForm from '../components/CreateRoomForm';
import { useAuth } from '../context/AuthContext';
import styles from '../styles/Home.module.css';

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
    const startsAt = new Date();
    const expiresAt = new Date(new Date().setHours(new Date().getHours() + 24));
    const { name, location } = formData;
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

  const timePast = (utc) => {
    const past = new Date(utc);
    const now = new Date();
    const diffMs = now - past;
    console.log(now, past, utc, diffMs);

    const hours = Math.floor(diffMs / (1000 * 60 * 60));
    const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diffMs % (1000 * 60)) / 1000);
    if (hours > 0) {
      if (hours === 1) return `${hours} hour ago`;
      return `${hours} hours ago`;
    }
    if (minutes > 0) {
      if (minutes === 1) return `${minutes} minute ago`;
      return `${minutes} minutes ago`;
    }
    if (seconds === 1) return `${seconds} second ago`;
    return `${seconds} seconds ago`;
  };

  return (
    <div className={`defaultMainContainer`}>
      <div
        className={`displayFlexColumn alignItemsCenter boxShadow ${styles.homeContainer}`}
      >
        <div
          className={`displayFlexRow justifyContentSpaceBetween alignItemsCenter ${styles.homeHeader}`}
        >
          <div className={`displayFlexRow gap10px`}>
            <div className={`displayFlexRow gap10px`}>
              <label htmlFor="miles" className={`${styles.hideOnSmall}`}>
                Chizmiz within:
              </label>
              <select
                name="miles"
                id="miles"
                value={miles}
                onChange={handleMileChange}
              >
                <option value={1}>1</option>
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={50}>50</option>
                <option value="all">All</option>
              </select>
              <div>miles</div>
            </div>
            <div>|</div>
            <div className={`displayFlexRow gap10px`}>
              <label htmlFor="sortBy" className={`${styles.hideOnSmall}`}>
                Sort by:
              </label>
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
          </div>
          <button
            onClick={() => setShowModal(true)}
            className={`defaultButton fontWeightBold ${styles.createButton}`}
          >
            + Create
          </button>
        </div>
        {loading ? (
          <div className={`defaultSpinner`}></div>
        ) : (
          <ul className={`displayFlexColumn ${styles.roomList}`}>
            {rooms.map((room) => (
              <li
                key={room.id}
                className={`${styles.roomListItem}`}
                onClick={() => handleJoinRoom(room.id)}
              >
                <div className={`displayFlexColumn ${styles.itemTitle}`}>
                  <div className={`fontWeightBold`}>{room.name}</div>
                  <div className={`displayFlexRow`}>
                    <div>Connected: {room.user_count}</div>
                    <div>
                      Created by {room.creator_username}{' '}
                      {timePast(room.startsAt)}
                    </div>
                  </div>
                </div>
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
    </div>
  );
};

export default Home;
