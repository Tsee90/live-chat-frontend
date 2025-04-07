import personIcon from '../assets/person.svg';
import styles from '../styles/ProfileIcon.module.css';

const ProfileIcon = () => {
  return (
    <div className={`${styles.iconContainer}`}>
      <img src={personIcon} alt="" className={`${styles.icon}`} />
    </div>
  );
};

export default ProfileIcon;
