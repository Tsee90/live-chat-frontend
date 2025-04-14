import { useNavigate } from 'react-router-dom';
import styles from '../styles/Forgot.module.css';
import Footer from '../components/Footer';
const Forgot = () => {
  const navigate = useNavigate();
  return (
    <div
      className={`defaultMainContainer alignItemsCenter ${styles.mainContainer}`}
    >
      <div className={`fontWeightBold`}>Please select an option:</div>
      <div
        onClick={() => {
          navigate('/username');
        }}
        className={`defaultLink`}
      >
        I forgot my username
      </div>
      <div
        onClick={() => {
          navigate('/password-reset');
        }}
        className={`defaultLink`}
      >
        I forgot my password
      </div>
      <Footer></Footer>
    </div>
  );
};

export default Forgot;
