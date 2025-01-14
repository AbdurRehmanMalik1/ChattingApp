import React, { useEffect, useState } from "react";
import Login from "./components/Login";
import Signup from "./components/Signup";
import './css/App.css'
import Chat from "./components/Chat";
import ChattingNav from "./components/ChattingNav";
const App = () => {
  
  const [isLogin, setIsLogin] = useState(true); 
  const toggleForm = () => {
    setIsLogin(!isLogin);
  };


  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const getUserChats = async () => {
    const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI2NzdlNDdlYjQ3YzQ3YmE3YTM5YjlhMmUiLCJuYW1lIjoiQWJkdXIgUmVobWFuIiwiZW1haWwiOiJhYmR1cnJlaG1hbjQ0MTVAZ21haWwuY29tIiwiaWF0IjoxNzM2ODcyODE3LCJleHAiOjE3MzY4ODAwMTd9.EyZBrtTB39RzeIEpHC3f1btKZj7OvPtvBSEOxsyZKcg";
    const bearerToken = `Bearer ${token}`
    try {
        const response = await fetch('http://localhost:8080/chat/my', {
          method: "GET",
          headers: { 
            'Content-Type': 'application/json',
            'Authorization': bearerToken
          }
        });
    
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        setChats(data);
      } catch (error) {
        console.error("Error fetching user chats:", error);
      }
  }
  useEffect(() => {
    getUserChats();
  }, []);

  return (
    <div className="app-div">
      <div className="background app-theme-primary">
        {isLogin ? (
          <Login toggleForm={toggleForm} />
        ) : (
          <Signup toggleForm={toggleForm} />
        )}
        </div>
      </div>
  );
};

export default App;
