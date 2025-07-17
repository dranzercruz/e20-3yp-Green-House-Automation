import React, { useState } from 'react';
import { Axios } from '../../AxiosBuilder';
import Spinner from '../Common/Spinner';

const AddPlant = ({ isOpen, onClose, setPlants }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    temperatureLow: 0,
    temperatureHigh: 0,
    humidityLow: 0,
    humidityHigh: 0,
    moistureLow: 0,
    moistureHigh: 0,
    nitrogen: 0,
    phosphorus: 0,
    potassium: 0,
  });

  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSave = async () => {
    const form = new FormData();

    Object.keys(formData).forEach(key => {
      form.append(key, formData[key]);
    });

    if (image) {
      if(image.size > 1 * 1024 * 1024) {
        alert('Image size exceeds 2MB limit. Please upload a smaller image.');
        return;
      }
      form.append('image', image);
    }

    setLoading(true);
    try {
      const res = await Axios.post('/addPlant', form, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${localStorage.getItem("token")}`,
        }
      });
      setPlants(res.data)
      console.log('Upload successful:', res.data);
      setLoading(false);
    } catch (err) {
      console.error('Upload failed:', err.response?.data || err.message);
      alert('Failed to add plant.');
    }

    onClose();
  };

  return (
    <>
      {loading && <Spinner />}
      <div style={styles.backdrop} onClick={onClose} />

      <div style={styles.modal} onClick={e => e.stopPropagation()}>
        <h2 style={styles.title}>Add New Plant</h2>

        <label style={styles.label}>
          Plant Name:
          <input name="name" type="text" value={formData.name || ''} onChange={handleChange} style={styles.input} />
        </label>

        <label style={styles.label}>
          Description:
          <textarea name="description" value={formData.description || ''} onChange={handleChange} style={styles.textarea} />
        </label>

        <label style={styles.label}>Temperature 🌡️:
          <div style={styles.doubleInputRow}>
            <label htmlFor="temperatureLow">Low: </label>
            <input name="temperatureLow" type="number" value={formData.temperatureLow} onChange={handleChange} style={styles.input} />
            <label htmlFor="temperatureHigh">High: </label>
            <input name="temperatureHigh" type="number" value={formData.temperatureHigh} onChange={handleChange} style={styles.input} />
          </div>
        </label>

        <label style={styles.label}>Humidity 💧:
          <div style={styles.doubleInputRow}>
            <label htmlFor="humidityLow">Low: </label>
            <input name="humidityLow" type="number" value={formData.humidityLow} onChange={handleChange} style={styles.input} />
            <label htmlFor="humidityHigh">High: </label>
            <input name="humidityHigh" type="number" value={formData.humidityHigh} onChange={handleChange} style={styles.input} />
          </div>
        </label>

        <label style={styles.label}>Moisture 🌿:
          <div style={styles.doubleInputRow}>
            <label htmlFor="moistureLow">Low: </label>
            <input name="moistureLow" type="number" value={formData.moistureLow} onChange={handleChange} style={styles.input} />
            <label htmlFor="moistureHigh">High: </label>
            <input name="moistureHigh" type="number" value={formData.moistureHigh} onChange={handleChange} style={styles.input} />
          </div>
        </label>

        <label style={styles.label}>Nitrogen:
          <input name="nitrogen" type="number" value={formData.nitrogen} onChange={handleChange} style={styles.input} />
        </label>

        <label style={styles.label}>Phosphorus:
          <input name="phosphorus" type="number" value={formData.phosphorus} onChange={handleChange} style={styles.input} />
        </label>

        <label style={styles.label}>Potassium:
          <input name="potassium" type="number" value={formData.potassium} onChange={handleChange} style={styles.input} />
        </label>

        <label style={styles.label}>Upload Image:
          <input type="file" accept="image/*" onChange={handleImageUpload} style={styles.input} />
        </label>

        {preview && (
          <div style={{ textAlign: 'center', marginTop: '10px' }}>
            <img src={preview} alt="Preview" style={{ maxWidth: '100%', maxHeight: '150px', borderRadius: '6px' }} />
          </div>
        )}

        <div style={styles.buttonRow}>
          <button onClick={onClose} style={styles.cancelButton}>Cancel</button>
          <button onClick={handleSave} style={styles.saveButton}>Save</button>
        </div>
      </div>
    </>
  );
};

const styles = {
  backdrop: {
    position: 'fixed',
    top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    zIndex: 999,
  },
  modal: {
    position: 'fixed',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    padding: '30px 40px',
    borderRadius: '12px',
    boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
    zIndex: 1000,
    width: '500px',
    maxWidth: '90%',
    maxHeight: '80vh',
    overflowY: 'auto',
    // background: 'linear-gradient(to bottom right, #014d36, #012A1C)',
    backgroundColor: "#e6f0ea",
  },
  title: {
    marginBottom: '20px',
    color: '#000',
    fontWeight: '700',
    fontSize: '24px',
    textAlign: 'center',
  },
  label: {
    display: 'block',
    marginBottom: '12px',
    color: '#000',
    fontWeight: '600',
  },
  doubleInputRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: "center",
    gap: '10px',
  },
  input: {
    width: '100%',
    padding: '8px 12px',
    marginTop: '6px',
    borderRadius: '6px',
    border: '1.5px solid #a5d6a7',
    fontSize: '16px',
    outline: 'none',
    backgroundColor: '#fff',
  },
  textarea: {
    width: '100%',
    padding: '8px 12px',
    marginTop: '5px',
    borderRadius: '6px',
    border: '1.5px solid #a5d6a7',
    fontSize: '14px',
    outline: 'none',
    resize: 'vertical',
    minHeight: '40px',
  },
  buttonRow: {
    display: 'flex',
    justifyContent: 'space-between',
    marginTop: '25px',
  },
  cancelButton: {
    backgroundColor: '#ccc',
    border: 'none',
    borderRadius: '6px',
    padding: '10px 20px',
    fontWeight: '600',
    cursor: 'pointer',
    flex: 1,
    marginRight: '10px',
    transition: 'background-color 0.3s ease',
  },
  saveButton: {
    backgroundColor: '#01694D',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    padding: '10px 20px',
    fontWeight: '600',
    cursor: 'pointer',
    flex: 1,
    transition: 'background-color 0.3s ease',
  },
};

export default AddPlant;
