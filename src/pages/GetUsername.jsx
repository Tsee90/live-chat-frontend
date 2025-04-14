import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api';
import styles from '../styles/GetUsername.module.css';

const GetUsername = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState(null);
  const [success, setSuccess] = useState(false);
  const [errors, setErrors] = useState('');
  const handleChange = (e) => {
    setErrors('');
    setEmail(e.target.value);
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await API.get('/users/username', {
        params: { email },
      });
      if (res.request?.status == 200) {
        setSuccess(true);
      }
    } catch (error) {
      setErrors(error.response?.data.message);
    }
  };
  return (
    <div
      className={`defaultMainContainer alignItemsCenter gap10px ${styles.mainContainer}`}
    >
      <div className={`fontWeightBold textAlignCenter`}>
        Please enter your email address:
      </div>

      {success ? (
        <div className={`displayFlexColumn gap10px alignItemsCenter`}>
          <div className={`textAlignCenter`}>Username sent to {email}</div>
          <div className={`textAlignCenter`}>
            Return to{' '}
            <span
              onClick={() => {
                navigate('/login');
              }}
              className={`defaultLink`}
            >
              log in
            </span>
          </div>
        </div>
      ) : (
        <form action="" onSubmit={handleSubmit}>
          <div className={`displayFlexRow gap10px`}>
            <input
              type="email"
              name="email"
              onChange={handleChange}
              className={`defaultInput`}
              placeholder="Email address"
            />
            <button className={`defaultButton ${styles.button}`}>Submit</button>
          </div>
        </form>
      )}
      {errors ? <div>{errors}</div> : null}
    </div>
  );
};

export default GetUsername;
