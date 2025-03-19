import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api';
import CreateRoomForm from '../components/CreateRoomForm';
import { useAuth } from '../context/AuthContext';
import styles from '../styles/Home.module.css';
import refreshIcon from '../assets/refresh.svg';
import Welcome from '../components/Welcome';

const Home = () => {
  const [rooms, setRooms] = useState([]);
  const [showModal, setShowModal] = useState(false); //Create form modal
  const navigate = useNavigate();
  const { token, location } = useAuth();
  const [miles, setMiles] = useState(5);
  const [radiusKm, setRadiusKm] = useState(5 * 1.609);
  const [loading, setLoading] = useState(true);
  const [sort, setSort] = useState('userCount');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    //Stop effect if no user logged in
    if (!token) {
      return;
    }

    const fetchNearbyRooms = async () => {
      try {
        const { latitude, longitude } = location;

        const { data } = await API.get('/rooms', {
          params: { latitude, longitude, radiusKm, sort },
          headers: { Authorization: `Bearer ${token}` },
        });

        setRooms(data);
      } catch (err) {
        console.error(
          'Failed to fetch nearby rooms:',
          err.response?.data?.error
        );
      } finally {
        setLoading(false);
        setIsRefreshing(false);
      }
    };

    fetchNearbyRooms();
  }, [navigate, token, radiusKm, sort, isRefreshing, location]);

  const handleCreateRoom = async (formData) => {
    setCreating(true);
    try {
      const startsAt = new Date();
      const expiresAt = new Date(
        new Date().setHours(new Date().getHours() + 24)
      ); //24 hours from now
      const { name } = formData;
      const { data } = await API.post(
        '/rooms',
        { name, startsAt, expiresAt, location },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      navigate(`/room/${data.id}`);
    } catch (error) {
      console.log(error);
    } finally {
      setShowModal(false);
      setCreating(false);
    }
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
    setLoading(true);
    if (event.target.value === 'all') {
      setRadiusKm('all');
      setMiles('all');
    } else {
      setMiles(Number(event.target.value));
      setRadiusKm(Number(event.target.value) * 1.609); //Convert to Km
    }
  };

  const handleSortChange = (event) => {
    setLoading(true);
    setSort(event.target.value);
  };

  const handleRefresh = () => {
    setLoading(true);
    setIsRefreshing(true);
  };

  //Calculate how much time has passed since room created to be displayed
  const timePast = (utc) => {
    const past = new Date(utc);
    const now = new Date();
    const diffMs = now - past;

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

  const roomList = (
    <ul className={`displayFlexColumn ${styles.roomList}`}>
      {rooms.map((room) => (
        <li
          key={room.id}
          className={`${styles.roomListItem}`}
          onClick={() => handleJoinRoom(room.id)}
        >
          <div className={`displayFlexColumn ${styles.itemTitle}`}>
            <div className={`fontWeightBold`}>{room.name}</div>
            <div className={`displayFlexColumn ${styles.itemFooter}`}>
              <div>
                Created by <strong>{room.creator_username}</strong>{' '}
                {timePast(room.startsAt)}
              </div>
              <div>Connected: {room.user_count}</div>
            </div>
          </div>
        </li>
      ))}
    </ul>
  );

  //If not logged in show welcome
  if (!token) {
    return <Welcome></Welcome>;
  }

  return (
    <div className={`defaultMainContainer ${styles.mainContainer}`}>
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
            <div>|</div>
            <button
              onClick={() => setShowModal(true)}
              className={`defaultButton fontWeightBold ${styles.createButton}`}
            >
              +
            </button>
          </div>
          <button onClick={handleRefresh} className={`${styles.refreshButton}`}>
            <img
              src={refreshIcon}
              alt="refresh"
              className={`${styles.refreshIcon}`}
            />
          </button>
        </div>
        {loading ? (
          <div className={`defaultSpinner`}></div>
        ) : rooms.length > 0 ? (
          roomList
        ) : (
          <div className={`${styles.nothing}`}>
            nothing here...try{' '}
            <span onClick={() => setShowModal(true)} className={`defaultLink`}>
              creating
            </span>{' '}
            a room!
          </div>
        )}
      </div>{' '}
      {showModal && (
        <div
          className={`${styles.overlay}`}
          onClick={() => setShowModal(false)}
        >
          <CreateRoomForm
            onClose={() => setShowModal(false)}
            onSubmit={handleCreateRoom}
            creating={creating}
          />
        </div>
      )}
    </div>
  );
};

export default Home;
