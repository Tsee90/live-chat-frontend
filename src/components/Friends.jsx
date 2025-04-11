import API from '../api';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import AcceptFriendButton from './AcceptFriendButton';
import CancelFriendButton from './CancelFriendButton';
import joinIcon from '../assets/join.svg';
import PropTypes from 'prop-types';
import styles from '../styles/Friends.module.css';

const Friends = ({ onClick }) => {
  const navigate = useNavigate();
  const { socket, user } = useAuth();
  const [friends, setFriends] = useState([]);
  const [received, setReceived] = useState([]);
  const [sent, setSent] = useState([]);
  const [updated, setUpdated] = useState(false);

  useEffect(() => {
    if (!socket) return;

    const fetchData = async () => {
      try {
        const resFriends = await API.get('/friends');
        const resReceived = await API.get('/friends/received-requests');
        const resSent = await API.get('/friends/sent-requests');
        setFriends(resFriends.data);
        setReceived(resReceived.data);
        setSent(resSent.data);
      } catch (error) {
        console.error('An unexpected error occurred', error);
      } finally {
        setUpdated(false);
      }
    };

    fetchData();

    const handleFriendUpdate = () => {
      setUpdated(true);
    };

    socket.on('friend_updated', handleFriendUpdate);

    return () => {
      socket.off('friend_updated', handleFriendUpdate);
    };
  }, [socket, updated]);

  const allFriendsList = friends.map((friendship) => {
    if (friendship.senderId === user?.id) {
      return {
        id: friendship.receiver.id,
        username: friendship.receiver.username,
        online: friendship.receiver.online,
        roomId: friendship.receiver.roomId,
      };
    } else {
      return {
        id: friendship.sender.id,
        username: friendship.sender.username,
        online: friendship.sender.online,
        roomId: friendship.sender.roomId,
      };
    }
  });

  const onlineFriends = allFriendsList.filter((friend) => friend.online);

  const onlineFriendsList = (
    <div>
      <div className={`${styles.headerWrapper}`}>
        <div>Online</div>
        {onlineFriends.length > 0 ? <div>({onlineFriends.length})</div> : null}
      </div>
      <ul>
        {onlineFriends.map((friend) => {
          return (
            <li key={friend.id} className={`${styles.friendListItem}`}>
              <div
                onClick={() => {
                  onClick?.();
                  navigate(`/dashboard/${friend.username}`);
                }}
              >
                <div className={`${styles.username}`}>{friend.username}</div>
              </div>
              {friend.roomId ? (
                <div
                  onClick={() => {
                    onClick?.();
                    navigate(`/room/${friend.roomId}`);
                  }}
                  className={`${styles.joinIcon}`}
                >
                  <img src={joinIcon} alt="" />
                </div>
              ) : null}
            </li>
          );
        })}
      </ul>
    </div>
  );

  const offlineFriends = allFriendsList.filter((friend) => !friend.online);

  const offlineFriendsList = (
    <div>
      <div className={`${styles.headerWrapper}`}>
        <div>Offline</div>
        {offlineFriends.length > 0 ? (
          <div>({offlineFriends.length})</div>
        ) : null}
      </div>
      <ul>
        {offlineFriends.map((friend) => {
          return <li key={friend.id}>{friend.username}</li>;
        })}
      </ul>
    </div>
  );

  const receivedList = (
    <div>
      <div className={`${styles.headerWrapper}`}>
        <div>Received</div>
        {received.length > 0 ? <div>({received.length})</div> : null}
      </div>
      <ul>
        {received.length !== 0
          ? received.map((fren) => (
              <li key={fren.sender.id}>
                {fren.sender.username}
                <AcceptFriendButton
                  senderId={fren.sender.id}
                ></AcceptFriendButton>
                <CancelFriendButton
                  friendId={fren.sender.id}
                  buttonName={'Decline'}
                ></CancelFriendButton>
              </li>
            ))
          : null}
      </ul>
    </div>
  );

  const sentList = (
    <div>
      <div className={`${styles.headerWrapper}`}>
        <div>Sent</div>
        {sent.length > 0 ? <div>({sent.length})</div> : null}
      </div>
      <ul>
        {sent.length !== 0
          ? sent.map((fren) => (
              <li key={fren.receiver.id}>
                {fren.receiver.username}

                <CancelFriendButton
                  friendId={fren.receiver.id}
                  buttonName={'Cancel'}
                ></CancelFriendButton>
              </li>
            ))
          : null}
      </ul>
    </div>
  );
  return (
    <div className={`displayFlexColumn ${styles.friendsWrapper}`}>
      {onlineFriendsList}
      {offlineFriendsList}
      {receivedList}
      {sentList}
    </div>
  );
};

Friends.propTypes = {
  onClick: PropTypes.func,
};

export default Friends;
