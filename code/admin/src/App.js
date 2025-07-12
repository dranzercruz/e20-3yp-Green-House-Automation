import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Devices from "./components/devices/Devices";
import AdminProfile from "./components/profile/AdminProfile";
import AdminDashboard from "./components/dashboard/AdminDashboard";
import Users from "./components/users/Users";
import Plants from "./components/plants/Plants";
import LoginPage from "./components/login/Login";
import NotFound from "./components/NotFound";
import ProtectedRoute from "./components/ProtectedRoute ";
import Layout from "./components/Layout";
import { UserAuth } from "./Context/UserContext";
import { Axios } from "./AxiosBuilder";

const isTokenExpired = (token) => {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return Date.now() > payload.exp * 1000;
  } catch {
    return true;
  }
};

function App() {
  const [activeTab, setActiveTab] = useState("");
  const {setUser, user} = UserAuth();

  
  useEffect(() => {
    const intervelId = setInterval(() => {
      const currentToken = localStorage.getItem("token");
      if(isTokenExpired(currentToken) || !currentToken ){
        localStorage.removeItem("token");
        setUser(null);
      }else if(user === null){
        fetchUserData();
      }
    }, 1000);
    
    const fetchUserData = async () => {
      try {
        const response = await Axios.get("/adminData", {
          headers: {
            Authorization: localStorage.getItem("token")
          }
        });
        setUser(response.data);
      } catch (error) {
        console.log(error);
      }
    }

    return () => {
      clearInterval(intervelId);
    };
  }, [setUser, user])

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />

        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Layout activeTab={activeTab} setActiveTab={setActiveTab}>
                <AdminDashboard />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/devices"
          element={
            <ProtectedRoute>
              <Layout activeTab={activeTab} setActiveTab={setActiveTab}>
                <Devices />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/users"
          element={
            <ProtectedRoute>
              <Layout activeTab={activeTab} setActiveTab={setActiveTab}>
                <Users />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Layout activeTab={activeTab} setActiveTab={setActiveTab}>
                <AdminProfile />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/plants"
          element={
            <ProtectedRoute>
              <Layout activeTab={activeTab} setActiveTab={setActiveTab}>
                <Plants />
              </Layout>
            </ProtectedRoute>
          }
        />

        {/* Catch all */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;
