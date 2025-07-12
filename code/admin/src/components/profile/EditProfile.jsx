import React, { useState } from 'react';
import './editProfile.css';
import { UserAuth } from '../../Context/UserContext';
import { Axios } from '../../AxiosBuilder';

const EditProfile = ({ onSave }) => {
  const { user, setUser } = UserAuth();
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [phoneNumber, setPhoneNumber] = useState(user?.phoneNumber || '');
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(`data:${user.imageType};base64,${user.imageData}` || require('../../assets/profile_picture.webp'));

  const handleSave = async () => {
    // Handle the save functionality, passing the updated data back
    onSave({ name, email, phoneNumber, profileImage: image });
    const form = new FormData();
    form.append('name', name);
    form.append('email', email);
    form.append('phoneNumber', phoneNumber);
    if (image) {
      form.append('image', image);
    }

    try {
      const response = await Axios.put("/update", form, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem("token")}`,
          'Content-Type': "multipart/form-data"
        }
      });
      console.log(response.data);
      setUser(response.data);
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
    setImagePreview(URL.createObjectURL(file))
  };

  return (
    <div className="edit-profile-modal">
      <div className="edit-profile-card">
        <div className="edit-profile-header">
          <div className="edit-profile-image-container">
          <h2>Edit Profile</h2>
            <img
              src={imagePreview || require('../../assets/profile_picture.webp')}
              alt="Profile"
              className="edit-profile-image"
              onClick={() => document.getElementById('image-upload').click()} // Trigger file input on image click
            />
            <input
              type="file"
              id="image-upload"
              accept="image/*"
              onChange={handleImageChange}
              style={{ display: 'none' }} // Hide file input
            />

          </div>
          
        </div>

        <div className="edit-profile-field">
          <label>Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <div className="edit-profile-field">
          <label>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="edit-profile-field">
          <label>Contact No</label>
          <input
            type="text"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
          />
        </div>

        <div className="edit-profile-actions">
          <button onClick={handleSave}>Save</button>
          <button onClick={() => window.location.reload()}>Cancel</button>
        </div>
      </div>
    </div>
  );
};

export default EditProfile;
