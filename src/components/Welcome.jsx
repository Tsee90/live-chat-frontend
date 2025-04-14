import styles from '../styles/Welcome.module.css';
import GuestLogin from './GuestLogin';
import Footer from './Footer';

const Welcome = () => {
  return (
    <div
      className={`defaultMainContainer displayFlexColumn justiyContentCenter alignItemsCenter gap10px ${styles.mainContainer}`}
    >
      <div className={`fontSize30px fontWeightBold ${styles.title}`}>
        Chizmiz.live
      </div>
      <div className={`textAlignCenter ${styles.info}`}>
        Welcome to Chizmiz.live, an anonymous, location based chat app to find
        out the current happenings in your area and beyond. Ask questions, chat
        about local events as they happen, or just shoot the breeze! What are
        you waiting for? Sign up now to start some chizmiz!
      </div>
      <a href="/signup" className={`${styles.signup}`}>
        Sign Up
      </a>{' '}
      <GuestLogin></GuestLogin>
      <Footer></Footer>
    </div>
  );
};

export default Welcome;
