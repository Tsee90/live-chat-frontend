import API from '../api';
import PropTypes from 'prop-types';
import { useAuth } from '../context/AuthContext';

const AcceptFriendButton = ({ senderId, onClick }) => {
  const { user, socket } = useAuth();
  const handleAcceptFriend = async (e) => {
    e.preventDefault();
    try {
      await API.put('/friends/request', { senderId });
      socket.emit('friend_update', { userId: user.id, targetUserId: senderId });
      await onClick?.();
    } catch {
      console.log('An unexpected error occurred');
    }
  };
  return <button onClick={handleAcceptFriend}>Accept</button>;
};

AcceptFriendButton.propTypes = {
  senderId: PropTypes.string.isRequired,
  onClick: PropTypes.func,
};
export default AcceptFriendButton;
