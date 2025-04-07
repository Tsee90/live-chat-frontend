import API from '../api';
import { useState } from 'react';
const PasswordResetRequest = () => {
  const [email, setEmail] = useState();
  const handlePasswordReset = async () => {
    API.post(`/users/password-reset`, { email, token: null });
  };
  return (
    <div>
      <div>Please enter your email address</div>
      <form onSubmit={handlePasswordReset}>
        <input
          type="email"
          name="email"
          onChange={(e) => {
            setEmail(e.target.value);
          }}
        />
        <button type="submit">Send</button>
      </form>
    </div>
  );
};

export default PasswordResetRequest;
