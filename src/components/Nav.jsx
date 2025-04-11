import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import styles from '../styles/Nav.module.css';
import { useState } from 'react';
import NetworkStatus from './NetworkStatus';
import ProfileIcon from './ProfileIcon';
import Friends from './Friends';

const Nav = () => {
  const { token, user, logout } = useAuth();
  const navigate = useNavigate();
  const [userModal, setUserModal] = useState(false);
  const [friendsModal, setFriendsModal] = useState(false);

  const handleLogout = async () => {
    setUserModal(false);
    await logout();
    navigate('/login');
  };
  const userLoggedIn = (
    <div
      className={` displayFlexRow alignItemsCenter  gap10px ${styles.userLoggedIn}`}
      onClick={() => {
        setUserModal(true);
      }}
    >
      <div className={`${styles.iconContainer}`}>
        <ProfileIcon></ProfileIcon>
      </div>
      <div className={`${styles.username}`}>{user?.username}</div>
    </div>
  );
  const userLoggedOut = (
    <div className={`displayFlexRow gap10px ${styles.userLoggedOut}`}>
      <div
        className={`${styles.login}`}
        onClick={() => {
          navigate('/login');
        }}
      >
        Log in
      </div>
      <div
        className={`fontWeightBold ${styles.signup}`}
        onClick={() => {
          navigate('/signup');
        }}
      >
        Sign up
      </div>
    </div>
  );
  const overlay = (
    <div
      onClick={() => {
        setUserModal(false);
        setFriendsModal(false);
      }}
      className={`${styles.overlay} ${
        userModal || friendsModal ? styles.active : null
      }`}
    ></div>
  );

  const userSidebar = (
    <div
      onClick={(e) => e.stopPropagation()}
      className={`displayFlexColumn ${styles.sidebar} ${
        userModal ? styles.active : null
      }`}
    >
      <div className={`${styles.sidebarIcon}`}>
        <ProfileIcon></ProfileIcon>
      </div>
      <div className={`${styles.sidebarTitle}`}>{user?.username}</div>
      <div className={`${styles.network}`}>
        <NetworkStatus></NetworkStatus>
      </div>
      <ul className={`${styles.sidebarList}`}>
        <li
          onClick={() => {
            setUserModal(false);
            navigate('/');
          }}
        >
          Home
        </li>
        <li
          onClick={() => {
            setUserModal(false);
            navigate(`/dashboard/${user?.username}`);
          }}
        >
          Dashboard
        </li>
        <li
          onClick={() => {
            setFriendsModal(true);
          }}
        >
          Friends
        </li>
        <li>
          <button className={`${styles.logOutButton}`} onClick={handleLogout}>
            Log Out
          </button>
        </li>
      </ul>
    </div>
  );

  const friendsSidebar = (
    <div
      onClick={(e) => e.stopPropagation()}
      className={`displayFlexColumn ${styles.sidebar} ${
        friendsModal ? styles.active : null
      }`}
    >
      <div className={`${styles.sidebarTitle}`}>Friends</div>
      <Friends
        onClick={() => {
          setFriendsModal(false);
          setUserModal(false);
        }}
      ></Friends>
    </div>
  );

  return (
    <nav
      className={`displayFlexRow alignItemsCenter justifyContentSpaceBetween ${styles.nav} `}
    >
      <div
        className={` ${styles.title}`}
        onClick={() => {
          navigate('/');
        }}
      >
        Chizmiz
      </div>
      {token ? userLoggedIn : userLoggedOut}
      {userModal ? overlay : null}
      {userSidebar}
      {friendsSidebar}
    </nav>
  );
};

export default Nav;
