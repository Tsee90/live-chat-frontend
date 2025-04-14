import { useAuth } from '../context/AuthContext';
import { useNavigate, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import API from '../api';
import styles from '../styles/Dashboard.module.css';
import NetworkStatus from '../components/NetworkStatus';
import ProfileIcon from '../components/ProfileIcon';
import AddFriendButton from '../components/AddFriendButton';
import Friends from '../components/Friends';
import CancelFriendButton from '../components/CancelFriendButton';
import AcceptFriendButton from '../components/AcceptFriendButton';
import cancelIcon from '../assets/cancel.svg';

const Dashboard = () => {
  const navigate = useNavigate();
  const { token, user, logout, socket } = useAuth();
  const { username } = useParams();
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState(null);
  const [isSelf, setIsSelf] = useState(false);
  const [isGuest, setIsGuest] = useState(false);
  const [isFriends, setIsFriends] = useState(false);
  const [isPending, setIsPending] = useState(false);
  const [updated, setUpdated] = useState(false);
  const [requestLoading, setRequestLoading] = useState(true);
  const [showSpinner, setShowSpinner] = useState(false);
  const [invalid, setInvalid] = useState(false);
  const [showRequestSpinner, setShowRequestSpinner] = useState(false);

  useEffect(() => {
    if (!token) {
      navigate('/login');
      return;
    }
    if (!socket) return;
    const fetchUser = async () => {
      try {
        if (!token || !user || !username) return;
        if (username) {
          setLoading(true);
          const res = await API.get(`/users/username/${username}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          if (res.data.user) {
            setUserData(res.data.user);
          } else {
            setInvalid(true);
          }

          if (res.data.user.role === 'guest') setIsGuest(true);
          if (user?.username === res.data.user.username) {
            setIsSelf(true);
          }
        } else {
          return;
        }
      } catch (error) {
        console.error('Failed to fetch user', error);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
    const handleFriendUpdate = () => {
      setUpdated(true);
    };

    socket.on('friend_updated', handleFriendUpdate);
    return () => {
      socket.off('friend_updated', handleFriendUpdate);
    };
  }, [navigate, username, token, user]);

  useEffect(() => {
    if (!userData) return;

    const fetchFriendStatus = async () => {
      try {
        const checkFriends = await API.get(
          `/friends/is-friend/${userData?.id}`
        );
        setIsFriends(checkFriends.data.areFriends);

        if (!checkFriends.data.areFriends) {
          const checkPending = await API.get(
            `/friends/is-pending/${userData?.id}`
          );
          console.log(checkPending.data.arePending);
          setIsPending(checkPending.data.arePending);
        }
      } catch {
        console.log('An unexpected error occurred');
      } finally {
        setUpdated(false);
        setRequestLoading(false);
      }
    };

    fetchFriendStatus();
  }, [userData, updated]);

  useEffect(() => {
    let timer;
    if (loading) {
      timer = setTimeout(() => {
        setShowSpinner(true);
      }, 300);
    } else {
      setShowSpinner(false);
    }
    return () => clearTimeout(timer);
  }, [loading]);

  useEffect(() => {
    let timer;
    if (requestLoading) {
      timer = setTimeout(() => {
        setShowRequestSpinner(true);
      }, 300);
    } else {
      setShowRequestSpinner(false);
    }
    return () => clearTimeout(timer);
  }, [requestLoading]);

  const handleReset = async () => {
    try {
      const res = await API.post(`/users/password-reset`, {
        email: user.email,
        token,
      });
      navigate(
        `/password-reset/${res?.data.resetCode}?email=${encodeURIComponent(
          user.email
        )}`
      );
    } catch {
      console.log('An unexpected error occurred');
    }
  };

  const handleDelete = async () => {
    try {
      await API.delete(`users/${user.id}`);
      await logout();
    } catch {
      console.log('An unexpected error occurred');
    }
  };

  const self = (
    <div className={`${styles.optionsContainer}`}>
      <div className={`${styles.userInfo}`}>
        <div className={`displayFlexRow gap10px`}>{userData?.email}</div>
        <NetworkStatus></NetworkStatus>
      </div>
      <div className={`${styles.accountOptions}`}>
        <div
          onClick={async () => {
            logout();
          }}
          className={`defaultLink themeColor`}
        >
          Log out
        </div>
        <div onClick={handleReset} className={`defaultLink themeColor`}>
          Reset Password
        </div>
        <div
          onClick={handleDelete}
          className={`defaultLink ${styles.deleteButton}`}
        >
          Delete Account
        </div>
      </div>
    </div>
  );

  const other =
    requestLoading && showRequestSpinner ? (
      <div className={`defaultSpinner justifySelfCenter alignSelfCenter`}></div>
    ) : (
      <div className={`${styles.request}`}>
        {isFriends ? (
          <CancelFriendButton
            friendId={userData?.id}
            buttonName={'Unfriend'}
            onClick={() => {
              setRequestLoading(true);
            }}
          />
        ) : !isPending ? (
          <AddFriendButton
            receiverId={userData?.id}
            onClick={() => {
              setRequestLoading(true);
            }}
          />
        ) : (
          <div>
            {isPending.senderId == user.id ? (
              <div className={`displayFlexRow gap10px`}>
                <div>Friend Request Sent</div>
                <CancelFriendButton
                  friendId={userData?.id}
                  buttonName={<img src={cancelIcon}></img>}
                  onClick={() => {
                    setRequestLoading(true);
                  }}
                />
              </div>
            ) : (
              <div className={`displayFlexRow gap10px`}>
                <div>Requested Friendship</div>
                <div className={`displayFlexRow gap10px`}>
                  <AcceptFriendButton
                    senderId={isPending.senderId}
                    onClick={() => {
                      setRequestLoading(true);
                    }}
                  ></AcceptFriendButton>
                  <CancelFriendButton
                    friendId={userData?.id}
                    buttonName={<img src={cancelIcon}></img>}
                    onClick={() => {
                      setRequestLoading(true);
                    }}
                  />
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    );

  const invalidUser = <div>Invalid user</div>;

  const dashboardLayout = (
    <div className={`displayFlexColumn ${styles.dashboardContainer}`}>
      <div className={`${styles.iconContainer}`}>
        <ProfileIcon></ProfileIcon>
      </div>
      <div className={`displayFlexRow gap10px ${styles.title}`}>
        {userData?.username}
      </div>

      <div className={`displayFlexColumn ${styles.infoContainer}`}>
        {isSelf ? self : other}
      </div>
    </div>
  );

  return (
    <div className={`defaultMainContainer gap10px ${styles.mainContainer}`}>
      {loading && showSpinner ? (
        <div
          className={`defaultSpinner justifySelfCenter alignSelfCenter`}
        ></div>
      ) : userData ? (
        dashboardLayout
      ) : invalid ? (
        invalidUser
      ) : null}
    </div>
  );
};

export default Dashboard;
