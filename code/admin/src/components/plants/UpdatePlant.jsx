import React, { useState } from 'react';
import { Axios } from '../../AxiosBuilder';

const UpdatePlant = ({ isOpen, onClose, plant, setPlant, setPlants }) => {
  const [image, setImage] = useState(null);
  if (!isOpen || !plant) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPlant({ ...plant, [name]: value });
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    setImage(file);
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPlant((prev) => ({
          ...prev,
          imageData: reader.result,
          imageName: file.name,
          imageType: file.type,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

    const handleUpdatePlant = async () => {
      const form = new FormData();

      Object.keys(plant).forEach(key => {
        form.append(key, plant[key]);
      });

      if (image) {
        if(image.size > 1 * 1024 * 1024) {
          alert('Image size exceeds 2MB limit. Please upload a smaller image.');
          return;
        }
        form.append('image', image);
      }
      try {
        const response = await Axios.put(`/updatePlant/${plant.id}`, form, {
          headers: {
            'Content-Type': 'multipart/form-data',
            'Authorization': `Bearer ${localStorage.getItem("token")}`,
          }
        });
        setPlants(response.data);
        alert("Plant updated successfully");
      } catch (error) {
        console.error(error);
        alert('Failed to update plant');
      }
      onClose();
  };

  return (
    <>
      <div style={styles.backdrop} onClick={onClose} />

      <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
        <h2 style={styles.title}>Update Plant</h2>

        <label style={styles.label}>
          Name:
          <input
            type="text"
            name="name"
            value={plant.name || ''}
            onChange={handleChange}
            style={styles.input}
          />
        </label>

        <label style={styles.label}>
          Description:
          <textarea
            name="description"
            value={plant.description || ''}
            onChange={handleChange}
            style={styles.textarea}
          />
        </label>

        <label style={styles.label}>Temperature 🌡️:
          <div style={styles.doubleInputRow}>
            <label htmlFor="temperatureLow">Low: </label>
            <input name="temperatureLow" type="number" value={plant.temperatureLow} onChange={handleChange} style={styles.input} />
            <label htmlFor="temperatureHigh">High: </label>
            <input name="temperatureHigh" type="number" value={plant.temperatureHigh} onChange={handleChange} style={styles.input} />
          </div>
        </label>

        <label style={styles.label}>Humidity 💧:
          <div style={styles.doubleInputRow}>
            <label htmlFor="humidityLow">Low: </label>
            <input name="humidityLow" type="number" value={plant.humidityLow} onChange={handleChange} style={styles.input} />
            <label htmlFor="humidityHigh">High: </label>
            <input name="humidityHigh" type="number" value={plant.humidityHigh} onChange={handleChange} style={styles.input} />
          </div>
        </label>

        <label style={styles.label}>Moisture 🌿:
          <div style={styles.doubleInputRow}>
            <label htmlFor="moistureLow">Low: </label>
            <input name="moistureLow" type="number" value={plant.moistureLow} onChange={handleChange} style={styles.input} />
            <label htmlFor="moistureHigh">High: </label>
            <input name="moistureHigh" type="number" value={plant.moistureHigh} onChange={handleChange} style={styles.input} />
          </div>
        </label>

        <label style={styles.label}>
          Nitrogen:
          <input
            type="text"
            name="nitrogen"
            value={plant.nitrogen || ''}
            onChange={handleChange}
            style={styles.input}
          />
        </label>

        <label style={styles.label}>
          Phosphorus:
          <input
            type="text"
            name="phosphorus"
            value={plant.phosphorus || ''}
            onChange={handleChange}
            style={styles.input}
          />
        </label>

        <label style={styles.label}>
          Potassium:
          <input
            type="text"
            name="potassium"
            value={plant.potassium || ''}
            onChange={handleChange}
            style={styles.input}
          />
        </label>

        <label style={styles.label}>
          Upload Image:
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            style={styles.input}
          />
        </label>

        {plant.imageData && (
          <div style={{ textAlign: 'center', marginTop: '10px' }}>
            <img
              src={
                plant.imageData.startsWith('data:')
                  ? plant.imageData
                  : `data:${plant.imageType};base64,${plant.imageData}`
              }
              alt="Preview"
              style={{ maxWidth: '100%', maxHeight: '150px', borderRadius: '6px' }}
            />
          </div>
        )}

        <div style={styles.buttonRow}>
          <button onClick={onClose} style={styles.cancelButton}>Cancel</button>
          <button onClick={handleUpdatePlant} style={styles.saveButton}>Save</button>
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
    maxHeight: '80vh',
    overflowY: 'auto',
    background: '#e6f0ea',
    
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
    backgroundColor: '#fff',
    fontSize: '16px',
    outline: 'none',
  },
  textarea: {
    width: '100%',
    padding: '8px 12px',
    marginTop: '6px',
    borderRadius: '6px',
    border: '1.5px solid #a5d6a7',
    fontSize: '14px',
    outline: 'none',
    resize: 'vertical',
    minHeight: '20px',
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
  },
};

export default UpdatePlant;
