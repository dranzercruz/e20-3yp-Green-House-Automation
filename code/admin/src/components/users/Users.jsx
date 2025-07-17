import React, { useState, useEffect } from 'react';
import AddUser from './AddUser'; // Adjust path if needed
import UpdateUser from './UpdateUser'; // Import your UpdateUser component
import './users.css';
import { Axios } from '../../AxiosBuilder';
import DeletePlant from '../plants/DeletePlant';

const Users = ({ activeTab }) => {
  const [users, setUsers] = useState([]);
  const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false);
  const [isUpdateUserModalOpen, setIsUpdateUserModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isDeletePlantModalOpen, setIsDeletePlantModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);


  const handleAddUserClick = () => {
    setIsAddUserModalOpen(true);
  };

  const handleCloseAddUserModal = () => {
    setIsAddUserModalOpen(false);
  };

  const handleSaveUser = async (userDetails) => {
    setLoading(true);
    try {
      const response = await Axios.post(`/addUser`, userDetails)
      setUsers(response.data);
      setLoading(false);
    } catch (error) {
      console.log(error);
    }
  };

  const handleEditClick = (user) => {
    setSelectedUser(user);
    setIsUpdateUserModalOpen(true);
  };
  
  const handleCloseUpdateUserModal = () => {
    setIsUpdateUserModalOpen(false);
    setSelectedUser(null);
  };
  
  const handleUpdateUser = async () => {
    handleCloseUpdateUserModal();
    setLoading(true);
    try {
      const response = await Axios.put(`/updateUser`, selectedUser)
      setUsers(response.data);
      setLoading(false);
    } catch (error) {
      console.log(error);
    }
  };
  
  
  const handleDeleteClick = async (id) => {
    setLoading(true);
    try {
      const response = await Axios.delete(`/deleteUser/${id}`);
      setUsers(response.data);
      setLoading(false);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await Axios.get("/getAllUsers");
        setUsers(response.data);
        setLoading(false);
      } catch (error) {
        console.log(error);
        if(error.response?.data?.message){
          alert(error.response.data.message);
        }
      }
    }
    fetchUsers();
  }, []);

  return (
    <div className="users-container">
      <div className="users-main-content">
        <h2 className="users-header">User Management</h2>

        <button onClick={handleAddUserClick} className="add-user-btn">
          Add User
        </button>

        <table className="users-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Role</th>
              <th>Joined At</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {loading ? 
              <tr>
                <td colSpan="8" className="loading">
                  <div className="outer">
                    <div className="inner"></div>
                  </div>
                </td>
              </tr>
            :
            users?.map(user => (
              <tr key={user.id}>
                <td>{user?.id}</td>
                <td>{user?.name}</td>
                <td>{user?.email}</td>
                <td>{user?.phoneNumber}</td>
                <td>{user?.role}</td>
                <td>{new Date(user?.createdAt).toLocaleDateString()}</td>
                <td>
                  <button className="edit-btn" onClick={() => handleEditClick(user)}>Edit</button>
                  <button className="delete-btn" onClick={() => {
                    setSelectedUser(user);
                    setIsDeletePlantModalOpen(true);
                  }}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <AddUser
        isOpen={isAddUserModalOpen}
        onClose={handleCloseAddUserModal}
        onSave={handleSaveUser}
      />

      <UpdateUser
        isOpen={isUpdateUserModalOpen}
        onClose={handleCloseUpdateUserModal}
        onSave={handleUpdateUser}
        user={selectedUser} // Pass user data to UpdateUser
        setUser={setSelectedUser}
      />

      <DeletePlant
        isOpen={isDeletePlantModalOpen}
          onClose={() => setIsDeletePlantModalOpen(false)}
          onDelete={handleDeleteClick}
          plant={selectedUser}
        />
    </div>
  );
};

export default Users;
