import API from '../api';
import PropTypes from 'prop-types';
import { useAuth } from '../context/AuthContext';

const CancelFriendButton = ({ friendId, buttonName, onClick }) => {
  const { user, socket } = useAuth();
  const handleCancelFriend = async (e) => {
    e.preventDefault();
    try {
      await API.delete('/friends', { data: { friendId } });
      socket.emit('friend_update', { userId: user.id, targetUserId: friendId });
      await onClick?.();
    } catch {
      console.log('An unexpected error occurred');
    }
  };
  return <button onClick={handleCancelFriend}>{buttonName}</button>;
};

CancelFriendButton.propTypes = {
  friendId: PropTypes.string.isRequired,
  buttonName: PropTypes.string.isRequired,
  onClick: PropTypes.func,
};
export default CancelFriendButton;
