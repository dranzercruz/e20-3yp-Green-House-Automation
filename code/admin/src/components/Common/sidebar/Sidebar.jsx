import React from 'react';
import { useNavigate } from 'react-router-dom';
import './sidebar.css';
import logo from "../../../assets/logopng.png";
import LoginPage from '../../login/Login';
import { UserAuth } from '../../../Context/UserContext';


const Sidebar = ({ activeTab, setActiveTab }) => {
  const navigate = useNavigate();
  const {setUser} = UserAuth();

  const handleTabClick = (tab) => {
    setActiveTab(tab);
    navigate(`/${tab}`);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setUser(null);
    navigate('/login');
  }

  return (
    <div className="sidebar">
      <div className='sideBar-content'>
        <div className="sidebar-title">
          <img src={logo} alt="" className='sidebar-logo'/>
        </div>
        <div
          className={`sidebar-item ${activeTab === '' ? 'active' : ''}`}
          onClick={() => handleTabClick('')}
        >
          Dashboard
        </div>
        <div
          className={`sidebar-item ${activeTab === 'devices' ? 'active' : ''}`}
          onClick={() => handleTabClick('devices')}
        >
          Devices
        </div>
        <div
          className={`sidebar-item ${activeTab === 'users' ? 'active' : ''}`}
          onClick={() => handleTabClick('users')}
        >
          Users
        </div>
        <div
          className={`sidebar-item ${activeTab === 'plants' ? 'active' : ''}`}
          onClick={() => handleTabClick('plants')}
        >
          Plants
        </div>
        <div
          className={`sidebar-item ${activeTab === 'profile' ? 'active' : ''}`}
          onClick={() => handleTabClick('profile')}
        >
          Profile
        </div>

      </div>

      <button type='button' className='logout' onClick={handleLogout}>Logout</button>
    </div>
  );
};

export default Sidebar;
