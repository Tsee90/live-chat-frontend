import { useState } from 'react';
import PropTypes from 'prop-types';
import styles from '../styles/CreateRoomForm.module.css';

const CreateRoomForm = ({ onClose, onSubmit, creating }) => {
  const [formData, setFormData] = useState({
    name: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    onSubmit({ ...formData });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={`defaultForm displayFlexColumn alignItemsCenter justifyContentSpaceAround ${styles.createRoomForm}`}
      onClick={(e) => e.stopPropagation()}
    >
      <div className={`fontWeightBold fontSize30px`}>New Room</div>

      <input
        type="text"
        name="name"
        value={formData.name}
        onChange={handleChange}
        placeholder="enter name"
        required
        className={`defaultInput`}
      />

      {creating ? (
        <div className={`defaultSpinner`}></div>
      ) : (
        <div className={`displayFlexRow justifyContentSpaceAround width100`}>
          <button
            type="submit"
            className={`defaultButton ${styles.createButton}`}
          >
            Create
          </button>
          <button
            type="button"
            onClick={onClose}
            className={`defaultButton ${styles.cancelButton}`}
          >
            Cancel
          </button>
        </div>
      )}
    </form>
  );
};

CreateRoomForm.propTypes = {
  onClose: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  creating: PropTypes.bool.isRequired,
};

export default CreateRoomForm;
