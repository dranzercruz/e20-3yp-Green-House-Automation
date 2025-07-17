import React, { useState, useEffect } from 'react';
import AddPlant from './AddPlant'; // Adjust path if needed
import UpdatePlant from './UpdatePlant'; // Import your UpdateUser component
import './plants.css';
import { Axios } from '../../AxiosBuilder';
import DeletePlant from './DeletePlant';


const Plants = ({ activeTab }) => {
  //const [plants, setPlants] = useState([]);
  const [isAddPlantModalOpen, setIsAddPlantModalOpen] = useState(false);
  const [isUpdatePlantModalOpen, setIsUpdatePlantModalOpen] = useState(false);
  const [isDeletePlantModalOpen, setIsDeletePlantModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [selectedPlant, setSelectedPlant] = useState(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [plants, setPlants] = useState([]);  

  const handleAddPlantClick = () => {
    setIsAddPlantModalOpen(true);
  };

  const handleCloseAddPlantModal = () => {
    setIsAddPlantModalOpen(false);
    };
    
  const handlePlantClick = (plant) => {
     setSelectedPlant(plant);
     setIsDetailModalOpen(true);
    }; 
    
  const handleCloseDetailModal = () => {
    setSelectedPlant(null);
    setIsDetailModalOpen(false);
    };

  const handleEditClick = (plant) => {
    setSelectedPlant(plant);
    setIsUpdatePlantModalOpen(true);
  };

  const handleCloseUpdatePlantModal = () => {
    setIsUpdatePlantModalOpen(false);
    setSelectedPlant(null);
  };

  const handleDeleteClick = (plant) => {
    if (plant) {
      setSelectedPlant(plant);
      setIsDeletePlantModalOpen(true);
    }
  };

  const handleConfirmDelete = async (id) => {
    setLoading(true);
    try {
      const response = await Axios.delete(`/deletePlant/${id}`);
      setPlants(response.data);
      setLoading(false);
    } catch (error) {
      console.error(error);
      alert('Failed to delete plant');
    }
    setIsDeletePlantModalOpen(false);
  };

  const fetchPlants = async () => {
    try {
      const response = await Axios.get("/getAllPlants");
      setPlants(response.data);
      setLoading(false);
    } catch (error) {
      console.log(error);
      if(error.response?.data?.message){
        alert(error.response.data.message);
      }
    }
  };

  useEffect(() => {
    fetchPlants();
  }, []);

  return (
    <div className="plants-container">
      <div className="plants-main-content">
        <h2 className='plant-heading'>Plant Management</h2>

        <button onClick={handleAddPlantClick} className="add-plant-btn">
          Add Plant
        </button>
        {/* Show hardcoded plant names */}
        <ul className="plant-list">
          {loading ? 
            <div className='outer'>
              <div className='inner'></div>
            </div>
          :
          (plants.map((plant) => (
            <li key={plant.id} className="plant-item">
              <div className="plant-info" onClick={() => handlePlantClick(plant)}>
              <img className="plant-img-placeholder" src={`data:${plant.imageType};base64,${plant.imageData}`} alt='plantImage' />
              <div className="plant-name">{plant.name}</div>
              </div>
              <div className="plant-buttons">
                <button className="edit-btn" onClick={() => handleEditClick(plant)}>Edit</button>
                <button className="delete-btn" onClick={() => handleDeleteClick(plant)}>Delete</button>
              </div>
           </li>
          )))}
        </ul>
        
      </div>

      <AddPlant
        isOpen={isAddPlantModalOpen}
        onClose={handleCloseAddPlantModal}
        setPlants={setPlants}
      />

      <UpdatePlant
        isOpen={isUpdatePlantModalOpen}
        onClose={handleCloseUpdatePlantModal}
        plant={selectedPlant}
        setPlant={setSelectedPlant}
        setPlants={setPlants}
      />

      <DeletePlant
        isOpen={isDeletePlantModalOpen}
          onClose={() => setIsDeletePlantModalOpen(false)}
          onDelete={handleConfirmDelete}
          plant={selectedPlant}
        />
      
       {isDetailModalOpen && selectedPlant && (
            <div className="plant-detail-modal">
              <div className="modal-content">
                <h3>{selectedPlant.name}</h3>
                <img src={`data:${selectedPlant.imageType};base64,${selectedPlant.imageData}`} alt={selectedPlant.name}/>
                <p>{selectedPlant.description}</p>
                <ul>
                  <li>Temperature🌡️: {selectedPlant.temperatureLow} - {selectedPlant.temperatureHigh}</li>
                  <li>Humidity💧: {selectedPlant.humidityLow} - {selectedPlant.humidityHigh}</li>
                  <li>Moisture🌿: {selectedPlant.moistureLow} - {selectedPlant.moistureHigh}</li>
                  <li>Nitrogen Level: {selectedPlant.nitrogen}</li>
                  <li>Phosphorus Level: {selectedPlant.phosphorus}</li>
                  <li>Potassium Level: {selectedPlant.potassium}</li>
                </ul>
                <button onClick={handleCloseDetailModal}>Close</button>
              </div>
            </div>
          )}   
    </div>
  );
};

export default Plants;
