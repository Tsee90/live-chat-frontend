import { useAuth } from '../context/AuthContext';
import API from '../api';
import styles from '../styles/GuestButton.module.css';

const GuestLogin = () => {
  const { login } = useAuth();
  const guestLogin = async () => {
    try {
      console.log('guest logging in...');
      const guest = await API.post(`/users/guest`, {});
      console.log(guest);
      login(guest.data.token);
      console.log('login successful!');
    } catch (error) {
      console.log(error);
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
