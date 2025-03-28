import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import API from '../api';

const Dashboard = () => {
  const navigate = useNavigate();
  const { user, token } = useAuth();
  const [loading, setLoading] = useState(false);
  const [userData, setUserData] = useState(null);
  useEffect(() => {
    const fetchUser = async () => {
      if (!token) {
        navigate('/login');
        return;
      }

      try {
        setLoading(true);
        const userId = user.id;
        const userInfo = await API.get(`/users/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUserData(userInfo.data);
      } catch (error) {
        console.error('Failed to fetch user:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [navigate, user]);

  const roomList = (
    <ul>
      {userData?.croom.map((room) => (
        <li key={room.id}>
          <div>{room.name}</div>
          <div>{room.active.toString()}</div>
        </li>
      ))}
    </ul>
  );

  const dashboardLayout = (
    <>
      <div>Welcome, {userData?.username}</div>
      <div>
        <div>Rooms</div>
        {roomList}
      </div>
    </>
  );

  return (
    <div className={`defaultMainContainer`}>
      {loading ? (
        <div
          className={`defaultSpinner justifySelfCenter alignSelfCenter`}
        ></div>
      ) : (
        dashboardLayout
      )}
    </div>
  );
};

export default Dashboard;
