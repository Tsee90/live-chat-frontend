import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import styles from '../styles/Nav.module.css';
import { useState } from 'react';

const Nav = () => {
  const { user, logout, disconnected, location } = useAuth();
  const navigate = useNavigate();
  const [userModal, setUserModal] = useState(false);

  const handleLogout = () => {
    setUserModal(false);
    logout();
    navigate('/login');
  };
  const userLoggedIn = (
    <div
      className={` displayFlexRow alignItemsCenter gap10px ${styles.userLoggedIn}`}
    >
      <div
        onClick={() => {
          setUserModal(true);
        }}
        className={`${styles.username}`}
      >
        {user?.username}
      </div>
    </div>
  );
  const userLoggedOut = (
    <div
      className={`displayFlexRow alignItemsCenter gap10px ${styles.userLoggedOut}`}
    >
      <div
        className={`${styles.login}`}
        onClick={() => {
          navigate('/login');
        }}
      >
        Log in
      </div>
      <div
        className={`fontWeightBold defaultButton ${styles.signup}`}
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
      }}
      className={`${styles.overlay} ${userModal ? styles.active : ''}`}
    ></div>
  );

  const userSidebar = (
    <div
      onClick={(e) => e.stopPropagation()}
      className={`displayFlexColumn ${styles.sidebar} ${
        userModal ? styles.active : ''
      }`}
    >
      <div className={`${styles.sidebarTitle}`}>{user?.username}</div>
      <div
        className={`displayFlexRow alignItemsCenter gap10px ${styles.network}`}
      >
        Status:{' '}
        <div
          className={` ${styles.statusIndicator} ${
            disconnected
              ? styles.offline
              : !location
              ? styles.noLocation
              : styles.online
          }`}
        >
          {disconnected
            ? 'Disconnected'
            : !location
            ? 'No Location'
            : 'Connected'}
        </div>
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
            navigate('/dashboard');
          }}
        >
          Dashboard
        </li>
        <li>Friends</li>
        <li>
          <button className={`${styles.logOutButton}`} onClick={handleLogout}>
            Log Out
          </button>
        </li>
      </ul>
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
      {user ? userLoggedIn : userLoggedOut}
      {overlay}
      {userSidebar}
    </nav>
  );
};

export default Nav;
