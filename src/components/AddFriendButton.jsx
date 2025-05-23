import API from '../api';
import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import styles from '../styles/AddFriendButton.module.css';

const AddFriendButton = ({ receiverId, onClick }) => {
  const [isRequested, setIsRequested] = useState(false);
  const { user, socket } = useAuth();
  useEffect(() => {
    if (!receiverId) return;
    const fetchRequest = async () => {
      try {
        const res = await API.get(`/friends/request/${receiverId}`);
        if (res.status == 200) {
          setIsRequested(true);
        }
      } catch {
        console.log('An unexpected error occurred');
      }
    };
    fetchRequest();
  }, [receiverId]);
  const handleAddFriend = async (e) => {
    e.preventDefault();
    await onClick?.();
    try {
      await API.post('/friends/request', { receiverId });
      socket.emit('friend_update', {
        userId: user.id,
        targetUserId: receiverId,
      });
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <button
      onClick={handleAddFriend}
      disabled={isRequested}
      className={`${styles.button}`}
    >
      Add Friend
    </button>
  );
};

AddFriendButton.propTypes = {
  receiverId: PropTypes.string.isRequired,
  onClick: PropTypes.func,
};

export default AddFriendButton;
