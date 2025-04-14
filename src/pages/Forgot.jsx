import { useNavigate } from 'react-router-dom';
import styles from '../styles/Forgot.module.css';

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
    </div>
  );
};

export default Forgot;
