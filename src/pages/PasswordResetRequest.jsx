import API from '../api';
import { useState } from 'react';
import styles from '../styles/PasswordResetRequest.module.css';
const PasswordResetRequest = () => {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const handlePasswordReset = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post(`/users/password-reset`, {
        email,
        token: null,
      });

      if (res.request?.status == 200) {
        setSent(true);
      }
    } catch {
      console.log('An unexpected error occurred');
    }
  };
  return (
    <div
      className={`defaultMainContainer alignItemsCenter gap10px ${styles.mainContainer}`}
    >
      <div className={`fontWeightBold textAlignCenter`}>
        Please enter your email address
      </div>
      {sent ? (
        <div className={`textAlignCenter`}>
          Password reset link sent to {email}
        </div>
      ) : (
        <form onSubmit={handlePasswordReset}>
          <div className={`displayFlexRow gap10px`}>
            <input
              type="email"
              name="email"
              onChange={(e) => {
                setEmail(e.target.value);
              }}
              className={`defaultInput`}
              placeholder="Email address"
            />
            <button type="submit" className={`defaultButton ${styles.button}`}>
              Send
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default PasswordResetRequest;
