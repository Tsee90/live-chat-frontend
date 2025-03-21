import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import styles from '../styles/Nav.module.css';

const Nav = () => {
  const { user, logout, disconnected, location } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };
  const userLoggedIn = (
    <div
      className={` displayFlexRow alignItemsCenter gap10px ${styles.userLoggedIn}`}
    >
      <div>{user?.username}</div>

      <div
        className={`borderRadius50 ${styles.statusIndicator} ${
          disconnected
            ? styles.offline
            : !location
            ? styles.noLocation
            : styles.online
        }`}
      ></div>

      <button
        className={`defaultButton ${styles.logOutButton}`}
        onClick={handleLogout}
      >
        Logout
      </button>
    </div>
  );
  const userLoggedOut = (
    <div
      className={`displayFlexRow alignItemsCenter gap10px ${styles.userLoggedOut}`}
    >
      <a className={`${styles.login}`} href="/login">
        Log in
      </a>
      <a
        className={`fontWeightBold defaultButton ${styles.signup}`}
        href="/signup"
      >
        Sign up
      </a>
    </div>
  );

  return (
    <nav
      className={`displayFlexRow alignItemsCenter justifyContentSpaceBetween ${styles.nav} `}
    >
      <div
        className={`fontWeightBold ${styles.title}`}
        onClick={() => {
          navigate('/');
        }}
      >
        Chizmiz
      </div>
      {user ? userLoggedIn : userLoggedOut}
    </nav>
  );
};

export default Nav;
