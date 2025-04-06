import { useState } from 'react';
import API from '../api';

const GetUsername = () => {
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
    <div>
      Enter your email address:
      <form action="" onSubmit={handleSubmit}>
        <input type="email" name="email" onChange={handleChange} />
        <button>Submit</button>
      </form>
      {success ? <div>Username sent to email!</div> : null}
      {errors ? <div>{errors}</div> : null}
    </div>
  );
};

export default GetUsername;
