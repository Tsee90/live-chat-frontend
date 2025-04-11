import API from '../api';
import PropTypes from 'prop-types';
import { useAuth } from '../context/AuthContext';
import acceptIcon from '../assets/accept.svg';
import styles from '../styles/AcceptFriend.module.css';

const AcceptFriendButton = ({ senderId, onClick }) => {
  const { user, socket } = useAuth();
  const handleAcceptFriend = async (e) => {
    e.preventDefault();
    await onClick?.();
    try {
      await API.put('/friends/request', { senderId });
      socket.emit('friend_update', { userId: user.id, targetUserId: senderId });
    } catch {
      console.log('An unexpected error occurred');
    }
  };
  return (
    <button onClick={handleAcceptFriend} className={`${styles.button}`}>
      <img src={acceptIcon} alt="" />
    </button>
  );
};

AcceptFriendButton.propTypes = {
  senderId: PropTypes.string.isRequired,
  onClick: PropTypes.func,
};
export default AcceptFriendButton;
