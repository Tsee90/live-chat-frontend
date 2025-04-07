import { useAuth } from '../context/AuthContext';
import { useNavigate, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import API from '../api';
import styles from '../styles/Dashboard.module.css';
import NetworkStatus from '../components/NetworkStatus';
import ProfileIcon from '../components/ProfileIcon';

const Dashboard = () => {
  const navigate = useNavigate();
  const { token, user, logout } = useAuth();
  const { username } = useParams();
  const [loading, setLoading] = useState(false);
  const [userData, setUserData] = useState(null);
  const [isSelf, setIsSelf] = useState(false);
  const [isGuest, setIsGuest] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      if (!token) {
        navigate('/login');
        return;
      }

      try {
        if (!token || !user || !username) return;
        if (username) {
          setLoading(true);
          const res = await API.get(`/users/username/${username}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          setUserData(res.data.user);

          if (res.data.user.role === 'guest') setIsGuest(true);
          if (user?.username === res.data.user.username) setIsSelf(true);
        } else {
          return;
        }
      } catch {
        console.error('Failed to fetch user');
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [navigate, username, token, user]);

  const handleReset = async () => {
    try {
      const res = await API.post(`/users/password-reset`, {
        email: user.email,
        token,
      });
      navigate(
        `/password-reset/${res?.data.resetCode}?email=${encodeURIComponent(
          user.email
        )}`
      );
    } catch {
      console.log('An unexpected error occurred');
    }
  };

  const handleDelete = async () => {
    try {
      await API.delete(`users/${user.id}`);
      await logout();
    } catch {
      console.log('An unexpected error occurred');
    }
  };

  const self = (
    <div className={`${styles.optionsContainer}`}>
      <div className={`${styles.userInfo}`}>
        <div className={`displayFlexRow gap10px`}>{userData?.email}</div>
        <NetworkStatus></NetworkStatus>
      </div>
      <div className={`${styles.accountOptions}`}>
        <div
          onClick={async () => {
            logout();
          }}
        >
          Log out
        </div>
        <div onClick={handleReset}>Reset Password</div>
        <div onClick={handleDelete}>Delete Account</div>
      </div>
    </div>
  );

  const other = <div>Other stuff</div>;

  const invalidUser = <div>Invalid user</div>;

  const dashboardLayout = (
    <>
      <div className={`${styles.iconContainer}`}>
        <ProfileIcon></ProfileIcon>
      </div>
      <div className={`displayFlexRow gap10px ${styles.title}`}>
        {userData?.username}
      </div>
      {isSelf ? self : other}
    </>
  );
  if (!userData) return invalidUser;
  return (
    <div className={`defaultMainContainer gap10px ${styles.mainContainer}`}>
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
