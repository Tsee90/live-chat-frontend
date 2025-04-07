import { useAuth } from '../context/AuthContext';
import styles from '../styles/NetworkStatus.module.css';
const NetworkStatus = () => {
  const { disconnected, location } = useAuth();

  return (
    <div
      className={`displayFlexRow alignItemsCenter gap10px ${styles.network}`}
    >
      Network:{' '}
      <div
        className={` ${styles.statusIndicator} ${
          disconnected
            ? styles.offline
            : !location
            ? styles.noLocation
            : styles.online
        }`}
      >
        {disconnected
          ? 'Disconnected'
          : !location
          ? 'No Location'
          : 'Connected'}
      </div>
    </div>
  );
};

export default NetworkStatus;
