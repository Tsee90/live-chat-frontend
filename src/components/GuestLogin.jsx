import { useAuth } from '../context/AuthContext';
import API from '../api';
import styles from '../styles/GuestButton.module.css';

const GuestLogin = () => {
  const { login } = useAuth();
  const guestLogin = async () => {
    try {
      const guest = await API.post(`/users/guest`);
      login(guest.data.token);
    } catch {
      console.log('Oops. Something went wrong!');
    }
  };
  const guestLoginButton = (
    <button onClick={guestLogin} className={`${styles.guestButton}`}>
      Continue as guest
    </button>
  );
  return guestLoginButton;
};

export default GuestLogin;
