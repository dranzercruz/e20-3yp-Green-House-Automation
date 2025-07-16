import React, { useEffect, useState } from 'react';
import './adminDashboard.css';
import { Axios } from '../../AxiosBuilder';

const AdminDashboard = () => {
  const [users, setUsers] = useState([]); 
  const [devices, setDevices] = useState([]);
   
  const fetchDevices = async () => {
       try {
         const response = await Axios.get("/getAllDevices");
         setDevices(response.data);
       } catch (error) {
         console.log(error);
         if (error.response?.data?.message) {
           alert(error.response.data.message);
         }
       }
     };

  const fetchUsers = async () => {
    try {
      const response = await Axios.get("/getAllUsers");
      setUsers(response.data);
      console.log(response.data);
    } catch (error) {
      console.log(error);
      if(error.response?.data?.message){
        alert(error.response.data.message);
      }
    }
  };
         
  useEffect(() => {
    fetchDevices();
    fetchPlants();
  }, [])

  return (
    <div className="admin-dashboard-container">
      <div className="admin-dashboard-content">
        <h2 className="admin-dashboard-title">Admin Dashboard</h2>
        <div className="dashboard-cards-container">
          <div className="dashboard-card">
            <h3 className="card-title">Users Count</h3>
            <p className="card-count">{users.length}</p>
          </div>
          <div className="dashboard-card">
            <h3 className="card-title">Devices Count</h3>
            <p className="card-count">{devices.length}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
