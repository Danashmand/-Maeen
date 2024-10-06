"use client";
import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Dashboard = () => {
  interface UserData {
    email: string, password: string, name: string,level:string
  }
  
  const [userData, setUserData] = useState<UserData | null>(null);
  
  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem('token'); // Retrieve the token
      const user = localStorage.getItem('user'); // Retrieve the user data
      if (user) {

        setUserData(JSON.parse(user));
      }
    };

    fetchUserData();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4">Dashboard</h1>
      {userData ? (
        <div>
          <h2 className="text-xl">Welcome, {userData.name}!</h2>
          <p>Email: {userData.email}</p>
          {/* Display other user information as needed */}
        </div>
      ) : (
        <p>Loading user data...</p>
      )}
    </div>
  );
};

export default Dashboard;
