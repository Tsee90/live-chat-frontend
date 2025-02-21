import { useState, useEffect } from 'react';
import API from '../api';
import PropTypes from 'prop-types';

const CreateRoomForm = ({ onClose }) => {
  const [formData, setFormData] = useState({
    name: '',
    startsAt: new Date().toISOString(),
    expiresAt: '',
  });
  const [location, setLocation] = useState(null);
  const [locationError, setLocationError] = useState('');
  const [apiError, setApiError] = useState('');

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
          setLocationError('');
        },
        () => setLocationError('Location access denied')
      );
    } else {
      setLocationError('Geolocation not supported');
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('HELLO', formData, location);
    if (!location) {
      setLocationError('Location is required');
      return;
    }

    try {
      console.log(formData, location);
      await API.post(
        '/rooms',
        { ...formData, location },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json',
          },
        }
      );
      onClose();
    } catch (error) {
      setApiError(error.response?.data?.message || 'Failed to create room');
    }
  };

  return (
    <div>
      <h2>Create Room</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Room Name:</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Expires At:</label>
          <input
            type="datetime-local"
            name="expiresAt"
            value={formData.expiresAt}
            onChange={handleChange}
            required
          />
        </div>
        {locationError && <p>{locationError}</p>}
        {apiError && <p>{apiError}</p>}
        <div>
          <button type="submit">Create Room</button>
          <button type="button" onClick={onClose}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

CreateRoomForm.propTypes = {
  onClose: PropTypes.func.isRequired,
};

export default CreateRoomForm;
