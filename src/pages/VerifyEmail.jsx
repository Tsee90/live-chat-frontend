import { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import API from '../api';
import styles from '../styles/VerifyEmail.module.css';

const VerifyEmail = () => {
  const [searchParams] = useSearchParams();
  const decodedEmail = searchParams.get('email');
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [resent, setResent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);
    setResent(false);
    try {
      const response = await API.post('/users/verify-email', {
        email: decodedEmail,
        code,
      });

      if (response.status === 200) {
        setSuccess(true);
        setTimeout(() => navigate('/login'), 2000);
      }
    } catch (err) {
      if (err.response?.data?.message === 'User already verified') {
        navigate('/login');
      }
      setError(
        err.response?.data?.message || 'Verification failed. Try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  const resendVerificationCode = async () => {
    try {
      setLoading(true);
      setError('');
      setSuccess('');
      const response = await API.post('/users/resend-email-verification', {
        email: decodedEmail,
      });
      if (response.status === 200) {
        setResent(true);
      }
    } catch (error) {
      console.log(error.status);
    } finally {
      setLoading(false);
    }
  };

  const resend = !resent ? (
    <a onClick={resendVerificationCode} className={`defaultLink`}>
      Send New Verification Code
    </a>
  ) : (
    <div className={`${styles.resent}`}>New code sent!</div>
  );

  if (success)
    return (
      <div
        className={`defaultMainContainer displayFlexColumn  alignItemsCenter`}
      >
        <div className={`fontSize30px fontWeightBold ${styles.verifiedTitle}`}>
          Email verified successfully!
        </div>
        <div>Redirecting to login...</div>
        <div className={`defaultSubtext`}>
          Still here? Go to{' '}
          <a href="/login" className={`defaultLink`}>
            Log in
          </a>
        </div>
      </div>
    );

  return (
    <div
      className={`defaultMainContainer displayFlexColumn alignItemsCenter justifyContentCenter`}
    >
      <form
        onSubmit={handleSubmit}
        className={`defaultForm displayFlexColumn gap10px justifyContentSpaceAround alignItemsCenter ${styles.verifyEmailForm}`}
      >
        <div className={`fontSize30px fontWeightBold textAlignCenter`}>
          Verify Your Email
        </div>
        <div
          className={`displayFlexColumn justifyContentCenter alignItemsCenter`}
        >
          Enter the 6-digit code sent to:{' '}
          <div>
            <strong>{decodedEmail}</strong>
          </div>
        </div>
        <input
          type="text"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder="Enter verification code"
          maxLength={6}
          required
          className={`defaultInput justifySelfCenter alignSelfCenter`}
        />
        {error && <p className={`defaultErrorText`}>{error}</p>}

        {!loading ? (
          <>
            <button
              type="submit"
              className={`defaultButton justify ${styles.verifyButton}`}
            >
              Verify
            </button>
            {resend}
          </>
        ) : (
          <div className={`defaultSpinner`}></div>
        )}
      </form>
    </div>
  );
};

export default VerifyEmail;
