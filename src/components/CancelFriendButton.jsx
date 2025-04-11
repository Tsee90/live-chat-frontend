import API from '../api';
import PropTypes from 'prop-types';
import { useAuth } from '../context/AuthContext';
import styles from '../styles/CancelFriend.module.css';

const CancelFriendButton = ({ friendId, buttonName, onClick }) => {
  const { user, socket } = useAuth();
  const handleCancelFriend = async (e) => {
    e.preventDefault();
    await onClick?.();
    try {
      await API.delete('/friends', { data: { friendId } });
      socket.emit('friend_update', { userId: user.id, targetUserId: friendId });
    } catch {
      console.log('An unexpected error occurred');
    }
  };
  return (
    <button onClick={handleCancelFriend} className={`${styles.button}`}>
      {buttonName}
    </button>
  );
};

CancelFriendButton.propTypes = {
  friendId: PropTypes.string.isRequired,
  buttonName: PropTypes.oneOfType([PropTypes.string, PropTypes.element])
    .isRequired,
  onClick: PropTypes.func,
};
export default CancelFriendButton;
