import React, { useState, useEffect } from 'react';
import './devices.css';
import { Axios } from '../../AxiosBuilder';
import UpdateDevice from './UpdateDevice';  // Import the UpdateDevice modal component
import DeletePlant from '../plants/DeletePlant';
  // Import the UpdateDevice modal component

const Device = ({ activeTab }) => {
  const [devices, setDevices] = useState([]);
  const [isAddDeviceModalOpen, setIsAddDeviceModalOpen] = useState(false);
  const [deviceToEdit, setDeviceToEdit] = useState({}); // Store the device to be edited
  const [isDeletePlantModalOpen, setIsDeletePlantModalOpen] = useState(false);
  const [selectedDevice, setSelectedDevice] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDevices = async () => {
      try {
        const response = await Axios.get("/getAllDevices");
        setDevices(response.data);
        setLoading(false);
      } catch (error) {
        console.log(error);
        if (error.response?.data?.message) {
          alert(error.response.data.message);
        }
      }
    };
    fetchDevices();
  }, []);

  // Function to delete the device
  const handleDelete = async (id) => {
    setLoading(true);
    try {
      const response = await Axios.delete(`/deleteDevice/${id}`);
      setDevices(response.data);
      setLoading(false);
    } catch (error) {
      console.log(error);
    }
  };

  // Opens the modal and sets the device data to be edited
  const handleEdit = (device) => {
    setDeviceToEdit(device);  // Set the device to be edited
    setIsAddDeviceModalOpen(true); // Open the modal
  };

  // Handle saving the edited device data
  const handleSave = async () => {
    setIsAddDeviceModalOpen(false);  // Close the modal after saving
    setLoading(true);
    try {
      const response = await Axios.put(`/updateDevice/${deviceToEdit.id}`, deviceToEdit);
      setDevices(response.data);  // Update the devices list after successful update
      setLoading(false);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="device-container">
      <div className="device-content">
        
          <div>
            <h2 className="device-heading">Device Management</h2>
            <table className="device-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>MAC</th>
                  <th>Location</th>
                  <th>Zone</th>
                  <th>Added At</th>
                  <th>User</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="8" className="loading">
                      <div className="outer">
                        <div className="inner"></div>
                      </div>
                    </td>
                  </tr>
                ) : (
                  devices.map((device) => (
                    <tr key={device.id}>
                      <td>{device?.id}</td>
                      <td>{device?.name}</td>
                      <td>{device?.mac}</td>
                      <td>{device?.location}</td>
                      <td>{device?.zoneName}</td>
                      <td>{device?.addedAt}</td>
                      <td>{device?.user?.name || 'Unassigned'}</td>
                      <td>
                        <button className="edit-button" onClick={() => handleEdit(device)}>Edit</button>
                        <button className="delete-button" onClick={() => {
                          setSelectedDevice(device);
                          setIsDeletePlantModalOpen(true);
                        }}>Delete</button>
                      </td>
                  </tr>
                )))}
              </tbody>
            </table>
          </div>
        
      </div>

      {/* Show the modal for updating device details */}
      <UpdateDevice
        isOpen={isAddDeviceModalOpen}
        onClose={() => setIsAddDeviceModalOpen(false)}
        onSave={handleSave}
        device={deviceToEdit}
        setDevice={setDeviceToEdit}
      />

      <DeletePlant
        isOpen={isDeletePlantModalOpen}
          onClose={() => setIsDeletePlantModalOpen(false)}
          onDelete={handleDelete}
          plant={selectedDevice}
        />
    </div>
  );
};

export default Device;
